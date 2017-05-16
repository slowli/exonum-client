'use strict';

const utils = require('./utils');
const specification = require('./spec');

const VARIANT_MARKER = '$type';

function parseOneOf (obj, variantNames) {
  var variantName, variant;

  if (obj[VARIANT_MARKER]) {
    variant = Object.assign({}, obj);

    if (Array.isArray(obj[VARIANT_MARKER])) {
      variantName = obj[VARIANT_MARKER][0];
      variant[VARIANT_MARKER] = obj[VARIANT_MARKER].slice(1);
      if (variant[VARIANT_MARKER].length === 0) {
        delete variant[VARIANT_MARKER];
      }
    } else {
      variantName = obj[VARIANT_MARKER];
      delete variant[VARIANT_MARKER];
    }

    if (variantNames.indexOf(variantName) < 0) {
      return undefined;
    }
  } else {
    variantName = variantNames.find(name => name in obj);
    if (variantName) variant = obj[variantName];
  }
  return variantName ? [variantName, variant] : undefined;
}

const oneOf = module.exports = function (spec) {
  'use strict';

  specification.validateAndResolve(spec);
  const variantNames = spec.map(f => f.name);
  const markerByteLength = 1;

  class OneOfType {
    constructor (obj) {
      var parsed = parseOneOf(obj, variantNames);
      if (!parsed) throw new TypeError('Invalid oneOf declaration');

      utils.defineConstant(this, 'raw', []);
      this.set(parsed[0], parsed[1]);
    }

    get (name) {
      if (this.raw[0] === name) return this.raw[1];
      return undefined;
    }

    set (name, value) {
      var idx = variantNames.indexOf(name);
      if (idx < 0) throw new Error('Unknown variant: ' + name);

      this.raw[0] = name;
      var Type = spec[idx].type;
      if (value instanceof Type) {
        this.raw[1] = value;
      } else {
        this.raw[1] = new Type(value);
      }
    }

    get byteLength () {
      return markerByteLength + this.raw[1].byteLength;
    }

    serialize (buffer) {
      buffer[0] = variantNames.indexOf(this.raw[0]);
      this.raw[1].serialize(buffer.subarray(1));
      return buffer;
    }

    toJSON () {
      return { [this.raw[0]]: this.raw[1].toJSON() };
    }
  }

  variantNames.forEach(name => {
    Object.defineProperty(OneOfType.prototype, name, {
      configurable: true,
      enumerable: true,
      get: function () { return this.get(name); },
      set: function (value) { return this.set(name, value); }
    });
  });

  utils.configureType(OneOfType, {
    byteLength: undefined
  });

  return OneOfType;
};

oneOf.parse = parseOneOf;
