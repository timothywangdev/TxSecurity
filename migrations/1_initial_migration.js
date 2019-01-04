var TxSecurity = artifacts.require("./TxSecurity.sol");

module.exports = function(deployer) {
  deployer.deploy(TxSecurity);
};
