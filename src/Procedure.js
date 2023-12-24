export class Procedure {
  constructor(params, body, env) {
    this.params = params;
    this.body = body;
    this.env = env;
  }
}

export function isPrimitive(proc) {
  return typeof proc === 'function';
}

export function applyPrimitive(proc, args) {
  return proc(...args);
}

export function isDynamicParam(param) {
  return Array.isArray(param) && param[0] == 'dynamic';
}

export function dynamicParamName(param) {
  return param[1];
}
