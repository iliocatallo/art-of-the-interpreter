import { stdout } from 'node:process';
import { test as uvuTest } from 'npm:uvu';
import { equal } from 'npm:uvu/assert';

/*
it's important that we are able to tell whether the eval block in a slide is supposed to run the test suite,
or just some random JavaScript. Since `test` and `assert` are going to be loaded in the `H.js` header file,
we cannot distinguish the two cases just by checking if `test` is defined. To overcome this, we set a global
variable as soon as `test` is applied, which is something we do only when we have to run the test suite.
*/
export const test = new Proxy(uvuTest, {
  apply(target, thisArg, args) {
    globalThis.SHOULD_RUN_TESTS = true;
    const [name, handler] = args;
    return target(name, silence(handler));
  },
});

/*
It's kind of useless to show the entire stack trace when running a failing test on a slide, it eats up space
without any clear advantage. `Silence` intercepts application of some throwing function in order to to modify
the `err.stack` property to the empty string.
*/
const silence = fn =>
  new Proxy(fn, {
    apply(target, thisArg, args) {
      try {
        target(...args);
      } catch (err) {
        err.stack = '';
        throw err;
      }
    },
  });

export const assert = silence(equal);

/*
We want to avoid showing the number of total tests, how many we skipped, how many passed, etc. As the listings get
longer and longer, there's the risk that this summary will make the slide scroll, which is not really nice.
*/
const write = stdout.write.bind(stdout);
stdout.write = function(input, ...rest) {
  if (typeof input !== 'string') {
    return write(input, ...rest);
  }
  if (input.indexOf('Total') > -1) return;
  if (input.indexOf('Passed') > -1) return;
  if (input.indexOf('Skipped') > -1) return;
  if (input.indexOf('Duration') > -1) return;
  return write(input, ...rest);
};
