// 04.js
test('#t is self-evaluating', () => assert(еval(sexp`#t`), sexp`#t`));
test('#f is self-evaluating', () => assert(еval(sexp`#f`), sexp`#f`));
test('0 is self-evaluating', () => assert(еval(sexp`0`), sexp`0`));
test('"hi" is self-evaluating', () => assert(еval(sexp`"hi"`), sexp`"hi"`));
