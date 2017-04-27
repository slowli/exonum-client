'use strict';
/* eslint-env node, mocha */

const expect = require('chai').expect;

const FixedBuffer = require('../../src/types/buffer').FixedBuffer;

describe('FixedBuffer', function () {
  var ShortBuffer = FixedBuffer(4);
  var LongBuffer = FixedBuffer(32);

  it('should declare correct byteLength', function () {
    expect(ShortBuffer.byteLength).to.equal(4);
    expect(LongBuffer.byteLength).to.equal(32);
  });

  it('should declare hasFixedLength', function () {
    expect(ShortBuffer.hasFixedLength).to.be.true;
    expect(LongBuffer.hasFixedLength).to.be.true;
  });

  describe('constructor', function () {
    it('should accept hex string', function () {
      var buf = new ShortBuffer('01234567');
      expect(buf.raw).to.deep.equal(new Uint8Array([0x01, 0x23, 0x45, 0x67]));
    });

    it('should accept JS array', function () {
      var buf = new ShortBuffer([ 1, 2, 34, 56 ]);
      expect(buf.raw).to.deep.equal(new Uint8Array([1, 2, 34, 56]));
    });

    it('should accept Uint8Array', function () {
      var arr = new Uint8Array([98, 76, 54, 32]);
      var buf = new ShortBuffer(arr);
      expect(buf.raw).to.deep.equal(arr);
    });

    it('should accept another buffer', function () {
      var buf = new ShortBuffer('01234567');
      var anotherBuf = new ShortBuffer(buf);
      expect(anotherBuf.raw).to.deep.equal(new Uint8Array([0x01, 0x23, 0x45, 0x67]));
    });

    it('should accept no-args call', function () {
      var buf = new ShortBuffer();
      expect(buf.raw).to.deep.equal(new Uint8Array(4));
    });

    it('should not accept hex string with invalid length', function () {
      expect(() => new ShortBuffer('123')).to.throw(TypeError, /length/i);
      expect(() => new ShortBuffer('aaaaaaaaaa')).to.throw(TypeError, /length/i);
    });

    it('should not accept JS array with invalid length', function () {
      expect(() => new ShortBuffer([1, 2])).to.throw(TypeError, /length/i);
      expect(() => new ShortBuffer([5, 4, 3, 2, 1])).to.throw(TypeError, /length/i);
    });

    it('should not accept Uint8Array with invalid length', function () {
      var arr = new Uint8Array(3);
      expect(() => new ShortBuffer(arr)).to.throw(TypeError, /length/i);
      arr = new Uint8Array(10);
      expect(() => new ShortBuffer(arr)).to.throw(TypeError, /length/i);
    });

    it('should not accept another buffer with invalid length', function () {
      var buf = new LongBuffer();
      expect(() => new ShortBuffer(buf)).to.throw(TypeError, /length/i);
      buf = new ShortBuffer([1, 2, 3, 4]);
      expect(() => new LongBuffer(buf)).to.throw(TypeError, /length/i);
    });
  });

  describe('serialize', function () {
    it('should serialize without modification', function () {
      var buf = new ShortBuffer([1, 2, 3, 4]);
      expect(buf.serialize()).to.deep.equal(new Uint8Array([1, 2, 3, 4]));
    });
  });
});
