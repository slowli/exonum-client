# Exonum Datatypes

The Exonum framework provides a set of built-in datatypes and tools for creating
new datatypes. The datatypes are used in order to parse and serialize data during
communication with Exonum full nodes, and in order to perform cryptographic routines
(e.g., message signing or hashing).

**Note.** For the sake of simplicity, the examples on this page imply that datatypes
and factories are imported directly to the global scope; i.e., as if the following
[ES6 import statement][import] was executed:
```javascript
import { Uint8, Int8, /* lots of other stuff */ } from 'exonum/types';
```

[import]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import

## Table of Contents

- [Common interface](#common-interface)
- Primitive types:
  - [Integer types](#integer-types)
  - [String](#string)
  - [Boolean](#boolean)
  - [Byte buffers](#byte-buffers)
- Composite types:
  - [Sequences](#sequences)
  
## Common Interface

All Exonum datatypes have a common interface:

### Constructor

```javascript
var x = new Type(...)
```

Creates a new instance of the data type. As a rule of a thumb,
the constructor can be supplied with JSON that parses to the intended value.

### Binary Serialization

```javascript
x.serialize([buffer])
```

Performs binary serialization of the instance to the `buffer`, or to a new `Uint8Array`.
The buffer should be the length necessary to serialize the data; this length
can be obtained by reading [`byteLength`](#byte-length) property of the instance.

Binary serialization is used to verify signatures and calculate hashes of data for
Merkle (Patricia) proofs.

### JSON Serialization

```javascript
x.toJSON()
```

Returns the JSON representation of the data instance.

JSON is the main format of communication among Exonun clients and full nodes
when using REST APIs.

### Byte Length

```javascript
x.byteLength
```

Returns the length of a binary representation of the data instance. Note that
some mutable datatypes (such as sequences) may have variable `byteLength`.
If the length of a datatype is constant, then the type itself has the `byteLength`
field, too. For example, `Uint64.byteLength === 8`.

## Integer Types

Exonum provides 1-, 2-, 4-, and 8-byte signed and unsigned integer types:
`Int8`, `Uint8`, `Int16`, `Uint16`, `Int32`, `Uint32`, `Int64`,
and `Uint64`. Exonum also has a generic interface `integer(byteLength, signed)`
to create fixed-length integers with arbitrary length.

Internally, all integer types are backed by arbitrary-length integers
from the [`big-integer` package][big-integer]. The integers proxy all
`big-integer` methods, including `toString()` and `valueOf()`. This means
that they can be used practically wherever a native JS number can be used.

[big-integer]: https://www.npmjs.com/package/big-integer

### Creation

```javascript
// Int is any of built-in or user-defined integer types
new Int(number)
new Int(decimalString)
new Int(encodedString, encoding)
new Int({ [encoding]: encodedString })
new Int(bigInteger)
```

Integer types can be created from:

- Native JS number (e.g., `123`)
- String (e.g., `'9000000000'`)
- Big integer instance from `big-integer` package
- Pair of encoding and an encoded string (e.g., `{hex: 'abcdef'}`). `'hex'`, `'dec'`,
  `'oct'` and `'bin'` encodings are supported
  
If a value cannot be parsed or is out of bounds for the type, a `TypeError`
is raised.

```javascript
var x = new Int32(42);
var y = new Uint64('10000000000');
var z = new Uint8({ hex: 'fe' });
```

### JSON Representation

`toJSON()` function for all integer types returns a native JS number
if the integer is within the safe range `[-2^53 + 1, 2^53 - 1]`,
and a decimal string otherwise.

### Binary Serialization

Little-endian, fixed length, padded with zeros.

```javascript
var x = new Int32(42);
x.serialize(); // returns Uint8Array([42, 0, 0, 0])
```

## String

Exonum's `Str` type is a simple wrapper around native JS strings.
Most `String` methods are proxied (excluding index-based char access via array indices;
use `charAt`).

### Creation

```javascript
new Str(string)
new Str(anythingWithToStringMethod)
```

`Str` constructor supports any value convertible to a string
(with the help of the `toString()` method).

```javascript
var str = new Str('Hello, world');
str = new Str(5); // '5'
str = new Str({}); // '[object Object]'
```

### JSON Representation

`Str` instances always convert to an underlying JS string.

### Binary Serialization

UTF-8 encoding.

## Boolean

Exonum's `Bool` type is a wrapper around native JS booleans.

### Creation

```javascript
new Bool(true)
new Bool(false)
new Bool(anything)
Bool.true
Bool.false
```

Boolean values can be created from JS booleans, or from any other value.
In the latter case, the value is coerced to boolean using `!!value` operator.
Additionally, you may use `Bool.true` and `Bool.false` constants.

### JSON Representation

`toJSON()` converts `Bool`s to their wrapped values, `true` or `false`.

#### Binary Serialization

`true` value serializes to a single `1` byte, `false` - to a single `0` byte.

## Byte Buffers

Types representing fixed-length data buffers can be created with the help
of `fixedBuffer(length)` method.

```javascript
const FourByteBuffer = fixedBuffer(4);
```

For convenience, Exonum provides built-in datatypes for common cryptographic operations:

- `Pubkey`, `SecretKey` and `Hash` are all 32-byte buffers
- `Signature` is a 64-byte buffer

Internally, buffers are backed by `Uint8Array`.

### Creation

```javascript
// FixedBuffer is any of built-in or user-defined fixed-length buffer types
new FixedBuffer()
new FixedBuffer(hexString)
new FixedBuffer(encodedString, encoding)
new FixedBuffer({[encoding]: encodedString})
new FixedBuffer(arrayOfBytes)
new FixedBuffer(uint8Array)
```

Fixed-length buffers can be created from encoded strings (`'hex'` encoding
is used by default), and from arrays of individual bytes (including `Uint8Array`
instances). If a constructor is called without arguments, the buffer is initialized
to zero bytes. If the passed argument(s) imply a buffer of a different length than
required by the type, a `TypeError` is thrown.

All the following constructors create the same 4-byte buffer:

```javascript
new FourByteBuffer('01020304');
new FourByteBuffer({ hex: '01020304' });
new FourByteBuffer('01020304', 'hex');
new FourByteBuffer([1, 2, 3, 4]);
new FourByteBuffer(new Uint8Array([1, 2, 3, 4]));
new FourByteBuffer(new FourByteBuffer([1, 2, 3, 4]));
```

### JSON Representation

`toJSON()` for buffers returns a hex string representing buffer contents.

```javascript
var x = new FourByteBuffer([0, 1, 2, 255]);
console.log(x.toJSON()); // '000102ff'
```

### Binary Serialization

Buffers are serialized as-is, without any modification.

```javascript
var x = new FourByteBuffer('01020304');
console.log(x.serialize()); // Uint8Array([1, 2, 3, 4])
```

## Sequences

Sequences can be best understood as a JavaScript array with a fixed length,
in which elements are *named*, i.e. can be accessed via a string shorthand rather than
an index. That is, a sequence almost looks like a plain JS object.

Sequence types may contain any number of items, all of which must be Exonum-typed.
A sequence type can be created via a `sequence` method:

```javascript
const Sequence = sequence([
  { name: 'foo', type: Uint32 },
  { name: 'bar', type: Str }
]);
```

This creates a type, the instances of which can be viewed either as 2-element
arrays (e.g., `[4, 'beer']`) or objects with properties `foo` and `bar` (e.g.,
`{foo: 4, bar: 'beer'}`).

Properties can have a constructed type, e.g., be a sequence themselves.

### Creation

```javascript
// Sequence is an arbitrary built-in or user-defined sequence type
new Sequence([prop1, prop2, ..., propN])
new Sequence({
  prop1Name: prop1,
  prop2Name: prop2,
  ...
  propNName: propN
})
new Sequence(prop1, prop2, ..., propN)
```

Sequence type instances can be initialized with:

- An array of properties in order of their declaration in the datatype
- An object containing property names and values
- Using a variable-arity constructor that lists properties in the order of their declaration
  in the datatype. This constructor form is only called if other two do not match,
  which may lead to unexpected results if you try to invoke this form with a single
  property, which is an object- or array-like
  
In all cases, some properties may not be initialized by the constructor.
The constructor performs automatic conversion of datatypes as described above;
thus, if you have `Sequence` from above, you may initialize it with

```javascript
new Sequence(4, 'beer');
new Sequence(['1234567', 'beer'])
new Sequence({
  foo: { hex: '00c0ffee' }
  bar: '.'
})
```

This logic extends to properties with constructed datatypes; e.g., if you have a sequence
property, you can initialize it with an object.

### Property Assignment

Properties/elements of a sequence can be individually assigned with any object convertible
to a corresponding Exonum type. For example, an integer field can be assigned with
a JS number, a JS string, a big integer, or an encoding-value pair in a form of an object.
Behind the scenes, field assignment uses the constructor of the datatype for the property
being assigned in order to do the conversion.

```javascript
var x = new Sequence({ bar: '!' }); // x.bar is '!', x.foo is undefined
x.foo = 255;
x.foo = '12345';
x.foo = bigInt(1).shiftLeft(29);
x.foo = { hex: '00c0ffee' };
x.foo--; // works too
x.bar += '?';
```

If the conversion cannot be performed, a `TypeError` is thrown. This means the following
code throws:

```javascript
var x = new Sequence({ foo: 0, bar: '!' });
x.foo--; // -1 is not a valid Uint32 value
```

### JSON Representation

A sequence is converted to a plain JS object with mapping of field names to values,
where all values are recursively converted with `toJSON()`.

```javascript
var x = new Sequence(4, 'beer');
console.log(x.toJSON()); // { foo: 4, bar: 'beer' }
```

### Binary Serialization

Sequences use a slightly complex serialization method, which is based on concepts
of "stack" and "heap". In short:
- Properties are serialized in the order of their declaration
in the datatype
- Fixed-length properties (e.g., integer types) are placed
directly in the "stack"
- Var-length properties (e.g., `Str`) are allocated in the "heap",
with a reference in the stack pointing to the allocation
- The sequence serialization is the concatenation of the "stack" and the "heap" 

See Exonum Core documentation for a more detailed explanation.
