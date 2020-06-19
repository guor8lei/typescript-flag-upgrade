import {StrictNullChecksComponent} from './strict-null-checks';

function test() {
  let comp = new StrictNullChecksComponent().asad;
}

// Calculate type based on method signatures that call this function
function c(val: string) {
  d(val);
}
function d(val: string) {}
