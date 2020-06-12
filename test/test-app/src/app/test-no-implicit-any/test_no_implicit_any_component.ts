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

import { Component, OnInit } from '@angular/core';
import { BasicClass } from '../util/basic_class';

/**
 * Component with anti-patterns to test noImplicitAny flag
 */
@Component({
  selector: 'app-test-no-implicit-any',
  templateUrl: './test_no_implicit_any_component.html',
})
export class TestNoImplicitAnyComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  // Test: No information regarding variable type
  // Fix: noInfo(name: any) {
  noInfo(name) {
    return name;
  }

  // Test: Infer type from method signatures called by func
  // Fix: callsTakeString(val: string) {
  callsTakeString(val) {
    this.takeString(val);
  }

  takeString(val: string) {}

  // Test: Infer type from method signatures calling func
  passString(val: string) {
    this.calledByPassString(val);
    this.calledByPassNumAndPassString(val);
  }

  // Fix: calledByPassString(val: string) {}
  calledByPassString(val) {}

  // Test: Concatenates multiple possible types
  passNum(val: number) {
    this.calledByPassNumAndPassString(val);
  }

  // Fix: calledByPassString(val: string | number) {}
  calledByPassNumAndPassString(val) {}

  // Test: Supports chaining
  // Fix: callsCallsTakeString(val: string) {
  callsCallsTakeString(val) {
    this.callsTakeString(val);
  }

  // Test: Spans across multiple files
  // Fix: callsTakeStringInSeparateClass(val: string) {
  callsTakeStringInSeparateClass(val) {
    new BasicClass().takeStringSeparateClass(val);
  }

  // Lists

  // Test: Assign any array to defined type array
  assignToDefinedArray() {
    let mustBeStringArray: string[];
    // Fix: const anyArray: string[] = [];
    const anyArray = [];
    mustBeStringArray = anyArray;
  }

  // Objects: For all object tests, possibility to leave smart comments detailing what the object structure should be

  // Test: Accessing an empty object
  accessEmptyObjectProperty() {
    // Fix: const emptyObject: any = {};
    const emptyObject = {};
    emptyObject['property'] = true;
  }

  // Test: Accessing a non-empty object
  accessNonEmptyObjectProperty() {
    // Fix: const nonEmptyObject: any = { already: false };
    const nonEmptyObject = { already: false };
    nonEmptyObject['property'] = true;
  }

  // Fix: printUnknownObject(unknownObject: any) {
  printUnknownObject(unknownObject) {
    console.log(unknownObject.foo + unknownObject.bar);
  }

  // Fix: printUnknownObjectWithProps(unknownObject: any) {
  printUnknownObjectWithProps(unknownObject) {
    Math.abs(unknownObject.baz);
  }
}
