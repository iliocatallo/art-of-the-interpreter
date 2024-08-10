---
title: " "
author: " "
patat:
  slideNumber: false
  incrementalLists: true
  breadcrumbs: false
  wrap: true
  theme:
    code: [ onRgb#d8d7d7 ]
  eval:
    runjs:
      command: ./bin/runjs
    runjs-immediate:
      command: ./bin/runjs
      fragment: false
    run-suite-04:
      command: ./bin/runjs 04
    run-suite-05:
      command: ./bin/runjs 0{4,5}
    run-suite-05-immediate:
      command: ./bin/runjs 0{4,5}
      fragment: false
    run-suite-06:
      command: ./bin/runjs 0{4..6}
    run-suite-06-immediate:
      command: ./bin/runjs 0{4..6}
      fragment: false
    run-suite-07:
      command: ./bin/runjs 0{4..7}
    run-suite-07-immediate:
      command: ./bin/runjs 0{4..7}
      fragment: false
    run-suite-08:
      command: ./bin/runjs 0{4..8}
    run-suite-08-immediate:
      command: ./bin/runjs 0{4..8}
      fragment: false
    run-suite-09:
      command: ./bin/runjs 0{4..9}
    run-suite-09-immediate:
      command: ./bin/runjs 0{4..9}
      fragment: false
    run-suite-10:
      command: ./bin/runjs 0{4..9} 10 10M
    run-suite-11:
      command: ./bin/runjs 0{4..9} 1{0..1}
    run-suite-11-immediate:
      command: ./bin/runjs 0{4..9} 1{0..1}
      fragment: false
    run-suite-12:
      command: ./bin/runjs 0{4..9} 1{0..2} 12G
    run-suite-12-immediate:
      command: ./bin/runjs 0{4..9} 1{0..2} 12G
      fragment: false
    run-suite-13:
      command: ./bin/runjs 0{4..9} 1{0..3} 13G
    sixel:
      command: sh
      replace: true
      fragment: false
      container: inline
...

# The Art of the Interpreter

## The Paper

<!-- https://github.com/jaspervdj/patat/issues/161 -->
```sixel
magick ./img/paper.png sixel:-
```

## The Authors

```sixel
magick ./img/authors.png sixel:-
```

# Introduction

## Modularity

What we already know:

1. The entities constructed by programming are extremely complex
2. Construction of large programs would be impossible without techniques for controlling complexity
3. Most such techniques are in fact _decomposition strategies_

## Modularity

One decomposition strategy is the _packaging of common patterns_ of use of a language

. . .

A `for` loop...

```c
for (int i = 0; i < 10; i++) {
  // do something
}
```

...captures a common pattern of `if` and `goto` statements

```c
int i = 0
loop:
  // do something
  i++;
  if (i < 10) goto loop;
```

## The Objective

“𝘞𝘦 𝘦𝘹𝘢𝘮𝘪𝘯𝘦 𝘵𝘩𝘦 𝘦𝘧𝘧𝘦𝘤𝘵𝘴 𝘰𝘧 𝘷𝘢𝘳𝘪𝘰𝘶𝘴 𝘭𝘢𝘯𝘨𝘶𝘢𝘨𝘦 𝘥𝘦𝘴𝘪𝘨𝘯 𝘥𝘦𝘤𝘪𝘴𝘪𝘰𝘯𝘴 𝘰𝘯 𝘵𝘩𝘦 𝘱𝘳𝘰𝘨𝘳𝘢𝘮𝘮𝘪𝘯𝘨 𝘴𝘵𝘺𝘭𝘦𝘴 𝘢𝘷𝘢𝘪𝘭𝘢𝘣𝘭𝘦 𝘵𝘰 𝘢 𝘶𝘴𝘦𝘳 𝘰𝘧 𝘵𝘩𝘦 𝘭𝘢𝘯𝘨𝘶𝘢𝘨𝘦, 𝘸𝘪𝘵𝘩 𝘱𝘢𝘳𝘵𝘪𝘤𝘶𝘭𝘢𝘳 𝘦𝘮𝘱𝘩𝘢𝘴𝘪𝘴 𝘰𝘯 𝘵𝘩𝘦 𝘢𝘣𝘪𝘭𝘪𝘵𝘺 𝘵𝘰 _𝘪𝘯𝘤𝘳𝘦𝘮𝘦𝘯𝘵𝘢𝘭𝘭𝘺 𝘤𝘰𝘯𝘴𝘵𝘳𝘶𝘤𝘵 𝘮𝘰𝘥𝘶𝘭𝘢𝘳 𝘴𝘺𝘴𝘵𝘦𝘮𝘴_”

## The Plan

We will construct a succession of interpreters for a simple _LISP-like language_

. . .

- **Part Zero** introduces the LISP-like language
- **Part One** introduces procedural data as an abstraction mechanism
- **Part Two** considers the problems associated with the decomposition of state

<!-- Each new interpreter is the result an incremental change to the previous interpreter -->

# Part Zero

## LISP-like languages

The elements of our _LISP-like language_ are

. . .

numbers: `5`, `3.14`, `42`

booleans: `#t`, `#f`

strings: `"hello world"`

<!-- present them as identifiers for variables -->

symbols: `name`, `age`

. . .

applications: `(+ x 1)`, `(square 7)`


definitions: `(define (square x) (* x x))`

. . .

conditionals: `(cond x ((prime? x) "prime") (else "composite"))`


quotations: `(quote (21 34 10))`


## LISP-like languages

Here's a valid (and useful) program in our language:

```scheme
(define (sqrt x) (sqrt-iter 1.0 x))

(define (sqrt-iter guess x)
  (cond ((good-enough? guess x) guess)
        (else (sqrt-iter (improve guess x) x))))

(define (good-enough? guess x)
  (< (abs (- (square guess) x)) 0.001))

(define (square x) (* x x))

(define (average x y) (/ (+ x y) 2))

(define (improve guess x) (average guess (/ x guess)))
```

## LISP-like languages

```



                              ┌───────────────────┐
                              │                   │
         Program text         │                   │         Answer
                              │                   │
               ──────────────▶│    Interpreter    ├───────────▶
                              │                   │
                              │                   │
                              │                   │
                              └───────────────────┘
```

## LISP-like languages

```



                              ┌───────────────────┐
                              │                   │
         Program text         │                   │         Answer
          (a string)          │                   │
               ──────────────▶│    Interpreter    ├───────────▶
                              │                   │
                              │                   │
                              │                   │
                              └───────────────────┘
```

## LISP-like languages

```



                              ┌───────────────────┐
                              │                   │
         Program text         │                   │         Answer
"(define (square x) (* x x))" │                   │
               ──────────────▶│    Interpreter    ├───────────▶
                              │                   │
                              │                   │
                              │                   │
                              └───────────────────┘
```

## LISP-like languages

The program text of a LISP program is encoded as _S-Expressions_

```

                              ┌───────────────────┐
                              │                   │
         Program text         │                   │         Answer
"(define (square x) (* x x))" │                   │
               ──────────────▶│    Interpreter    ├───────────▶
                              │                   │
                              │                   │
                              │                   │
                              └───────────────────┘
```

## LISP-like languages

An S-Expression is either

- an indivisible data item (**atom**)
- a possibly empty sequence of S-expressions (**list**)

## LISP-like languages

An S-Expression is either an indivisible data item (**atom**) or a possibly empty sequence of S-expressions (**list**)

## LISP-like languages

An S-Expression is either an indivisible data item (**atom**) or a possibly empty sequence of S-expressions (**list**)

```
(define (double x) (* 2 x))
```

## LISP-like languages

An S-Expression is either an indivisible data item (**atom**) or a possibly empty sequence of S-expressions (**list**)

```
(define (double x) (* 2 x))─┬─define
                            ├─(double x)
                            │
                            └─(* 2 x)
```

## LISP-like languages

An S-Expression is either an indivisible data item (**atom**) or a possibly empty sequence of S-expressions (**list**)

```
(define (double x) (* 2 x))─┬─define
                            ├─(double x)─┬─double
                            │            └─x
                            └─(* 2 x)─┬─*
                                      ├─2
                                      └─x
```

## LISP-like languages

Just like `JSON.parse` parses a JSON-encoded `string` into a JavaScript value...

~~~~{.js .runjs}
let value = JSON.parse('{ "a": { "x": 3, "y": 10 }, "b": false }');

console.log(value);
~~~~

## LISP-like languages

...we assume the existence of a `sexp` function that turns an SExp-encoded `string` into a JavaScript value

~~~~{.js .runjs}
let square = sexp`(define (double x) (* 2 x))`;

console.log(square);
~~~~

## Self-evaluation

~~~~{.js .runjs}
test('#t is self-evaluating', () => {

  let ans = еval(sexp`#t`);

  assert(ans, sexp`#t`);

});
~~~~

<!--
Since in strict mode `eval` cannot be assigned, as a workaround we call
our function `еval`, where the first letter is the the Unicode character `е`
(U+0435)
-->

## Self-evaluation

~~~~{.js .runjs}
test('#t is self-evaluating', () => {

  let ans = еval(sexp`#t`);

  assert(ans, sexp`#t`);

});


function еval(exp) {
  return exp;
}
~~~~

## Self-evaluation

~~~~{.js .runjs-immediate}
test('#t is self-evaluating', () => assert(еval(sexp`#t`), sexp`#t`));

test('#f is self-evaluating', () => assert(еval(sexp`#f`), sexp`#f`));

test('0 is self-evaluating', () => assert(еval(sexp`0`), sexp`0`));

test('"hi" is self-evaluating', () => assert(еval(sexp`"hi"`), sexp`"hi"`));


function еval(exp) {
  return exp;
}
~~~~

## Applications (1/2)

~~~~{.js .run-suite-04}
test('(+ 3 2) evaluates to 5', () => {

  let ans = еval(sexp`(+ 3 2)`);

  assert(ans, sexp`5`);

});


function еval(exp) {
  return exp;
}
~~~~

## Applications (1/2)

```js
test('(+ 3 2) evaluates to 5', () => {

  let ans = еval(sexp`(+ 3 2)`);

  assert(ans, sexp`5`);

});


function еval(exp) {
  return exp;
}
```

## Applications (1/2)

```js
test('(+ 3 2) evaluates to 5', () => {

  let ans = еval(sexp`(+ 3 2)`);

  assert(ans, sexp`5`);

});


function еval(exp) {
  if (!Array.isArray(exp)) {
    return exp;
  }
}
```
```
sexp`(+ 3 2)` = [ '+', 3, 2 ]
                  ───  ─────
```

## Applications (1/2)

```js
test('(+ 3 2) evaluates to 5', () => {

  let ans = еval(sexp`(+ 3 2)`);

  assert(ans, sexp`5`);

});


function еval(exp) {
  if (!Array.isArray(exp)) {
    return exp;
  }

  let name = exp[0];
  let args = exp.slice(1);
}
```

```
sexp`(+ 3 2)` = [ '+', 3, 2 ]
                  ───  ─────
```

## Applications (1/2)

```js
test('(+ 3 2) evaluates to 5', () => {

  let ans = еval(sexp`(+ 3 2)`);

  assert(ans, sexp`5`);

});


function еval(exp) {
  if (!Array.isArray(exp)) {
    return exp;
  }

  let name = exp[0];
  let args = exp.slice(1);
  let proc = procedures.lookup(name);

  return apply(proc, args);
}
```

```
sexp`(+ 3 2)` = [ '+', 3, 2 ]
                  ───  ─────
```

## Applications (1/2)

```js
test('(+ 3 2) evaluates to 5', () => {

  let ans = еval(sexp`(+ 3 2)`);

  assert(ans, sexp`5`);

});


function еval(exp) {
  if (!Array.isArray(exp)) {
    return exp;
  }

  let name = exp[0];
  let args = exp.slice(1);
  let proc = procedures.lookup(name); // (•_•) ( •_•)

  return apply(proc, args);
}
```

```
sexp`(+ 3 2)` = [ '+', 3, 2 ]
                  ───  ─────
```

## Symbol Table

A **symbol table** is an association between _symbols_ and their corresponding _values_
 
 


```
                            ┌───────────┬───────────┐
                            │     x     │    10     │
                            ├───────────┼───────────┤
                            │    name   │  "Gerry"  │
                            ├───────────┼───────────┤
                            │    ...    │    ...    │
                            ├───────────┼───────────┤
                            │    ...    │    ...    │
                            ├───────────┼───────────┤
                            │    ...    │    ...    │
                            ├───────────┼───────────┤
                            │  enabled  │    #f     │
                            └───────────┴───────────┘
```

## Symbol Table

```js
test('Extending a table with new associations produces a table with the new and the old associations', () => {

  let before = STable.of({ x: 20, y: 10 });








});
```

```
                                   ┌───────────┬───────────┐
                                   │     x     │    20     │
                      before ─────▶├───────────┼───────────┤
                                   │     y     │    10     │
                                   └───────────┴───────────┘
```

## Symbol Table

```js
test('Extending a table with new associations produces a table with the new and the old associations', () => {

  let before = STable.of({ x: 20, y: 10 });

  let after  = before.extend([ 'a', 'b' ], [ 40, 30 ]);






});
```

```
                                   ┌───────────┬───────────┐
                                   │     x     │    20     │
                      before ─────▶├───────────┼───────────┤
                                   │     y     │    10     │
                                   └───────────┴───────────┘
                                               ▲
                                               │
                                               │
             ┌───────────┬───────────┐         │
             │     a     │    40     ├─────────┘
after ──────▶├───────────┼───────────┤
             │     b     │    30     │
             └───────────┴───────────┘
```

## Symbol Table

```js
test('Extending a table with new associations produces a table with the new and the old associations', () => {

  let before = STable.of({ x: 20, y: 10 });

  let after  = before.extend([ 'a', 'b' ], [ 40, 30 ]);

  assert(after.lookup('a'), 40);
  assert(after.lookup('b'), 30);
  assert(after.lookup('x'), 20);
  assert(after.lookup('y'), 10);

});
```

```
                                   ┌───────────┬───────────┐
                                   │     x     │    20     │
                      before ─────▶├───────────┼───────────┤
                                   │     y     │    10     │
                                   └───────────┴───────────┘
                                               ▲
                                               │
                                               │
             ┌───────────┬───────────┐         │
             │     a     │    40     ├─────────┘
after ──────▶├───────────┼───────────┤
             │     b     │    30     │
             └───────────┴───────────┘
```

## Symbol Table

```js
test('More recent associations supersede old ones', () => {

  let before = STable.of({ x: 20, y: 10 });






});
```

```
                                   ┌───────────┬───────────┐
                                   │     x     │    20     │
                      before ─────▶├───────────┼───────────┤
                                   │     y     │    10     │
                                   └───────────┴───────────┘
```

## Symbol Table

```js
test('More recent associations supersede old ones', () => {

  let before = STable.of({ x: 20, y: 10 });

  let after = before.extend([ 'x' ], [ 50 ]);




});
```

```
                                   ┌───────────┬───────────┐
                                   │     x     │    20     │
                      before ─────▶├───────────┼───────────┤
                                   │     y     │    10     │
                                   └───────────┴───────────┘
                                               ▲
                                               │
                                               │
             ┌───────────┬───────────┐         │
after ──────▶│     x     │    50     ├─────────┘
             └───────────┴───────────┘
```

## Symbol Table

```js
test('More recent associations supersede old ones', () => {

  let before = STable.of({ x: 20, y: 10 });

  let after = before.extend([ 'x' ], [ 50 ]);

  assert(before.lookup('x'), 20);
  assert(after.lookup('x'),  50);

});
```

```
                                   ┌───────────┬───────────┐
                                   │     x     │    20     │
                      before ─────▶├───────────┼───────────┤
                                   │     y     │    10     │
                                   └───────────┴───────────┘
                                               ▲
                                               │
                                               │
             ┌───────────┬───────────┐         │
after ──────▶│     x     │    50     ├─────────┘
             └───────────┴───────────┘
```

## Applications (1/2)

```js
test('(+ 3 2) evaluates to 5', () => {

  let ans = еval(sexp`(+ 3 2)`);

  assert(ans, sexp`5`);

});


function еval(exp) {
  if (!Array.isArray(exp)) {
    return exp;
  }

  let name = exp[0];
  let proc = procedures.lookup(name);
  let args = exp.slice(1);

  return apply(proc, args);
}
```

<!--
From this slide on, `proc` is defined before `args`.
In this way, `proc` gets checked for existence before determining its `args`
--->

## Applications (1/2)

```js
test('(+ 3 2) evaluates to 5', () => {

  let procedures = STable.of({ '+': (x, y) => x + y }); /* ⟸  */

  let ans = еval(sexp`(+ 3 2)`, procedures /* ⟸  */);

  assert(ans, sexp`5`);

});


function еval(exp, procedures /* ⟸  */) {
  if (!Array.isArray(exp)) {
    return exp;
  }

  let name = exp[0];
  let proc = procedures.lookup(name);
  let args = exp.slice(1);

  return apply(proc, args);
}
```

## Applications (1/2)

~~~~{.js .run-suite-04}
test('(+ 3 2) evaluates to 5', () => {

  let procedures = STable.of({ '+': (x, y) => x + y }); /* ⟸  */

  let ans = еval(sexp`(+ 3 2)`, procedures /* ⟸  */);

  assert(ans, sexp`5`);

});


function еval(exp, procedures /* ⟸  */) {
  if (!Array.isArray(exp)) {
    return exp;
  }

  let name = exp[0];
  let proc = procedures.lookup(name);
  let args = exp.slice(1);

  return apply(proc, args);
}


function apply(proc, args) { return proc(...args); } /* ⟸  */
~~~~

## Applications (2/2)

~~~~{.js .run-suite-05}
test('(+ 3 (+ 4 1)) evaluates to 8', () => {

  let procedures = STable.of({ '+': (x, y) => x + y });

  let ans = еval(sexp`(+ 3 (+ 4 1))`, procedures);

  assert(ans, sexp`8`);

});


function еval(exp, procedures) {
  if (!Array.isArray(exp)) {
    return exp;
  }

  let name = exp[0];
  let proc = procedures.lookup(name);
  let args = exp.slice(1);

  return apply(proc, args);
}


function apply(proc, args) { return proc(...args); }
~~~~

## Applications (2/2)

```js
test('(+ 3 (+ 4 1)) evaluates to 8', () => {

  let procedures = STable.of({ '+': (x, y) => x + y });

  let ans = еval(sexp`(+ 3 (+ 4 1))`, procedures);

  assert(ans, sexp`8`);

});


function еval(exp, procedures) {
  if (!Array.isArray(exp)) {
    return exp;
  }

  let name = exp[0];
  let proc = procedures.lookup(name);
  let args = exp.slice(1);

  return apply(proc, args);
}


function apply(proc, args) { return proc(...args); }


```
```
sexp`(+ 3 (+ 4 1))` = [ '+', 3, [ '+', 4, 1 ] ]
                        ───  ────────────────
```

## Applications (2/2)

```js
test('(+ 3 (+ 4 1)) evaluates to 8', () => {

  let procedures = STable.of({ '+': (x, y) => x + y });

  let ans = еval(sexp`(+ 3 (+ 4 1))`, procedures);

  assert(ans, sexp`8`);

});


function еval(exp, procedures) {
  if (!Array.isArray(exp)) {
    return exp;
  }

  let name = exp[0];
  let proc = procedures.lookup(name);
  let args = exp.slice(1).map(oprand => еval(oprand, procedures)); /* ⟸  */

  return apply(proc, args);
}


function apply(proc, args) { return proc(...args); }


```
```
sexp`(+ 3 (+ 4 1))` = [ '+', 3, [ '+', 4, 1 ] ]
                        ───  ────────────────
```


## Applications (2/2)

~~~~{.js .run-suite-05-immediate}
test('(+ 3 (+ 4 1)) evaluates to 8', () => {

  let procedures = STable.of({ '+': (x, y) => x + y });

  let ans = еval(sexp`(+ 3 (+ 4 1))`, procedures);

  assert(ans, sexp`8`);

});


function еval(exp, procedures) {
  if (!Array.isArray(exp)) {
    return exp;
  }

  let name = exp[0];
  let proc = procedures.lookup(name);
  let args = exp.slice(1).map(oprand => еval(oprand, procedures)); /* ⟸  */

  return apply(proc, args);
}


function apply(proc, args) { return proc(...args); }
~~~~

## Abstract Syntax

```js
test('(+ 3 (+ 4 1)) evaluates to 8', () => {

  let procedures = STable.of({ '+': (x, y) => x + y });

  let ans = еval(sexp`(+ 3 (+ 4 1))`, procedures);

  assert(ans, sexp`8`);

});


function еval(exp, procedures) {
  if (isSelfEvaluating(exp)) { /* ⟸  */
    return exp;
  }

  let name = operator(exp); /* ⟸  */
  let proc = procedures.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, procedures)); /* ⟸  */

  return apply(proc, args);
}


function apply(proc, args) { return proc(...args); }


function isSelfEvaluating(exp) { return !Array.isArray(exp); }

function operator(exp) { return exp[0]; }

function operands(exp) { return exp.slice(1); }
```

## REPL

```js
import * as repl from 'node:repl';


let procedures = STable.of({ '+': add, /* more primitive procs */ });

repl.start({
  eval: function (str, context, filename, cb) {

    let exp = read(str);
    let ans = еval(exp, procedures);
    cb(null, ans);

  }
});


function read(str) { return sexp([str.trim()]); }
```

<!--
Note that `read` is written in terms of `sexp`.
To invoke `sexp` as a plain function, its argument must be an array.
-->

## REPL

Application: `(+ 1 2)`

```
> (+ 1 2)
3
>
```

. . .

Definition: `(define (double x) (+ x x))`

```
> (define (double x) (+ x x))
Uncaught Error: unbound value: define
    at STable.lookup
    at еval
    at REPLServer.eval
    ...
```

## REPL

```js
import * as repl from 'node:repl';


let procedures = STable.of({ '+': add, /* more primitive procs */ });

repl.start({
  eval: function (str, context, filename, cb) {

    let exp = read(str);
    let ans = еval(exp, procedures);
    cb(null, ans);

  }
});
```

## REPL

```js
import * as repl from 'node:repl';


let procedures = STable.of({ '+': add, /* more primitive procs */ });

repl.start({
  eval: function (str, context, filename, cb) {

    let exp = read(str);
    if (isDefinition(exp)) {




    }

    let ans = еval(exp, procedures);
    cb(null, ans);

  }
});


function isDefinition(exp) { return Array.isArray(exp) && exp[0] === 'define'; } // [ 'd̲e̲f̲i̲n̲e̲', ['name', 'a', 'b'], body ]
```

## REPL

```js
import * as repl from 'node:repl';


let procedures = STable.of({ '+': add, /* more primitive procs */ });

repl.start({
  eval: function (str, context, filename, cb) {

    let exp = read(str);
    if (isDefinition(exp)) {
      let name = definitionName(exp);
      let proc = new Procedure(definitionParams(exp), definitionBody(exp));
      procedures = procedures.extend(name, proc);
      return cb(null, name);
    }

    let ans = еval(exp, procedures);
    cb(null, ans);

  }
});


function isDefinition(exp) { return Array.isArray(exp) && exp[0] === 'define'; } // [ 'd̲e̲f̲i̲n̲e̲', ['name', 'a', 'b'], body ]

function definitionName(exp) { return exp[1][0]; }                               // [ 'define', ['n̲a̲m̲e̲', 'a', 'b'], body ]

function definitionParams(exp) { return exp[1].slice(1); }                       // [ 'define', ['name', 'a̲',̲ 'b̲'], body ]

function definitionBody(exp) { return exp[2]; }                                  // [ 'define', ['name', 'a', 'b'], b̲o̲d̲y ]

class Procedure {
  constructor(params, body) {
    this.params = params;
    this.body = body;
  }
}
```

## Compound Applications

~~~~{.js .run-suite-06}
test(`(double 3) evaluates to 6`, () => {

  let procedures = STable.of({ '+': add });

  let double = new Procedure(sexp`(x)`, sexp`(+ x x)`);

  let ans = еval(sexp`(double 3)`, procedures.extend('double', double));

  assert(ans, sexp`6`);

});


function еval(exp, procedures) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }

  let name = operator(exp);
  let proc = procedures.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, procedures));

  return apply(proc, args, procedures);
}


