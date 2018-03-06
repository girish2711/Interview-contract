import React, { Component } from 'react'
import TalioInterviewContract from '../build/contracts/Talio.json'
import Owner from './Owner/Owner.js'
import Candidate from './Candidate/Candidate.js'
import Interviewer from './Interviewer/Interviewer'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'


class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      isHomePageForAll : true,
      isOwnerPage : false,
      isCandidatePage : false,
      isInterviewerPage : false,
      openPositions : null
    }

  }

  componentWillMount() {

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
  
      this.instantiateContract();
      this.doWeb3Calls({action:4,value:0});
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
    const TalioInterview = contract(TalioInterviewContract)
    TalioInterview.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var talioInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      TalioInterview.deployed().then((instance) => {
        talioInstance = instance
        return talioInstance.readMaxOpenings.call(accounts[0])
      }).then((result) => {
        return this.props.onPositionChangeCallBack(result.c[0]);
      }).catch((err)=>{
        alert("Contract not live !");
      });
    })
  }

 
  handleOwnerClick = (e) => {
    e.preventDefault();

    const contract = require('truffle-contract')
    const TalioInterview = contract(TalioInterviewContract)
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
          alert("Only authorized accounts can use this feature");
          console.log(err);
        }
  }

  

  handleCandidateClick = (e) => {
    e.preventDefault();
    this.setState({
      isHomePageForAll : false,
      isInterviewerPage : false,
      isCandidatePage : true,
      isOwnerPage : false
     } );
  }

  handleInterviewerClick = (e) => {
    e.preventDefault();
    this.setState({
      isHomePageForAll : false,
      isInterviewerPage : true,
      isCandidatePage : false,
      isOwnerPage : false
     } );
  }

  handleHomButtonClick =(event) => {
    event.preventDefault();
    this.setState({
      isHomePageForAll : true,
      isInterviewerPage : false,
      isCandidatePage : false,
      isOwnerPage : false
     } );
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

    var homeButton = (
      <button className='buttonStyle' onClick={this.handleHomButtonClick}>Home</button>
    );

    return (
      <div>
       
        { this.state.isHomePageForAll ? homePageComp : homeButton }
        { this.state.isOwnerPage ? this.renderOwnerPage() : null }
        {this.state.isCandidatePage ? this.renderCandidatePage() : null}
        {this.state.isInterviewerPage ? this.renderInterviewerPage() : null}
      </div>
    );
  }

  

  doWeb3Calls = (value) => {

    const contract = require('truffle-contract')
    const TalioInterview = contract(TalioInterviewContract)
    TalioInterview.setProvider(this.state.web3.currentProvider)
    var talioInstance;

      this.state.web3.eth.getAccounts((error, accounts) => {
        TalioInterview.deployed().then((instance) => {
           talioInstance = instance;

          if (value.action === 1) {
            console.log("Position opening = " + parseInt(value.position));
            return talioInstance.openNewPosition(parseInt(value.position), {from:accounts[0]});
          } else if (value.action === 2) {
            // Add an interviwer
          } else if (value.action === 3) {
            // Close a position
          } else if (value.action === 4) {
            // Get open positions
            this.openPositions = new Array();
            return talioInstance.readMaxOpenings.call({from:accounts[0]});
          } else if (value.action === 5) {
            // Check if he is an interviewer
            return talioInstance.readMaxOpenings.call({from:accounts[0]});
          }
            
        }).then((result) => {
           console.log(result);

          if (value.action === 1) {
            talioInstance.readMaxOpenings.call({from:accounts[0]}).then(function(op){
            //  this.props.onPositionChangeCallBack(result.c[0]);
            });
          } else if (value.action === 2) {
            // Add an interviwer
          } else if (value.action === 3) {
            // Close a position
          } else if (value.action === 4) {
            // Get open positions
            for(var i = 0; i < result.c[0]; i++) {
               talioInstance.readJobDetails.call(i,{from:accounts[0]})
              .then((positions) => {
                var jobType = parseInt(positions["0"]);
                var isPositionOpen = positions["1"];

                if (isPositionOpen === false) {
                  var jobDescription = "iOS Software engineer";
                  i = positions["3"];
                  var jobid = 12001 + parseInt(i);

                  if (jobType === 1) {
                    jobDescription = "Android Software engineer";
                  } else if (jobType === 2) {
                    jobDescription = "Java Lead engineer";
                  } else if (jobType === 3) {
                    jobDescription = "Blockchain Architect";
                  }
                  this.openPositions.push(jobid + " " + jobDescription);
                }
               
              }).catch((err) => {
                 console.log("there is some error")
              });
            }
          } else if (value.action == 5) {
            // Read all open details
            this.openPositions = new Array();
            for(var i = 0; i < result.c[0]; i++) {
              talioInstance.readJobDetails.call(i,{from:accounts[0]})
              .then((positions) => {
               this.openPositions.push(positions["1"]);
              }).catch((err) => {
                 console.log("Could not read open job positions")
              });
            }
          }

        }).catch((err) =>{
          console.log("not working "+ err);
          alert("Failed: Please check permission. Only Talio manager can create openings");
        });
      });

  }


  renderOwnerPage() {
    return (<Owner onDappActions={this.doWeb3Calls} currentOpenPositions={this.openPositions}/>);
  }

  renderCandidatePage() {
    return(<Candidate onDappActions={this.doWeb3Calls} currentOpenPositions={this.openPositions}/>);
  }

  renderInterviewerPage() {
    return(<Interviewer />);
  }

}


export default App
