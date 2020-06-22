import {StrictNullChecksComponent} from './experimental/strict-null-checks';

// Calculate type based on method signatures that call this function
function c(val: string) {
  d(val);
}
function d(val: string) {}
