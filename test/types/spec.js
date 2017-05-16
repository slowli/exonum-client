'use strict';
/* eslint-env node, mocha */

const expect = require('chai')
  .use(require('../chai-bytes'))
  .expect;

const types = require('../../src/types/index');

describe('defineTypes', function () {
  it('should parse type spec', function () {
    var Wallet = types.defineType({
      sequence: [
        { name: 'pubkey', type: 'Pubkey' },
        { name: 'name', type: 'Str' },
        { name: 'balance', type: 'Uint64' },
        { name: 'history_hash', type: 'Hash' }
      ]
    });

    var json = {
      pubkey: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
      name: 'Smart wallet',
      balance: 359120,
      history_hash: '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030'
    };
    var wallet = new Wallet(json);

    expect(wallet.pubkey.raw).to.equalBytes('f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36');
    expect(wallet.name.toString()).to.equal('Smart wallet');
    expect(wallet.balance.valueOf()).to.equal(359120);
    expect(wallet.history_hash.raw).to.equalBytes('6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030');
    expect(wallet.toJSON()).to.deep.equal(json);
  });

  it('should parse recursive type spec', function () {
    var List = types.defineType({
      $id: 'List',
      option: {
        sequence: [
          { name: 'head', type: 'Uint32' },
          { name: 'tail', type: 'List' }
        ]
      }
    });

    List.prototype.elements = function () {
      var elements = [];
      var list = this;
      while (list.some) {
        elements.push(+list.some.head);
        list = list.some.tail;
      }
      return elements;
    };

    var lst = new List([0, [1, [2, null]]]);
    expect(lst.elements()).to.deep.equal([0, 1, 2]);
  });

  var list = function (Type) {
    return class extends types.defineType({
      $id: 'List',
      option: {
        sequence: [
          { name: 'head', type: Type },
          { name: 'tail', type: 'List' }
        ]
      }
    }) {
      // Returns the elements of the list in a JS array,
      // converting them with the help of `toJSON()` method
      elements () {
        var elements = [];
        var list = this;
        while (list.some) {
          elements.push(list.some.head.toJSON());
          list = list.some.tail;
        }
        return elements;
      }
    };
  };

  it('should parse recursive generic type spec for type Int32', function () {
    var IntList = list(types.Int32);

    var lst = new IntList([0, [1, [2, null]]]);
    expect(lst.elements()).to.deep.equal([0, 1, 2]);
  });

  it('should parse recursive generic type spec for type Str', function () {
    var StrList = list(types.Str);

    var lst = new StrList(['a', ['b', ['c', null]]]);
    expect(lst.elements()).to.deep.equal(['a', 'b', 'c']);
  });

  it('should parse recursive generic type spec for a sequence type', function () {
    var SeqList = list({
      sequence: [
        { name: 'x', type: 'Uint32' },
        { name: 'y', type: 'Uint32' }
      ]
    });

    var lst = new SeqList([[1, 2], [[3, 4], [[5, 6], null]]]);
    expect(lst.elements()).to.deep.equal([
      { x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5, y: 6 }
    ]);
  });

  it('should parse recursive generic type spec for a oneOf type', function () {
    var OneOfList = list({
      oneOf: [
        { name: 'str', type: 'Str' },
        { name: 'int', type: 'Int32' }
      ]
    });

    var lst = new OneOfList([{ str: 'a' }, [{ int: '-5' }, [{ str: 'b' }, null]]]);
    expect(lst.elements()).to.deep.equal([
      { str: 'a' }, { int: -5 }, { str: 'b' }
    ]);
  });

  it('should parse recursive generic type spec for an option type', function () {
    var OneOfList = list({
      option: 'Str'
    });

    var lst = new OneOfList(['Hello', [null, ['world', null]]]);
    expect(lst.elements()).to.deep.equal([
      'Hello', null, 'world'
    ]);
  });

  it('should parse cross-recursive type spec', function () {
    var t = types.defineTypes([
      {
        $id: 'Tree',
        oneOf: [
          { name: 'branch', type: 'Branch' },
          { name: 'stub', type: 'Hash' },
          { name: 'leaf', type: 'Int64' }
        ]
      },
      {
        $id: 'Branch',
        sequence: [
          { name: 'left', type: 'Tree' },
          { name: 'right', type: 'Tree' }
        ]
      }
    ]);

    // Create shortcuts for branches' children
    Object.defineProperty(t.Tree.prototype, 'left', {
      enumerable: true,
      configurable: false,
      get: function () {
        return this.branch ? this.branch.left : undefined;
      }
    });
    Object.defineProperty(t.Tree.prototype, 'right', {
      enumerable: true,
      configurable: false,
      get: function () {
        return this.branch ? this.branch.right : undefined;
      }
    });

    var tree = new t.Tree({
      $type: 'branch',
      left: {
        $type: 'branch',
        left: {
          $type: 'stub',
          hex: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
        },
        right: {
          leaf: 123456
        }
      },
      right: {
        $type: 'leaf',
        dec: '123456789'
      }
    });

    expect(tree.left.branch).to.be.instanceof(t.Branch);
    expect(tree.left.left.stub.raw).to.equalBytes('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
    expect(+tree.left.right.leaf).to.equal(123456);
    expect(+tree.right.leaf).to.equal(123456789);
  });
});
