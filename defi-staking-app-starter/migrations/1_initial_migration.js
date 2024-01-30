// import our contract
const Migrations = artifacts.require("Migrations");

// deployer: used to deploy smart contracts
// deploy: function provided by deployer
module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
