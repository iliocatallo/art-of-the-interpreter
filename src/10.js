// 10.js
test(`(map (lambda (x) (+ x x)) '(1 2 3)) evaluates to (2 4 6)`, () => {
  let env = STable.of({ '+': add, 'null?': isNull, cons, car, cdr });

  // To make the test forward compatible we give up on absolute referential transparency and use `env.set`
  let map = new Procedure(['f', 'l'], sexp`(cond ((null? l) '()) (else (cons (f (car l)) (map f (cdr l)))))`, env);
  env.set('map', map);

  let ans = еval(
    sexp`(map (lambda (x) (+ x x)) '(1 2 3))`,
    env,
    STable.empty(), /* here to make it forward compatible with `denv` */
  );

  assert(ans, sexp`(2 4 6)`);
});
