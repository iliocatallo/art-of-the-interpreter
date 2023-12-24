// 13.js
test(`a dynamic variable can be set and later referenced from the dynamic env`, () => {
  let denv = STable.empty();

  let ans = еval(sexp`(begin (set! (dynamic x) 10) (dynamic x))`, null, denv);

  assert(ans, sexp`10`);
});
