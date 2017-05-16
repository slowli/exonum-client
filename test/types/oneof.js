'use strict';
/* eslint-env node, mocha */

const expect = require('chai')
  .use(require('../chai-bytes'))
  .expect;

const types = require('../../src/types/index');
const oneOf = types.oneOf;

describe('oneOf', function () {
  var StrOrInt = oneOf([
    { name: 'str', type: types.Str },
    { name: 'int', type: types.Uint32 }
  ]);

  // Not actually a list
  var ListRecord = types.sequence([
    { name: 'head', type: types.Uint32 },
    { name: 'tail', type: types.Str }
  ]);
  var List = oneOf([
    { name: 'none', type: types.None },
    { name: 'some', type: ListRecord }
  ]);

  var EmbeddedOneOf = oneOf([
    { name: 'oneOf', type: StrOrInt },
    { name: 'bool', type: types.Bool }
  ]);

  describe('constructor', function () {
    it('should parse spec', function () {
      expect(StrOrInt).to.be.a('function');
      // FIXME verify schema
    });

    it('should calculate hasFixedLength', function () {
      expect(StrOrInt.hasFixedLength).to.be.false;
    });

    it('should calculate byteLength', function () {
      expect(StrOrInt.byteLength).to.be.undefined;
    });

    it('should instantiate from an object', function () {
      var x = new StrOrInt({ str: 'Hello world' });
      expect('' + x.str).to.equal('Hello world');
      expect(x).to.have.property('int', undefined);
    });

    it('should instantiate from an object with embedded $type declaration', function () {
      var x = new List({
        $type: 'some',
        head: 15,
        tail: 'not actually a tail'
      });
      expect(x).to.have.property('some');
      expect(x.some.head.toJSON()).to.equal(15);
      expect(x.some.tail.toJSON()).to.equal('not actually a tail');
    });

    it('should instantiate from an object with embedded array @type declaration', function () {
      var x = new EmbeddedOneOf({
        $type: [ 'oneOf', 'int' ],
        dec: '1020304'
      });
      expect(x.oneOf.int.toJSON()).to.equal(1020304);
    });

    it('should throw if an object does not contain allowed variant tags', function () {
      expect(() => new StrOrInt({ bool: false })).to.throw(TypeError, /invalid/i);
    });

    it('should throw if an @type declaration does not have allowed variant tag', function () {
      expect(() => new StrOrInt({ $type: 'bool', dec: '1' })).to.throw(TypeError, /invalid/i);
    });
  });

  describe('get', function () {
    it('should return the defined variant of a oneOf type', function () {
      var x = new StrOrInt({ str: 'Hello world' });
      expect(x.get('str').toJSON()).to.equal('Hello world');
    });

    it('should return undefined for all variants that are not set', function () {
      var x = new StrOrInt({ str: 'Hello world' });
      expect(x.get('int')).to.be.undefined;
    });

    it('should return undefined for non-existent variants', function () {
      var x = new StrOrInt({ str: 'Hello world' });
      expect(x.get('bool')).to.be.undefined;
    });
  });

  describe('set', function () {
    it('should unset previously set variants', function () {
      var x = new StrOrInt({ str: 'Hello world' });
      x.set('int', 123);
      expect(+x.int).to.equal(123);
      expect(x.str).to.be.undefined;
    });

    it('should unset previously set variants when called implicitly', function () {
      var x = new StrOrInt({ str: 'Hello world' });
      x.int = { hex: 'fe' };
      expect(+x.int).to.equal(254);
      expect(x.str).to.be.undefined;
    });
  });

  describe('byteLength', function () {
    it('should work in the basic case', function () {
      var x = new StrOrInt({ str: 'Hello world' });
      expect(x.byteLength).to.equal(1 + 11);
      x.int = 123;
      expect(x.byteLength).to.equal(5);
    });

    it('should work for oneOf with embedded sequence', function () {
      var lst = {
        $type: 'some',
        head: 15,
        tail: 'not actually a tail'
      };
      var x = new List(lst);
      expect(x.byteLength).to.equal(1 + 4 + 8 + lst.tail.length);
      // 8 is for the segment pointer for the string
    });

    it('should work for oneOf with embedded oneOf', function () {
      var x = new EmbeddedOneOf({
        $type: [ 'oneOf', 'int' ],
        dec: '1020304'
      });
      expect(x.byteLength).to.equal(1 + 1 + 4);
    });
  });

  describe('serialize', function () {
    it('should serialize as a marker + variant in the basic case', function () {
      var x = new StrOrInt({ int: 255 });
      expect(x.serialize()).to.equalBytes('01ff000000');
    });

    it('should serialize in the basic case for var-length variant', function () {
      var x = new StrOrInt({ str: 'ABC' });
      expect(x.serialize()).to.equalBytes('00414243');
    });

    it('should serialize as a marker + variant for embedded types', function () {
      var x = new List({ some: [ 256, 'ABC' ] });
      expect(x.serialize()).to.equalBytes('01' + // marker
        '00010000' + // head
        '0d000000' + '03000000' + // segment pointer to the tail
        '414243' // tail
      );

      x = new List({ none: null });
      expect(x.serialize()).to.equalBytes('00');
    });
  });

  describe('toJSON', function () {
    it('should work in the basic case', function () {
      var x = new StrOrInt({ str: 'Hello world' });
      expect(x.toJSON()).to.deep.equal({ str: 'Hello world' });
      x.int = 123;
      expect(x.toJSON()).to.deep.equal({ int: 123 });
    });

    it('should work for oneOf with embedded sequence', function () {
      var lst = {
        some: {
          head: 15,
          tail: 'not actually a tail'
        }
      };
      var x = new List(lst);
      expect(x.toJSON()).to.deep.equal(lst);
    });

    it('should work for oneOf with embedded oneOf', function () {
      var x = new EmbeddedOneOf({
        $type: [ 'oneOf', 'int' ],
        dec: '1020304'
      });
      expect(x.toJSON()).to.deep.equal({
        oneOf: { int: 1020304 }
      });
    });
  });
});