function apply(proc, args, procedures) { return proc(...args); }
~~~~

<!--
Here, `procedures` is passed to `apply` even if there is no real usage for it.
Since it will be needed soon, in the interest of time I anticipate here the change
so that I don't have to explicitly justify it later.
-->

## Compound Applications

```js
test(`(double 3) evaluates to 6`, () => {

  let procedures = STable.of({ '+': add });

  let double = new Procedure(sexp`(x)`, sexp`(+ x x)`);

  let ans = еval(sexp`(double 3)`, procedures.extend('double', double));

  assert(ans, sexp`6`);

});


function еval(exp, procedures) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }

  let name = operator(exp);
  let proc = procedures.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, procedures));

  return apply(proc, args, procedures);
}


function apply(proc, args, procedures) {
  if (typeof proc === 'function') {
    return proc(...args);
  }
  // apply compound procedure
}
```
. . .

```



             proc            args
      ┌────────┬─────────┐   ┌───┐
apply(│   x    │ (+ x x) │ , │ 3 │, procedures)
      └────────┴─────────┘   └───┘
```

## Compound Applications

```js
test(`(double 3) evaluates to 6`, () => {

  let procedures = STable.of({ '+': add });

  let double = new Procedure(sexp`(x)`, sexp`(+ x x)`);

  let ans = еval(sexp`(double 3)`, procedures.extend('double', double));

  assert(ans, sexp`6`);

});


function еval(exp, procedures) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }

  let name = operator(exp);
  let proc = procedures.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, procedures));

  return apply(proc, args, procedures);
}


function apply(proc, args, procedures) {
  if (typeof proc === 'function') {
    return proc(...args);
  }
  return еval(proc.body, procedures); /* ⟸  */
}
```

```



             proc            args                               exp
      ┌────────┬─────────┐   ┌───┐                          ┌─────────┐
apply(│   x    │ (+ x x) │ , │ 3 │, procedures)        eval(│ (+ x x) │, procedures)
      └────────┴─────────┘   └───┘                          └─────────┘
```

## Compound Applications

~~~~{.js .runjs-immediate}
test(`(double 3) evaluates to 6`, () => {

  let procedures = STable.of({ '+': add });

  let double = new Procedure(sexp`(x)`, sexp`(+ x x)`);

  let ans = еval(sexp`(double 3)`, procedures.extend('double', double));

  assert(ans, sexp`6`);

});


function еval(exp, procedures) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }

  let name = operator(exp);
  let proc = procedures.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, procedures));

  return apply(proc, args, procedures);
}


function apply(proc, args, procedures) {
  if (typeof proc === 'function') {
    return proc(...args);
  }
  return еval(proc.body, procedures); /* ⟸  */
}
~~~~

<!-- at a certain point it wants to evaluate `x`` of `(+ x x)`; since there's no special case for variables,
<-- it tries to treat `x` as an application, but `x` is not an array so `operands()` fails -->

## Compound Applications

```js
test(`(double 3) evaluates to 6`, () => {

  let procedures = STable.of({ '+': add });

  let double = new Procedure(sexp`(x)`, sexp`(+ x x)`);

  let ans = еval(sexp`(double 3)`, procedures.extend('double', double));

  assert(ans, sexp`6`);

});


function еval(exp, procedures) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }

  let name = operator(exp);
  let proc = procedures.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, procedures));

  return apply(proc, args, procedures);
}


function apply(proc, args, procedures) {
  if (typeof proc === 'function') {
    return proc(...args);
  }
  return еval(proc.body, procedures); /* ⟸  */
}
```

```




             proc            args                               exp
      ┌────────┬─────────┐   ┌───┐                          ┌─────────┐
apply(│   x    │ (+ x x) │ , │ 3 │, procedures)        eval(│ (+ x x) │, procedures)
      └────────┴─────────┘   └───┘                          └─────────┘
```

## Compound Applications

```js
test(`(double 3) evaluates to 6`, () => {

  let procedures = STable.of({ '+': add });

  let double = new Procedure(sexp`(x)`, sexp`(+ x x)`);

  let ans = еval(sexp`(double 3)`, procedures.extend('double', double));

  assert(ans, sexp`6`);

});


function еval(exp, procedures) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }

  let name = operator(exp);
  let proc = procedures.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, procedures));

  return apply(proc, args, procedures);
}


function apply(proc, args, procedures) {
  if (typeof proc === 'function') {
    return proc(...args);
  }
  return еval(proc.body, procedures); /* ⟸  */
}
```


```




             proc            args                               exp                               exp
      ┌────────┬─────────┐   ┌───┐                          ┌─────────┐                          ┌───┐
apply(│   x    │ (+ x x) │ , │ 3 │, procedures)        eval(│ (+ x x) │, procedures)        eval(│ x │, procedures)  𝙤𝙤𝙥𝙨!
      └────────┴─────────┘   └───┘                          └─────────┘                          └───┘
```


## Compound Applications

```js
test(`(double 3) evaluates to 6`, () => {

  let procedures = STable.of({ '+': add });

  let double = new Procedure(sexp`(x)`, sexp`(+ x x)`);

  let ans = еval(sexp`(double 3)`, procedures.extend('double', double));

  assert(ans, sexp`6`);

});


function еval(exp, procedures) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }

  let name = operator(exp);
  let proc = procedures.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, procedures));

  return apply(proc, args, procedures);
}


function apply(proc, args, procedures) {
  if (typeof proc === 'function') {
    return proc(...args);
  }
  return еval(proc.body, procedures); /* ⟸  */
}
```


```




             proc            args                               exp
      ┌────────┬─────────┐   ┌───┐                          ┌─────────┐
apply(│   x    │ (+ x x) │ , │ 3 │, procedures)        eval(│ (+ x x) │, procedures)
      └────────┴─────────┘   └───┘                          └─────────┘
```


## Compound Applications

```js
test(`(double 3) evaluates to 6`, () => {

  let procedures = STable.of({ '+': add });

  let double = new Procedure(sexp`(x)`, sexp`(+ x x)`);

  let ans = еval(sexp`(double 3)`, procedures.extend('double', double));

  assert(ans, sexp`6`);

});


function еval(exp, procedures, env = STable.empty()) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }

  let name = operator(exp);
  let proc = procedures.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, procedures));

  return apply(proc, args, procedures);
}


function apply(proc, args, procedures) {
  if (typeof proc === 'function') {
    return proc(...args);
  }
  let env = STable.of(proc.params, args); /* ⟸  */
  return еval(proc.body, procedures, env /* ⟸  */);
}
```

```



             proc            args                               exp         env
      ┌────────┬─────────┐   ┌───┐                          ┌─────────┐  ┌───┬───┐
apply(│   x    │ (+ x x) │ , │ 3 │, procedures)        eval(│ (+ x x) │, │ x │ 3 │, procedures)
      └────────┴─────────┘   └───┘                          └─────────┘  └───┴───┘
```

## Compound Applications

```js
test(`(double 3) evaluates to 6`, () => {

  let procedures = STable.of({ '+': add });

  let double = new Procedure(sexp`(x)`, sexp`(+ x x)`);

  let ans = еval(sexp`(double 3)`, procedures.extend('double', double));

  assert(ans, sexp`6`);

});


function еval(exp, procedures, env = STable.empty()) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }

  let name = operator(exp);
  let proc = procedures.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, procedures));

  return apply(proc, args, procedures);
}


function apply(proc, args, procedures) {
  if (typeof proc === 'function') {
    return proc(...args);
  }
  let env = STable.of(proc.params, args); /* ⟸  */
  return еval(proc.body, procedures, env /* ⟸  */);
}
```

```



             proc            args                               exp         env                             exp      env
      ┌────────┬─────────┐   ┌───┐                          ┌─────────┐  ┌───┬───┐                         ┌───┐  ┌───┬───┐
apply(│   x    │ (+ x x) │ , │ 3 │, procedures)        eval(│ (+ x x) │, │ x │ 3 │, procedures)       eval(│ x │, │ x │ 3 │, procedures)
      └────────┴─────────┘   └───┘                          └─────────┘  └───┴───┘                         └───┘  └───┴───┘
```

<!--
What does it mean to apply a compound function?
it means binding local variables and evaluating the body of the procedure
-->

## Compound Applications

```js
test(`(double 3) evaluates to 6`, () => {

  let procedures = STable.of({ '+': add });

  let double = new Procedure(sexp`(x)`, sexp`(+ x x)`);

  let ans = еval(sexp`(double 3)`, procedures.extend('double', double));

  assert(ans, sexp`6`);

});


function еval(exp, procedures, env = STable.empty()) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) { /* ⟸  */
    return env.lookup(exp); /* ⟸  */
  }

  let name = operator(exp);
  let proc = procedures.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, procedures, env));

  return apply(proc, args, procedures);
}


function apply(proc, args, procedures) {
  if (typeof proc === 'function') {
    return proc(...args);
  }
  let env = STable.of(proc.params, args);
  return еval(proc.body, procedures, env);
}
```

```
             proc            args                               exp         env                             exp      env
      ┌────────┬─────────┐   ┌───┐                          ┌─────────┐  ┌───┬───┐                         ┌───┐  ┌───┬───┐
apply(│   x    │ (+ x x) │ , │ 3 │, procedures)        eval(│ (+ x x) │, │ x │ 3 │, procedures)       eval(│ x │, │ x │ 3 │, procedures)
      └────────┴─────────┘   └───┘                          └─────────┘  └───┴───┘                         └───┘  └───┴───┘
```

```js
function isVariable(exp) { return typeof exp === 'string' && !exp.startsWith(`"`); }
```

## Compound Applications

~~~~{.js .run-suite-06-immediate}
test(`(double 3) evaluates to 6`, () => {

  let procedures = STable.of({ '+': add });

  let double = new Procedure(sexp`(x)`, sexp`(+ x x)`);

  let ans = еval(sexp`(double 3)`, procedures.extend('double', double));

  assert(ans, sexp`6`);

});


function еval(exp, procedures, env = STable.empty()) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) { /* ⟸  */
    return env.lookup(exp); /* ⟸  */
  }

  let name = operator(exp);
  let proc = procedures.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, procedures, env));

  return apply(proc, args, procedures);
}


function apply(proc, args, procedures) {
  if (typeof proc === 'function') {
    return proc(...args);
  }
  let env = STable.of(proc.params, args);
  return еval(proc.body, procedures, env);
}
~~~~

## Compound Applications

```js
test(`(double 3) evaluates to 6`, () => {

  let procedures = STable.of({ '+': add });

  let double = new Procedure(sexp`(x)`, sexp`(+ x x)`);

  let ans = еval(sexp`(double 3)`, procedures.extend('double', double));

  assert(ans, sexp`6`);

});


function еval(exp, procedures, env = STable.empty()) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) {
    return env.lookup(exp);
  }

  let name = operator(exp);
  let proc = procedures.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, procedures, env));

  return apply(proc, args, procedures);
}


function apply(proc, args, procedures) {
  if (isPrimitive(proc)) { /* ⟸  */
    return applyPrimitive(proc, args); /* ⟸  */
  }
  let env = STable.of(proc.params, args);
  return еval(proc.body, procedures, env);
}


function isPrimitive(proc) { return typeof proc === 'function'; }

function applyPrimitive(proc, args) { return proc(...args); }
```

## Conditionals

```js
function еval(exp, procedures, env = STable.empty()) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) {
    return env.lookup(exp);
  }

  let name = operator(exp);
  let proc = procedures.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, procedures, env));

  return apply(proc, args, procedures);
}
```

What about conditionals?

```scheme
(define (abs x)
  (cond ((> x 0) x)
        (else (* -1 x))))
```

## Conditionals

```js
function еval(exp, procedures, env = STable.empty()) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isConditional(exp)) { /* ⟸  */
    return evalCond(exp, procedures, env);  /* ⟸  */
  }

  let name = operator(exp);
  let proc = procedures.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, procedures, env));

  return apply(proc, args, procedures);
}


function isConditional(exp) { return Array.isArray(exp) && exp[0] === 'cond'; }  // [ 'c̲o̲n̲d̲', clauses ]

function evalCond(exp, procedures, env) { /* no time for no monkey business */ }
```

<!--
The comment `[ 'c̲o̲n̲d̲', clauses ]` suggests that `clauses` is `exp[1]`, while
in reality `clauses` are `exp.slice(1)`. But it's difficult to draw and it's not
very crucial for the discussion.
-->

## Conditionals

<!-- Want to show an example just to give a break --->

```scheme
(define (sqrt x) (sqrt-iter 1.0 x))

(define (sqrt-iter guess x)
  (cond ((good-enough? guess x) guess)
        (else (sqrt-iter (improve guess x) x))))

(define (good-enough? guess x)
  (< (abs (- (square guess) x)) 0.001))

(define (square x) (* x x))

(define (average x y) (/ (+ x y) 2))

(define (improve guess x) (average guess (/ x guess)))

(define (abs x)
  (cond ((< x 0) (* -1 x))
        (else x)))

(sqrt 9)
```

## Quotations

What's the intended meaning?

```scheme
(first (21 34 10))
```

## Quotations

What's the intended meaning?

```scheme
(first (21 34 10))
 ──┬──  ────┬────
   │        │
   │        └─ argument
   │
   └─ procedure
```

## Quotations

However, that's not what would happen...

```scheme
(first (21 34 10))
```

## Quotations

However, that's not what would happen...

```scheme
(first (21 34 10))
 ──┬──  ┬  ┬   ┬
   │    │  │   │
   │    │  │   └─ argument
   │    │  │
   │    │  └─ argument
   │    │
   │    └─ procedure
   │
procedure
```

## Quotations

We need a way to _prevent the nested application_

```scheme
(first (21 34 10))
 ──┬──  ┬  ┬   ┬
   │    │  │   │
   │    │  │   └─ argument
   │    │  │
   │    │  └─ argument
   │    │
   │    └─ procedure
   │
procedure
```


## Quotations

We need a way to _prevent the nested application_

```scheme
(first  '(21 34 10))
 ──┬──  ──────┬────
   │          │
   │          │
   │          │
   │          │
   │       argument
   │
   │
procedure
```

## Quotations

**Wᴀɪᴛ. Tʜᴀᴛ's ɪʟʟᴇɢᴀʟ.**

```scheme
(first  '(21 34 10))
 ──┬──  ──────┬────
   │          │
   │          │
   │          │
   │          │
   │       argument
   │
   │
procedure
```

## Quotations

**Wᴀɪᴛ. Tʜᴀᴛ's ɪʟʟᴇɢᴀʟ.**

```scheme
(first (quote (21 34 10)))
 ──┬──  ──────┬──────────
   │          │
   │          │
   │          │
   │          │
   │       argument
   │
   │
procedure
```

## Quotations

~~~{.js .run-suite-07}
test(`(quote (21 34 10)) evaluates to (21 34 10)`, () => {

  let procedures = STable.empty();

  let ans = еval(sexp`(quote (21 34 10))`, procedures);

  assert(ans, sexp`(21 34 10)`);

});


function еval(exp, procedures, env = STable.empty()) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isConditional(exp)) {
    return evalCond(exp, procedures, env);
  }

  let name = operator(exp);
  let proc = procedures.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, procedures, env));

  return apply(proc, args, procedures);
}

function apply(proc, args, procedures) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let env = STable.of(proc.params, args);
  return еval(proc.body, procedures, env);
}
~~~

## Quotations

```js
test(`(quote (21 34 10)) evaluates to (21 34 10)`, () => {

  let procedures = STable.empty();

  let ans = еval(sexp`(quote (21 34 10))`, procedures);

  assert(ans, sexp`(21 34 10)`);

});


function еval(exp, procedures, env = STable.empty()) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isQuoted(exp)) {  /* ⟸  */
    return textOfQuotation(exp); /* ⟸  */
  }
  if (isConditional(exp)) {
    return evalCond(exp, procedures, env);
  }

  let name = operator(exp);
  let proc = procedures.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, procedures, env));

  return apply(proc, args, procedures);
}

function apply(proc, args, procedures) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let env = STable.of(proc.params, args);
  return еval(proc.body, procedures, env);
}


function isQuoted(exp) { return Array.isArray(exp) && exp[0] === 'quote'; } // [ 'qu̲o̲t̲e̲', exp ]

