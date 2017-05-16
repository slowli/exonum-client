'use strict';

const EventEmitter = require('events');
const utils = require('./utils');

module.exports = function placeholder () {
  const emitter = new EventEmitter();

  var Placeholder = class {
    get byteLength () {
      throw new Error('Placeholders should be replaced with real types');
    }

    serialize () {
      throw new Error('Placeholders should be replaced with real types');
    }

    toJSON () {
      throw new Error('Placeholders should be replaced with real types');
    }

    static replaceBy (type) {
      this.emit('replace', type);
    }

    static get isPlaceholder () {
      return true;
    }
  };

  // FIXME this is just wrong
  [
    'on',
    'emit'
  ].forEach(method => {
    Placeholder[method] = emitter[method].bind(emitter);
  });

  utils.configureType(Placeholder, {
    byteLength: undefined
  });

  return Placeholder;
};
