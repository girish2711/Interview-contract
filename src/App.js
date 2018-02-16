import React, { Component } from 'react'
import TalioInterviewContract from '../build/contracts/Talio.json'
import Owner from './Owner/Owner.js'
import Candidate from './Candidate/Candidate.js'
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
        this.props.onPositionChangeCallBack(result.c[0]);
        return this.setState({ storageValue: result.c[0] })
      }).catch((err)=>{
        alert("Contract not live !");
      });
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

               instance.isTalioOwner.call({from:accounts[0]}).then((result) => {
                  console.log("Owner of the contract: " + result);

                  if (result) {
                      this.setState( {isHomePageForAll:false}, function(){
                      this.setState({isOwnerPage : true}, function() {            
                      })
                    });
                  } else {
                    alert("Only authorized accounts can use this feature");
                  }

                }).catch((err) => { 
                  console.log("Failed with error: " + err);
                  alert("This feature available only to owner of Talio");

              });

            }).catch((err) => {
              alert("Contract not live yet");
            });
          })
        } catch(err) {
          console.log("what happened here");
          alert("Only authorized accounts can use this feature");
          console.log(err);
        }
  }

  handleCandidateClick = (e) => {
    e.preventDefault();
    this.setState({
      isHomePageForAll : false,
      isInterviewerPage : true,
      isCandidatePage : false,
      isOwnerPage : false
     } );
  }

  handleInterviewerClick = (e) => {
    e.preventDefault();
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
        {this.state.isInterviewerPage ? this.renderCandidatePage() : null}
      </div>
    );
  }



  renderOwnerPage() {
    return (<Owner/>);
  }

  renderCandidatePage() {
    return(<Candidate />);
  }

}


export default App