function textOfQuotation(exp) { return exp[1]; } // [ 'quote', e̲x̲p ]
```

## Quotations

~~~{.js .run-suite-07-immediate}
test(`(quote (21 34 10)) evaluates to (21 34 10)`, () => {

  let procedures = STable.empty();

  let ans = еval(sexp`(quote (21 34 10))`, procedures);

  assert(ans, sexp`(21 34 10)`);

});


function еval(exp, procedures, env = STable.empty()) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isQuoted(exp)) {  /* ⟸  */
    return textOfQuotation(exp); /* ⟸  */
  }
  if (isConditional(exp)) {
    return evalCond(exp, procedures, env);
  }

  let name = operator(exp);
  let proc = procedures.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, procedures, env));

  return apply(proc, args, procedures);
}

function apply(proc, args, procedures) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let env = STable.of(proc.params, args);
  return еval(proc.body, procedures, env);
}
~~~

## Quotations

Via quotations, S-expressions become _values_ in our language

```scheme
(quote (21 34 10))
```

## Quotations

Direct access to S-expressions gives us the possibility to use _lists as values_

```scheme
(quote (21 34 10))
```

## Quotations

Now that they are values, we can introduce built-in procedures to _take apart_ lists

```scheme
(car '(21 34 10))
```

```js
function car(lst) { return lst[0]; }
```

## Quotations

Now that they are values, we can introduce built-in procedures to _take apart_ lists

```scheme
(cdr '(21 34 10))
```


```js
function cdr(lst) { return lst.slice(1); }
```

## Quotations

We can also introduce a built-in procedure to _build bigger lists_ out of smaller ones

```scheme
(cons 0 '(1 2 3))
```

```js
function cons(a, lst) { return [a, ...lst]; }
```

## Quotations

We can build arbitrary lists starting from the _empty list_

```scheme
(cons 1 (cons 2 (cons 3 '())))
```

# Part One

## Procedures as Data

Many problems require one to perform one operation on each element of a list and produce a new list of the results

```scheme
(define (square-list l)
  (cond ((null? l) '())
        (else (cons (square (car l))
                    (square-list (cdr l))))))
```

## Procedures as Data

We find ourselves writing this _pattern_ over and over again

```scheme
(define (f-list l)
  (cond ((null? l) '())
        (else (cons (f (car l))
                    (f-list (cdr l))))))
```

## Procedures as Data

It would be nice to introduce an entity of the programming language which would _capture_ this _abstract pattern_

```scheme
(define (f-list l)
  (cond ((null? l) '())
        (else (cons (f (car l))
                    (f-list (cdr l))))))
```

## Procedures as Data

The most direct solution is to write the function `f` as a variable which can be accepted as an argument

```scheme
(define (map f l)
  (cond ((null? l) '())
        (else (cons (f (car l))
                    (map f (cdr l))))))
```

## Procedures as Data

~~~~{.js .run-suite-08}
test(`(map double '(1 2 3)) evaluates to (2 4 6)`, () => {

  let procedures = STable.of({ '+': add, 'null?': isNull, cons, car, cdr });

  let double = new Procedure(sexp`(x)`, sexp`(+ x x)`);

  let map = new Procedure(sexp`(f l)`, sexp`(cond ((null? l) '()) (else (cons (f (car l)) (map f (cdr l)))))`);

  let ans = еval(sexp`(map double '(1 2 3))`, procedures.extend(['double', 'map'], [double, map]));

  assert(ans, sexp`(2 4 6)`);

});


function еval(exp, procedures, env = STable.empty()) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isQuoted(exp)) {
    return textOfQuotation(exp);
  }
  if (isConditional(exp)) {
    return evalCond(exp, procedures, env);
  }

  let name = operator(exp);
  let proc = procedures.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, procedures, env));

  return apply(proc, args, procedures);
}

function apply(proc, args, procedures) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let env = STable.of(proc.params, args);
  return еval(proc.body, procedures, env);
}
~~~~

## Procedures as Data

The essence of the problem is that our interpreter _segregates procedures_ from other kinds of objects

```
           procedures                           env
    ┌───────────┬───────────┐        ┌───────────┬───────────┐
    │     +     │ (a, b) => │        │     x     │    10     │
    ├───────────┼───────────┤        ├───────────┼───────────┤
    │    cons   │(a, lst) =>│        │    name   │  "Gerry"  │
    ├───────────┼───────────┤        ├───────────┼───────────┤
    │    car    │    ...    │        │    ...    │    ...    │
    ├───────────┼───────────┤        ├───────────┼───────────┤
    │    cdr    │    ...    │        │    ...    │    ...    │
    ├───────────┼───────────┤        ├───────────┼───────────┤
    │    list   │(...xs) => │        │  enabled  │    #f     │
    └───────────┴───────────┘        └───────────┴───────────┘
```

## Procedures as Data

Let's merge the two symbol tables!

```
           procedures                           env
    ┌───────────┬───────────┐        ┌───────────┬───────────┐
    │     +     │ (a, b) => │        │     x     │    10     │
    ├───────────┼───────────┤        ├───────────┼───────────┤
    │    cons   │(a, lst) =>│        │    name   │  "Gerry"  │
    ├───────────┼───────────┤        ├───────────┼───────────┤
    │    car    │    ...    │        │    ...    │    ...    │
    ├───────────┼───────────┤        ├───────────┼───────────┤
    │    cdr    │    ...    │        │    ...    │    ...    │
    ├───────────┼───────────┤        ├───────────┼───────────┤
    │    list   │(...xs) => │        │  enabled  │    #f     │
    └───────────┴───────────┘        └───────────┴───────────┘
```

## Procedures as Data

```js
test(`(map double '(1 2 3)) evaluates to (2 4 6)`, () => {

  let env /* ⟸  */ = STable.of({ '+': add, 'null?': isNull, cons, car, cdr });

  let double = new Procedure(sexp`(x)`, sexp`(+ x x)`);

  let map = new Procedure(sexp`(f l)`, sexp`(cond ((null? l) '()) (else (cons (f (car l)) (map f (cdr l)))))`);

  let ans = еval(sexp`(map double '(1 2 3))`, env /* ⟸  */.extend(['double', 'map'], [double, map]));

  assert(ans, sexp`(2 4 6)`);

});


function еval(exp, env /* ⟸  */) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isQuoted(exp)) {
    return textOfQuotation(exp);
  }
  if (isConditional(exp)) {
    return evalCond(exp, env);
  }

  let name = operator(exp);
  let proc = env.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, env));

  return apply(proc, args, env);
}

function apply(proc, args, env) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let updatedEnv = STable.of(proc.params, args);
  return еval(proc.body, updatedEnv);
}
```

## Procedures as Data

```js
test(`(map double '(1 2 3)) evaluates to (2 4 6)`, () => {

  let env = STable.of({ '+': add, 'null?': isNull, cons, car, cdr });

  let double = new Procedure(sexp`(x)`, sexp`(+ x x)`);

  let map = new Procedure(sexp`(f l)`, sexp`(cond ((null? l) '()) (else (cons (f (car l)) (map f (cdr l)))))`);

  let ans = еval(sexp`(map double '(1 2 3))`, env.extend(['double', 'map'], [double, map]));

  assert(ans, sexp`(2 4 6)`);

});


function еval(exp, env) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isQuoted(exp)) {
    return textOfQuotation(exp);
  }
  if (isConditional(exp)) {
    return evalCond(exp, env);
  }

  let name = operator(exp);
  let proc = env.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, env));

  return apply(proc, args, env  /* ⟸  */);
}

function apply(proc, args, env) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let updatedEnv = STable.of(proc.params, args);
  return еval(proc.body, updatedEnv);
}
```

```
             proc                          args                        env
      ┌───────┬──────────┐  ┌────────┬─────────┐ ┌───────┐  ┌───────────┬───────────┐
apply(│ (f l) │(cond ... │, │  (x)   │ (+ x x) │ │(1 2 3)│, │   cons    │    ...    │)
      └───────┴──────────┘  └────────┴─────────┘ └───────┘  ├───────────┼───────────┤
                                                            │   map     │    ...    │
                                                            ├───────────┼───────────┤
                                                            │   double  │    ...    │
                                                            └───────────┴───────────┘
```

## Procedures as Data


```js
test(`(map double '(1 2 3)) evaluates to (2 4 6)`, () => {

  let env = STable.of({ '+': add, 'null?': isNull, cons, car, cdr });

  let double = new Procedure(sexp`(x)`, sexp`(+ x x)`);

  let map = new Procedure(sexp`(f l)`, sexp`(cond ((null? l) '()) (else (cons (f (car l)) (map f (cdr l)))))`);

  let ans = еval(sexp`(map double '(1 2 3))`, env.extend(['double', 'map'], [double, map]));

  assert(ans, sexp`(2 4 6)`);

});


function еval(exp, env) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isQuoted(exp)) {
    return textOfQuotation(exp);
  }
  if (isConditional(exp)) {
    return evalCond(exp, env);
  }

  let name = operator(exp);
  let proc = env.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, env));

  return apply(proc, args, env);
}

function apply(proc, args, env) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let updatedEnv = env.extend(proc.params, args); /* ⟸  */
  return еval(proc.body, updatedEnv);
}
```

```
             proc                          args                        env                                    exp                  env
      ┌───────┬──────────┐  ┌────────┬─────────┐ ┌───────┐  ┌───────────┬───────────┐                     ┌──────────┐  ┌───────────┬───────────┐
apply(│ (f l) │(cond ... │, │  (x)   │ (+ x x) │ │(1 2 3)│, │   cons    │    ...    │)              eval( │(cond ... │, │    𝗳      │(𝘅) (+ 𝘅 𝘅)│ )
      └───────┴──────────┘  └────────┴─────────┘ └───────┘  ├───────────┼───────────┤                     └──────────┘  ├───────────┼───────────┤
                                                            │   map     │    ...    │                                   │    𝗹      │  (𝟭 𝟮 𝟯)  │
                                                            ├───────────┼───────────┤                                   ├───────────┼───────────┤
                                                            │   double  │    ...    │                                   │   cons    │    ...    │
                                                            └───────────┴───────────┘                                   ├───────────┼───────────┤
                                                                                                                        │   map     │    ...    │
                                                                                                                        ├───────────┼───────────┤
                                                                                                                        │   double  │    ...    │
                                                                                                                        └───────────┴───────────┘
```


## Procedures as Data

~~~~{.js .run-suite-08-immediate}
test(`(map double '(1 2 3)) evaluates to (2 4 6)`, () => {

  let env = STable.of({ '+': add, 'null?': isNull, cons, car, cdr });

  let double = new Procedure(sexp`(x)`, sexp`(+ x x)`);

  let map = new Procedure(sexp`(f l)`, sexp`(cond ((null? l) '()) (else (cons (f (car l)) (map f (cdr l)))))`);

  let ans = еval(sexp`(map double '(1 2 3))`, env.extend(['double', 'map'], [double, map]));

  assert(ans, sexp`(2 4 6)`);

});


function еval(exp, env) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isQuoted(exp)) {
    return textOfQuotation(exp);
  }
  if (isConditional(exp)) {
    return evalCond(exp, env);
  }

  let name = operator(exp);
  let proc = env.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, env));

  return apply(proc, args, env);
}

function apply(proc, args, env) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let updatedEnv = env.extend(proc.params, args); /* ⟸  */
  return еval(proc.body, updatedEnv);
}
~~~~

## Anonymous Procedures

Unfortunately, our language requires that we use a name to refer to the functional arguments

```scheme
(define (foobar-43 x) (* (+ x 4) 3))

(map foobar-43 '(1 2 3))
```

## Anonymous Procedures

It would be nice to have a way of writing an S-expression that _evaluates to a procedure_

```scheme
(map (lambda (x) (+ x x)) '(1 2 3))
```

## Anonymous Procedures

~~~~{.js .run-suite-09}
test(`(map (lambda (x) (+ x x)) '(1 2 3)) evaluates to (2 4 6)`, () => {

  let env = STable.of({ '+': add, 'null?': isNull, cons, car, cdr });

  let map = new Procedure(sexp`(f l)`, sexp`(cond ((null? l) '()) (else (cons (f (car l)) (map f (cdr l)))))`);

  let ans = еval(sexp`(map (lambda (x) (+ x x)) '(1 2 3))`, env.extend('map', map));

  assert(ans, sexp`(2 4 6)`);

});


function еval(exp, env) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isQuoted(exp)) {
    return textOfQuotation(exp);
  }
  if (isConditional(exp)) {
    return evalCond(exp, env);
  }

  let name = operator(exp);
  let proc = env.lookup(name);
  let args = operands(exp).map(oprand => еval(oprand, env));

  return apply(proc, args, env);
}

function apply(proc, args, env) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let updatedEnv = env.extend(proc.params, args);
  return еval(proc.body, updatedEnv);
}
~~~~

## Anonymous Procedures

```js
test(`(map (lambda (x) (+ x x)) '(1 2 3)) evaluates to (2 4 6)`, () => {

  let env = STable.of({ '+': add, 'null?': isNull, cons, car, cdr });

  let map = new Procedure(sexp`(f l)`, sexp`(cond ((null? l) '()) (else (cons (f (car l)) (map f (cdr l)))))`);

  let ans = еval(sexp`(map (lambda (x) (+ x x)) '(1 2 3))`, env.extend('map', map));

  assert(ans, sexp`(2 4 6)`);

});


function еval(exp, env) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isQuoted(exp)) {
    return textOfQuotation(exp);
  }
  if (isConditional(exp)) {
    return evalCond(exp, env);
  }
  if (isLambda(exp)) { /* ⟸  */
    return new Procedure(lparams(exp), lbody(exp)); /* ⟸  */
  }

  let name = operator(exp);
  let proc = еval(name, env);
  let args = operands(exp).map(oprand => еval(oprand, env));

  return apply(proc, args, env);
}

function apply(proc, args, env) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let updatedEnv = env.extend(proc.params, args);
  return еval(proc.body, updatedEnv);
}


function isLambda(exp) { return Array.isArray(exp) && exp[0] === 'lambda'; } // [ 'l̲a̲m̲b̲d̲a̲', params, body ]

function lparams(exp) { return exp[1]; } // [ 'lambda', pa̲r̲a̲m̲s̲, body ]

function lbody(exp) { return exp[2]; }  //  [ 'lambda', params, b̲o̲d̲y ]
```

<!--
Note that `proc` is now obtained as `eval(name, env)`, replacing the old `env.lookup(exp)`.
This is a silent change to avoid spending time to justify the generalization.
In a previous iteration of the presentation, there was a dedicated test to show that you
cannot evaluate lambda expression in operator position without that change. The test read

test(`((lambda (x) (+ x x)) 2)`, () => { /* ... */ });

Once again, it got removed to fit the intended time slot for the presentation.

Using `name` as the result of the `operator(exp)` is also a bit of a misnomer at this point,
because in addition to the name of a procedure, the result may be an lambda expression.
-->

## Anonymous Procedures

~~~~{.js .run-suite-09-immediate}
test(`(map (lambda (x) (+ x x)) '(1 2 3)) evaluates to (2 4 6)`, () => {

  let env = STable.of({ '+': add, 'null?': isNull, cons, car, cdr });

  let map = new Procedure(sexp`(f l)`, sexp`(cond ((null? l) '()) (else (cons (f (car l)) (map f (cdr l)))))`);

  let ans = еval(sexp`(map (lambda (x) (+ x x)) '(1 2 3))`, env.extend('map', map));

  assert(ans, sexp`(2 4 6)`);

});


function еval(exp, env) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isQuoted(exp)) {
    return textOfQuotation(exp);
  }
  if (isConditional(exp)) {
    return evalCond(exp, env);
  }
  if (isLambda(exp)) { /* ⟸  */
    return new Procedure(lparams(exp), lbody(exp)); /* ⟸  */
  }

  let name = operator(exp);
  let proc = еval(name, env);
  let args = operands(exp).map(oprand => еval(oprand, env));

  return apply(proc, args, env);
}

function apply(proc, args, env) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let updatedEnv = env.extend(proc.params, args);
  return еval(proc.body, updatedEnv);
}
~~~~

## Anonymous Procedures

The ability to use _anonymous procedures_ and _free variables_ gives us the freedom to express interesting procedures

```
(define (scale s v)
  (map (lambda (x) (* x s)) v))
```

## Anonymous Procedures

The ability to use _anonymous procedures_ and _free variables_ gives us the freedom to express interesting procedures

```
(define (scale s v)
  (map (𝗹𝗮𝗺𝗯𝗱𝗮 (𝘅) (* 𝘅 𝘀)) v))
                        ┬
                        │
                        └─ free variable
```

## Anonymous Procedures

Suppose that we decide to use the name `l` rather than `s` to represent the scalar

```
(define (scale l v)
  (map (𝗹𝗮𝗺𝗯𝗱𝗮 (𝘅) (* 𝘅 𝗹)) v))
                        ┬
                        │
                        └─ free variable
```

Does it make any difference?

## Anonymous Procedures

Evaluating `(scale 2 '(1 2 3))`


## Anonymous Procedures

Evaluating `(scale 2 '(1 2 3))`

```
                 ┌─────────┬─────────────┐
                 │         │             │
                 │    l    │      2      │
 scale:          ├─────────┼─────────────┤       (map (lambda (x) (* x l)) v)
                 │         │             │
                 │    v    │   (1 2 3)   │
                 └─────────┴─────────────┘
```

<!--
It's the application of a user-defined procedure that leads to the creation of a new frame,
because there's a body to evaluate — which may contain free variables, whose meaning is to be found in the frame
-->

## Anonymous Procedures

Evaluating `(scale 2 '(1 2 3))`

```
                 ┌─────────┬─────────────┐
                 │         │             │
                 │    l    │      2      │
 scale:          ├─────────┼─────────────┤       (map (lambda (x) (* x l)) v)
                 │         │             │
                 │    v    │   (1 2 3)   │
                 └─────────┴─────────────┘
                           ▲
                           │
                           │
                 ┌─────────┼─────────────┐
                 │         │             │       (cond ((null? x) '())
                 │    f    │ (x) (* x l) │             (else (cons (f (car l))
 map:            ├─────────┼─────────────┤                         (map f (cdr l)))))
                 │         │             │
                 │    l    │   (1 2 3)   │
                 └─────────┴─────────────┘
```

## Anonymous Procedures

Evaluating `(scale 2 '(1 2 3))`

```
                 ┌─────────┬─────────────┐
                 │         │             │
                 │    l    │      2      │
 scale:          ├─────────┼─────────────┤       (map (lambda (x) (* x l)) v)
                 │         │             │
                 │    v    │   (1 2 3)   │
                 └─────────┴─────────────┘
                           ▲
                           │
                           │
                 ┌─────────┼─────────────┐
                 │         │             │       (cons (f (car l))
                 │    f    │ (x) (* x l) │             (map f (cdr l)))
 map:            ├─────────┼─────────────┤
                 │         │             │
                 │    l    │   (1 2 3)   │
                 └─────────┴─────────────┘
```

## Anonymous Procedures

Evaluating `(scale 2 '(1 2 3))`

```
                 ┌─────────┬─────────────┐
                 │         │             │
                 │    l    │      2      │
 scale:          ├─────────┼─────────────┤       (map (lambda (x) (* x l)) v)
                 │         │             │
                 │    v    │   (1 2 3)   │
                 └─────────┴─────────────┘
                           ▲
                           │
                           │
                 ┌─────────┼─────────────┐
                 │         │             │       (f (car l))
                 │    f    │ (x) (* x l) │
 map:            ├─────────┼─────────────┤
                 │         │             │
                 │    l    │   (1 2 3)   │
                 └─────────┴─────────────┘
```

## Anonymous Procedures

Evaluating `(scale 2 '(1 2 3))`

```
                 ┌─────────┬─────────────┐
                 │         │             │
                 │    l    │      2      │
 scale:          ├─────────┼─────────────┤       (map (lambda (x) (* x l)) v)
                 │         │             │
                 │    v    │   (1 2 3)   │
                 └─────────┴─────────────┘
                           ▲
                           │
                           │
                 ┌─────────┼─────────────┐
                 │         │             │       (f (car l))
                 │    f    │ (x) (* x l) │
 map:            ├─────────┼─────────────┤
                 │         │             │
                 │    l    │   (1 2 3)   │
                 └─────────┴─────────────┘
                           ▲
                           │
                           │
                 ┌─────────┼─────────────┐
                 │         │             │
anon proc:       │    x    │      1      │       (* x l)
                 └─────────┴─────────────┘
```

. . .

That is, `(* 1 '(1 2 3))` **ouch!**

<!-- The `l` in the `lambda`-expression in `scale` refers to the `l` bound in `map` — not to the one bound in `scale` -->

## Anonymous Procedures

Evaluating `(scale 2 '(1 2 3))`

```
                 ┌─────────┬─────────────┐
                 │         │             │
                 │    l    │      2      │
 scale:          ├─────────┼─────────────┤       (map (lambda (x) (* x l)) v)
                 │         │             │
                 │    v    │   (1 2 3)   │
                 └─────────┴─────────────┘
                           ▲
                           │
                           │
                 ┌─────────┼─────────────┐
                 │         │             │       (f (car l))
                 │    f    │ (x) (* x l) │
 map:            ├─────────┼─────────────┤
                 │         │             │
                 │    l    │   (1 2 3)   │
                 └─────────┴─────────────┘
                           ▲
                           │
                           │
                 ┌─────────┼─────────────┐
                 │         │             │
anon proc:       │    x    │      1      │       (* x l)
                 └─────────┴─────────────┘
```

**Dynamic scoping:** free variables in one procedure refer to the bindings in other procedures higher up in the _chain of calls_

<!-- Free variables, variables whose meaning is not determined by the local frame -->

## Anonymous Procedures

Evaluating `(scale 2 '(1 2 3))`

