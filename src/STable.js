export class STable {
  #frame;
  #parent;

  constructor(frame, parent) {
    this.#frame = frame;
    this.#parent = parent;
  }

  static of(frameOrIds, maybeValues) {
    if (Array.isArray(frameOrIds) && maybeValues != undefined) {
      return STable.empty().extend(frameOrIds, maybeValues);
    }
    return new STable(frameOrIds, null);
  }

  static empty() {
    return new STable({}, null);
  }

  isEmpty() {
    let keys = Object.keys(this.#frame);
    return keys.length === 0 && (this.#parent ? this.#parent.isEmpty() : true);
  }

  lookup(id) {
    const val = this.#frame[id];
    if (val !== undefined) {
      return val;
    }
    if (this.#parent) {
      return this.#parent.lookup(id);
    }
    throw new Error(`STable: unbound value ${JSON.stringify(id)}`);
  }

  extend(ids, vals) {
    if (!Array.isArray(ids) && !Array.isArray(vals)) {
      ids = [ids];
      vals = [vals];
    }

    if (ids.length !== vals.length) {
      throw new Error(`STable: identifiers and values are not the same length`);
    }
    let frame = {};
    for (let i = 0; i < ids.length; i++) {
      let id = ids[i];
      let val = vals[i];
      frame[id] = val;
    }
    return new STable(frame, this);
  }

  set(id, val) {
    if (this.#frame[id]) {
      this.#frame[id] = val;
      return this;
    }
    if (this.#parent === null) {
      this.#frame[id] = val;
      return this;
    }
    this.#parent.set(id, val);
    return this;
  }
}
