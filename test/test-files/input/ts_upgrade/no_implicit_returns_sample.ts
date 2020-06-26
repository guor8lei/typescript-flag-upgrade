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

function noEndValueReturn(name: string) {
  if (name === 'Bob') {
    return 'Hello Bob';
  }
    // typescript-flag-upgrade automated fix: --noImplicitReturns
    return undefined;
}

function noValueReturnInIf(name: string) {
  if (name === 'Bob') {
    return;
  }
  return 'Hello Not-Bob';
}

function noExplitReturnUndefined(name: string) {
  if (name === 'Bob') {
    return 'Hello Bob';
  }
  return;
}
