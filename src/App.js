import React, { Component } from 'react'
import TalioInterviewContract from '../build/contracts/Talio.json'
import Owner from './Owner/Owner.js'
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
      web3: null,
      isHomePageForAll : true,
      isOwnerPage : false,
      isCandidatePage : false,
      isInterviewerPage : false
    }

  }

  componentWillMount() {

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
    this.setState( {isHomePageForAll:false}, function(){
      this.setState({isOwnerPage : true}, function() {

      })
    });
    //this.context.router.push(`/owner`);
  }

  handleInterviewerClick = (e) => {
    e.preventDefault();
    alert('Interviewer Button Clicked!')

    //this.context.router.push(`/owner`);
  }

  render() {
    var homePageComp = (
      <div>
              <button className='buttonStyle'
                  onClick={this.handleOwnerClick}>Manager</button>
              <button className='buttonStyle'
                  onClick={this.handleCandidateClick}>Candidate</button>
              <button className='buttonStyle'
                onClick={this.handleInterviewerClick}>Interviewer</button>
       </div>
    );

    return (
      <div>
        { this.state.isHomePageForAll ? homePageComp : null }
        { this.state.isOwnerPage ? this.renderOwnerPage() : null }
      </div>
    );
  }



  renderOwnerPage() {
    return (<Owner/>);
  }


}


export default App
