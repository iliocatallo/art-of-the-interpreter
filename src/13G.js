// 13G.js
/*
 Redefine the `eval` on the slides.
 This is because in the "binding a dynamic parameter causes a side-effect on an unrelated procedure" test
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
    if (isVariable(exp)) {
      return env.lookup(exp);
    }
    if (isDynamicVariable(exp)) {
      let name = dynamicVariableName(exp);
      return denv.lookup(name);
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
    if (isAssignment(exp)) {
      let value = еval(assignmentValue(exp), env, denv);
      let varbl = assignmentVariable(exp);
      isDynamicVariable(varbl) ? denv.set(dynamicVariableName(varbl), value) : env.set(varbl, value);
      return value;
    }
    return slideEval(exp, env, denv);
  };
})();
