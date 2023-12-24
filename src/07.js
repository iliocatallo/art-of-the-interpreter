// 07.js
test(`(double 3) evaluates to 6`, () => {
  let procedures = STable.of({ '+': add });

  // Provide the lexical environment `procedures` for foward compatibility.
  let double = new Procedure(['x'], sexp`(+ x x)`, procedures);

  let ans = еval(
    sexp`(double 3)`,
    procedures.extend('double', double),
    STable.empty(), /* here to make it forward compatible with `denv` */
  );

  assert(ans, sexp`6`);
});
