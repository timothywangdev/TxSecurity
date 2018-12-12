import ether from 'openzeppelin-solidity/test/helpers/ether'
import EVMRevert from 'openzeppelin-solidity/test/helpers/EVMRevert'

const BigNumber = web3.BigNumber

const should = require('chai')
      .use(require('chai-as-promised'))
      .use(require('chai-bignumber')(BigNumber))
      .should()

const TxSecurity = artifacts.require('TxSecurity')

contract('Basic Tests: ', function ([_, user1, user2, user3]) {
  beforeEach(async function () {
    this.TxSecurity = await TxSecurity.new()
  })
})
