'use strict';

const utils = require('./utils');

const None = module.exports = class {
  serialize (buffer) {
    return buffer;
  }

  toJSON () {
    return null;
  }
};

utils.configureType(None, {
  byteLength: 0
});
