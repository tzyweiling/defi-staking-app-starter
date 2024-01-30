const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

//required library
require("chai")
  .use(require("chai-as-promised"))
  .should();

//name of the contract being tested, takes the accounts array as a parameter
//contract("DecentralBank", (accounts) => {
contract("DecentralBank", ([owner, customer]) => {
  let tether, rwd, decentralBank;

  //number parameter is expected to be a numeric value representing the amount of tokens
  function tokens(number) {
    return web3.utils.toWei(number, "ether");
  }

  //any code add to before for testing will run first before anything
  //code inside this block contains asynchronous operations
  //test framework should wait for these operations to complete before proceeding with the tests
  before(async () => {
    //load contract
    tether = await Tether.new(); //.new(): to deploy a new instance of a contract
    rwd = await RWD.new();
    decentralBank = await DecentralBank.new(rwd.address, tether.address);

    //transfer all reward token to decentral bank
    await rwd.transfer(decentralBank.address, tokens("1000000"));

    //distribute 100 Tether tokens to investors (2nd acc in ganache)
    await tether.transfer(customer, tokens("100"), {
      from: owner,
    });
  });

  //first parameter is a description or label for the test suite
  //second parameter is a function that contains the actual test cases
  describe("Mock Tether Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await tether.name();
      assert.equal(name, "Mock Tether Token");
    });
  });

  describe("Reward Token Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await rwd.name();
      assert.equal(name, "Reward Token");
    });
  });

  describe("Decentral Bank Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await decentralBank.name();
      assert.equal(name, "Decentral Bank");
    });

    it("contract has reward tokens", async () => {
      //balance of rewards in the decentral bank contract
      let balance = await rwd.balanceOf(decentralBank.address);
      assert.equal(balance, tokens("1000000"));
    });
  });

  describe("Yield Farming", async () => {
    it("rewards tokens for staking", async () => {
      let result;

      //check investor balance
      result = await tether.balanceOf(customer);
      assert.equal(
        result.toString(),
        tokens("100"),
        "customer mock tether balance before staking"
      );

      //check staking for customer of 100 tokens, deposit into bank
      //hv to run approval first before deposit cuz transferFrom function
      //The { from: customer } part is specifying that the transaction should be sent from the Ethereum address represented by the variable customer
      await tether.approve(decentralBank.address, tokens("100"), {
        from: customer,
      });
      await decentralBank.depositTokens(tokens("100"), { from: customer });

      //check updated balance of customer
      result = await tether.balanceOf(customer);
      assert.equal(
        result.toString(),
        tokens("0"),
        "customer mock tether balance after staking 100 tokens"
      );

      //check updated balance of decentral bank
      result = await tether.balanceOf(decentralBank.address);
      assert.equal(
        result.toString(),
        tokens("100"),
        "Decentral bank mock tether balance after staking from customer"
      );

      //is staking update
      result = await decentralBank.isStaking(customer);
      assert.equal(
        result.toString(),
        "true",
        "customer is staking status after staking"
      );

      //issue tokens from owner
      await decentralBank.issueTokens({ from: owner });

      //ensure only the owner can issue token issue tokens
      await decentralBank.issueTokens({ from: customer }).should.be.rejected;

      //unsatke token
      await decentralBank.unstakeTokens({ from: customer });

      //check unstaking balances
      result = await tether.balanceOf(customer);
      assert.equal(
        result.toString(),
        tokens("100"),
        "customer mock tether balance after unstaking"
      );

      //check updated balance of decentral bank
      result = await tether.balanceOf(decentralBank.address);
      assert.equal(
        result.toString(),
        tokens("0"),
        "Decentral bank mock tether balance after unstaking from customer"
      );

      //is staking update
      result = await decentralBank.isStaking(customer);
      assert.equal(
        result.toString(),
        "false",
        "customer is no longer staking after unstaking"
      );

    });
  });
});
