// 10M.js
const map = (() => {
  let env = STable.of({ 'null?': isNull, cons, car, cdr });

  let map = new Procedure(
    ['f', 'l'],
    sexp`(cond ((null? l) '()) (else (cons (f (car l)) (map f (cdr l)))))`,
    env,
  );
  env.set('map', map);

  return map;
})();
