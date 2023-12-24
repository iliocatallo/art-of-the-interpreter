// F.js
function evalCond(exp, env, denv) {
  let clauses = getClauses(exp);
  while (clauses.length != 0) {
    let [clause, ...rest] = clauses;

    if (isElseClause(clause)) {
      if (rest.length != 0) {
        throw new Error(`COND: ELSE not last`);
      }
      let consequent = getClauseConsequent(clause);
      return еval(consequent, env, denv);
    }

    let predicate = getClausePredicate(clause);
    if (еval(predicate, env, denv)) {
      let consequent = getClauseConsequent(clause);
      return еval(consequent, env, denv);
    }

    clauses = rest;
  }
  throw new Error(`COND: no matching clause`);
}

function applyCompound(proc, args, denv) {
  let dparams = [];
  let lparams = [];
  let dargs = [];
  let largs = [];

  let i = 0;
  for (let param of proc.params) {
    if (isDynamicParam(param)) {
      dparams.push(dynamicParamName(param));
      dargs.push(args[i]);
    } else {
      lparams.push(param);
      largs.push(args[i]);
    }
    i++;
  }

  let updatedEnv = proc.env.extend(lparams, largs);
  let updatedDenv = denv.extend(dparams, dargs);

  return еval(proc.body, updatedEnv, updatedDenv);
}

// Set in test.js
if (globalThis.SHOULD_RUN_TESTS) {
  test.run();
}