```
                 ┌─────────┬─────────────┐
                 │         │             │
                 │    l    │      2      │
 scale:          ├─────────┼─────────────┤       (map (lambda (x) (* x l)) v)
                 │         │             │
                 │    v    │   (1 2 3)   │
                 └─────────┴─────────────┘
                           ▲
                           │
                           │
                 ┌─────────┼─────────────┐
                 │         │             │       (f (car l))
                 │    f    │ (x) (* x l) │
 map:            ├─────────┼─────────────┤
                 │         │             │
                 │    l    │   (1 2 3)   │
                 └─────────┴─────────────┘
                           ▲
                           │
                           │
                 ┌─────────┼─────────────┐
                 │         │             │
anon proc:       │    x    │      1      │       (* x l)
                 └─────────┴─────────────┘
```

**Dynamic scoping:** the connection between binding and reference is established at run-time, changing as different procedures are executed

## Anonymous Procedures

The modularity of the `map` abstraction has been **destroyed**

```scheme
(define (scale l v)
  (map (lambda (x) (* x l)) v))
```

## Anonymous Procedures

No one can use that abstraction....

```scheme
(define (scale l v)
  (map (lambda (x) (* x l)) v))
```

## Anonymous Procedures

...without knowing the details of its implementation

```scheme
(define (map f l)
  (cond ((null? l) '())
        (else (cons (f (car l))
                    (map f (cdr l))))))
```

## Anonymous Procedures

We must arrange our language so that the choice of names locally cannot have global repercussions

```scheme
(define (map f l)
  (cond ((null? l) '())
        (else (cons (f (car l))
                    (map f (cdr l))))))
```

## Lexical Scoping

Evaluating `(scale 2 '(1 2 3))`

```
                 ┌─────────┬─────────────┐
                 │         │             │
                 │    l    │      2      │
 scale:          ├─────────┼─────────────┤       (map (lambda (x) (* x l)) v)
                 │         │             │
                 │    v    │   (1 2 3)   │
                 └─────────┴─────────────┘
                           ▲
                           │
                           │
                 ┌─────────┼─────────────┐
                 │         │             │       (f (car l))
                 │    f    │ (x) (* x l) │
 map:            ├─────────┼─────────────┤
                 │         │             │
                 │    l    │   (1 2 3)   │
                 └─────────┴─────────────┘
                           ▲
                           │
                           │
                 ┌─────────┼─────────────┐
                 │         │             │
anon proc:       │    x    │      1      │       (* x l)
                 └─────────┴─────────────┘
```

## Lexical Scoping

Evaluating `(scale 2 '(1 2 3))`

```
                 ┌─────────┬─────────────┐
                 │         │             │
                 │    l    │      2      │
 scale:      ┌──▶├─────────┼─────────────┤       (map (lambda (x) (* x l)) v)
             │   │         │             │
             │   │    v    │   (1 2 3)   │
             │   └─────────┴─────────────┘
             │             ▲
             │             │
             │             │
             │   ┌─────────┼─────────────┐
             │   │         │             │       (f (car l))
             │   │    f    │ (x) (* x l) │
 map:        │   ├─────────┼─────────────┤
             │   │         │             │
             │   │    l    │   (1 2 3)   │
             │   └─────────┴─────────────┘
             │
             │
             │
             │   ┌─────────┬─────────────┐
             │   │         │             │
anon proc:   └───┤    x    │      1      │       (* x l)
                 └─────────┴─────────────┘
```

<!--
The problem is that the body of the `lambda`-expression `(* x l)` is evaluated using
the `env` available when evaluating the body of `map`.
-->

We want `(* x l)` to be evaluated using the `env` which was available when the body of `scale` was being evaluated

<!-- How can we break the connection between the chain of invocations and the chain of frames? -->

## Lexical Scoping

**Lexical scoping:** all references are _textual apparent_ in the program

```scheme
(define (scale 𝗹 v)
  (map (lambda (x) (* x 𝗹)) v))
                        ┬
                        │
                        └─ free variable
```

## Lexical Scoping

~~~~{.js .run-suite-10}
test(`(scale 2 '(1 2 3))`, () => {

  let env = STable.of({ '*': mul, 'null?': isNull, cons, car, cdr, map });

  let scale = new Procedure(sexp`(l v)`, sexp`(map (lambda (x) (* x l)) v)`);

  let ans = еval(sexp`(scale 2 '(1 2 3))`, env.extend('scale', scale));

  assert(ans, sexp`(2 4 6)`);

});


function еval(exp, env) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isQuoted(exp)) {
    return textOfQuotation(exp);
  }
  if (isConditional(exp)) {
    return evalCond(exp, env);
  }
  if (isLambda(exp)) {
    return new Procedure(lparams(exp), lbody(exp));
  }

  let name = operator(exp);
  let proc = еval(name, env);
  let args = operands(exp).map(oprand => еval(oprand, env));

  return apply(proc, args, env);
}

function apply(proc, args, env) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let updatedEnv = env.extend(proc.params, args);
  return еval(proc.body, updatedEnv);
}
~~~~

## Lexical Scoping

```js
test(`(scale 2 '(1 2 3))`, () => {

  let env = STable.of({ '*': mul, 'null?': isNull, cons, car, cdr, map });

  let scale = new Procedure(sexp`(l v)`, sexp`(map (lambda (x) (* x l)) v)`, env /* ⟸  */);

  let ans = еval(sexp`(scale 2 '(1 2 3))`, env.extend('scale', scale));

  assert(ans, sexp`(2 4 6)`);

});


function еval(exp, env) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isQuoted(exp)) {
    return textOfQuotation(exp);
  }
  if (isConditional(exp)) {
    return evalCond(exp, env);
  }
  if (isLambda(exp)) {
    return new Procedure(lparams(exp), lbody(exp), env /* ⟸  */); // Not just the text describing the computation, but also the meaning of the free variables
  }

  let name = operator(exp);
  let proc = еval(name, env);
  let args = operands(exp).map(oprand => еval(oprand, env));

  return apply(proc, args, env);
}

function apply(proc, args, env) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let updatedEnv = env.extend(proc.params, args);
  return еval(proc.body, updatedEnv);
}


class Procedure {
  constructor(params, body, env /* ⟸  */) {
    this.params = params;
    this.body = body;
    this.env = env;
  }
}
```

## Lexical Scoping

~~~~{.js .run-suite-10}
test(`(scale 2 '(1 2 3))`, () => {

  let env = STable.of({ '*': mul, 'null?': isNull, cons, car, cdr, map });

  let scale = new Procedure(sexp`(l v)`, sexp`(map (lambda (x) (* x l)) v)`, env /* ⟸  */);

  let ans = еval(sexp`(scale 2 '(1 2 3))`, env.extend('scale', scale));

  assert(ans, sexp`(2 4 6)`);

});


function еval(exp, env) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isQuoted(exp)) {
    return textOfQuotation(exp);
  }
  if (isConditional(exp)) {
    return evalCond(exp, env);
  }
  if (isLambda(exp)) {
    return new Procedure(lparams(exp), lbody(exp), env /* ⟸  */);
  }

  let name = operator(exp);
  let proc = еval(name, env);
  let args = operands(exp).map(oprand => еval(oprand, env));

  return apply(proc, args);
}

function apply(proc, args) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let updatedEnv = proc.env /* ⟸  */.extend(proc.params, args);
  return еval(proc.body, updatedEnv);
}
~~~~

<!-- Omitting the definition of `Procedure` to make some space -->

## Referential Transparency

Lexical scoping guarantees that the 𝘮𝘦𝘢𝘯𝘪𝘯𝘨𝘴 of parts of a program are _apparent_ and _do not change_

```scheme
(define (scale l v)
  (map (lambda (x) (* x l)) v))
```

<!-- In this way, such meanings can be reliably depended upon -->

## Referential Transparency

Now `map`'s behaviour is _independent of the context_ of its use

```scheme
(define (scale l v)
  (map (lambda (x) (* x l)) v))
```

That is, `map` is now 𝙧𝙚𝙛𝙚𝙧𝙚𝙣𝙩𝙞𝙖𝙡𝙡𝙮 𝙩𝙧𝙖𝙣𝙨𝙥𝙖𝙧𝙚𝙣𝙩

<!--
Here, we can trust that `map` is going to do what it's supposed to do, no matter the lambda we pass.
To reiterate, we do not want the behavior to depend on the particular chain of invocations.
-->

## Referential Transparency

Referential transparency permits programs to be divided into parts so that each part can be _separately specified_ without a description of its implementation

```
(car (cons ⍺ β)) = ⍺
(cdr (cons ⍺ β)) = β
```

<!-- Depend on the context of its use == depend on its implementation -->

## REPL

We changed the format of `Procedure` objects, so we must reflect this change also in the REPL

```js
let env = STable.of({ '+': add, '*': mul, 'null?': isNull, cons, car, cdr }});

repl.start({
  eval: function (str, context, filename, cb) {

    let exp = read(str);
    if (isDefinition(exp)) {
      let name = definitionName(exp);
      let proc = new Procedure(definitionParams(exp), definitionBody(exp));
      env = env.extend(name, proc);
      return cb(null, name);
    }

    let ans = еval(exp, env);
    cb(null, ans);

  }
});
```

## REPL

We changed the format of `Procedure` objects, so we must reflect this change also in the REPL

```js
let env = STable.of({ '+': add, '*': mul, 'null?': isNull, cons, car, cdr }});

repl.start({
  eval: function (str, context, filename, cb) {

    let exp = read(str);
    if (isDefinition(exp)) {
      let name = definitionName(exp);
      let proc = new Procedure(definitionParams(exp), definitionBody(exp), env /* ⟸  */);
      env = env.extend(name, proc);
      return cb(null, name);
    }

    let ans = еval(exp, env);
    cb(null, ans);

  }
});
```

## REPL

```
> (define (map f l)
...   (cond ((null? l) '())
...         (else (cons (f (car l))
...                     (map f (cdr l))))))
'map
>
```

## REPL

```
> (define (map f l)
...   (cond ((null? l) '())
...         (else (cons (f (car l))
...                     (map f (cdr l))))))
'map
>


new Procedure( ┬ , ┬ , ┬ )
               │   │   │
               │   │   │
               │   │   │   ┌───────────┬───────────┐
               │   │   │   │     +     │  (a, b)=> │
  [ f, l ]◄────┘   │   │   ├───────────┼───────────┤
                   │   │   │     *     │  (a, b)=> │
                   │   │   ├───────────┼───────────┤
                   │   │   │    cons   │ (a, lst)=>│
                   │   └──▶├───────────┼───────────┤
                   │       │    null?  │    ...    │
                   │       ├───────────┼───────────┤
                   │       │    car    │    ...    │
                   │       ├───────────┼───────────┤
                   │       │    cdr    │    ...    │
                   │       └───────────┴───────────┘
                   │
                   │       ┌──                                    ──┐
                   │       │                                        │
                   │       │                                        │
                   │       │  (cond ((null? x) '())                 │
                   └──────▶│        (else (cons (f (car l))         │
                           │                    (map f (cdr l)))))  │
                           │                                        │
                           │                                        │
                           └──                                    ──┘
```

## REPL

```
> (define (map f l)
...   (cond ((null? l) '())
...         (else (cons (f (car l))
...                     (map f (cdr l))))))
'map
> (map (lambda (x) (+ x 1)) '(1 2 3))
Uncaught Error: unbound value: "map"
    at STable.lookup
    ...
```

## Top Level

The `Procedure` object contains an environment having only the previously defined procedures

```
> (define (map f l)
...   (cond ((null? l) '())
...         (else (cons (f (car l))
...                     (map f (cdr l))))))


new Procedure( ┬ , ┬ , ┬ )
               │   │   │
               │   │   │
               │   │   │   ┌───────────┬───────────┐
               │   │   │   │     +     │  (a, b)=> │
  [ f, l ]◄────┘   │   │   ├───────────┼───────────┤
                   │   │   │     *     │  (a, b)=> │
                   │   │   ├───────────┼───────────┤
                   │   │   │    cons   │ (a, lst)=>│
                   │   └──▶├───────────┼───────────┤
                   │       │    null?  │    ...    │
                   │       ├───────────┼───────────┤
                   │       │    car    │    ...    │
                   │       ├───────────┼───────────┤
                   │       │    cdr    │    ...    │
                   │       └───────────┴───────────┘
                   │
                   │       ┌──                                    ──┐
                   │       │                                        │
                   │       │                                        │
                   │       │  (cond ((null? x) '())                 │
                   └──────▶│        (else (cons (f (car l))         │
                           │                    (map f (cdr l)))))  │
                           │                                        │
                           │                                        │
                           └──                                    ──┘
```

## Top Level

**Problem.** We cannot use `define` to make recursive procedures

```
> (define (map f l)
...   (cond ((null? l) '())
...         (else (cons (f (car l))
...                     (map f (cdr l))))))


new Procedure( ┬ , ┬ , ┬ )
               │   │   │
               │   │   │
               │   │   │   ┌───────────┬───────────┐
               │   │   │   │     +     │  (a, b)=> │
  [ f, l ]◄────┘   │   │   ├───────────┼───────────┤
                   │   │   │     *     │  (a, b)=> │
                   │   │   ├───────────┼───────────┤
                   │   │   │    cons   │ (a, lst)=>│
                   │   └──▶├───────────┼───────────┤
                   │       │    null?  │    ...    │
                   │       ├───────────┼───────────┤
                   │       │    car    │    ...    │
                   │       ├───────────┼───────────┤
                   │       │    cdr    │    ...    │
                   │       └───────────┴───────────┘
                   │
                   │       ┌──                                    ──┐
                   │       │                                        │
                   │       │                                        │
                   │       │  (cond ((null? x) '())                 │
                   └──────▶│        (else (cons (f (car l))         │
                           │                    (map f (cdr l)))))  │
                           │                                        │
                           │                                        │
                           └──                                    ──┘
```

## Top Level

```


 >                                                                                                  ┌───────────┬───────────┐
                                                                                                    │     +     │  (a, b)=> │
                                                                                                    ├───────────┼───────────┤
                                                                                                    │     *     │  (a, b)=> │
                                                                                                    ├───────────┼───────────┤
                                                                                                    │    cons   │ (a, lst)=>│
                                                                                                    ├───────────┼───────────┤
                                                                                                    │    null?  │    ...    │
                                                                                                    ├───────────┼───────────┤
                                                                                                    │    car    │    ...    │
                                                                                                    ├───────────┼───────────┤
                                                                                                    │    cdr    │    ...    │
                                                                                                    └───────────┴───────────┘
```

## Top Level



```


 > (define (square x) (+ x x))                                                                      ┌───────────┬───────────┐
 'square                                                                                            │     +     │  (a, b)=> │
 >                                                                                                  ├───────────┼───────────┤
                                                                                                    │     *     │  (a, b)=> │
                                                                                                    ├───────────┼───────────┤
                                                                                                    │    cons   │ (a, lst)=>│
                                                                                                    ├───────────┼───────────┤◄───────┐
                                                                                                    │    null?  │    ...    │        │
                                                                                                    ├───────────┼───────────┤        │
                                                                                                    │    car    │    ...    │        │
                                                                                                    ├───────────┼───────────┤        │
                                                                                                    │    cdr    │    ...    │        │
                                                                                                    └───────────┴───────────┘        │
                                                                                                                                     │
                                                                                                                                     │
                                                                                                                                     │
                                                                                                                                     │
                                                                                                    ┌───────────┬───────────┐        │
                                                                                                    │  square   │ <┬, ┬, ┬> │        │
                                                                                                    └───────────┴──┼──┼──┼──┘        │
                                                                                                                   │  │  │           │
                                                                                                                   │  │  │           │
                                                                                                                   │  │  │           │
                                                                                                                   ▼  │  └───────────┘
                                                                                                                   x  │
                                                                                                                      │
                                                                                                                      └───►(+ x x) 𝘰𝘰𝘱𝘴!
```

## Top Level

```


 > (define (square x) (+ x x))                                                                      ┌───────────┬───────────┐
 'square                                                                                            │     +     │  (a, b)=> │
 > (define (sum-of-squares a b) (+ (square a) (square b)))                                          ├───────────┼───────────┤
 'sum-of-squares                                                                                    │     *     │  (a, b)=> │
 >                                                                                                  ├───────────┼───────────┤
                                                                                                    │    cons   │ (a, lst)=>│
                                                                                                    ├───────────┼───────────┤◄───────┐
                                                                                                    │    null?  │    ...    │        │
                                                                                                    ├───────────┼───────────┤        │
                                                                                                    │    car    │    ...    │        │
                                                                                                    ├───────────┼───────────┤        │
                                                                                                    │    cdr    │    ...    │        │
                                                                                                    └───────────┴───────────┘        │
                                                                                                                                     │
                                                                                                                                     │
                                                                                                                                     │
                                                                                                                                     │
                                                                ┌─────────────────┬───────────┐     ┌───────────┬───────────┐        │
                                                                │ sum-of-squares  │ <┬, ┬, ┬> │     │  square   │ <┬, ┬, ┬> │        │
                                                                └─────────────────┴──┼──┼──┼──┘     └───────────┴──┼──┼──┼──┘        │
                                                                                     │  │  │             ▲         │  │  │           │
                                                                                     │  │  │             │         │  │  │           │
                                                                                     ▼  │  │             │         │  │  │           │
                                                                                  [a, b]│  └─────────────┘         ▼  │  └───────────┘
                                                                                        │                          x  │
                                                                                        │                             │
                                                                                        │                             └───►(+ x x) 𝘰𝘰𝘱𝘴!
                                                                                        │
                                                                                        │
                                                                                        │
                                                                                        └───►(+ (square a) (square b))
```

## Top Level

```


 > (define (square x) (+ x x))                                                                      ┌───────────┬───────────┐
 'square                                                                                            │     +     │  (a, b)=> │
 > (define (sum-of-squares a b) (+ (square a) (square b)))                                          ├───────────┼───────────┤
 'sum-of-squares                                                                                    │     *     │  (a, b)=> │
 > (sum-of-squares 3 4)                                                                             ├───────────┼───────────┤
 14                                                                                                 │    cons   │ (a, lst)=>│
                                                                                                    ├───────────┼───────────┤◄───────┐
                                                                                                    │    null?  │    ...    │        │
                                                                                                    ├───────────┼───────────┤        │
                                                                                                    │    car    │    ...    │        │
                                                                                                    ├───────────┼───────────┤        │
                                                                                                    │    cdr    │    ...    │        │
                                                                                                    └───────────┴───────────┘        │
                                                                                                                                     │
                                                                                                                                     │
                                                                                                                                     │
                                                                                                                                     │
                                                                ┌─────────────────┬───────────┐     ┌───────────┬───────────┐        │
                                                                │ sum-of-squares  │ <┬, ┬, ┬> │     │  square   │ <┬, ┬, ┬> │        │
                                                                └─────────────────┴──┼──┼──┼──┘     └───────────┴──┼──┼──┼──┘        │
                                                                                     │  │  │             ▲         │  │  │           │
                                                                                     │  │  │             │         │  │  │           │
                                                                                     ▼  │  │             │         │  │  │           │
                                                                                  [a, b]│  └─────────────┘         ▼  │  └───────────┘
                                                                                        │                          x  │
                                                                                        │                             │
                                                                                        │                             └───►(+ x x) 𝘰𝘰𝘱𝘴!
                                                                                        │
                                                                                        │
                                                                                        │
                                                                                        └───►(+ (square a) (square b))
```

## Top Level

```


 > (define (square x) (+ x x))                                                                      ┌───────────┬───────────┐
 'square                                                                                            │     +     │  (a, b)=> │
 > (define (sum-of-squares a b) (+ (square a) (square b)))                                          ├───────────┼───────────┤
 'sum-of-squares                                                                                    │     *     │  (a, b)=> │
 > (sum-of-squares 3 4)                                                                             ├───────────┼───────────┤
 14                                                                                                 │    cons   │ (a, lst)=>│
 > (define (square x) (* x x))                                                                      ├───────────┼───────────┤◄───────┐
 'square                                                                                            │    null?  │    ...    │        │
                                                                                                    ├───────────┼───────────┤        │
                                                                                                    │    car    │    ...    │        │
                                                                                                    ├───────────┼───────────┤        │
                                                                                                    │    cdr    │    ...    │        │
                                                                                                    └───────────┴───────────┘        │
                                                                                                                                     │
                                                                                                                                     │
                                                                                                                                     │
                                                                                                                                     │
                                  ┌───────────┬───────────┐     ┌─────────────────┬───────────┐     ┌───────────┬───────────┐        │
                                  │  square   │ <┬, ┬, ┬> │     │ sum-of-squares  │ <┬, ┬, ┬> │     │  square   │ <┬, ┬, ┬> │        │
                                  └───────────┴──┼──┼──┼──┘     └─────────────────┴──┼──┼──┼──┘     └───────────┴──┼──┼──┼──┘        │
                                                 │  │  │             ▲               │  │  │             ▲         │  │  │           │
                                                 │  │  │             │               │  │  │             │         │  │  │           │
                                                 │  │  │             │               ▼  │  │             │         │  │  │           │
                                                 ▼  │  └─────────────┘            [a, b]│  └─────────────┘         ▼  │  └───────────┘
                                                 x  │                                   │                          x  │
                                                    │                                   │                             │
                                                    └───►(* x x)                        │                             └───►(+ x x) 𝘰𝘰𝘱𝘴!
                                                                                        │
                                                                                        │
                                                                                        │
                                                                                        └───►(+ (square a) (square b))
```


