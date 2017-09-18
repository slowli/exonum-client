/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const Exonum = require('../src')

describe('Check cryptography', function () {
  describe('Get SHA256 hash', function () {
    it('should return hash of data of newType type', function () {
      const Wallet = Exonum.newType({
        size: 80,
        fields: {
          pub_key: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 },
          name: { type: Exonum.String, size: 8, from: 32, to: 40 },
          balance: { type: Exonum.Uint64, size: 8, from: 40, to: 48 },
          history_hash: { type: Exonum.Hash, size: 32, from: 48, to: 80 }
        }
      })
      const walletData = {
        pub_key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
        name: 'Smart wallet',
        balance: 359120,
        history_hash: '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030'
      }
      const hash = Exonum.hash(walletData, Wallet)

      expect(hash).to.equal('86b47510fbcbc83f9926d8898a57c53662518c97502625a6d131842f2003f974')
    })

    it('should return hash of data of newType type using built-in method', function () {
      const Wallet = Exonum.newType({
        size: 80,
        fields: {
          pub_key: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 },
          name: { type: Exonum.String, size: 8, from: 32, to: 40 },
          balance: { type: Exonum.Uint64, size: 8, from: 40, to: 48 },
          history_hash: { type: Exonum.Hash, size: 32, from: 48, to: 80 }
        }
      })
      const walletData = {
        pub_key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
        name: 'Smart wallet',
        balance: 359120,
        history_hash: '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030'
      }
      const hash = Wallet.hash(walletData)

      expect(hash).to.equal('86b47510fbcbc83f9926d8898a57c53662518c97502625a6d131842f2003f974')
    })

    it('should return hash of data of newMessage type', function () {
      const CustomMessage = Exonum.newMessage({
        size: 18,
        network_id: 0,
        protocol_version: 0,
        service_id: 1,
        message_id: 2,
        fields: {
          name: { type: Exonum.String, size: 8, from: 0, to: 8 },
          age: { type: Exonum.Uint8, size: 1, from: 8, to: 9 },
          balance: { type: Exonum.Uint64, size: 8, from: 9, to: 17 },
          status: { type: Exonum.Bool, size: 1, from: 17, to: 18 }
        },
        signature: 'dad76b4c3b067d53265534bde4d9ff59987d00f87e0e1a633613576195a4cbc1e0a43a58c67c34c98019f791812699d010655c4eccec448e46e5524471a8c401'
      })
      const messageData = {
        name: 'John Doe',
        age: 34,
        balance: 17,
        status: true
      }
      const hash = Exonum.hash(messageData, CustomMessage)

      expect(hash).to.equal('a19f4123eb23e01811322cb8d721c0f6866459a145b0ea79f2afcc529f61252c')
    })

    it('should return hash of data of newMessage type using built-in method', function () {
      const CustomMessage = Exonum.newMessage({
        size: 18,
        network_id: 0,
        protocol_version: 0,
        service_id: 1,
        message_id: 2,
        fields: {
          name: { type: Exonum.String, size: 8, from: 0, to: 8 },
          age: { type: Exonum.Uint8, size: 1, from: 8, to: 9 },
          balance: { type: Exonum.Uint64, size: 8, from: 9, to: 17 },
          status: { type: Exonum.Bool, size: 1, from: 17, to: 18 }
        },
        signature: 'dad76b4c3b067d53265534bde4d9ff59987d00f87e0e1a633613576195a4cbc1e0a43a58c67c34c98019f791812699d010655c4eccec448e46e5524471a8c401'
      })
      const messageData = {
        name: 'John Doe',
        age: 34,
        balance: 17,
        status: true
      }
      const hash = CustomMessage.hash(messageData)

      expect(hash).to.equal('a19f4123eb23e01811322cb8d721c0f6866459a145b0ea79f2afcc529f61252c')
    })

    it('should return hash of the array of 8-bit integers', function () {
      const Wallet = Exonum.newType({
        size: 80,
        fields: {
          pub_key: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 },
          name: { type: Exonum.String, size: 8, from: 32, to: 40 },
          balance: { type: Exonum.Uint64, size: 8, from: 40, to: 48 },
          history_hash: { type: Exonum.Hash, size: 32, from: 48, to: 80 }
        }
      })
      const walletData = {
        pub_key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
        name: 'Smart wallet',
        balance: 359120,
        history_hash: '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030'
      }
      const buffer = Wallet.serialize(walletData)
      const hash = Exonum.hash(buffer)

      expect(hash).to.equal('86b47510fbcbc83f9926d8898a57c53662518c97502625a6d131842f2003f974')
    })

    it('should throw error when data of invalid NewType type', function () {
      const Wallet = Exonum.newType({
        size: 80,
        fields: {
          pub_key: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 },
          name: { type: Exonum.String, size: 8, from: 32, to: 40 },
          balance: { type: Exonum.Uint64, size: 8, from: 40, to: 48 },
          history_hash: { type: Exonum.Hash, size: 32, from: 48, to: 80 }
        }
      })

      expect(() => Exonum.hash(undefined, Wallet))
        .to.throw(TypeError, 'Cannot read property \'pub_key\' of undefined');

      [false, 42, new Date(), []].forEach(function (_hash) {
        expect(() => Exonum.hash(_hash, Wallet))
          .to.throw(TypeError, 'Field pub_key is not defined.')
      })
    })

    it('should throw error when data of invalid NewMessage type', function () {
      const CustomMessage = Exonum.newMessage({
        size: 18,
        network_id: 0,
        protocol_version: 0,
        service_id: 1,
        message_id: 2,
        fields: {
          name: { type: Exonum.String, size: 8, from: 0, to: 8 },
          age: { type: Exonum.Uint8, size: 1, from: 8, to: 9 },
          balance: { type: Exonum.Uint64, size: 8, from: 9, to: 17 },
          status: { type: Exonum.Bool, size: 1, from: 17, to: 18 }
        }
      })

      expect(() => Exonum.hash(undefined, CustomMessage))
        .to.throw(TypeError, 'Cannot read property \'name\' of undefined');

      [false, 42, new Date(), []].forEach(function (_hash) {
        expect(() => Exonum.hash(_hash, CustomMessage))
          .to.throw(TypeError, 'Field name is not defined.')
      })
    })
  })

  describe('Get ED25519 signature', function () {
    it('should return signature of the data of NewType type', function () {
      const secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36'
      const User = Exonum.newType({
        size: 16,
        fields: {
          firstName: { type: Exonum.String, size: 8, from: 0, to: 8 },
          lastName: { type: Exonum.String, size: 8, from: 8, to: 16 }
        }
      })
      const userData = {
        firstName: 'John',
        lastName: 'Doe'
      }
      const signature = User.sign(secretKey, userData)

      expect(signature).to.equal('7ccad21d76359c8c3ed1161eb8231edd44a91d53ea468d23f8528e2985e5547f72f98ccc61d96ecad173bdc29627abbf6d46908807f6dd0a0d767ae3887d040e')
    })

    it('should return signature of the data of NewType type using built-in method', function () {
      const secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36'
      const User = Exonum.newType({
        size: 16,
        fields: {
          firstName: { type: Exonum.String, size: 8, from: 0, to: 8 },
          lastName: { type: Exonum.String, size: 8, from: 8, to: 16 }
        }
      })
      const userData = {
        firstName: 'John',
        lastName: 'Doe'
      }
      const signature = User.sign(secretKey, userData)

      expect(signature).to.equal('7ccad21d76359c8c3ed1161eb8231edd44a91d53ea468d23f8528e2985e5547f72f98ccc61d96ecad173bdc29627abbf6d46908807f6dd0a0d767ae3887d040e')
    })

    it('should return signature of the data of NewMessage type', function () {
      const secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36'
      const CustomMessage = Exonum.newMessage({
        size: 18,
        network_id: 0,
        protocol_version: 0,
        service_id: 1,
        message_id: 2,
        fields: {
          name: { type: Exonum.String, size: 8, from: 0, to: 8 },
          age: { type: Exonum.Uint8, size: 1, from: 8, to: 9 },
          balance: { type: Exonum.Uint64, size: 8, from: 9, to: 17 },
          status: { type: Exonum.Bool, size: 1, from: 17, to: 18 }
        }
      })
      const messageData = {
        name: 'John Doe',
        age: 34,
        balance: 173008,
        status: true
      }
      const signature = Exonum.sign(secretKey, messageData, CustomMessage)

      expect(signature).to.equal('8a55a1e91fec53cf0c46db75572311f167300ca1d453edbc18dff372d1d44372100eef3acf8d64d39a0b5cdf79a3b3ba2617c16d1a245f50a48add336ec3b508')
    })

    it('should return signature of the data of NewMessage type using built-in method', function () {
      const secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36'
      const CustomMessage = Exonum.newMessage({
        size: 18,
        network_id: 0,
        protocol_version: 0,
        service_id: 1,
        message_id: 2,
        fields: {
          name: { type: Exonum.String, size: 8, from: 0, to: 8 },
          age: { type: Exonum.Uint8, size: 1, from: 8, to: 9 },
          balance: { type: Exonum.Uint64, size: 8, from: 9, to: 17 },
          status: { type: Exonum.Bool, size: 1, from: 17, to: 18 }
        }
      })
      const messageData = {
        name: 'John Doe',
        age: 34,
        balance: 173008,
        status: true
      }
      const signature = CustomMessage.sign(secretKey, messageData)

      expect(signature).to.equal('8a55a1e91fec53cf0c46db75572311f167300ca1d453edbc18dff372d1d44372100eef3acf8d64d39a0b5cdf79a3b3ba2617c16d1a245f50a48add336ec3b508')
    })

    it('should return signature of the array of 8-bit integers', function () {
      const secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36'
      const User = Exonum.newType({
        size: 16,
        fields: {
          firstName: { type: Exonum.String, size: 8, from: 0, to: 8 },
          lastName: { type: Exonum.String, size: 8, from: 8, to: 16 }
        }
      })
      const userData = {
        firstName: 'John',
        lastName: 'Doe'
      }
      const buffer = User.serialize(userData)
      const signature = Exonum.sign(secretKey, buffer)

      expect(signature).to.equal('7ccad21d76359c8c3ed1161eb8231edd44a91d53ea468d23f8528e2985e5547f72f98ccc61d96ecad173bdc29627abbf6d46908807f6dd0a0d767ae3887d040e')
    })

    it('should throw error when the data parameter of wrong NewType type', function () {
      const secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36'
      const User = Exonum.newType({
        size: 16,
        fields: {
          firstName: { type: Exonum.String, size: 8, from: 0, to: 8 },
          lastName: { type: Exonum.String, size: 8, from: 8, to: 16 }
        }
      })
      const userData = {
        sum: 500,
        hash: 'Hello world'
      }

      expect(() => Exonum.sign(secretKey, userData, User))
        .to.throw(TypeError, 'Field firstName is not defined.')
    })

    it('should throw error when the data parameter of wrong NewMessage type', function () {
      const secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36'
      const CustomMessage = Exonum.newMessage({
        size: 18,
        network_id: 0,
        protocol_version: 0,
        service_id: 1,
        message_id: 2,
        fields: {
          name: { type: Exonum.String, size: 8, from: 0, to: 8 },
          age: { type: Exonum.Uint8, size: 1, from: 8, to: 9 },
          balance: { type: Exonum.Uint64, size: 8, from: 9, to: 17 },
          status: { type: Exonum.Bool, size: 1, from: 17, to: 18 }
        }
      })
      const someData = {
        sum: 500,
        hash: 'Hello world'
      }

      expect(() => Exonum.sign(secretKey, someData, CustomMessage))
        .to.throw(TypeError, 'Field name is not defined.')
    })

    it('should throw error when the type parameter of invalid type', function () {
      const secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36'
      const User = {
        alpha: 5
      }
      const userData = {
        firstName: 'John',
        lastName: 'Doe'
      }

      expect(() => Exonum.sign(secretKey, userData, User))
        .to.throw(TypeError, 'Wrong type of data.')
    })

    it('should throw error when the secretKey parameter of wrong length', function () {
      const secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C'
      const User = Exonum.newType({
        size: 16,
        fields: {
          firstName: { type: Exonum.String, size: 8, from: 0, to: 8 },
          lastName: { type: Exonum.String, size: 8, from: 8, to: 16 }
        }
      })
      const userData = {
        firstName: 'John',
        lastName: 'Doe'
      }
      const buffer = User.serialize(userData)

      expect(() => Exonum.sign(secretKey, buffer))
        .to.throw(TypeError, 'secretKey of wrong type is passed. Hexadecimal expected.')
    })

    it('should throw error when wrong secretKey parameter', function () {
      const secretKey = '6752ZE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36'
      const User = Exonum.newType({
        size: 16,
        fields: {
          firstName: { type: Exonum.String, size: 8, from: 0, to: 8 },
          lastName: { type: Exonum.String, size: 8, from: 8, to: 16 }
        }
      })
      const userData = {
        firstName: 'John',
        lastName: 'Doe'
      }
      const buffer = User.serialize(userData)

      expect(() => Exonum.sign(secretKey, buffer))
        .to.throw(TypeError, 'secretKey of wrong type is passed. Hexadecimal expected.')
    })

    it('should throw error when the secretKey parameter of invalid type', function () {
      const User = Exonum.newType({
        size: 16,
        fields: {
          firstName: { type: Exonum.String, size: 8, from: 0, to: 8 },
          lastName: { type: Exonum.String, size: 8, from: 8, to: 16 }
        }
      })
      const userData = {
        firstName: 'John',
        lastName: 'Doe'
      }
      const buffer = User.serialize(userData);

      [true, null, undefined, [], {}, 51, new Date()].forEach(function (secretKey) {
        expect(() => Exonum.sign(secretKey, buffer))
          .to.throw(TypeError, 'secretKey of wrong type is passed. Hexadecimal expected.')
      })
    })
  })

  describe('Verify signature', function () {
    it('should verify signature of the data of NewType type and return true', function () {
      const publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36'
      const signature = '7ccad21d76359c8c3ed1161eb8231edd44a91d53ea468d23f8528e2985e5547f72f98ccc61d96ecad173bdc29627abbf6d46908807f6dd0a0d767ae3887d040e'
      const User = Exonum.newType({
        size: 16,
        fields: {
          firstName: { type: Exonum.String, size: 8, from: 0, to: 8 },
          lastName: { type: Exonum.String, size: 8, from: 8, to: 16 }
        }
      })
      const userData = {
        firstName: 'John',
        lastName: 'Doe'
      }

      expect(User.verifySignature(signature, publicKey, userData)).to.be.true
    })

    it('should verify signature of the data of NewType type using built-in method and return true', function () {
      const publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36'
      const signature = '7ccad21d76359c8c3ed1161eb8231edd44a91d53ea468d23f8528e2985e5547f72f98ccc61d96ecad173bdc29627abbf6d46908807f6dd0a0d767ae3887d040e'
      const User = Exonum.newType({
        size: 16,
        fields: {
          firstName: { type: Exonum.String, size: 8, from: 0, to: 8 },
          lastName: { type: Exonum.String, size: 8, from: 8, to: 16 }
        }
      })
      const userData = {
        firstName: 'John',
        lastName: 'Doe'
      }

      expect(User.verifySignature(signature, publicKey, userData)).to.be.true
    })

    it('should verify signature of the data of NewMessage type and return true', function () {
      const publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36'
      const signature = '8a55a1e91fec53cf0c46db75572311f167300ca1d453edbc18dff372d1d44372100eef3acf8d64d39a0b5cdf79a3b3ba2617c16d1a245f50a48add336ec3b508'
      const CustomMessage = Exonum.newMessage({
        size: 18,
        network_id: 0,
        protocol_version: 0,
        service_id: 1,
        message_id: 2,
        fields: {
          name: { type: Exonum.String, size: 8, from: 0, to: 8 },
          age: { type: Exonum.Uint8, size: 1, from: 8, to: 9 },
          balance: { type: Exonum.Uint64, size: 8, from: 9, to: 17 },
          status: { type: Exonum.Bool, size: 1, from: 17, to: 18 }
        }
      })
      const messageData = {
        name: 'John Doe',
        age: 34,
        balance: 173008,
        status: true
      }

      expect(Exonum.verifySignature(signature, publicKey, messageData, CustomMessage)).to.be.true
    })

    it('should verify signature of the data of NewMessage type using built-in method and return true', function () {
      const publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36'
      const signature = '8a55a1e91fec53cf0c46db75572311f167300ca1d453edbc18dff372d1d44372100eef3acf8d64d39a0b5cdf79a3b3ba2617c16d1a245f50a48add336ec3b508'
      const CustomMessage = Exonum.newMessage({
        size: 18,
        network_id: 0,
        protocol_version: 0,
        service_id: 1,
        message_id: 2,
        fields: {
          name: { type: Exonum.String, size: 8, from: 0, to: 8 },
          age: { type: Exonum.Uint8, size: 1, from: 8, to: 9 },
          balance: { type: Exonum.Uint64, size: 8, from: 9, to: 17 },
          status: { type: Exonum.Bool, size: 1, from: 17, to: 18 }
        }
      })
      const messageData = {
        name: 'John Doe',
        age: 34,
        balance: 173008,
        status: true
      }

      expect(CustomMessage.verifySignature(signature, publicKey, messageData)).to.be.true
    })

    it('should verify signature of the array of 8-bit integers', function () {
      const publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36'
      const signature = '7ccad21d76359c8c3ed1161eb8231edd44a91d53ea468d23f8528e2985e5547f72f98ccc61d96ecad173bdc29627abbf6d46908807f6dd0a0d767ae3887d040e'
      const User = Exonum.newType({
        size: 16,
        fields: {
          firstName: { type: Exonum.String, size: 8, from: 0, to: 8 },
          lastName: { type: Exonum.String, size: 8, from: 8, to: 16 }
        }
      })
      const userData = {
        firstName: 'John',
        lastName: 'Doe'
      }
      const buffer = User.serialize(userData)

      expect(Exonum.verifySignature(signature, publicKey, buffer)).to.be.true
    })

    it('should verify signature of the array of 8-bit integers', function () {
      const publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36'
      const signature = '7ccad21d76359c8c3ed1161eb8231edd44a91d53ea468d23f8528e2985e5547f72f98ccc61d96ecad173bdc29627abbf6d46908807f6dd0a0d767ae3887d040b'
      const User = Exonum.newType({
        size: 16,
        fields: {
          firstName: { type: Exonum.String, size: 8, from: 0, to: 8 },
          lastName: { type: Exonum.String, size: 8, from: 8, to: 16 }
        }
      })
      const userData = {
        firstName: 'John',
        lastName: 'Doe'
      }
      const buffer = User.serialize(userData)

      expect(Exonum.verifySignature(signature, publicKey, buffer)).to.be.false
    })

    it('should throw error when the data parameter is of wrong NewType type', function () {
      const publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36'
      const signature = '9e0f0122c2963b76ba10842951cd1b67c8197b3f964c34f8b667aa655a7b4a8d844d567698d99de30590fc5002ddb4b9b5927ec05cd73572b972cb6b034cd40b'
      const User = Exonum.newType({
        size: 16,
        fields: {
          firstName: { type: Exonum.String, size: 8, from: 0, to: 8 },
          lastName: { type: Exonum.String, size: 8, from: 8, to: 16 }
        }
      })
      const userData = {
        sum: 500,
        hash: 'Hello world'
      }

      expect(() => Exonum.verifySignature(signature, publicKey, userData, User))
        .to.throw(TypeError, 'Field firstName is not defined.')
    })

    it('should throw error when the data parameter is of wrong NewMessage type', function () {
      const publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36'
      const signature = '24a5224702d670c95a78ef1f753c9e6e698da5b2a2c52dcc51b5bf9e556e717fb763b1a5e78bd39e5369a139ab68ae50dd19a129038e8da3af30985f09549500'
      const CustomMessage = Exonum.newMessage({
        size: 18,
        network_id: 0,
        protocol_version: 0,
        service_id: 1,
        message_id: 2,
        fields: {
          name: { type: Exonum.String, size: 8, from: 0, to: 8 },
          age: { type: Exonum.Uint8, size: 1, from: 8, to: 9 },
          balance: { type: Exonum.Uint64, size: 8, from: 9, to: 17 },
          status: { type: Exonum.Bool, size: 1, from: 17, to: 18 }
        }
      })
      const someData = {
        sum: 500,
        hash: 'Hello world'
      }

      expect(() => Exonum.verifySignature(signature, publicKey, someData, CustomMessage))
        .to.throw(TypeError, 'Field name is not defined.')
    })

    it('should throw error when the type parameter is of wrong type', function () {
      const publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36'
      const signature = '9e0f0122c2963b76ba10842951cd1b67c8197b3f964c34f8b667aa655a7b4a8d844d567698d99de30590fc5002ddb4b9b5927ec05cd73572b972cb6b034cd40b'
      const User = {
        alpha: 3
      }
      const userData = {
        sum: 500,
        hash: 'Hello world'
      }

      expect(() => Exonum.verifySignature(signature, publicKey, userData, User))
        .to.throw(TypeError, 'Wrong type of data.')
    })

    it('should throw error when the signature parameter is of wrong length', function () {
      const publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36'
      const signature = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36'
      const User = Exonum.newType({
        size: 16,
        fields: {
          firstName: { type: Exonum.String, size: 8, from: 0, to: 8 },
          lastName: { type: Exonum.String, size: 8, from: 8, to: 16 }
        }
      })
      const userData = {
        firstName: 'John',
        lastName: 'Doe'
      }
      const buffer = User.serialize(userData)

      expect(() => Exonum.verifySignature(signature, publicKey, buffer))
        .to.throw(TypeError, 'Signature of wrong type is passed. Hexadecimal expected.')
    })

    it('should throw error when the signature parameter is invalid', function () {
      const publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36'
      const signature = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7Z'
      const User = Exonum.newType({
        size: 16,
        fields: {
          firstName: { type: Exonum.String, size: 8, from: 0, to: 8 },
          lastName: { type: Exonum.String, size: 8, from: 8, to: 16 }
        }
      })
      const userData = {
        firstName: 'John',
        lastName: 'Doe'
      }
      const buffer = User.serialize(userData)

      expect(() => Exonum.verifySignature(signature, publicKey, buffer))
        .to.throw(TypeError, 'Signature of wrong type is passed. Hexadecimal expected.')
    })

    it('should throw error when the signature parameter is of wrong type', function () {
      const publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36'
      const User = Exonum.newType({
        size: 16,
        fields: {
          firstName: { type: Exonum.String, size: 8, from: 0, to: 8 },
          lastName: { type: Exonum.String, size: 8, from: 8, to: 16 }
        }
      })
      const userData = {
        firstName: 'John',
        lastName: 'Doe'
      }
      const buffer = User.serialize(userData);

      [true, null, undefined, [], {}, 51, new Date()].forEach(signature => {
        expect(() => Exonum.verifySignature(signature, publicKey, buffer))
          .to.throw(TypeError, 'Signature of wrong type is passed. Hexadecimal expected.')
      })
    })

    it('should throw error when the publicKey parameter is of wrong length', function () {
      const publicKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C'
      const signature = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C'
      const User = Exonum.newType({
        size: 16,
        fields: {
          firstName: { type: Exonum.String, size: 8, from: 0, to: 8 },
          lastName: { type: Exonum.String, size: 8, from: 8, to: 16 }
        }
      })
      const userData = {
        firstName: 'John',
        lastName: 'Doe'
      }
      const buffer = User.serialize(userData)

      expect(() => Exonum.verifySignature(signature, publicKey, buffer))
        .to.throw(TypeError, 'Signature of wrong type is passed. Hexadecimal expected.')
    })

    it('should throw error when the publicKey parameter is invalid', function () {
      const publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C3Z'
      const signature = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C'
      const User = Exonum.newType({
        size: 16,
        fields: {
          firstName: { type: Exonum.String, size: 8, from: 0, to: 8 },
          lastName: { type: Exonum.String, size: 8, from: 8, to: 16 }
        }
      })
      const userData = {
        firstName: 'John',
        lastName: 'Doe'
      }
      const buffer = User.serialize(userData)

      expect(() => Exonum.verifySignature(signature, publicKey, buffer))
        .to.throw(TypeError, 'Signature of wrong type is passed. Hexadecimal expected.')
    })

    it('should throw error when the publicKey parameter is of wrong type', function () {
      const signature = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C'
      const User = Exonum.newType({
        size: 16,
        fields: {
          firstName: { type: Exonum.String, size: 8, from: 0, to: 8 },
          lastName: { type: Exonum.String, size: 8, from: 8, to: 16 }
        }
      })
      const userData = {
        firstName: 'John',
        lastName: 'Doe'
      }
      const buffer = User.serialize(userData);

      [true, null, undefined, [], {}, 51, new Date()].forEach(function (publicKey) {
        expect(() => Exonum.verifySignature(signature, publicKey, buffer))
          .to.throw(TypeError, 'Signature of wrong type is passed. Hexadecimal expected.')
      })
    })
  })

  describe('Generate key pair', function () {
    it('should generate random key pair of secret and public keys, serialize it and return serialized array', function () {
      const Type = Exonum.newType({
        size: 96,
        fields: {
          publicKey: { type: Exonum.Hash, size: 32, from: 0, to: 32 },
          secretKey: { type: Exonum.Digest, size: 64, from: 32, to: 96 }
        }
      })
      const data = Exonum.keyPair()
      const buffer = Type.serialize(data)

      expect(buffer.length).to.equal(96)
    })
  })

  describe('Generate random Uint64', function () {
    it('should generate random value of Uint64 type, serialize and return serialized array', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { balance: { type: Exonum.Uint64, size: 8, from: 0, to: 8 } }
      })
      const data = { balance: Exonum.randomUint64() }
      const buffer = Type.serialize(data)

      expect(buffer.length).to.equal(8)
    })
  })
})
