import { stringify } from './sexp.js';

// --------------------------------------------------------
// Lists
// --------------------------------------------------------
export function cons(a, lst) {
  return [a, ...lst];
}

export function car(lst) {
  return lst[0];
}

export function cdr(lst) {
  return lst.slice(1);
}

export function isNull(lst) {
  return Array.isArray(lst) && lst.length === 0;
}

// --------------------------------------------------------
// Math
// --------------------------------------------------------
export function add(...xs) {
  return xs.reduce((x, y) => x + y, 0);
}

export function mul(...xs) {
  return xs.reduce(function(x, y) {
    // Explicit type check for the sake of the `(scale 2 '(1 2 3))` test
    if (typeof y == 'number') {
      return x * y;
    }
    throw new Error(`*: expected a number, got ${stringify(y)}`);
  }, 1);
}

export function remainder(x, y) {
  return x % y;
}
