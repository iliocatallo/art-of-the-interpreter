// 05.js
test('(+ 3 2) evaluates to 5', () => assert(еval(sexp`(+ 3 2)`, STable.of({ '+': add })), sexp`5`));
