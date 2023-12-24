// 12.js
test(`1st value of (rgen 42) is 1'083'814'273`, () => {
  let env = STable.of({ '+': add, '*': mul, remainder, 'a': 1664525, 'c': 1013904223, 'm': 2 ** 32 });

  let rgen = new Procedure(
    sexp`(seed)`,
    sexp`(lambda () (begin (set! seed (remainder (+ (* a seed) c) m)) seed))`,
    env,
  );

  let ans = еval(
    sexp`(begin (set! rand (rgen 42)) (rand))`,
    env.set('rgen', rgen),
    STable.empty(), /* here to make it forward compatible with `denv` */
  );

  assert(ans, sexp`1083814273`);
});
