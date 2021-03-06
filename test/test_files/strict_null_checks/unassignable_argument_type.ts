// Test: Pass null value to function
function doesNotExpectNull(n: number) {}

function passesNullValue() {
  const n: number | null = null;
  // Fix: doesNotExpectNull(n!);
  doesNotExpectNull(n);
}

// Test: Pass null and undefined value to function
function doesNotExpectNullUndefined(n: number) {}

function passesNullVariable() {
  const n: number | null = null;
  // Fix: doesNotExpectNullUndefined(n!);
  doesNotExpectNullUndefined(n);
}

function passesUndefinedVariable() {
  const n: number | undefined = undefined;
  // Fix: doesNotExpectNullUndefined(n!);
  doesNotExpectNullUndefined(n);
}

// Test: Add element to empty list
function addToEmptyList() {
  // Fix: const emptyList = [];
  const emptyList = [];
  emptyList.push(5);
}

// Test: No overload matches
function noOverloadMatches(n: number | undefined) {
  // Fix: new Date(n!);
  new Date(n);
}
