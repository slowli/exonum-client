'use strict';
/* eslint-env node, mocha */

const expect = require('chai')
  .use(require('../chai-bytes'))
  .expect;

const types = require('../../src/types/index');
const option = types.option;

describe('option', function () {
  var MaybeStr = option(types.Str);
  var List = option(types.sequence([
    { name: 'head', type: types.Uint32 },
    { name: 'tail', type: types.Str }
  ]));

  describe('constructor', function () {
    it('should parse spec', function () {
      expect(MaybeStr).to.be.a('function');
      expect(List).to.be.a('function');
    });

    it('should calculate hasFixedLength', function () {
      expect(MaybeStr.hasFixedLength).to.be.false;
    });

    it('should calculate byteLength', function () {
      expect(MaybeStr.byteLength).to.be.undefined;
    });

    it('should instantiate from an object', function () {
      var x = new MaybeStr('Hello world');
      expect('' + x.some).to.equal('Hello world');
      expect(x).to.have.property('none', undefined);
    });

    it('should instantiate from null', function () {
      var x = new MaybeStr(null);
      expect(x).to.have.property('some', undefined);
      expect(x.none).to.be.instanceof(types.None);
    });

    it('should instantiate from explicit undefined', function () {
      var x = new MaybeStr(undefined);
      expect(x).to.have.property('some', undefined);
      expect(x.none).to.be.instanceof(types.None);
    });

    it('should instantiate from implicit undefined', function () {
      var x = new MaybeStr();
      expect(x).to.have.property('some', undefined);
      expect(x.none).to.be.instanceof(types.None);
    });

    it('should instantiate for complex wrapped type', function () {
      var x = new List({ head: 1, tail: 'tail' });
      expect(+x.some.head).to.equal(1);
      expect('' + x.some.tail).to.equal('tail');
    });
  });

  describe('toJSON', function () {
    it('should return the internal value if it is set', function () {
      var x = new MaybeStr('abc');
      expect(x.toJSON()).to.equal('abc');
    });

    it('should return the internal value if it is set, with the wrapped type', function () {
      var x = new List({ head: 1, tail: 'tail' });
      expect(x.toJSON()).to.deep.equal({ head: 1, tail: 'tail' });
    });
  });

  describe('serialize', function () {
    it('should serialize as a single zero byte if not set', function () {
      var x = new MaybeStr(null);
      expect(x.serialize()).to.equalBytes('00');
    });

    it('should serialize as a 0x01 + wrapped value if set', function () {
      var x = new MaybeStr('ABC');
      expect(x.serialize()).to.equalBytes('01414243');
    });
  });

  it('should work as a field (simple case)', function () {
    var Type = types.sequence([
      { name: 'list', type: List },
      { name: 'len', type: types.Uint32 }
    ]);
    var x = new Type([ null, 3 ]);
    expect(x.list.none).to.be.truthy;
    x.list = [ 42, '!' ];
    expect(+x.list.some.head).to.equal(42);
    expect('' + x.list.some.tail).to.equal('!');
  });
});
