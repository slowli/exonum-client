'use strict';

const objectAssign = Object.assign || require('object-assign');

const utils = require('./utils');
const specification = require('./spec');

objectAssign(module.exports,
  require('./integers'),
  require('./buffer'),
  require('./crypto'),
  { Str: require('./string') },
  { Bool: require('./bool') },
  { sequence: require('./sequence') },
  utils,
  // Specification utils
  {
    spec: specification,
    defineTypes: specification.defineTypes,
    defineType: specification.defineType
  });

// Add built-in types and factories to the spec resolver
var types = {};
for (var name in module.exports) {
  if (utils.isExonumType(module.exports[name])) {
    types[name] = module.exports[name];
  }
}
specification.addTypes(types);

const factories = [
  'sequence',
  'oneOf',
  'option',
  // 'integer',
  'fixedBuffer'
].reduce((obj, name) => {
  obj[name] = module.exports[name];
  return obj;
}, {});
specification.addFactories(factories);
