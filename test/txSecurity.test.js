import ether from 'openzeppelin-solidity/test/helpers/ether'
import EVMRevert from 'openzeppelin-solidity/test/helpers/EVMRevert'

const BigNumber = web3.BigNumber

const should = require('chai')
      .use(require('chai-as-promised'))
      .use(require('chai-bignumber')(BigNumber))
      .should()

const TxSecurity = artifacts.require('TxSecurity')

const user1Secret = web3.sha3('user1Secret')

contract('TxSecurity', function ([_, user1, user2, user3]) {
  beforeEach(async function () {
    this.TxSecurity = await TxSecurity.new()
  })
  describe('Init State: ', function () {
    it('transfer list should be empty', async function () {
      let length = await this.TxSecurity.getTransferListLen.call()
      length.should.be.bignumber.equal(new BigNumber(0))
    })
    it('user transfer list should be empty', async function () {
      let length = await this.TxSecurity.getUserTransferListLen.call(user1)
      length.should.be.bignumber.equal(new BigNumber(0))
    })
  })
  describe('Send: ', function () {
    it('basic send test', async function () {
      let tx = await this.TxSecurity.send(user2, user1Secret, {from: user1, value: 1000})
    })
  })
})