## Top Level

```


 > (define (square x) (+ x x))                                                                      ┌───────────┬───────────┐
 'square                                                                                            │     +     │  (a, b)=> │
 > (define (sum-of-squares a b) (+ (square a) (square b)))                                          ├───────────┼───────────┤
 'sum-of-squares                                                                                    │     *     │  (a, b)=> │
 > (sum-of-squares 3 4)                                                                             ├───────────┼───────────┤
 14                                                                                                 │    cons   │ (a, lst)=>│
 > (define (square x) (* x x))                                                                      ├───────────┼───────────┤◄───────┐
 'square                                                                                            │    null?  │    ...    │        │
 > (sum-of-squares 3 4)                                                                             ├───────────┼───────────┤        │
 14                                                                                                 │    car    │    ...    │        │
                                                                                                    ├───────────┼───────────┤        │
                                                                                                    │    cdr    │    ...    │        │
                                                                                                    └───────────┴───────────┘        │
                                                                                                                                     │
                                                                                                                                     │
                                                                                                                                     │
                                                                                                                                     │
                                  ┌───────────┬───────────┐     ┌─────────────────┬───────────┐     ┌───────────┬───────────┐        │
                                  │  square   │ <┬, ┬, ┬> │     │ sum-of-squares  │ <┬, ┬, ┬> │     │  square   │ <┬, ┬, ┬> │        │
                                  └───────────┴──┼──┼──┼──┘     └─────────────────┴──┼──┼──┼──┘     └───────────┴──┼──┼──┼──┘        │
                                                 │  │  │             ▲               │  │  │             ▲         │  │  │           │
                                                 │  │  │             │               │  │  │             │         │  │  │           │
                                                 │  │  │             │               ▼  │  │             │         │  │  │           │
                                                 ▼  │  └─────────────┘            [a, b]│  └─────────────┘         ▼  │  └───────────┘
                                                 x  │                                   │                          x  │
                                                    │                                   │                             │
                                                    └───►(* x x)                        │                             └───►(+ x x) 𝘰𝘰𝘱𝘴!
                                                                                        │
                                                                                        │
                                                                                        │
                                                                                        └───►(+ (square a) (square b))
```

## Top Level

```


 > (define (square x) (+ x x))                                                                      ┌───────────┬───────────┐
 'square                                                                                            │     +     │  (a, b)=> │
 > (define (sum-of-squares a b) (+ (square a) (square b)))                                          ├───────────┼───────────┤
 'sum-of-squares                                                                                    │     *     │  (a, b)=> │
 > (sum-of-squares 3 4)                                                                             ├───────────┼───────────┤
 14                                                                                                 │    cons   │ (a, lst)=>│
 > (define (square x) (* x x))                                                                      ├───────────┼───────────┤◄───────┐
 'square                                                                                            │    null?  │    ...    │        │
 > (sum-of-squares 3 4)                                                                             ├───────────┼───────────┤        │
 14                                                                                                 │    car    │    ...    │        │
 > (define (sum-of-squares a b) (+ (square a) (square b)))                                          ├───────────┼───────────┤        │
                                                                                                    │    cdr    │    ...    │        │
                                                                                                    └───────────┴───────────┘        │
                                                                                                                                     │
                                                                                                                                     │
                                                                                                                                     │
                                                                                                                                     │
┌─────────────────┬───────────┐   ┌───────────┬───────────┐     ┌─────────────────┬───────────┐     ┌───────────┬───────────┐        │
│ sum-of-squares  │ <┬, ┬, ┬> │   │  square   │ <┬, ┬, ┬> │     │ sum-of-squares  │ <┬, ┬, ┬> │     │  square   │ <┬, ┬, ┬> │        │
└─────────────────┴──┼──┼──┼──┘   └───────────┴──┼──┼──┼──┘     └─────────────────┴──┼──┼──┼──┘     └───────────┴──┼──┼──┼──┘        │
                     │  │  │           ▲         │  │  │             ▲               │  │  │             ▲         │  │  │           │
                     │  │  │           │         │  │  │             │               │  │  │             │         │  │  │           │
                     ▼  │  │           │         │  │  │             │               ▼  │  │             │         │  │  │           │
                  [a, b]│  └───────────┘         ▼  │  └─────────────┘            [a, b]│  └─────────────┘         ▼  │  └───────────┘
                        │                        x  │                                   │                          x  │
                        │                           │                                   │                             │
                        │                           └───►(* x x)                        │                             └───►(+ x x) 𝘰𝘰𝘱𝘴!
                        │                                                               │
                        │                                                               │
                        │                                                               │
                        └───►(+ (square a) (square b))                                  └───►(+ (square a) (square b))
```

## Top Level

```


 > (define (square x) (+ x x))                                                                      ┌───────────┬───────────┐
 'square                                                                                            │     +     │  (a, b)=> │
 > (define (sum-of-squares a b) (+ (square a) (square b)))                                          ├───────────┼───────────┤
 'sum-of-squares                                                                                    │     *     │  (a, b)=> │
 > (sum-of-squares 3 4)                                                                             ├───────────┼───────────┤
 14                                                                                                 │    cons   │ (a, lst)=>│
 > (define (square x) (* x x))                                                                      ├───────────┼───────────┤◄───────┐
 'square                                                                                            │    null?  │    ...    │        │
 > (sum-of-squares 3 4)                                                                             ├───────────┼───────────┤        │
 14                                                                                                 │    car    │    ...    │        │
 > (define (sum-of-squares a b) (+ (square a) (square b)))                                          ├───────────┼───────────┤        │
 > (sum-of-squares 3 4)                                                                             │    cdr    │    ...    │        │
 25                                                                                                 └───────────┴───────────┘        │
                                                                                                                                     │
                                                                                                                                     │
                                                                                                                                     │
                                                                                                                                     │
┌─────────────────┬───────────┐   ┌───────────┬───────────┐     ┌─────────────────┬───────────┐     ┌───────────┬───────────┐        │
│ sum-of-squares  │ <┬, ┬, ┬> │   │  square   │ <┬, ┬, ┬> │     │ sum-of-squares  │ <┬, ┬, ┬> │     │  square   │ <┬, ┬, ┬> │        │
└─────────────────┴──┼──┼──┼──┘   └───────────┴──┼──┼──┼──┘     └─────────────────┴──┼──┼──┼──┘     └───────────┴──┼──┼──┼──┘        │
                     │  │  │           ▲         │  │  │             ▲               │  │  │             ▲         │  │  │           │
                     │  │  │           │         │  │  │             │               │  │  │             │         │  │  │           │
                     ▼  │  │           │         │  │  │             │               ▼  │  │             │         │  │  │           │
                  [a, b]│  └───────────┘         ▼  │  └─────────────┘            [a, b]│  └─────────────┘         ▼  │  └───────────┘
                        │                        x  │                                   │                          x  │
                        │                           │                                   │                             │
                        │                           └───►(* x x)                        │                             └───►(+ x x) 𝘰𝘰𝘱𝘴!
                        │                                                               │
                        │                                                               │
                        │                                                               │
                        └───►(+ (square a) (square b))                                  └───►(+ (square a) (square b))
```

## Top Level

**Problem.** We can't redefine a procedure which had a bug in it and expect old references to use the new definition

```
 > (define (square x) (+ x x))                                                                      ┌───────────┬───────────┐
 'square                                                                                            │     +     │  (a, b)=> │
 > (define (sum-of-squares a b) (+ (square a) (square b)))                                          ├───────────┼───────────┤
 'sum-of-squares                                                                                    │     *     │  (a, b)=> │
 > (sum-of-squares 3 4)                                                                             ├───────────┼───────────┤
 14                                                                                                 │    cons   │ (a, lst)=>│
 > (define (square x) (* x x))                                                                      ├───────────┼───────────┤◄───────┐
 'square                                                                                            │    null?  │    ...    │        │
 > (sum-of-squares 3 4)                                                                             ├───────────┼───────────┤        │
 14                                                                                                 │    car    │    ...    │        │
 > (define (sum-of-squares a b) (+ (square a) (square b)))                                          ├───────────┼───────────┤        │
 > (sum-of-squares 3 4)                                                                             │    cdr    │    ...    │        │
 25                                                                                                 └───────────┴───────────┘        │
                                                                                                                                     │
                                                                                                                                     │
                                                                                                                                     │
                                                                                                                                     │
┌─────────────────┬───────────┐   ┌───────────┬───────────┐     ┌─────────────────┬───────────┐     ┌───────────┬───────────┐        │
│ sum-of-squares  │ <┬, ┬, ┬> │   │  square   │ <┬, ┬, ┬> │     │ sum-of-squares  │ <┬, ┬, ┬> │     │  square   │ <┬, ┬, ┬> │        │
└─────────────────┴──┼──┼──┼──┘   └───────────┴──┼──┼──┼──┘     └─────────────────┴──┼──┼──┼──┘     └───────────┴──┼──┼──┼──┘        │
                     │  │  │           ▲         │  │  │             ▲               │  │  │             ▲         │  │  │           │
                     │  │  │           │         │  │  │             │               │  │  │             │         │  │  │           │
                     ▼  │  │           │         │  │  │             │               ▼  │  │             │         │  │  │           │
                  [a, b]│  └───────────┘         ▼  │  └─────────────┘            [a, b]│  └─────────────┘         ▼  │  └───────────┘
                        │                        x  │                                   │                          x  │
                        │                           │                                   │                             │
                        │                           └───►(* x x)                        │                             └───►(+ x x) 𝘰𝘰𝘱𝘴!
                        │                                                               │
                        │                                                               │
                        │                                                               │
                        └───►(+ (square a) (square b))                                  └───►(+ (square a) (square b))
```

## Top Level

We must read in all our definitions 𝘢𝘵 𝘰𝘯𝘤𝘦: a program must be constructed _monolithically_

```
 > (define (square x) (+ x x))                                                                      ┌───────────┬───────────┐
 'square                                                                                            │     +     │  (a, b)=> │
 > (define (sum-of-squares a b) (+ (square a) (square b)))                                          ├───────────┼───────────┤
 'sum-of-squares                                                                                    │     *     │  (a, b)=> │
 > (sum-of-squares 3 4)                                                                             ├───────────┼───────────┤
 14                                                                                                 │    cons   │ (a, lst)=>│
 > (define (square x) (* x x))                                                                      ├───────────┼───────────┤◄───────┐
 'square                                                                                            │    null?  │    ...    │        │
 > (sum-of-squares 3 4)                                                                             ├───────────┼───────────┤        │
 14                                                                                                 │    car    │    ...    │        │
 > (define (sum-of-squares a b) (+ (square a) (square b)))                                          ├───────────┼───────────┤        │
 > (sum-of-squares 3 4)                                                                             │    cdr    │    ...    │        │
 25                                                                                                 └───────────┴───────────┘        │
                                                                                                                                     │
                                                                                                                                     │
                                                                                                                                     │
                                                                                                                                     │
┌─────────────────┬───────────┐   ┌───────────┬───────────┐     ┌─────────────────┬───────────┐     ┌───────────┬───────────┐        │
│ sum-of-squares  │ <┬, ┬, ┬> │   │  square   │ <┬, ┬, ┬> │     │ sum-of-squares  │ <┬, ┬, ┬> │     │  square   │ <┬, ┬, ┬> │        │
└─────────────────┴──┼──┼──┼──┘   └───────────┴──┼──┼──┼──┘     └─────────────────┴──┼──┼──┼──┘     └───────────┴──┼──┼──┼──┘        │
                     │  │  │           ▲         │  │  │             ▲               │  │  │             ▲         │  │  │           │
                     │  │  │           │         │  │  │             │               │  │  │             │         │  │  │           │
                     ▼  │  │           │         │  │  │             │               ▼  │  │             │         │  │  │           │
                  [a, b]│  └───────────┘         ▼  │  └─────────────┘            [a, b]│  └─────────────┘         ▼  │  └───────────┘
                        │                        x  │                                   │                          x  │
                        │                           │                                   │                             │
                        │                           └───►(* x x)                        │                             └───►(+ x x) 𝘰𝘰𝘱𝘴!
                        │                                                               │
                        │                                                               │
                        │                                                               │
                        └───►(+ (square a) (square b))                                  └───►(+ (square a) (square b))
```

## Top Level

The possibility of _separately_ writing and debugging pieces of our program no longer holds

```
 > (define (square x) (+ x x))                                                                      ┌───────────┬───────────┐
 'square                                                                                            │     +     │  (a, b)=> │
 > (define (sum-of-squares a b) (+ (square a) (square b)))                                          ├───────────┼───────────┤
 'sum-of-squares                                                                                    │     *     │  (a, b)=> │
 > (sum-of-squares 3 4)                                                                             ├───────────┼───────────┤
 14                                                                                                 │    cons   │ (a, lst)=>│
 > (define (square x) (* x x))                                                                      ├───────────┼───────────┤◄───────┐
 'square                                                                                            │    null?  │    ...    │        │
 > (sum-of-squares 3 4)                                                                             ├───────────┼───────────┤        │
 14                                                                                                 │    car    │    ...    │        │
 > (define (sum-of-squares a b) (+ (square a) (square b)))                                          ├───────────┼───────────┤        │
 > (sum-of-squares 3 4)                                                                             │    cdr    │    ...    │        │
 25                                                                                                 └───────────┴───────────┘        │
                                                                                                                                     │
                                                                                                                                     │
                                                                                                                                     │
                                                                                                                                     │
┌─────────────────┬───────────┐   ┌───────────┬───────────┐     ┌─────────────────┬───────────┐     ┌───────────┬───────────┐        │
│ sum-of-squares  │ <┬, ┬, ┬> │   │  square   │ <┬, ┬, ┬> │     │ sum-of-squares  │ <┬, ┬, ┬> │     │  square   │ <┬, ┬, ┬> │        │
└─────────────────┴──┼──┼──┼──┘   └───────────┴──┼──┼──┼──┘     └─────────────────┴──┼──┼──┼──┘     └───────────┴──┼──┼──┼──┘        │
                     │  │  │           ▲         │  │  │             ▲               │  │  │             ▲         │  │  │           │
                     │  │  │           │         │  │  │             │               │  │  │             │         │  │  │           │
                     ▼  │  │           │         │  │  │             │               ▼  │  │             │         │  │  │           │
                  [a, b]│  └───────────┘         ▼  │  └─────────────┘            [a, b]│  └─────────────┘         ▼  │  └───────────┘
                        │                        x  │                                   │                          x  │
                        │                           │                                   │                             │
                        │                           └───►(* x x)                        │                             └───►(+ x x) 𝘰𝘰𝘱𝘴!
                        │                                                               │
                        │                                                               │
                        │                                                               │
                        └───►(+ (square a) (square b))                                  └───►(+ (square a) (square b))
```

<!--
Development of a large system can be very difficult if parts cannot be separately constructed.

The fascination for referential transparency was motivated by the prospect that each part could be separately specified,
because of its independence from the context of its use. Surprisingly, *absolute* referential transparency inhibits precisely that.
-->

## Top Level

If we are to fix this, we must _give up absolute referential transparency_

```
 > (define (square x) (+ x x))                                                                      ┌───────────┬───────────┐
 'square                                                                                            │     +     │  (a, b)=> │
 > (define (sum-of-squares a b) (+ (square a) (square b)))                                          ├───────────┼───────────┤
 'sum-of-squares                                                                                    │     *     │  (a, b)=> │
 > (sum-of-squares 3 4)                                                                             ├───────────┼───────────┤
 14                                                                                                 │    cons   │ (a, lst)=>│
 > (define (square x) (* x x))                                                                      ├───────────┼───────────┤◄───────┐
 'square                                                                                            │    null?  │    ...    │        │
 > (sum-of-squares 3 4)                                                                             ├───────────┼───────────┤        │
 14                                                                                                 │    car    │    ...    │        │
 > (define (sum-of-squares a b) (+ (square a) (square b)))                                          ├───────────┼───────────┤        │
 > (sum-of-squares 3 4)                                                                             │    cdr    │    ...    │        │
 25                                                                                                 └───────────┴───────────┘        │
                                                                                                                                     │
                                                                                                                                     │
                                                                                                                                     │
                                                                                                                                     │
┌─────────────────┬───────────┐   ┌───────────┬───────────┐     ┌─────────────────┬───────────┐     ┌───────────┬───────────┐        │
│ sum-of-squares  │ <┬, ┬, ┬> │   │  square   │ <┬, ┬, ┬> │     │ sum-of-squares  │ <┬, ┬, ┬> │     │  square   │ <┬, ┬, ┬> │        │
└─────────────────┴──┼──┼──┼──┘   └───────────┴──┼──┼──┼──┘     └─────────────────┴──┼──┼──┼──┘     └───────────┴──┼──┼──┼──┘        │
                     │  │  │           ▲         │  │  │             ▲               │  │  │             ▲         │  │  │           │
                     │  │  │           │         │  │  │             │               │  │  │             │         │  │  │           │
                     ▼  │  │           │         │  │  │             │               ▼  │  │             │         │  │  │           │
                  [a, b]│  └───────────┘         ▼  │  └─────────────┘            [a, b]│  └─────────────┘         ▼  │  └───────────┘
                        │                        x  │                                   │                          x  │
                        │                           │                                   │                             │
                        │                           └───►(* x x)                        │                             └───►(+ x x) 𝘰𝘰𝘱𝘴!
                        │                                                               │
                        │                                                               │
                        │                                                               │
                        └───►(+ (square a) (square b))                                  └───►(+ (square a) (square b))
```

<!--
We are confronted with the fact that we have been seeking the impossible:

- Attaining complete referential transparency (expecting modularity to increase)
- Retaining the notion of an incremental, interactive top-level loop for reading definitions
-->

## Top Level

```js
let env = STable.of({ '+': add, '*': mul, 'null?': isNull, cons, car, cdr }});

repl.start({
  eval: function (str, context, filename, cb) {

    let exp = read(str);
    if (isDefinition(exp)) {
      let name = definitionName(exp);
      let proc = new Procedure(definitionParams(exp), definitionBody(exp), env);
      env = env.extend(name, proc);
      return cb(null, name);
    }

    let ans = еval(exp, env);
    cb(null, ans);

  }
});
```

## Top Level

```js
let env = STable.of({ '+': add, '*': mul, 'null?': isNull, cons, car, cdr }});

repl.start({
  eval: function (str, context, filename, cb) {

    let exp = read(str);
    if (isDefinition(exp)) {
      let name = definitionName(exp);
      let proc = new Procedure(definitionParams(exp), definitionBody(exp), env);
      env = env.set(name, proc); /* ⟸  */
      return cb(null, name);
    }

    let ans = еval(exp, env);
    cb(null, ans);

  }
});
```

## Top Level

```


>









                                                                 ┌─────────────────┬───────────┐
                                                                 │        +        │  (a, b)=> │
                                                                 ├─────────────────┼───────────┤
                                                                 │        *        │  (a, b)=> │
                                                                 ├─────────────────┼───────────┤
                                                                 │      cons       │ (a, lst)=>│
                                                                 ├─────────────────┼───────────┤
                                                                 │      null?      │    ...    │
                                                                 ├─────────────────┼───────────┤
                                                                 │       car       │    ...    │
                                                                 ├─────────────────┼───────────┤
                                                                 │       cdr       │    ...    │
                                                                 └─────────────────┴───────────┘
```

## Top Level

```


> (define (square x) (+ x x))
'square








                                                                 ┌─────────────────┬───────────┐
                                                                 │        +        │  (a, b)=> │
                                                                 ├─────────────────┼───────────┤
                                                                 │        *        │  (a, b)=> │
                                                                 ├─────────────────┼───────────┤
                                                                 │      cons       │ (a, lst)=>│
                                                                 ├─────────────────┼───────────┤◄───────┐
                                                                 │      null?      │    ...    │        │
                                                                 ├─────────────────┼───────────┤        │
                                                                 │       car       │    ...    │        │
                                                                 ├─────────────────┼───────────┤        │
                                                                 │       cdr       │    ...    │        │
                                                                 ├─────────────────┼───────────┤        │
                                                                 │      square     │ <┬, ┬, ┬> │        │
                                                                 └─────────────────┴──┼──┼──┼──┘        │
                                                                                      │  │  │           │
                                                                                      │  │  │           │
                                                                                      │  │  │           │
                                                                                      ▼  │  └───────────┘
                                                                                      x  │
                                                                                         └───►(+ x x) 𝘰𝘰𝘱𝘴!
```

## Top Level

