/*
    Copyright 2020 Google LLC

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        https://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

import path from 'path';
import _ from 'lodash';
import {Project} from 'ts-morph';
import {ArgumentOptions} from './types';
import {Emitter} from './emitters/emitter';
import {NoImplicitReturnsManipulator} from './manipulators/no_implicit_returns_manipulator';
import {NoImplicitAnyManipulator} from './manipulators/no_implicit_any_manipulator';
import {StrictNullChecksManipulator} from './manipulators/strict_null_checks_manipulator';
import {StrictPropertyInitializationManipulator} from './manipulators/strict_property_initialization_manipulator';
import {Parser} from './parser';
import {Manipulator} from './manipulators/manipulator';
import {OutOfPlaceEmitter} from './emitters/out_of_place_emitter';
import {DiagnosticUtil} from './diagnostic_util';

/** Class responsible for running the execution of the tool. */
export class Runner {
  private tsConfigPath: string | undefined;
  private overrideInputDir: string | undefined;

  private project: Project;

  private parser: Parser;
  private emitter: Emitter;

  private diagnosticUtil: DiagnosticUtil;

  private manipulators: Manipulator[];

  /**
   * Instantiates project and appropriate modules.
   * @param {ArgumentOptions} args - Arguments passed
   */
  constructor(args?: ArgumentOptions, project?: Project) {
    if (project) {
      this.project = project;
    } else if (args) {
      this.tsConfigPath = args.p;
      this.overrideInputDir = args.i;
      this.project = this.createProject(
        this.tsConfigPath,
        this.overrideInputDir
      );
    } else {
      throw Error('need project or args');
    }
    this.parser = new Parser(this.project);
    this.diagnosticUtil = new DiagnosticUtil();
    this.manipulators = [
      new NoImplicitReturnsManipulator(this.diagnosticUtil),
      new NoImplicitAnyManipulator(this.diagnosticUtil),
      new StrictPropertyInitializationManipulator(this.diagnosticUtil),
      new StrictNullChecksManipulator(this.diagnosticUtil),
    ];
    this.emitter = new OutOfPlaceEmitter(this.project);
  }

  /**
   * Runs through execution of parsing, manipulating, and emitting.
   */
  run() {
    const sourceFiles = this.project.getSourceFiles();
    console.log(
      sourceFiles.map(file => {
        return file.getFilePath();
      })
    );

    let errors = this.parser.parse();
    let prevErrors = errors;
    let errorsExist;

    do {
      errorsExist = false;
      for (const manipulator of this.manipulators) {
        if (
          this.diagnosticUtil.detectErrors(errors, manipulator.diagnosticCodes)
        ) {
          manipulator.fixErrors(errors);
          errorsExist = true;
          prevErrors = errors;
          errors = this.parser.parse();
          break;
        }
      }
    } while (errorsExist && !_.isEqual(errors, prevErrors));

    this.emitter.emit();
  }

  /**
   * Creates a ts-morph project from filepath.
   * @return {Project} Created project
   */
  private createProject(
    tsConfigPath: string,
    overrideInputDir: string | undefined
  ): Project {
    if (overrideInputDir) {
      const project = new Project({
        tsConfigFilePath: path.join(process.cwd(), tsConfigPath),
        addFilesFromTsConfig: false,
        compilerOptions: {
          strictNullChecks: true,
          strictPropertyInitialization: true,
          noImplicitAny: true,
          noImplicitReturns: true,
        },
      });

      project.addSourceFilesAtPaths(
        path.join(process.cwd(), overrideInputDir) + '/**/*{.d.ts,.ts}'
      );

      project.resolveSourceFileDependencies();
      return project;
    }

    return new Project({
      tsConfigFilePath: path.join(process.cwd(), tsConfigPath),
      compilerOptions: {
        strictNullChecks: true,
        strictPropertyInitialization: true,
        noImplicitAny: true,
        noImplicitReturns: true,
      },
    });
  }
}
