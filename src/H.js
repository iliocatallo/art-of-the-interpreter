// H.js
import { add, car, cdr, cons, isNull, mul, remainder } from './builtin.js';
import {
  assignmentValue,
  assignmentVariable,
  beginActions,
  dynamicVariableName,
  getClauseConsequent,
  getClausePredicate,
  getClauses,
  isAssignment,
  isBegin,
  isConditional,
  isDynamicVariable,
  isElseClause,
  isLambda,
  isQuoted,
  isSelfEvaluating,
  isVariable,
  lbody,
  lparams,
  operands,
  operator,
  textOfQuotation,
  variableName,
} from './Expression.js';
import { applyPrimitive, dynamicParamName, isDynamicParam, isPrimitive, Procedure } from './Procedure.js';
import { sexp } from './sexp.js';
import { STable } from './STable.js';
import { assert, test } from './test.js';

// The parameters for the random number generator introduced in Part Two
const a = 1664525;
const c = 1013904223;
const m = 2 ** 32;
