// 12G.js
/*
 Redefine the `eval` on the slides.
 This is because in the "a dynamic variable can be set and later referenced from the dynamic env" test
 we want to reduce the visual noise by not showing the if statements of special forms that are not directly involved in the test.
 HOWEVER, since old tests still need to pass, we wrap `eval` in order to handle the cases we are not explicitly showing anymore.
*/
еval = (() => {
  let slideEval = еval;
  return function wrappedEval(exp, env, denv) {
    if (isSelfEvaluating(exp)) {
      return exp;
    }
    if (isQuoted(exp)) {
      return textOfQuotation(exp);
    }
    if (isConditional(exp)) {
      return evalCond(exp, env, denv);
    }
    if (isLambda(exp, env, denv)) {
      return new Procedure(lparams(exp), lbody(exp), env, denv);
    }
    if (isBegin(exp)) {
      return beginActions(exp).reduce((_, action) => еval(action, env, denv), null);
    }
    return slideEval(exp, env, denv);
  };
})();
