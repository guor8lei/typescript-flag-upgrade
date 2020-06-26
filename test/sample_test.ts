import {Project} from 'ts-morph';
import {Runner} from '../src/runner';
import {compareSourceFiles} from './test_util';

describe('calculate', function () {
  const inputConfigPath = './targets/test-files/tsconfig.json';

  it('add', function () {
    const project = new Project({
      tsConfigFilePath: inputConfigPath,
      addFilesFromTsConfig: false,
      compilerOptions: {
        noImplicitReturns: true,
      },
    });

    project.addSourceFileAtPath(
      './test/test-files/input/no_end_value_return.ts'
    );

    new Runner(undefined, project).run();

    project.addSourceFilesAtPaths([
      './test/test-files/ts_upgrade/no_end_value_return.ts',
      './test/test-files/expected_output/no_end_value_return_output.ts',
    ]);

    const givenOutput = project.getSourceFile(
      './test/test-files/input/ts_upgrade/no_end_value_return.ts'
    );
    const expectedOutput = project.getSourceFile(
      './test/test-files/expected_output/no_end_value_return_output.ts'
    );

    const diff = compareSourceFiles(givenOutput!, expectedOutput!);
    console.log(diff);
    expect(diff.length).toEqual(0, diff);
  });
});
