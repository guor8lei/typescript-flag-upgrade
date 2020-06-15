// Test: No return at end of function
function noEndValueReturn(name: string) {
  if (name === 'Bob') {
    return 'Hello Bob';
  }
  // Fix: return undefined;
}

// Test: Returns halfway through function with no value
function noValueReturnInIf(name: string) {
  if (name === 'Bob') {
    // Fix: return undefined;
    return;
  }
  return 'Hello Not-Bob';
}
