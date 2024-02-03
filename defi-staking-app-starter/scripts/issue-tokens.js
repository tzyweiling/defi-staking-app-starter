//scripts that can use in truffle terminal , which can just essentilly issue the tokens
const DecentralBank = artifacts.require("DecentralBank");

//callback function: function that calls itself
module.exports = async function issueRewards(callback) {
  let decentralBank = await DecentralBank.deployed();
  await decentralBank.issueTokens();
  console.log("Tokens have been issued successfully");
  callback();
};

//truffle exec scripts/issue-tokens.js