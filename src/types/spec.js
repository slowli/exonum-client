'use strict';

const objectAssign = Object.assign || require('object-assign');

const utils = require('./utils');
const oneOf = require('./oneOf');
const placeholder = require('./placeholder');

const RESERVED_PROPERTY_NAMES = [
  'get',
  'set',
  'byteLength',
  'hasFixedLength'
];

const DEFAULT_RESOLVER = {
  resolve (type, cb) {
    if (utils.isExonumType(type)) {
      cb(type);
      return type;
    }
    throw new TypeError('Invalid type: ' + type);
  }
};

const TYPES = {};
const FACTORIES = {};

module.exports.getType = function (name) {
  return TYPES[name];
};

module.exports.getFactory = function (name) {
  return FACTORIES[name];
};

module.exports.addTypes = function (types) {
  objectAssign(TYPES, types);
};

module.exports.addFactories = function (factories) {
  objectAssign(FACTORIES, factories);
};

module.exports.validateAndResolve = function (spec) {
  var definedNames = [];
  spec.forEach((prop, i) => {
    if (!prop.name) {
      throw new TypeError('No property name specified for property #' + i);
    }
    if (RESERVED_PROPERTY_NAMES.indexOf(prop.name) >= 0 || prop.name[0] === '$') {
      throw new TypeError('Reserved property name: ' + prop.name);
    }
    if (definedNames.indexOf(prop.name) >= 0) {
      throw new TypeError('Property redefined: ' + prop.name);
    }
    definedNames.push(prop.name);

    if (!prop.type) {
      throw new TypeError('No property type specified for property #' + i);
    }

    // XXX does this really work at all times?
    var localResolver = spec.$resolver || prop.type.$resolver || DEFAULT_RESOLVER;
    localResolver.resolve(prop.type, type => { prop.type = type; });
  });
};

const defineTypes = module.exports.defineTypes = function (types, options) {
  // TODO process options

  function createType (spec) {
    if (utils.isExonumType(spec)) {
      return spec;
    } else if (definedTypes[spec]) {
      // String specification (e.g., 'Uint32')
      return definedTypes[spec];
    } else {
      // Try to use a factory
      var factory = oneOf.parse(spec, Object.getOwnPropertyNames(FACTORIES));
      if (factory) {
        var arg = factory[1];
        if (typeof arg === 'string') {
          // If `arg` is not an object (i.e., a string), the resolver is unassignable,
          // so we need to resolve the type immediately
          arg = createType(arg);
        } else {
          arg.$resolver = resolver;
        }

        factory = FACTORIES[factory[0]];
        return factory(arg);
      }
    }
    throw new TypeError('Cannot parse type spec');
  }

  const resolver = {
    resolve (type, cb) {
      type = createType(type);
      if (type.isPlaceholder) {
        type.on('replace', cb);
      }
      cb(type);
      return type;
    }
  };

  // First, create placeholders for all types being defined
  var definedTypes = Object.assign({}, TYPES);
  var newTypes = {};

  const typeNames = types.map(type => type.$id);
  typeNames.forEach(name => {
    definedTypes[name] = placeholder();
  });

  // Then, create types
  types.forEach(type => {
    var name = type.$id;
    delete type.$id;
    type = createType(type);
    definedTypes[name].replaceBy(type);
    newTypes[name] = definedTypes[name] = type;
  });

  return newTypes;
};

module.exports.defineType = function (spec, options) {
  spec = Object.assign({ $id: '$name' }, spec);
  var typeName = spec.$id;
  return defineTypes([ spec ], options)[typeName];
};