```


> (define (square x) (+ x x))                                                            ┌─────►(+ (square a) (square b))
'square                                                                                  │
> (define (sum-of-squares a b) (+ (square a) (square b)))                                │
'sum-of-squares                                                                          │
                                                                                   [a, b]│  ┌───────────┐
                                                                                      ▲  │  │           │
                                                                                      │  │  │           │
                                                                                      │  │  │           │
                                                                 ┌─────────────────┬──┼──┼──┼──┐        │
                                                                 │ sum-of-squares  │ <┴, ┴, ┴> │        │
                                                                 ├─────────────────┼───────────┤        │
                                                                 │        +        │  (a, b)=> │        │
                                                                 ├─────────────────┼───────────┤        │
                                                                 │        *        │  (a, b)=> │        │
                                                                 ├─────────────────┼───────────┤◄───────┘
                                                                 │      cons       │ (a, lst)=>│
                                                                 ├─────────────────┼───────────┤◄───────┐
                                                                 │      null?      │    ...    │        │
                                                                 ├─────────────────┼───────────┤        │
                                                                 │       car       │    ...    │        │
                                                                 ├─────────────────┼───────────┤        │
                                                                 │       cdr       │    ...    │        │
                                                                 ├─────────────────┼───────────┤        │
                                                                 │      square     │ <┬, ┬, ┬> │        │
                                                                 └─────────────────┴──┼──┼──┼──┘        │
                                                                                      │  │  │           │
                                                                                      │  │  │           │
                                                                                      │  │  │           │
                                                                                      ▼  │  └───────────┘
                                                                                      x  │
                                                                                         └───►(+ x x) 𝘰𝘰𝘱𝘴!
```

## Top Level

```


> (define (square x) (+ x x))                                                            ┌─────►(+ (square a) (square b))
'square                                                                                  │
> (define (sum-of-squares a b) (+ (square a) (square b)))                                │
'sum-of-squares                                                                          │
> (sum-of-squares 3 4)                                                             [a, b]│  ┌───────────┐
14                                                                                    ▲  │  │           │
                                                                                      │  │  │           │
                                                                                      │  │  │           │
                                                                 ┌─────────────────┬──┼──┼──┼──┐        │
                                                                 │ sum-of-squares  │ <┴, ┴, ┴> │        │
                                                                 ├─────────────────┼───────────┤        │
                                                                 │        +        │  (a, b)=> │        │
                                                                 ├─────────────────┼───────────┤        │
                                                                 │        *        │  (a, b)=> │        │
                                                                 ├─────────────────┼───────────┤◄───────┘
                                                                 │      cons       │ (a, lst)=>│
                                                                 ├─────────────────┼───────────┤◄───────┐
                                                                 │      null?      │    ...    │        │
                                                                 ├─────────────────┼───────────┤        │
                                                                 │       car       │    ...    │        │
                                                                 ├─────────────────┼───────────┤        │
                                                                 │       cdr       │    ...    │        │
                                                                 ├─────────────────┼───────────┤        │
                                                                 │      square     │ <┬, ┬, ┬> │        │
                                                                 └─────────────────┴──┼──┼──┼──┘        │
                                                                                      │  │  │           │
                                                                                      │  │  │           │
                                                                                      │  │  │           │
                                                                                      ▼  │  └───────────┘
                                                                                      x  │
                                                                                         └───►(+ x x) 𝘰𝘰𝘱𝘴!
```

## Top Level

```


> (define (square x) (+ x x))                                                            ┌─────►(+ (square a) (square b))
'square                                                                                  │
> (define (sum-of-squares a b) (+ (square a) (square b)))                                │
'sum-of-squares                                                                          │
> (sum-of-squares 3 4)                                                             [a, b]│  ┌───────────┐
14                                                                                    ▲  │  │           │
> (define (square x) (* x x))                                                         │  │  │           │
'square                                                                               │  │  │           │
                                                                 ┌─────────────────┬──┼──┼──┼──┐        │
                                                                 │ sum-of-squares  │ <┴, ┴, ┴> │        │
                                                                 ├─────────────────┼───────────┤        │
                                                                 │        +        │  (a, b)=> │        │
                                                                 ├─────────────────┼───────────┤        │
                                                                 │        *        │  (a, b)=> │        │
                                                                 ├─────────────────┼───────────┤◄───────┘
                                                                 │      cons       │ (a, lst)=>│
                                                                 ├─────────────────┼───────────┤◄───────┐
                                                                 │      null?      │    ...    │        │
                                                                 ├─────────────────┼───────────┤        │
                                                                 │       car       │    ...    │        │
                                                                 ├─────────────────┼───────────┤        │
                                                                 │       cdr       │    ...    │        │
                                                                 ├─────────────────┼───────────┤        │
                                                                 │      square     │ <┬, ┬, ┬> │        │
                                                                 └─────────────────┴──┼──┼──┼──┘        │
                                                                                      │  │  │           │
                                                                                      │  │  │           │
                                                                                      │  │  │           │
                                                                                      ▼  │  └───────────┘
                                                                                      x  │
                                                                                         └───►(* x x)
```

## Top Level

```


> (define (square x) (+ x x))                                                            ┌─────►(+ (square a) (square b))
'square                                                                                  │
> (define (sum-of-squares a b) (+ (square a) (square b)))                                │
'sum-of-squares                                                                          │
> (sum-of-squares 3 4)                                                             [a, b]│  ┌───────────┐
14                                                                                    ▲  │  │           │
> (define (square x) (* x x))                                                         │  │  │           │
'square                                                                               │  │  │           │
> (sum-of-squares 3 4)                                           ┌─────────────────┬──┼──┼──┼──┐        │
25                                                               │ sum-of-squares  │ <┴, ┴, ┴> │        │
>                                                                ├─────────────────┼───────────┤        │
                                                                 │        +        │  (a, b)=> │        │
                                                                 ├─────────────────┼───────────┤        │
                                                                 │        *        │  (a, b)=> │        │
                                                                 ├─────────────────┼───────────┤◄───────┘
                                                                 │      cons       │ (a, lst)=>│
                                                                 ├─────────────────┼───────────┤◄───────┐
                                                                 │      null?      │    ...    │        │
                                                                 ├─────────────────┼───────────┤        │
                                                                 │       car       │    ...    │        │
                                                                 ├─────────────────┼───────────┤        │
                                                                 │       cdr       │    ...    │        │
                                                                 ├─────────────────┼───────────┤        │
                                                                 │      square     │ <┬, ┬, ┬> │        │
                                                                 └─────────────────┴──┼──┼──┼──┘        │
                                                                                      │  │  │           │
                                                                                      │  │  │           │
                                                                                      │  │  │           │
                                                                                      ▼  │  └───────────┘
                                                                                      x  │
                                                                                         └───►(* x x)
```

## Top Level

In this way, it is possible for a piece of code to refer to a procedure **before** a definition for that procedure is provided

<!-- Thereby altering the meaning of the reference -->

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│ > (define (sum-of-squares a b) (+ (𝘀𝗾𝘂𝗮𝗿𝗲 a) (𝘀𝗾𝘂𝗮𝗿𝗲 b)))   │
│ 'sum-of-squares                                             │
│ > (define (square x) (* x x))                               │
│ 'square                                                     │
│ > (sum-of-squares 3 4)                                      │
│ 25                                                          │
│ >                                                           │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

That is, procedures are allowed to refer to top-level variables existing at the time they are called

<!--
The meaning of `square` is not apparent at the time `sum-of-squares` gets defined.
There's no way we can get it from what has been defined so far.
-->

## Top Level

In this way, it is possible for a piece of code to refer to a procedure **before** a definition for that procedure is provided

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│ > (define (sum-of-squares a b) (+ (𝘀𝗾𝘂𝗮𝗿𝗲 a) (𝘀𝗾𝘂𝗮𝗿𝗲 b)))   │
│ 'sum-of-squares                                             │
│ > (define (square x) (* x x))                               │
│ 'square                                                     │
│ > (sum-of-squares 3 4)                                      │
│ 25                                                          │
│ >                                                           │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

That is, 𝙛𝙧𝙚𝙚 𝙫𝙖𝙧𝙞𝙖𝙗𝙡𝙚𝙨 𝙖𝙧𝙚 𝙙𝙮𝙣𝙖𝙢𝙞𝙘 𝙤𝙣𝙡𝙮 𝙬𝙞𝙩𝙝 𝙧𝙚𝙨𝙥𝙚𝙘𝙩 𝙩𝙤 𝙩𝙝𝙚 𝙩𝙤𝙥-𝙡𝙚𝙫𝙚𝙡 𝙚𝙣𝙫𝙞𝙧𝙤𝙣𝙢𝙚𝙣𝙩


# Part Two

## Decomposition of State

An interactive interpreter necessarily **violates** referential transparency

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│ > (define (square x) (+ x x))                               │
│ 'square                                                     │
│ > (define (sum-of-squares a b) (+ (square a) (square b)))   │
│ 'sum-of-squares                                             │
│ > (sum-of-squares 3 4)                                      │
│ 14                                                          │
│ > (define (square x) (* x x))                               │
│ 'square                                                     │
│ > (sum-of-squares 3 4)                                      │
│ 25                                                          │
│ >                                                           │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Decomposition of State

We wish to deal with the computer as an _entity with state_, which changes over time by interacting with a user

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│ > (define (square x) (+ x x))                               │
│ 'square                                                     │
│ > (define (sum-of-squares a b) (+ (square a) (square b)))   │
│ 'sum-of-squares                                             │
│ > (sum-of-squares 3 4)                                      │
│ 14                                                          │
│ > (define (square x) (* x x))                               │
│ 'square                                                     │
│ > (sum-of-squares 3 4)                                      │
│ 25                                                          │
│ >                                                           │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

Specifically, we want the computer to change over time by _accumulating_ procedure definitions


## Decomposition of State

Just as the user wishes to think of the computer as having state, he may find it convenient to organize a program similarly: _one part may deal with another part having state_

## Decomposition of State

Consider a pseudo-random number generator

```scheme
(define (random seed)
  (remainder (+ (* a seed) c) m))
```

Where `a` (the 𝘮𝘶𝘭𝘵𝘪𝘱𝘭𝘪𝘦𝘳), `c` (the 𝘪𝘯𝘤𝘳𝘦𝘮𝘦𝘯𝘵) and `m` (the 𝘮𝘰𝘥𝘶𝘭𝘶𝘴) are global constants


## Decomposition of State

The caller of `random` is required to save this value and supply it on the next call to `random`

```scheme
(define (random seed)
  (remainder (+ (* a seed) c) m))
```

## Decomposition of State

Consider now building some larger program using `random`

```
                 ┌─────────────────────────┐
                 │                         │
                 │                         │
                 │ (def┌───────────────────┴─────┐
                 │   (r│                         │
                 │     │                         │
                 │     │     ┌───────────────────┴─────┐
                 │     │     │                         │
                 │     │     │                         │
                 │     │     │     ┌───────────────────┴─────┐
                 │     │     │     │                         │
                 │     │     │     │                         │
                 │     │     │     │  (define (foo a b c)    │
                 │     │     │     │    (bar (+ a b) c) ...) │
                 │     │     │     │                         │
                 └─────┤     │     │                         │
                       │     │     │                         │
                       │     │     │                         │
                       └─────┤     │                         │
                             │     │                         │
                             │     │                         │
                             └─────┤                         │
                                   │                         │
                                   │                         │
                                   └─────────────────────────┘
```

## Decomposition of State

Consider now building some larger program using `random`

```
┌─────────────────────────┐
│                         │
│                         │
│(define (random seed) ┌──┴──────────────────────┐
│ (remainder (+ (* a se│                         │
│                      │                         │
│                      │     ┌───────────────────┴─────┐
│                      │     │                         │
│                      │     │                         │
│                      │     │     ┌───────────────────┴─────┐
│                      │     │     │                         │
│                      │     │     │                         │
│                      │     │     │  (define (foo a b c)    │
│                      │     │     │    (bar (+ a b) c) ...) │
│                      │     │     │                         │
└──────────────────────┤     │     │                         │
                       │     │     │                         │
                       │     │     │                         │
                       └─────┤     │                         │
                             │     │                         │
                             │     │                         │
                             └─────┤                         │
                                   │                         │
                                   │                         │
                                   └─────────────────────────┘
```

## Decomposition of State

The programmer who writes some high-level procedure does not care that a low-level procedure uses `random`

```
                 ┌─────────────────────────┐
                 │                         │
                 │                         │
                 │ (def┌───────────────────┴─────┐
                 │   (r│                         │
                 │     │                         │
                 │     │     ┌───────────────────┴─────┐
                 │     │     │                         │
                 │     │     │                         │
                 │     │     │     ┌───────────────────┴─────┐
                 │     │     │     │                         │
                 │     │     │     │                         │
                 │     │     │     │  (define (foo a b c)    │
                 │     │     │     │    (bar (+ a b) c) ...) │
                 │     │     │     │                         │
                 └─────┤     │     │                         │
                       │     │     │                         │
                       │     │     │                         │
                       └─────┤     │                         │
                             │     │                         │
                             │     │                         │
                             └─────┤                         │
                                   │                         │
                                   │                         │
                                   └─────────────────────────┘
```

## Decomposition of State

The programmer has **no interest** in the working of `random` - he may not even know about its existence

```
                 ┌─────────────────────────┐
                 │                         │
                 │                         │
                 │ (def┌───────────────────┴─────┐
                 │   (r│                         │
                 │     │                         │
                 │     │     ┌───────────────────┴─────┐
                 │     │     │                         │
                 │     │     │                         │
                 │     │     │     ┌───────────────────┴─────┐
                 │     │     │     │                         │
                 │     │     │     │                         │
                 │     │     │     │  (define (foo a b c)    │
                 │     │     │     │    (bar (+ a b) c) ...) │
                 │     │     │     │                         │
                 └─────┤     │     │                         │
                       │     │     │                         │
                       │     │     │                         │
                       └─────┤     │                         │
                             │     │                         │
                             │     │                         │
                             └─────┤                         │
                                   │                         │
                                   │                         │
                                   └─────────────────────────┘
```

Still, the programmer has to deal with some state quantity `seed` he knows nothing about

## Side Effects

Imagine passing 𝙖𝙡𝙡 𝙨𝙩𝙖𝙩𝙚 𝙫𝙖𝙧𝙞𝙖𝙗𝙡𝙚𝙨 around: now we have a _monolithic_ conception of the program

<!-- programs that manipulate a monolithic representation of the state --->

```
                 ┌─────────────────────────┐
                 │                         │
                 │                         │
                 │ (def┌───────────────────┴─────┐
                 │   (r│                         │
                 │     │                         │
                 │     │     ┌───────────────────┴─────┐
                 │     │     │                         │
                 │     │     │                         │
                 │     │     │     ┌───────────────────┴─────┐
                 │     │     │     │                         │
                 │     │     │     │                         │
                 │     │     │     │  (define (foo a b c)    │
                 │     │     │     │    (bar (+ a b) c) ...) │
                 │     │     │     │                         │
                 └─────┤     │     │                         │
                       │     │     │                         │
                       │     │     │                         │
                       └─────┤     │                         │
                             │     │                         │
                             │     │                         │
                             └─────┤                         │
                                   │                         │
                                   │                         │
                                   └─────────────────────────┘
```


## Side Effects

If we wish to break a program up into independent modules, we must seek _another method_

```
                 ┌─────────────────────────┐
                 │                         │
                 │                         │
                 │ (def┌───────────────────┴─────┐
                 │   (r│                         │
                 │     │                         │
                 │     │     ┌───────────────────┴─────┐
                 │     │     │                         │
                 │     │     │                         │
                 │     │     │     ┌───────────────────┴─────┐
                 │     │     │     │                         │
                 │     │     │     │                         │
                 │     │     │     │  (define (foo a b c)    │
                 │     │     │     │    (bar (+ a b) c) ...) │
                 │     │     │     │                         │
                 └─────┤     │     │                         │
                       │     │     │                         │
                       │     │     │                         │
                       └─────┤     │                         │
                             │     │                         │
                             │     │                         │
                             └─────┤                         │
                                   │                         │
                                   │                         │
                                   └─────────────────────────┘
```

**Idea.** Introduce 𝘀𝗶𝗱𝗲 𝗲𝗳𝗳𝗲𝗰𝘁𝘀 as a technique for breaking a program up into independent modules, each with local state information

. . .

> - A caller would very much prefer to invoke `(random)`
> - This would reflect more precisely the abstract notion of “random number generator”


## Side Effects

Side effects violate referential transparency by changing the meaning of expressions

> - We expect `(+ 3 4)` always to mean the same thing
> - We cannot say the same for `(+ 3 (random))`

. . .

**These two techniques for achieving modularity have come into direct conflict**

## Side Effects

The most common form of side effect in programming languages is the _assignment statement_, which alters the meaning of variables

```scheme
(set! x 42)
```

returns `42`, and as a side effect alters the meaning of `x`

## Side Effects

It is so common to use `set!` only for its side effect that another construction, `begin`, is very useful

<!-- utftex 'e_1 e_2 \ldots e_n' -->
```scheme
(begin e₁ e₂ … eₙ)
```

`begin` evaluates each of the expressions in order, throwing away the values of all but the last one

## Side Effects

We combine the use of _lexical scoping_ and of _side effects_ to manipulate a complete hidden state variable

```scheme
(define (rgen seed)
  (lambda () (begin (set! seed
                         (remainder (+ (* a seed) c) m))
                    seed)))
```

. . .

In JavaScript:

```js
function rgen(seed) {
  return () => {
    seed = (a*seed + c) % m;
    return seed;
  };
}
```

## Side Effects in the Interpreter

<!-- Those are the values of a, c and m suggested in the "Numerical Recipies" book -->

~~~~{.js .run-suite-11}
test(`1st value of (rgen 42) is 1'083'814'273`, () => {

  let env = STable.of({ '+': add, '*': mul, remainder, a, c, m  });

  let rgen = new Procedure(sexp`(seed)`, sexp`(lambda () (begin (set! seed (remainder (+ (* a seed) c) m)) seed))`, env);

  let ans = еval(sexp`(begin (set! rand (rgen 42)) (rand))`, env.set('rgen', rgen));

  assert(ans, sexp`1083814273`);

});


function еval(exp, env) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isQuoted(exp)) {
    return textOfQuotation(exp);
  }
  if (isConditional(exp)) {
    return evalCond(exp, env);
  }
  if (isLambda(exp)) {
    return new Procedure(lparams(exp), lbody(exp), env);
  }

  let name = operator(exp);
  let proc = еval(name, env);
  let args = operands(exp).map(oprand => еval(oprand, env));

  return apply(proc, args);
}

function apply(proc, args) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let updatedEnv = proc.env.extend(proc.params, args);
  return еval(proc.body, updatedEnv);
}
~~~~

## Side Effects in the Interpreter

<!-- Those are the values of a, c and m suggested in the "Numerical Recipies" book -->

```js
test(`1st value of (rgen 42) is 1'083'814'273`, () => {

  let env = STable.of({ '+': add, '*': mul, remainder, a, c, m  });

  let rgen = new Procedure(sexp`(seed)`, sexp`(lambda () (begin (set! seed (remainder (+ (* a seed) c) m)) seed))`, env);

  let ans = еval(sexp`(begin (set! rand (rgen 42)) (rand))`, env.set('rgen', rgen));

  assert(ans, sexp`1083814273`);

});


function еval(exp, env) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isQuoted(exp)) {
    return textOfQuotation(exp);
  }
  if (isConditional(exp)) {
    return evalCond(exp, env);
  }
  if (isLambda(exp)) {
    return new Procedure(lparams(exp), lbody(exp), env);
  }
  if (isBegin(exp)) { /* ⟸  */
    return beginActions(exp).reduce((_, action) => еval(action, env), null); /* ⟸  */
  }

  let name = operator(exp);
  let proc = еval(name, env);
  let args = operands(exp).map(oprand => еval(oprand, env));

  return apply(proc, args);
}

function apply(proc, args) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let updatedEnv = proc.env.extend(proc.params, args);
  return еval(proc.body, updatedEnv);
}


function isBegin(exp) { return Array.isArray(exp) && exp[0] === 'begin'; } // [ 'b̲e̲gi̲n̲', e₁, e₂, …, eₙ ]

function beginActions(exp) { return exp.slice(1); }                        // [ 'begin', e̲₁, e̲₂, …̲, e̲ₙ̲ ]
```

## Side Effects in the Interpreter

~~~~{.js .run-suite-11-immediate}
test(`1st value of (rgen 42) is 1'083'814'273`, () => {

  let env = STable.of({ '+': add, '*': mul, remainder, a, c, m  });

  let rgen = new Procedure(sexp`(seed)`, sexp`(lambda () (begin (set! seed (remainder (+ (* a seed) c) m)) seed))`, env);

  let ans = еval(sexp`(begin (set! rand (rgen 42)) (rand))`, env.set('rgen', rgen));

  assert(ans, sexp`1083814273`);

});


