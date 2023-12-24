// --------------------------------------------------------
// Self-evaluating
// --------------------------------------------------------
export function isSelfEvaluating(exp) {
  return typeof exp === 'boolean'
    || typeof exp === 'number'
    || (typeof exp === 'string' && exp.startsWith(`"`) && exp.endsWith(`"`));
}

// --------------------------------------------------------
// Variables
// --------------------------------------------------------
export function isVariable(exp) {
  return typeof exp === 'string' && !exp.startsWith(`"`);
}

export function isDynamicVariable(exp) {
  return Array.isArray(exp) && exp[0] === 'dynamic';
}

export function dynamicVariableName(exp) {
  return exp[1];
}

// --------------------------------------------------------
// Quote
// --------------------------------------------------------
export function isQuoted(exp) {
  return Array.isArray(exp) && exp[0] === 'quote';
}

export function textOfQuotation(exp) {
  return exp[1];
}

// --------------------------------------------------------
// Definition
// --------------------------------------------------------
export function isDefinition(exp) {
  return Array.isArray(exp) && exp[0] === 'define';
}

export function definitionName(exp) {
  return exp[1][0];
}

export function definitionParams(exp) {
  return exp[1].slice(1);
}

export function definitionBody(exp) {
  return exp[2];
}

// --------------------------------------------------------
// Cond
// --------------------------------------------------------
export function isConditional(exp) {
  return Array.isArray(exp) && exp[0] === 'cond';
}

export function getClauses(exp) {
  return exp.slice(1);
}

export function isElseClause(clause) {
  return getClausePredicate(clause) === 'else';
}

export function getClausePredicate(clause) {
  return clause[0];
}

export function getClauseConsequent(clause) {
  return clause[1];
}

// --------------------------------------------------------
// Lambda
// --------------------------------------------------------
export function isLambda(exp) {
  return Array.isArray(exp) && exp[0] === 'lambda';
}

export function lparams(exp) {
  return exp[1];
}

export function lbody(exp) {
  return exp[2];
}

// --------------------------------------------------------
// Begin
// --------------------------------------------------------
export function isBegin(exp) {
  return Array.isArray(exp) && exp[0] === 'begin';
}

export function beginActions(exp) {
  return exp.slice(1);
}

// --------------------------------------------------------
// Assignment
// --------------------------------------------------------
export function isAssignment(exp) {
  return Array.isArray(exp) && exp[0] === 'set!';
}

export function assignmentVariable(exp) {
  return exp[1];
}

export function assignmentValue(exp) {
  return exp[2];
}

// --------------------------------------------------------
// Application
// --------------------------------------------------------
export function operator(exp) {
  return exp[0];
}

export function operands(exp) {
  return exp.slice(1);
}
