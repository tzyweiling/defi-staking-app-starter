//deployemnt script

//import our contract
//used to load a deployed contract by its name
//returns a contract abstraction that can be interacted with in your JavaScript code
const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

//asynchronous function, takes a deployer as an argument
//deployer: used to deploy smart contracts
//deploy: fucntion provided by deployer
//await keyword is used to wait for the deployment to complete before moving on

//async: declare a function as asynchronous, always returns a Promise. It allows you to work with Promises in a more concise and readable manner
//await: used inside an async function to pause the execution and wait for the Promise to resolve before continuing

module.exports = async function(deployer, network, accounts) {
  //deploy mock Tether contract
  await deployer.deploy(Tether);
  //Retrieves the deployed instance of the contract
  const tether = await Tether.deployed();

  //deploy RWD contract
  await deployer.deploy(RWD);
  //Retrieves the deployed instance of the contract
  const rwd = await RWD.deployed();

  //deploy DecentralBank contract
  //passing the addresses of the deployed rwd and tether contracts as constructor arguments
  //establish connections between different contracts and enable them to interact with each other
  await deployer.deploy(DecentralBank, rwd.address, tether.address);
  const decentralBank = await DecentralBank.deployed();

  //transfer all reward token to decentral bank contract
  //await: wait for rwd.transfer to happen first before we proceed to anything else
  await rwd.transfer(decentralBank.address, "1000000000000000000000000");

  //distribute 100 Tether tokens to investors (2nd acc in ganache)
  await tether.transfer(accounts[1], "100000000000000000000");
};
