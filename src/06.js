// 06.js
test('(+ 3 (+ 4 1)) evaluates to 8', () => assert(еval(sexp`(+ 3 (+ 4 1))`, STable.of({ '+': add })), sexp`8`));
