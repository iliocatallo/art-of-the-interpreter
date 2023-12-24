// 11.js
test(`(scale 2 '(1 2 3))`, () => {
  let env = STable.of({ '*': mul, '+': add, 'null?': isNull, cons, car, cdr });

  // In the slide showing this test, `env` already includes `map` (as defined in 10M.js) as a way to postpone the discussion on
  // the fact that recursive functions cannot really be defined if we insist on absolute referantial transparency.
  // Here, to make the test forward compatible we use `env.set`.
  let map = new Procedure(['f', 'l'], sexp`(cond ((null? l) '()) (else (cons (f (car l)) (map f (cdr l)))))`, env);
  env.set('map', map);

  // To make the test forward compatible we use `env.set` (same with `map` above)
  let scale = new Procedure(['l', 'v'], sexp`(map (lambda (x) (* x l)) v)`, env);

  let ans = еval(
    sexp`(scale 2 '(1 2 3))`,
    env.extend('scale', scale),
    STable.empty(), /* here to make it forward compatible with `denv` */
  );

  assert(ans, sexp`(2 4 6)`);
});
