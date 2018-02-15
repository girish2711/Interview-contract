import React, { Component } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom';
import TalioInterviewContract from '../build/contracts/Talio.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const  TalioInterview = contract(TalioInterviewContract)
    TalioInterview.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var talioInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      TalioInterview.deployed().then((instance) => {
        talioInstance = instance
        return talioInstance.readMaxOpenings.call(accounts[0])
      }).then((result) => {
        return this.setState({ storageValue: result.c[0] })
      })
    })
  }


  handleOwnerClick = (e) => {
    e.preventDefault();

    const contract = require('truffle-contract')
    const  TalioInterview = contract(TalioInterviewContract)
    TalioInterview.setProvider(this.state.web3.currentProvider)


    try {
          this.state.web3.eth.getAccounts((error, accounts) => {
            TalioInterview.deployed().then((instance) => {
              return instance.isTalioOwner.call(accounts[0])
            }).then((result) => {
              this.context.router.push(`./Owner/Owner.js`);
              return this.setState({ storageValue: result.c[0] })
            })
          })
        } catch(err) {
          alert("Only authorized accounts can use this feature");
          console.log(err);
        }
  }

  handleCandidateClick = (e) => {
    e.preventDefault();
    Router.push(`./Owner`);
    //this.context.router.push(`/owner`);
  }

  handleInterviewerClick = (e) => {
    e.preventDefault();
    alert('Interviewer Button Clicked!')

    //this.context.router.push(`/owner`);
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Talio hiring DApp</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Smart contract example based on ethereum testnetwork!</h1>
              <h2>Current open posisitions are <strong>: {this.state.storageValue}</strong></h2>
              <br></br>
              <br></br>
              <button className='buttonStyle'
                  onClick={this.handleOwnerClick}>Manager</button>
              <button className='buttonStyle'
                  onClick={this.handleCandidateClick}>Candidate</button>
              <button className='buttonStyle'
                onClick={this.handleInterviewerClick}>Interviewer</button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}


export default App
