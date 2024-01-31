import React, { Component } from "react";
import "./App.css";
import Navbar from "./NavBar";
import Web3 from "web3/dist/web3.min.js";

class App extends Component {
  //called immediately before mounting occurs
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
    console.log(account);
    //the account address in metamask will show in console
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
    };
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
      </div>
    );
  }
}

export default App;
