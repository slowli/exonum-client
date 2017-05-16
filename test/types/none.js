'use strict';
/* eslint-env node, mocha */

const expect = require('chai')
  .use(require('../chai-bytes'))
  .expect;

const None = require('../../src/types/index').None;

describe('None', function () {
  describe('constructor', function () {
    it('should declare hasFixedLength', function () {
      expect(None.hasFixedLength).to.be.true;
    });

    it('should declare correct byteLength', function () {
      expect(None.byteLength).to.equal(0);
    });

    it('should create a new None instance', function () {
      var x = new None();
      expect(x).to.have.property('byteLength', 0);
    });
  });

  describe('serialize', function () {
    it('should serialize to an empty buffer', function () {
      var none = new None();
      expect(none.serialize()).to.equalBytes([]);
    });
  });

  describe('toJSON', function () {
    it('should convert to null', function () {
      expect(new None().toJSON()).to.be.null;
    });
  });
});