function еval(exp, env) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isQuoted(exp)) {
    return textOfQuotation(exp);
  }
  if (isConditional(exp)) {
    return evalCond(exp, env);
  }
  if (isLambda(exp)) {
    return new Procedure(lparams(exp), lbody(exp), env);
  }
  if (isBegin(exp)) { /* ⟸  */
    return beginActions(exp).reduce((_, action) => еval(action, env), null); /* ⟸  */
  }

  let name = operator(exp);
  let proc = еval(name, env);
  let args = operands(exp).map(oprand => еval(oprand, env));

  return apply(proc, args);
}

function apply(proc, args) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let updatedEnv = proc.env.extend(proc.params, args);
  return еval(proc.body, updatedEnv);
}
~~~~

## Side Effects in the Interpreter

```js
test(`1st value of (rgen 42) is 1'083'814'273`, () => {

  let env = STable.of({ '+': add, '*': mul, remainder, a, c, m  });

  let rgen = new Procedure(sexp`(seed)`, sexp`(lambda () (begin (set! seed (remainder (+ (* a seed) c) m)) seed))`, env);

  let ans = еval(sexp`(begin (set! rand (rgen 42)) (rand))`, env.set('rgen', rgen));

  assert(ans, sexp`1083814273`);

});


function еval(exp, env) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isQuoted(exp)) {
    return textOfQuotation(exp);
  }
  if (isConditional(exp)) {
    return evalCond(exp, env);
  }
  if (isLambda(exp)) {
    return new Procedure(lparams(exp), lbody(exp), env);
  }
  if (isBegin(exp)) {
    return beginActions(exp).reduce((_, action) => еval(action, env), null);
  }
  if (isAssignment(exp)) { /* ⟸  */
    let value = еval(assignmentValue(exp), env);  /* ⟸  */
    env.set(assignmentVariable(exp), value);      /* ⟸  */
    return value;                                 /* ⟸  */
  }

  let name = operator(exp);
  let proc = еval(name, env);
  let args = operands(exp).map(oprand => еval(oprand, env));

  return apply(proc, args);
}

function apply(proc, args) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let updatedEnv = proc.env.extend(proc.params, args);
  return еval(proc.body, updatedEnv);
}


function isAssignment(exp) { return Array.isArray(exp) && exp[0] === 'set!'; } // [ 's̲e̲t̲!̲', variable, value ]

function assignmentVariable(exp) { return exp[1]; } // [ 'set!', v̲a̲r̲i̲a̲b̲l̲e̲, value ]

function assignmentValue(exp) { return exp[2]; }    // [ 'set!', variable, v̲a̲l̲u̲e̲ ]
```

## Side Effects in the Interpreter

~~~~{.js .run-suite-11-immediate}
test(`1st value of (rgen 42) is 1'083'814'273`, () => {

  let env = STable.of({ '+': add, '*': mul, remainder, a, c, m });

  let rgen = new Procedure(sexp`(seed)`, sexp`(lambda () (begin (set! seed (remainder (+ (* a seed) c) m)) seed))`, env);

  let ans = еval(sexp`(begin (set! rand (rgen 42)) (rand))`, env.set('rgen', rgen));

  assert(ans, sexp`1083814273`);

});


function еval(exp, env) {
  if (isSelfEvaluating(exp)) {
    return exp;
  }
  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isQuoted(exp)) {
    return textOfQuotation(exp);
  }
  if (isConditional(exp)) {
    return evalCond(exp, env);
  }
  if (isLambda(exp)) {
    return new Procedure(lparams(exp), lbody(exp), env);
  }
  if (isBegin(exp)) {
    return beginActions(exp).reduce((_, action) => еval(action, env), null);
  }
  if (isAssignment(exp)) { /* ⟸  */
    let value = еval(assignmentValue(exp), env);  /* ⟸  */
    env.set(assignmentVariable(exp), value);      /* ⟸  */
    return value;                                 /* ⟸  */
  }

  let name = operator(exp);
  let proc = еval(name, env);
  let args = operands(exp).map(oprand => еval(oprand, env));

  return apply(proc, args);
}

function apply(proc, args) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let updatedEnv = proc.env.extend(proc.params, args);
  return еval(proc.body, updatedEnv);
}
~~~~

## State Decomposition

Suppose we have a procedure `print-number`, which prints numbers:

```scheme
(define (print-number n)
  ((lambda (q r)
      (cond ((zero? q) (print r))
            (else (begin (print-number q) (print r)))))
   (quotient n 10)
   (remainder n 10)))
```

. . .

The procedure proves very useful and and we now use it all the time

## State Decomposition

Normally, we want to print numbers in radix 10, but occasionally we want to print number in other radices, such as 8 or 16

```scheme
(define (print-number n)
  ((lambda (q r)
      (cond ((zero? q) (print r))
            (else (begin (print-number q) (print r)))))
   (quotient n 10)
   (remainder n 10)))
```

## State Decomposition

One might generalize the `print-number` program to take the radix as an extra argument

```scheme
(define (print-number n radix)
  ((lambda (q r)
      (cond ((zero? q) (print r))
            (else (begin (print-number q) (print r)))))
   (quotient n radix)
   (remainder n radix)))
```

## State Decomposition

_Everyone_ who uses `print-number` must supply the radix through the intermediate levels of the program (even if most of the time one wants decimal printing)

```
┌─────────────────────────┐
│                         │
│                         │
│(define (print-number ┌──┴──────────────────────┐
│ ((lambda (q r)       │                         │
│   (cond ((zero? q) (p│                         │
│         (else (begin │     ┌───────────────────┴─────┐
│  (quotient n radix)  │     │                         │
│  (remainder n radix))│     │                         │
│                      │     │     ┌───────────────────┴─────┐
│                      │     │     │                         │
│                      │     │     │                         │
│                      │     │     │(define (print-primes n) │
│                      │     │     │  (begin (...)           │
│                      │     │     │         (...)))         │
└──────────────────────┤     │     │                         │
                       │     │     │                         │
                       │     │     │                         │
                       └─────┤     │                         │
                             │     │                         │
                             │     │                         │
                             └─────┤                         │
                                   │                         │
                                   │                         │
                                   └─────────────────────────┘
```

## State Decomposition

But this **violates** the modularity of the intermediate modules, which generally have no interest in this extra parameter

```
                 ┌─────────────────────────┐
                 │                         │
                 │                         │
                 │ (def┌───────────────────┴─────┐
                 │  ((l│                         │
                 │    (│                         │
                 │     │     ┌───────────────────┴─────┐
                 │   (q│     │                         │
                 │   (r│     │                         │
                 │     │     │     ┌───────────────────┴─────┐
                 │     │     │     │                         │
                 │     │     │     │                         │
                 │     │     │     │(define (print-primes n) │
                 │     │     │     │  (begin (...)           │
                 │     │     │     │         (...)))         │
                 └─────┤     │     │                         │
                       │     │     │                         │
                       │     │     │                         │
                       └─────┤     │                         │
                             │     │                         │
                             │     │                         │
                             └─────┤                         │
                                   │                         │
                                   │                         │
                                   └─────────────────────────┘
```

## State Decomposition

A real `print` procedure in a real LISP system may be controlled by dozens of parameters like `radix`

> - Format parameters for printing floating-point numbers
> - Line width
> - Uppercase vs. lowercase
> - etc.

## State Decomposition

We can make all parameters globally available in the top-level environment, initialized to reasonable defaults...

```js
(set! radix 10)
(set! precision 2)
(set! ...)
```

. . .

...and invite all interested parties to perform `set!` as necessary

```scheme
(define (print-8 m)
  (begin (set! radix 8)
         (...)))
```

## State Decomposition

The disadvantage is that if every part changes the parameters at will, then each module must re-set all the parameters (even the ones not of interest)

```scheme
(define (print-8 m)
  (begin (set! radix 8)
         (set! precision 2)
         (set! ...)
         (set! ...)
         (...)))
```

## State Decomposition

We can require a _convention_ whereby any part which modifies a parameter must eventually restore it to its previous value

```scheme
(define (print-8 m)
  ((lambda (oldradix)
    (begin (set! radix 8)
           (print-number m)
           (set! radix oldradix)))
   radix))
```

This convention allows `print-8` to locally alter the radix, in a manner transparent to its caller

## State Decomposition

This convention is a standard pattern of use: it is a **stack discipline** on the values of `radix`

```scheme
(define (print-8 m)
  ((lambda (oldradix)
    (begin (set! radix 8)
           (print-number m)
           (set! radix oldradix)))
   radix))
```

𝗪𝗲 𝘄𝗼𝘂𝗹𝗱 𝗹𝗶𝗸𝗲 𝘁𝗼 𝗰𝗮𝗽𝘁𝘂𝗿𝗲 𝘁𝗵𝗶𝘀 𝗽𝗮𝘁𝘁𝗲𝗿𝗻 𝗮𝘀 𝗮𝗻 𝗮𝗯𝘀𝘁𝗿𝗮𝗰𝘁𝗶𝗼𝗻 𝗶𝗻 𝗼𝘂𝗿 𝗹𝗮𝗻𝗴𝘂𝗮𝗴𝗲

<!-- REMEMBER: Our objective is to abstract and package common patterns of use of the language -->

## State Decomposition

We have seen this pattern before:

```scheme
(define (print-8 m)
  ((lambda (oldradix)
    (begin (set! radix 8)
           (print-number m)
           (set! radix oldradix)))
   radix))
```

. . .

**dynamically scoped** variables behave in precisely this way

## State Decomposition

We have seen this pattern before:

```
███████╗██╗   ██╗██████╗ ██████╗ ██████╗ ██╗███████╗███████╗██╗
██╔════╝██║   ██║██╔══██╗██╔══██╗██╔══██╗██║██╔════╝██╔════╝██║
███████╗██║   ██║██████╔╝██████╔╝██████╔╝██║███████╗█████╗  ██║
╚════██║██║   ██║██╔══██╗██╔═══╝ ██╔══██╗██║╚════██║██╔══╝  ╚═╝
███████║╚██████╔╝██║  ██║██║     ██║  ██║██║███████║███████╗██╗
╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═╝
```

**dynamically scoped** variables behave in precisely this way

## State Decomposition

Let's evaluate `(print-8 19)` while assuming dynamic scoping

```scheme
(set! radix 10)


(define (print-number n)
  ((lambda (q r)
      (cond ((zero? q) (print r))
            (else (begin (print-number q) (print r)))))
   (quotient n radix)
   (remainder n radix)))


(define (print-8 m)
  ((lambda (radix) (print-number m)) 8))
```

## State Decomposition

Let's evaluate `(print-8 19)` while assuming a dynamic scoping discipline

```
                        top-level env.
                    ┌─────────┬─────────┐
                    │         │         │
                    │  radix  │   10    │
                    ├─────────┼─────────┤
                    │         │         │
                    │   ...   │   ...   │
                    └─────────┴─────────┘
```

<!-- REMEMBER: with dynamic scoping, the structure of the environment mirrors the invocation chain -->

## State Decomposition

Let's evaluate `(print-8 19)` while assuming a dynamic scoping discipline

```
                        top-level env.
                    ┌─────────┬─────────┐
                    │         │         │
                    │  radix  │   10    │
                    ├─────────┼─────────┤
                    │         │         │
                    │   ...   │   ...   │
                    └─────────┴─────────┘
                              ▲
                              │
                              │
                    ┌─────────┼─────────┐
                    │         │         │
        print-8:    │    m    │   19    │       ((lambda (radix) (print-number m)) 8)
                    └─────────┴─────────┘
```

## State Decomposition

Let's evaluate `(print-8 19)` while assuming a dynamic scoping discipline

```
                        top-level env.
                    ┌─────────┬─────────┐
                    │         │         │
                    │  radix  │   10    │
                    ├─────────┼─────────┤
                    │         │         │
                    │   ...   │   ...   │
                    └─────────┴─────────┘
                              ▲
                              │
                              │
                    ┌─────────┼─────────┐
                    │         │         │
        print-8:    │    m    │   19    │       ((lambda (radix) (print-number m)) 8)
                    └─────────┴─────────┘
                              ▲
                              │
                              │
                    ┌─────────┼─────────┐
                    │         │         │
anon. procedure:    │  radix  │    8    │       (print-number m)
                    └─────────┴─────────┘
```

## State Decomposition

Let's evaluate `(print-8 19)` while assuming a dynamic scoping discipline

```
                        top-level env.
                    ┌─────────┬─────────┐
                    │         │         │
                    │  radix  │   10    │
                    ├─────────┼─────────┤
                    │         │         │
                    │   ...   │   ...   │
                    └─────────┴─────────┘
                              ▲
                              │
                              │
                    ┌─────────┼─────────┐
                    │         │         │
        print-8:    │    m    │   19    │       ((lambda (radix) (print-number m)) 8)
                    └─────────┴─────────┘
                              ▲
                              │
                              │
                    ┌─────────┼─────────┐
                    │         │         │
anon. procedure:    │  radix  │    8    │       (print-number m)
                    └─────────┴─────────┘
                              ▲
                              │
                              │
                    ┌─────────┼─────────┐
                    │         │         │
   print-number:    │    n    │   19    │       ((lambda (q r)
                    └─────────┴─────────┘          (cond ((zero? q) (print r))
                                                         (else (begin (print-number q) (print r)))))
                                                  (quotient n radix)
                                                  (remainder n radix))
```

When evaluating the body of `(print-number n)`, the meaning of `radix` as been altered to `8`

## State Decomposition

Let's evaluate `(print-8 19)` while assuming a dynamic scoping discipline

```
                        top-level env.
                    ┌─────────┬─────────┐
                    │         │         │
                    │  radix  │   10    │
                    ├─────────┼─────────┤
                    │         │         │
                    │   ...   │   ...   │
                    └─────────┴─────────┘
```

However, this is transparent to the caller


## State Decomposition

Binding a dynamically scoped variable like `radix` causes a **side effect** because it alters the behavior of an unrelated procedure such as `print-number`

```scheme
(define (print-8 m)
  ((lambda (radix) (print-number m)) 8))
```

It's a **structured side-effect**: it guarantees that the side effect will be properly undone when the lambda has finished executing

## State Decomposition

We have rediscovered dynamic variables in another context and found them _desirable_

```scheme
(define (print-8 m)
  ((lambda (radix) (print-number m)) 8))
```

However, we learned in Part One that we **do not want** 𝘢𝘭𝘭 𝘷𝘢𝘳𝘪𝘢𝘣𝘭𝘦𝘴 to be dynamically scoped

## State Decomposition

A solution to this problem is to maintain _separate environments_ for lexical and dynamic variables

```

             lexical environment            dynamic environment
          ┌───────────┬───────────┐      ┌───────────┬───────────┐
          │    cons   │    ...    │      │    ...    │    ...    │
          ├───────────┼───────────┤      ├───────────┼───────────┤
          │    car    │    ...    │      │    ...    │    ...    │
          ├───────────┼───────────┤      └───────────┴───────────┘
          │    cdr    │    ...    │
          └───────────┴───────────┘
```

## State Decomposition

A solution to this problem is to maintain _separate environments_ for lexical and dynamic variables

```

             lexical environment            dynamic environment
          ┌───────────┬───────────┐      ┌───────────┬───────────┐
          │    cons   │    ...    │      │    ...    │    ...    │
          ├───────────┼───────────┤      ├───────────┼───────────┤
          │    car    │    ...    │      │    ...    │    ...    │
          ├───────────┼───────────┤      └───────────┴───────────┘
          │    cdr    │    ...    │
          └───────────┴───────────┘



```

```
> (set! pi 3.14)
```

## State Decomposition

A solution to this problem is to maintain _separate environments_ for lexical and dynamic variables

```

             lexical environment            dynamic environment
          ┌───────────┬───────────┐      ┌───────────┬───────────┐
          │    cons   │    ...    │      │    ...    │    ...    │
          ├───────────┼───────────┤      ├───────────┼───────────┤
          │    car    │    ...    │      │    ...    │    ...    │
          ├───────────┼───────────┤      └───────────┴───────────┘
          │    cdr    │    ...    │
          ├───────────┼───────────┤
          │    pi     │    3.14   │
          └───────────┴───────────┘
```

```
> (set! pi 3.14)
'ok
>
```

## State Decomposition

A solution to this problem is to maintain _separate environments_ for lexical and dynamic variables

```

             lexical environment            dynamic environment
          ┌───────────┬───────────┐      ┌───────────┬───────────┐
          │    cons   │    ...    │      │    ...    │    ...    │
          ├───────────┼───────────┤      ├───────────┼───────────┤
          │    car    │    ...    │      │    ...    │    ...    │
          ├───────────┼───────────┤      └───────────┴───────────┘
          │    cdr    │    ...    │
          ├───────────┼───────────┤
          │    pi     │    3.14   │
          └───────────┴───────────┘
```

```
> (set! pi 3.14)
'ok
> pi
3.14
>
```

## State Decomposition

A solution to this problem is to maintain _separate environments_ for lexical and dynamic variables

```

             lexical environment            dynamic environment
          ┌───────────┬───────────┐      ┌───────────┬───────────┐
          │    cons   │    ...    │      │    ...    │    ...    │
          ├───────────┼───────────┤      ├───────────┼───────────┤
          │    car    │    ...    │      │    ...    │    ...    │
          ├───────────┼───────────┤      └───────────┴───────────┘
          │    cdr    │    ...    │
          ├───────────┼───────────┤
          │    pi     │    3.14   │
          └───────────┴───────────┘
```

```
> (set! (dynamic radix) 10)
```

## State Decomposition

A solution to this problem is to maintain _separate environments_ for lexical and dynamic variables

```

             lexical environment            dynamic environment
          ┌───────────┬───────────┐      ┌───────────┬───────────┐
          │    cons   │    ...    │      │    ...    │    ...    │
          ├───────────┼───────────┤      ├───────────┼───────────┤
          │    car    │    ...    │      │    ...    │    ...    │
          ├───────────┼───────────┤      ├───────────┼───────────┤
          │    cdr    │    ...    │      │   radix   │    10     │
          ├───────────┼───────────┤      └───────────┴───────────┘
          │    pi     │    3.14   │
          └───────────┴───────────┘
```

```
> (set! (dynamic radix) 10)
'ok
>
```

## State Decomposition

A solution to this problem is to maintain _separate environments_ for lexical and dynamic variables

```

             lexical environment            dynamic environment
          ┌───────────┬───────────┐      ┌───────────┬───────────┐
          │    cons   │    ...    │      │    ...    │    ...    │
          ├───────────┼───────────┤      ├───────────┼───────────┤
          │    car    │    ...    │      │    ...    │    ...    │
          ├───────────┼───────────┤      ├───────────┼───────────┤
          │    cdr    │    ...    │      │   radix   │    10     │
          ├───────────┼───────────┤      └───────────┴───────────┘
          │    pi     │    3.14   │
          └───────────┴───────────┘
```

```
> (set! (dynamic radix) 10)
'ok
> (dynamic radix)
10
>
```

## State Decomposition

~~~~{.js .run-suite-12}
test(`a dynamic variable can be set and later referenced from the dynamic env`, () => {

  let denv = STable.empty();

  let ans = еval(sexp`(begin (set! (dynamic x) 10) (dynamic x))`, null, denv);

  assert(ans, sexp`10`);

});


function еval(exp, env, denv) {
  // cases for self-evaluating, quotation, conditional, lambda & begin

  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isAssignment(exp)) {
    let value = еval(assignmentValue(exp), env, denv);
    env.set(assignmentVariable(exp), value);
    return value;
  }

  let name = operator(exp);
  let proc = еval(name, env, denv);
  let args = operands(exp).map(oprand => еval(oprand, env, denv));

  return apply(proc, args);
}

function apply(proc, args) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let updatedEnv = proc.env.extend(proc.params, args);
  return еval(proc.body, updatedEnv);
}
~~~~

## State Decomposition

```js
test(`a dynamic variable can be set and later referenced from the dynamic env`, () => {

  let denv = STable.empty();

  let ans = еval(sexp`(begin (set! (dynamic x) 10) (dynamic x))`, null, denv);

  assert(ans, sexp`10`);

});


function еval(exp, env, denv) {
  // cases for self-evaluating, quotation, conditional, lambda & begin

  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isDynamicVariable(exp)) { /* ⟸  */
    let name = dynamicVariableName(exp); /* ⟸  */
    return denv.lookup(name); /* ⟸  */
  }
  if (isAssignment(exp)) {
    let value = еval(assignmentValue(exp), env);
    env.set(assignmentVariable(exp), value);
    return value;
  }

  let name = operator(exp);
  let proc = еval(name, env, denv);
  let args = operands(exp).map(oprand => еval(oprand, env, denv));

  return apply(proc, args);
}

function apply(proc, args) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let updatedEnv = proc.env.extend(proc.params, args);
  return еval(proc.body, updatedEnv);
}



function isDynamicVariable(exp) { return Array.isArray(exp) && exp[0] === 'dynamic'; } // [ 'd̲yn̲a̲m̲i̲c̲', name ]

function dynamicVariableName(exp) { return exp[1]; } // [ 'dynamic', n̲a̲m̲e̲ ]
```

