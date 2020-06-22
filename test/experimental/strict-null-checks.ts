interface BasicInterface {}

export class StrictNullChecksComponent {
  // Test: Assign class member to null/undefined
  // Fix: shouldBeNumber: number | null;
  shouldBeNumber: number;
  // Fix: shouldBeInterface: BasicInterface | undefined;
  shouldBeInterface: BasicInterface;

  constructor() {
    this.shouldBeNumber = null;
    this.shouldBeInterface = undefined;
  }

  // Test: Assign variable to null
  assignNull() {
    // Fix: let n: number | null = 0;
    let n = 0;
    n = null;
    n = 5;
  }

  // Test: Assign variable to undefined
  assignUndefined() {
    // Fix: let n: number | undefined = 0;
    let n = 0;
    n = undefined;
    n = 5;
  }

  // Test: Assign variable to null and undefined
  assignNullAndUndefined() {
    // Fix: let n: number | null | undefined = 0;
    let n = 0;
    n = null;
    n = 5;
    n = undefined;
    n = 7;
  }

  // Test: Assign variable to null in conditional branch
  assignInBranch(goInBranch: boolean) {
    // Fix: let n: number | null = 0;
    let n = 0;
    if (goInBranch) {
      n = null;
    }
    n = 5;
  }

  // Test: Pass null value to function
  // Fix: doesNotExpectNull(n: number | null) {}
  doesNotExpectNull(n: number) {}

  passesNullValue() {
    this.doesNotExpectNull(null);
  }

  // Test: Pass null and undefined value to function
  // Fix: doesNotExpectNullUndefined(n: number | null | undefined) {}
  doesNotExpectNullUndefined(n: number) {}

  passesNullVariable() {
    const n: number | null = null;
    this.doesNotExpectNullUndefined(n);
  }

  passesUndefinedVariable() {
    const n: number | undefined = undefined;
    this.doesNotExpectNullUndefined(n);
  }

  // Test: Assign argument to null
  // Fix: turnsIntoNull(n: number | null)
  turnsIntoNull(n: number) {
    n = null;
  }

  // Test: Assign non-null to null variable
  assignNonNullValueToNullVar() {
    // Fix: let n: null | number = null;
    let n = null;
    n = this.returnsNumber();
  }

  returnsNumber() {
    return 5;
  }

  // Test: Add element to empty list
  addToEmptyList() {
    // Fix: const emptyList: number[] = [];
    const emptyList = [];
    emptyList.push(5);
  }

  // Test: Return null value but not in return type
  // Fix: unexpectedlyReturnsNull(): number | null {
  unexpectedlyReturnsNull(): number {
    return null;
  }

  // Test: Object is possibly null
  objectPossiblyNull(v: number | null) {
    // Fix: console.log(v!.toString());
    console.log(v.toString());

    // Fix: console.log('V: ' + (v != null ? v.toString() : 'unknown'));
    console.log('V: ' + v != null ? v.toString() : 'unknown');
  }
}
