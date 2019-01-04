import ether from 'openzeppelin-solidity/test/helpers/ether'
import EVMRevert from 'openzeppelin-solidity/test/helpers/EVMRevert'
import Web3 from 'web3'

const BigNumber = web3.BigNumber

const should = require('chai')
      .use(require('chai-as-promised'))
      .use(require('chai-bignumber')(BigNumber))
      .should()

const TxSecurity = artifacts.require('TxSecurity')

const user1Secret = web3.sha3('user1Secret')

const domain1 = 'domain1'
const domain2 = 'domain2'
const alias1 = 'alias1'
const alias2 = 'alias2'
const cryptoType1 = 'cryptoType1'
const cryptoType2 = 'cryptoType2'
const addr1 = 'addr1'
const addr2 = 'addr2'
const pin1 = 'pin1'
const pin2 = 'pin2'

contract('TxSecurity', function ([user1, user2, user3]) {
  beforeEach(async function () {
    this.TxSecurity = await TxSecurity.new()
  })
  describe('Init State: ', function () {
    it('owner should not exist and alias should be empty', async function () {
      let domainData = await this.TxSecurity.getDomain.call(web3.sha3(domain1))
      let owner = domainData[0]
      let alias = domainData[1]
      owner.should.be.equal('0x0000000000000000000000000000000000000000')
      alias.length.should.be.equal(0)
    })
  })
  describe('Domain operations: ', function () {
    it('register a domain', async function () {
      await this.TxSecurity.registerDomain(web3.sha3(domain1))
      let domainData = await this.TxSecurity.getDomain.call(web3.sha3(domain1))
      let owner = domainData[0]
      let alias = domainData[1]
      owner.should.be.equal(user1)
      alias.length.should.be.equal(0)
    })

    it('remove a domain', async function () {
      await this.TxSecurity.registerDomain(web3.sha3(domain1))
      await this.TxSecurity.removeDomain(web3.sha3(domain1))
      let domainData = await this.TxSecurity.getDomain.call(web3.sha3(domain1))
      let owner = domainData[0]
      let alias = domainData[1]
      owner.should.be.equal('0x0000000000000000000000000000000000000000')
      alias.length.should.be.equal(0)
    })
  })
  describe('Alias operations: ', function () {
    beforeEach(async function () {
      // register a domain
      await this.TxSecurity.registerDomain(web3.sha3(domain1))
    })

    it('add an alias', async function () {
      await this.TxSecurity.addAlias(web3.sha3(domain1), Web3.utils.asciiToHex(alias1), addr1, web3.fromAscii(cryptoType1), web3.fromAscii(pin1))

      let domainData = await this.TxSecurity.getDomain.call(web3.sha3(domain1))
      let owner = domainData[0]
      let alias = domainData[1]
      owner.should.be.equal(user1)
      alias.length.should.be.equal(1)
      let aliasDecoded = Web3.utils.hexToAscii(alias[0]).replace(/\0/g, '')
      aliasDecoded.should.be.equal(alias1)

      // check alias data
      let aliasData = await this.TxSecurity.getAliasData.call(web3.sha3(domain1), Web3.utils.asciiToHex(aliasDecoded))
      let addr = aliasData[0]
      let cryptoType = Web3.utils.hexToAscii(aliasData[1]).replace(/\0/g, '')
      let pin = Web3.utils.hexToAscii(aliasData[2]).replace(/\0/g, '')

      addr.should.be.equal(addr1)
      cryptoType.should.be.equal(cryptoType1)
      pin.should.be.equal(pin1)
    })

    it('add multiple alias', async function () {
      await this.TxSecurity.addAlias(web3.sha3(domain1), Web3.utils.asciiToHex(alias1), addr1, web3.fromAscii(cryptoType1), web3.fromAscii(pin1))
      await this.TxSecurity.addAlias(web3.sha3(domain1), Web3.utils.asciiToHex(alias2), addr2, web3.fromAscii(cryptoType2), web3.fromAscii(pin2))

      let domainData = await this.TxSecurity.getDomain.call(web3.sha3(domain1))
      let owner = domainData[0]
      let alias = domainData[1]
      owner.should.be.equal(user1)
      alias.length.should.be.equal(2)

      let aliasDecoded1 = Web3.utils.hexToAscii(alias[0]).replace(/\0/g, '')
      aliasDecoded1.should.be.equal(alias1)

      let aliasDecoded2 = Web3.utils.hexToAscii(alias[1]).replace(/\0/g, '')
      aliasDecoded2.should.be.equal(alias2)

      // check alias data
      let aliasData = await this.TxSecurity.getAliasData.call(web3.sha3(domain1), Web3.utils.asciiToHex(aliasDecoded1))
      let addr = aliasData[0]
      let cryptoType = Web3.utils.hexToAscii(aliasData[1]).replace(/\0/g, '')
      let pin = Web3.utils.hexToAscii(aliasData[2]).replace(/\0/g, '')

      addr.should.be.equal(addr1)
      cryptoType.should.be.equal(cryptoType1)
      pin.should.be.equal(pin1)

      // check alias data
      aliasData = await this.TxSecurity.getAliasData.call(web3.sha3(domain1), Web3.utils.asciiToHex(aliasDecoded2))
      addr = aliasData[0]
      cryptoType = Web3.utils.hexToAscii(aliasData[1]).replace(/\0/g, '')
      pin = Web3.utils.hexToAscii(aliasData[2]).replace(/\0/g, '')

      addr.should.be.equal(addr2)
      cryptoType.should.be.equal(cryptoType2)
      pin.should.be.equal(pin2)
    })

    it('add multiple alias then remove the second', async function () {
      await this.TxSecurity.addAlias(web3.sha3(domain1), Web3.utils.asciiToHex(alias1), addr1, web3.fromAscii(cryptoType1), web3.fromAscii(pin1))
      await this.TxSecurity.addAlias(web3.sha3(domain1), Web3.utils.asciiToHex(alias2), addr2, web3.fromAscii(cryptoType2), web3.fromAscii(pin2))
      await this.TxSecurity.addAlias(web3.sha3(domain1), Web3.utils.asciiToHex(alias2), '', '0x0', '0x0')

      let domainData = await this.TxSecurity.getDomain.call(web3.sha3(domain1))
      let alias = domainData[1]
      alias.length.should.be.equal(1)

      let aliasDecoded1 = Web3.utils.hexToAscii(alias[0]).replace(/\0/g, '')
      aliasDecoded1.should.be.equal(alias1)
    })

    it('add multiple alias then remove the first', async function () {
      await this.TxSecurity.addAlias(web3.sha3(domain1), Web3.utils.asciiToHex(alias1), addr1, web3.fromAscii(cryptoType1), web3.fromAscii(pin1))
      await this.TxSecurity.addAlias(web3.sha3(domain1), Web3.utils.asciiToHex(alias2), addr2, web3.fromAscii(cryptoType2), web3.fromAscii(pin2))
      await this.TxSecurity.addAlias(web3.sha3(domain1), Web3.utils.asciiToHex(alias1), '', '0x0', '0x0')

      let domainData = await this.TxSecurity.getDomain.call(web3.sha3(domain1))
      let alias = domainData[1]
      alias.length.should.be.equal(1)

      let aliasDecoded1 = Web3.utils.hexToAscii(alias[0]).replace(/\0/g, '')
      aliasDecoded1.should.be.equal(alias2)
    })

    it('add multiple alias then remove all', async function () {
      await this.TxSecurity.addAlias(web3.sha3(domain1), Web3.utils.asciiToHex(alias1), addr1, web3.fromAscii(cryptoType1), web3.fromAscii(pin1))
      await this.TxSecurity.addAlias(web3.sha3(domain1), Web3.utils.asciiToHex(alias2), addr2, web3.fromAscii(cryptoType2), web3.fromAscii(pin2))
      await this.TxSecurity.addAlias(web3.sha3(domain1), Web3.utils.asciiToHex(alias1), '', '0x0', '0x0')
      await this.TxSecurity.addAlias(web3.sha3(domain1), Web3.utils.asciiToHex(alias2), '', '0x0', '0x0')

      let domainData = await this.TxSecurity.getDomain.call(web3.sha3(domain1))
      let alias = domainData[1]
      alias.length.should.be.equal(0)
    })
  })
})