## State Decomposition

```js
test(`a dynamic variable can be set and later referenced from the dynamic env`, () => {

  let denv = STable.empty();

  let ans = еval(sexp`(begin (set! (dynamic x) 10) (dynamic x))`, null, denv);

  assert(ans, sexp`10`);

});


function еval(exp, env, denv) {
  // cases for self-evaluating, quotation, conditional, lambda & begin

  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isDynamicVariable(exp)) {
    let name = dynamicVariableName(exp);
    return denv.lookup(name);
  }
  if (isAssignment(exp)) {
    let value = еval(assignmentValue(exp), env, denv);
    let varbl = assignmentVariable(exp); /* ⟸  */
    isDynamicVariable(varbl) ? denv.set(dynamicVariableName(varbl), value) : env.set(varbl, value); /* ⟸  */
    return value;
  }

  let name = operator(exp);
  let proc = еval(name, env, denv);
  let args = operands(exp).map(oprand => еval(oprand, env, denv));

  return apply(proc, args);
}

function apply(proc, args) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let updatedEnv = proc.env.extend(proc.params, args);
  return еval(proc.body, updatedEnv);
}


function isDynamicVariable(exp) { return Array.isArray(exp) && exp[0] === 'dynamic'; } // [ 'd̲yn̲a̲m̲i̲c̲', name ]

function dynamicVariableName(exp) { return exp[1]; } // [ 'dynamic', n̲a̲m̲e̲ ]
```

## State Decomposition

~~~~{.js .run-suite-12-immediate}
test(`a dynamic variable can be set and later referenced from the dynamic env`, () => {

  let denv = STable.empty();

  let ans = еval(sexp`(begin (set! (dynamic x) 10) (dynamic x))`, null, denv);

  assert(ans, sexp`10`);

});


function еval(exp, env, denv) {
  // cases for self-evaluating, quotation, conditional, lambda & begin

  if (isVariable(exp)) {
    return env.lookup(exp);
  }
  if (isDynamicVariable(exp)) {
    let name = dynamicVariableName(exp);
    return denv.lookup(name);
  }
  if (isAssignment(exp)) {
    let value = еval(assignmentValue(exp), env, denv);
    let varbl = assignmentVariable(exp); /* ⟸  */
    isDynamicVariable(varbl) ? denv.set(dynamicVariableName(varbl), value) : env.set(varbl, value); /* ⟸  */
    return value;
  }

  let name = operator(exp);
  let proc = еval(name, env, denv);
  let args = operands(exp).map(oprand => еval(oprand, env, denv));

  return apply(proc, args);
}

function apply(proc, args) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let updatedEnv = proc.env.extend(proc.params, args);
  return еval(proc.body, updatedEnv);
}
~~~~

## State Decomposition

We can now move from this...

```scheme
(set! radix 10)

(define (print-number n)
  ((lambda (q r)
      (cond ((zero? q) (print r))
            (else (begin (print-number q) (print r)))))
   (quotient n radix)
   (remainder n radix)))
```

## State Decomposition

...to this

```scheme
(set! (dynamic radix) 10)

(define (print-number n)
  ((lambda (q r)
      (cond ((zero? q) (print r))
            (else (begin (print-number q) (print r)))))
   (quotient n (dynamic radix))
   (remainder n (dynamic radix))))
```

## State Decomposition

We now only miss a mechanism for _binding parameters dynamically_

```scheme
(define (print-8 m)
  ((lambda (radix) (print-number m)) 8))
```

## State Decomposition

We now only miss a mechanism for _binding parameters dynamically_

```scheme
(define (print-8 m)
  ((lambda ((dynamic radix)) (print-number m)) 8))
```

## State Decomposition


~~~~{.js .run-suite-13}
test(`binding a dynamic parameter causes a side-effect on an unrelated procedure`, () => {

  let denv = STable.of({ 'radix': sexp`10` });

  let env  = STable.empty()

  let fun = new Procedure(sexp`()`, sexp`(dynamic radix)`, env);

  let ans = еval(sexp`((lambda ((dynamic radix)) (fun)) 8)`, env.set('fun', fun), denv);

  assert(ans, sexp`8`);

});


function еval(exp, env, denv) {
  // cases for self-evaluation, variable, quotation, conditional, begin & set!

  if (isLambda(exp)) {
    return new Procedure(lparams(exp), lbody(exp), env);
  }

  let name = operator(exp);
  let proc = еval(name, env, denv);
  let args = operands(exp).map(oprand => еval(oprand, env, denv));

  return apply(proc, args, denv);
}

function apply(proc, args, denv) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  let updatedEnv = proc.env.extend(proc.params, args);
  return еval(proc.body, updatedEnv, denv);
}
~~~~

## State Decomposition

```js
test(`binding a dynamic parameter causes a side-effect on an unrelated procedure`, () => {

  let denv = STable.of({ 'radix': sexp`10` });

  let env  = STable.empty()

  let fun = new Procedure(sexp`()`, sexp`(dynamic radix)`, env);

  let ans = еval(sexp`((lambda ((dynamic radix)) (fun)) 8)`, env.set('fun', fun), denv);

  assert(ans, sexp`8`);

});


function еval(exp, env, denv) {
  // cases for self-evaluation, variable, quotation, conditional, begin & set!

  if (isLambda(exp)) {
    return new Procedure(lparams(exp), lbody(exp), env);
  }

  let name = operator(exp);
  let proc = еval(name, env, denv);
  let args = operands(exp).map(oprand => еval(oprand, env, denv));

  return apply(proc, args, denv);
}

function apply(proc, args, denv) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  return applyCompound(proc, args, denv); /* ⟸  */
}


function applyCompound(proc, args, denv) { /* apply compound procedures */ };
```

. . .

```
                            proc               args   denv
              ┌─────────────────────────────┐ ┌───┐  ┌───┐
applyCompound(│  new Procedure( ┬ , ┬ , ┬ ) │,│ 8 │, │ ┬ │ )
              └─────────────────┼───┼───┼───┘ └───┘  └─┼─┘
                                │   │   │              │   ┌───────────┬───────────┐
                                │   │   │              └──►│   radix   │    10     │
                                │   │   │                  └───────────┴───────────┘
            (dynamic radix)◄────┘   │   │
                                    │   │                     ┌─────────────────┐
                                    │   │                     │                 │
                     (fun) ◄────────┘   │                     │                 │
                                        │                     ▼                 │
                                        │ ┌────────┬────────────────────────┐   │
                                        └►│   fun  │new Procedure( ┬,┬ ,┬ ) │   │
                                          └────────┴───────────────┼─┼──┼───┘   │
                                                                   │ │  │       │
                                                                   │ │  └───────┘
                                                                   │ │
                                                           ()◄─────┘ │
                                                                     ▼
                                                              (dynamic radix)
```

## State Decomposition

```js
test(`binding a dynamic parameter causes a side-effect on an unrelated procedure`, () => {

  let denv = STable.of({ 'radix': sexp`10` });

  let env  = STable.empty()

  let fun = new Procedure(sexp`()`, sexp`(dynamic radix)`, env);

  let ans = еval(sexp`((lambda ((dynamic radix)) (fun)) 8)`, env.set('fun', fun), denv);

  assert(ans, sexp`8`);

});


function applyCompound(proc, args, denv) {
  // update the dynamic environment with the local dynamic variables
  // update the lexical environment with the local lexical variables
  // evaluate the body of the procedure in the new lexical / dynamic environment
}
```

## State Decomposition

```js
test(`binding a dynamic parameter causes a side-effect on an unrelated procedure`, () => {

  let denv = STable.of({ 'radix': sexp`10` });

  let env  = STable.empty()

  let fun = new Procedure(sexp`()`, sexp`(dynamic radix)`, env);

  let ans = еval(sexp`((lambda ((dynamic radix)) (fun)) 8)`, env.set('fun', fun), denv);

  assert(ans, sexp`8`);

});


function applyCompound(proc, args, denv) {
  // update the dynamic environment with the local dynamic variables
  // update the lexical environment with the local lexical variables
  return еval(proc.body, updatedEnv, updatedDenv);
}
```

## State Decomposition

```js
test(`binding a dynamic parameter causes a side-effect on an unrelated procedure`, () => {

  let denv = STable.of({ 'radix': sexp`10` });

  let env  = STable.empty()

  let fun = new Procedure(sexp`()`, sexp`(dynamic radix)`, env);

  let ans = еval(sexp`((lambda ((dynamic radix)) (fun)) 8)`, env.set('fun', fun), denv);

  assert(ans, sexp`8`);

});


function applyCompound(proc, args, denv) {
  let dparams = [];
  let lparams = [];
  let dargs   = [];
  let largs   = [];

  // update the dynamic environment with the local dynamic variables
  // update the lexical environment with the local lexical variables

  let updatedEnv = proc.env.extend(lparams, largs);
  let updatedDenv = denv.extend(dparams, dargs);

  return еval(proc.body, updatedEnv, updatedDenv);
}
```

## State Decomposition

```js
test(`binding a dynamic parameter causes a side-effect on an unrelated procedure`, () => {

  let denv = STable.of({ 'radix': sexp`10` });

  let env  = STable.empty()

  let fun = new Procedure(sexp`()`, sexp`(dynamic radix)`, env);

  let ans = еval(sexp`((lambda ((dynamic radix)) (fun)) 8)`, env.set('fun', fun), denv);

  assert(ans, sexp`8`);

});


function applyCompound(proc, args, denv) {
  let dparams = [];
  let lparams = [];
  let dargs   = [];
  let largs   = [];


  for (let param of proc.params) {
    // update the dynamic environment with the local dynamic variables
    // update the lexical environment with the local lexical variables
  }

  let updatedEnv = proc.env.extend(lparams, largs);
  let updatedDenv = denv.extend(dparams, dargs);

  return еval(proc.body, updatedEnv, updatedDenv);
}
```

## State Decomposition

```js
test(`binding a dynamic parameter causes a side-effect on an unrelated procedure`, () => {

  let denv = STable.of({ 'radix': sexp`10` });

  let env  = STable.empty()

  let fun = new Procedure(sexp`()`, sexp`(dynamic radix)`, env);

  let ans = еval(sexp`((lambda ((dynamic radix)) (fun)) 8)`, env.set('fun', fun), denv);

  assert(ans, sexp`8`);

});


function applyCompound(proc, args, denv) {
  let dparams = [];
  let lparams = [];
  let dargs   = [];
  let largs   = [];


  for (let param of proc.params) {
    // update the dynamic environment with the local dynamic variables
    // update the lexical environment with the local lexical variables
  }

  let updatedEnv = proc.env.extend(lparams, largs);
  let updatedDenv = denv.extend(dparams, dargs);

  return еval(proc.body, updatedEnv, updatedDenv);
}


function isDynamicParam(param) { return Array.isArray(param) && param[0] == 'dynamic'; } // [ 'd̲yn̲a̲m̲i̲c̲', name ]

function dynamicParamName(param) { return exp[1] } // [ 'dynamic', n̲a̲m̲e̲ ]
```

## State Decomposition

```js
test(`binding a dynamic parameter causes a side-effect on an unrelated procedure`, () => {

  let denv = STable.of({ 'radix': sexp`10` });

  let env  = STable.empty()

  let fun = new Procedure(sexp`()`, sexp`(dynamic radix)`, env);

  let ans = еval(sexp`((lambda ((dynamic radix)) (fun)) 8)`, env.set('fun', fun), denv);

  assert(ans, sexp`8`);

});


function applyCompound(proc, args, denv) {
  let dparams = [];
  let lparams = [];
  let dargs   = [];
  let largs   = [];


  for (let param of proc.params) {
    if (isDynamicParam(param)) {
      // update the dynamic environment with the local dynamic variables
    }
    else {
      // update the lexical environment with the local lexical variables
    }
  }

  let updatedEnv = proc.env.extend(lparams, largs);
  let updatedDenv = denv.extend(dparams, dargs);

  return еval(proc.body, updatedEnv, updatedDenv);
}


function isDynamicParam(param) { return Array.isArray(param) && param[0] == 'dynamic'; } // [ 'd̲yn̲a̲m̲i̲c̲', name ]

function dynamicParamName(param) { return exp[1] } // [ 'dynamic', n̲a̲m̲e̲ ]
```

## State Decomposition

```js
test(`binding a dynamic parameter causes a side-effect on an unrelated procedure`, () => {

  let denv = STable.of({ 'radix': sexp`10` });

  let env  = STable.empty()

  let fun = new Procedure(sexp`()`, sexp`(dynamic radix)`, env);

  let ans = еval(sexp`((lambda ((dynamic radix)) (fun)) 8)`, env.set('fun', fun), denv);

  assert(ans, sexp`8`);

});


function applyCompound(proc, args, denv) {
  let dparams = [];
  let lparams = [];
  let dargs   = [];
  let largs   = [];

  let i = 0;
  for (let param of proc.params) {
    if (isDynamicParam(param)) {
      dparams.push(dynamicParamName(param));
      dargs.push(args[i]);
    }
    else {
      // update the lexical environment with the local lexical variables
    }
    i++;
  }

  let updatedEnv = proc.env.extend(lparams, largs);
  let updatedDenv = denv.extend(dparams, dargs);

  return еval(proc.body, updatedEnv, updatedDenv);
}


function isDynamicParam(param) { return Array.isArray(param) && param[0] == 'dynamic'; } // [ 'd̲yn̲a̲m̲i̲c̲', name ]

function dynamicParamName(param) { return exp[1] } // [ 'dynamic', n̲a̲m̲e̲ ]
```

## State Decomposition

```js
test(`binding a dynamic parameter causes a side-effect on an unrelated procedure`, () => {

  let denv = STable.of({ 'radix': sexp`10` });

  let env  = STable.empty()

  let fun = new Procedure(sexp`()`, sexp`(dynamic radix)`, env);

  let ans = еval(sexp`((lambda ((dynamic radix)) (fun)) 8)`, env.set('fun', fun), denv);

  assert(ans, sexp`8`);

});


function applyCompound(proc, args, denv) {
  let dparams = [];
  let lparams = [];
  let dargs   = [];
  let largs   = [];

  let i = 0;
  for (let param of proc.params) {
    if (isDynamicParam(param)) {
      dparams.push(dynamicParamName(param));
      dargs.push(args[i]);
    }
    else {
      lparams.push(param);
      largs.push(args[i]);
    }
    i++;
  }

  let updatedEnv = proc.env.extend(lparams, largs);
  let updatedDenv = denv.extend(dparams, dargs);

  return еval(proc.body, updatedEnv, updatedDenv);
}


function isDynamicParam(param) { return Array.isArray(param) && param[0] == 'dynamic'; } // [ 'd̲yn̲a̲m̲i̲c̲', name ]

function dynamicParamName(param) { return exp[1] } // [ 'dynamic', n̲a̲m̲e̲ ]
```

## State Decomposition

~~~~{.js .run-suite-13}
test(`binding a dynamic parameter causes a side-effect on an unrelated procedure`, () => {

  let denv = STable.of({ 'radix': sexp`10` });

  let env  = STable.empty()

  let fun = new Procedure(sexp`()`, sexp`(dynamic radix)`, env);

  let ans = еval(sexp`((lambda ((dynamic radix)) (fun)) 8)`, env.set('fun', fun), denv);

  assert(ans, sexp`8`);

});


function еval(exp, env, denv) {
  // cases for self-evaluation, variable, quotation, conditional, begin & set!

  if (isLambda(exp)) {
    return new Procedure(lparams(exp), lbody(exp), env);
  }

  let name = operator(exp);
  let proc = еval(name, env, denv);
  let args = operands(exp).map(oprand => еval(oprand, env, denv));

  return apply(proc, args, denv);
}

function apply(proc, args, denv) {
  if (isPrimitive(proc)) {
    return applyPrimitive(proc, args);
  }
  return applyCompound(proc, args, denv); /* ⟸  */
}
~~~~

## State Decomposition

```
“𝘛𝘩𝘰𝘶𝘨𝘩 𝘪𝘵 𝘴𝘦𝘦𝘮𝘴 𝘧𝘶𝘯𝘯𝘺 𝘯𝘰𝘸 𝘵𝘰 𝘵𝘩𝘪𝘯𝘬 𝘵𝘩𝘢𝘵 𝘭𝘦𝘹𝘪𝘤𝘢𝘭 𝘦𝘯𝘷𝘪𝘳𝘰𝘯𝘮𝘦𝘯𝘵 𝘸𝘦𝘳𝘦 𝘦𝘷𝘦𝘳 𝘥𝘪𝘧𝘧𝘪𝘤𝘶𝘭𝘵 𝘵𝘰 𝘶𝘯𝘥𝘦𝘳𝘴𝘵𝘢𝘯𝘥,
𝘺𝘰𝘶 𝘮𝘶𝘴𝘵 𝘵𝘢𝘬𝘦 𝘮𝘺 𝘸𝘰𝘳𝘥 𝘵𝘩𝘢𝘵 𝘪𝘯 1976, 𝘱𝘦𝘰𝘱𝘭𝘦 𝘸𝘪𝘵𝘩 𝘗𝘩𝘋’𝘴 𝘪𝘯 𝘤𝘰𝘮𝘱𝘶𝘵𝘦𝘳 𝘴𝘤𝘪𝘦𝘯𝘤𝘦 𝘳𝘦𝘲𝘶𝘪𝘳𝘦𝘥 𝘤𝘢𝘳𝘦𝘧𝘶𝘭
𝘦𝘹𝘱𝘭𝘢𝘯𝘢𝘵𝘪𝘰𝘯 𝘸𝘪𝘵𝘩 𝘭𝘰𝘵𝘴 𝘰𝘧 𝘦𝘹𝘢𝘮𝘱𝘭𝘦𝘴 𝘵𝘰 𝘨𝘦𝘵 𝘪𝘵. 𝘐𝘯 𝘧𝘢𝘤𝘵, 𝘮𝘢𝘯𝘺 𝘱𝘦𝘰𝘱𝘭𝘦 — 𝘮𝘺𝘴𝘦𝘭𝘧 𝘪𝘯𝘤𝘭𝘶𝘥𝘦𝘥 — 𝘩𝘢𝘥 𝘵𝘰 𝘸𝘳𝘪𝘵𝘦
𝘭𝘦𝘹𝘪𝘤𝘢𝘭 𝘪𝘯𝘵𝘦𝘳𝘱𝘳𝘦𝘵𝘦𝘳𝘴 𝘵𝘰 𝘶𝘯𝘥𝘦𝘳𝘴𝘵𝘢𝘯𝘥 𝘵𝘩𝘦 𝘪𝘯𝘵𝘦𝘳𝘢𝘤𝘵𝘪𝘰𝘯𝘴 𝘵𝘩𝘢𝘵 𝘭𝘦𝘥 𝘵𝘰 𝘵𝘩𝘦 𝘦𝘹𝘵𝘦𝘳𝘯𝘢𝘭 𝘣𝘦𝘩𝘢𝘷𝘪𝘰𝘳,
𝘢𝘯𝘥 𝘶𝘯𝘥𝘦𝘳𝘴𝘵𝘢𝘯𝘥𝘪𝘯𝘨 𝘵𝘩𝘦 𝘪𝘯𝘵𝘦𝘳𝘢𝘤𝘵𝘪𝘰𝘯𝘴 𝘸𝘢𝘴 𝘳𝘦𝘲𝘶𝘪𝘳𝘦𝘥 𝘵𝘰 𝘨𝘦𝘵 𝘪𝘵.”

– Richard P. Gabriel
```

# Summary

## Summary

We examined the effects of various language design decisions on the programming styles available to the user of the language

**Part Zero**

- We started with a simple interpreter for a LISP-like language

. . .

**Part One**

- We introduced _procedural data_ to capture certain abstractions
- We pondered the meaning of _free variables_ after the unexpected introduction of _dynamic scoping_
- We moved to _lexical scoping_ to preserve the integrity of procedural abstractions
- We realized that the resulting _referentially transparent_ language supported higher-order procedures
- We found that complete referential transparency prevents the _independent construction_ of program parts
- We gave up absolute referential transparency to admit an _interactive interpreter_

. . .

**Part Two**

- We considered the notion of _state as a dimension of abstraction_
- We wanted to avoid programs which manipulate a _monolithic representation of state_ (just as we didn't want textually monolithic programs)
- We acknowledged that the decomposition of the state into independent parts induces the notion of a _side effect_
- We realized we must _accept a trade-off_ between side effects and referential transparency
- We looked for _patterns of controlled side effects_ which can be easily understood and safely applied
- We discovered that one such pattern is equivalent to the use of _dynamically scoped variables_
- We constructed a system which _integrates lexical_ and _dynamic scoping_ in a smooth way

## The Art of the Interpreter

```sixel
magick img/xkcd.png -resize 1600 sixel:-
```
