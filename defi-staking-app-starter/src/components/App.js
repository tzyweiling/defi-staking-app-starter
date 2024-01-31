import React, { Component } from "react";
import "./App.css";
import Navbar from "./NavBar";
import Web3 from "web3/dist/web3.min.js";
import Tether from "../truffle_abis/Tether.json";
import RWD from "../truffle_abis/RWD.json";
import DecentralBank from "../truffle_abis/DecentralBank.json";

class App extends Component {
  //called immediately before mounting  occurs
  //component is considered unsafe by react, best practice using UNSAFE_
  //make sure metamask is load
  async UNSAFE_componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockChainData();
  }

  // function to load web3 (async function), connect the app to the blockchain
  async loadWeb3() {
    // if we detect ethereum in window
    if (window.ethereum) {
      // create a new instance of Web3 using the detected ethereum provider
      //allows the app to interact with the Ethereum blockchain
      window.web3 = new Web3(window.ethereum);
      try {
        // requests the user's permission to connect the app to their Ethereum accounts
        // using the recommended eth_requestAccounts method
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        // Handle error (user denied account access)
        console.error("User denied account access:", error);
      }
    } else if (window.web3) {
      // if no ethereum provider but web3 is present, create a new Web3 instance using the current provider
      window.web3 = new this.Web3(window.web3.currentProvider);
    } else {
      // if no ethereum provider or web3, show an alert indicating that no ethereum browser is detected
      window.alert("No ethereum browser detected! You can check out MetaMask!");
    }
  }

  async loadBlockChainData() {
    const web3 = window.web3;
    //get acc from blockchain data
    const account = await web3.eth.getAccounts();
    //set the state here to update the account
    //account[0], first acc address in the account variable
    this.setState({ account: account[0] });
    //the account address in metamask will show in console
    //console.log(account);

    //loading from which network, ganache is one of the ethereum network (network id:5777)
    //how do we set our network to 5777
    //// Get the network ID using web3.eth.net.getId()
    const networkID = await web3.eth.net.getId();
    //the network id 5777 will show in console log
    //console.log(networkID, "Network ID");
    //output: 5777 'Network ID'

    //load Tether contract
    //tetherData is an attempt to access the deployment information for the current network using the networkID as the key
    //tetherData should contain information about the Tether contract on the current network
    const tetherData = Tether.networks[networkID];
    //if the app find the tetherData loading
    //Common falsy values include false, null, undefined, 0, NaN, and an empty string ('')
    //Truthy values include non-empty strings, numbers other than 0, objects, arrays, and other non-falsy values
    if (tetherData) {
      //creates a contract instance named tether using the web3.eth.Contract constructor
      //requires the contract's ABI (Tether.abi) and the contract address (tetherData.address).
      //tether contract
      const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
      //setting the state to tether (object type)
      this.setState({ tether });

      //balance of the state of account
      //if grabbing through web3, require .methods, method have to run the call function
      let tetherBalance = await tether.methods
        .balanceOf(this.state.account)
        .call();
      //setting the state to tetherBalance
      this.setState({ tetherBalance: tetherBalance.toString() });
      //console.log({ tether_balance: tetherBalance });
      //output: {tether_balance: '100000000000000000000'}
    } else {
      window.alert("Error! Tether token not deployed - no detected network");
    }

    //load RWD contract
    const rwdData = RWD.networks[networkID];
    if (rwdData) {
      const rwd = new web3.eth.Contract(RWD.abi, rwdData.address);
      this.setState({ rwd });

      let rwdBalance = await rwd.methods.balanceOf(this.state.account).call();
      this.setState({ rwdBalance: rwdBalance.toString() });
      //console.log({ reward_balance: rwdBalance });
      //output: {reward_balance: '0'}
    } else {
      window.alert("Error! Reward token not deployed - no detected network");
    }

    //load DecentralBank contract
    const decentralBankData = DecentralBank.networks[networkID];
    if (decentralBankData) {
      const decentralBank = new web3.eth.Contract(
        DecentralBank.abi,
        decentralBankData.address
      );
      this.setState({ decentralBank });

      let stakingBalance = await decentralBank.methods
        .stakingBalance(this.state.account)
        .call();
      this.setState({ stakingBalance: stakingBalance.toString() });
      //console.log({ staking_balance: stakingBalance });
      //output: {staking_balance: '0'}
    } else {
      window.alert(
        "Error! Decentral Bank contract not deployed - no detected network"
      );
    }

    //change the state of loading after completing loading all contract
    this.setState({ loading: false });
  }

  //props: special feature/parameter in react, allow us to passover properties fromone component to another
  constructor(props) {
    super(props);
    //set our state
    // we have lot of state, so create an object and put all state in the object
    this.state = {
      //setup state
      account: "0x0",
      //send state as props to navbar, want acc info to appear in navbar
      //create a property called account in <Navbar>, then we hv applied state to account in navbar by passing it through props

      //initialize state for all contract and the balance of all contract (deposit, withdraw, issue token)
      //contarct is an object {}, initialize contarct as empty
      //intialize other state (except loading) as number value
      tether: {},
      rwd: {},
      decentralBank: {},
      tetherBalance: "0",
      rwdBalance: "0",
      stakingBalance: "0",
      loading: true,
    };
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div>
          <h1>{console.log(this.state.loading)}</h1>
        </div>
      </div>
    );
  }
}

export default App;
