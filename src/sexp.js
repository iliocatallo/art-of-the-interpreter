import { parse } from 'npm:parseltongue@0.1.1';

export function sexp(strings) {
  return parse(strings[0]);
}

export function stringify(sexp) {
  if (typeof sexp === 'number') {
    return `${sexp}`;
  }
  if (typeof sexp === 'string' && sexp.startsWith('"') && sexp.endsWith('"')) {
    return `${sexp}`;
  }
  if (typeof sexp === 'string') {
    return `'${sexp}`;
  }
  const elems = [];
  for (const subSexp of sexp) {
    let str = stringify(subSexp);
    if (str.startsWith("'")) str = str.substring(1);
    elems.push(str);
  }
  return `'(${elems.join(' ')})`;
}
