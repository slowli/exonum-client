'use strict';

const objectAssign = Object.assign || require('object-assign');

const utils = require('./utils');
objectAssign(module.exports,
  require('./integers'),
  require('./buffer'),
  require('./crypto'),
  { Str: require('./string') },
  { Bool: require('./bool') },
  { sequence: require('./sequence') },
  utils,
