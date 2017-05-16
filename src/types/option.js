'use strict';

const oneOf = require('./oneof');
const None = require('./none');

module.exports = function (Type) {
  const spec = [
    { name: 'none', type: None },
    { name: 'some', type: Type }
  ];

  return class extends oneOf(spec) {
    constructor (obj) {
      if (obj === null || obj === undefined) {
        obj = { none: null };
      } else {
        obj = { some: obj };
      }
      super(obj);
    }

    toJSON () {
      return this.none ? null : this.some.toJSON();
    }
  };
};
