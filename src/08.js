// 08.js
test(`(quote (21 34 10)) evaluates to (21 34 10)`, () => {
  let ans = еval(
    sexp`(quote (21 34 10))`,
    STable.empty(),
    STable.empty(), /* here to make it forward compatible with `denv` */
  );

  assert(ans, sexp`(21 34 10)`);
});
