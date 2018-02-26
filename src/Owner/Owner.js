import React, { Component } from 'react';
import Title from '../JobTitle/Title';
import './Owner.css';

class Owner extends Component {

  state = {
    jobtypes: [
      'iOS Software Engineer',
      'Android Software Engineer',
      'Java Lead position',
      'Blockchain Architect',
    ],
    jobTitel: '',
    jobDesc: '',
    selectedOption: 'create',
    interviewer: ''
  }

  getInitialState = function () {
    return {
      selectedOption: 'create',
      selectedCheckboxes: -1
    };

  }

  componentWillMount(){
    console.log("do you know what I am ");

  }


  handleOptionChange = (e) => {
    this.setState({
      selectedOption: e.target.value
    });

  }

  toggleCheckboxChange = (event) => {
      this.selectedCheckboxes = event.target.value;
  }

  handleJobDescriptionChanges = (event) => {
    this.setState({ jobDesc: event.target.value })
  }

  changeInterviewerAddress = (event) => {
    this.setState({interviewer: event.target.value});
  }


  handleOpenPosition = event => {
    //event.preventDefault();
    if (this.state.selectedOption === 'create') {
      if (this.selectedCheckboxes <0) {
        alert("Please select a job type");
      } else {
          this.props.onDappActions({action:1,value:0})
      }

    } else {
      console.log("junk is happenng");

      console.log(this.state.jobTitel + "  " + this.state.jobDesc);
    }
  }



  render() {
    let containerTag = null;
    if (this.state.selectedOption === 'create') {
      containerTag = (

        <div className='inner-div'>
          {this.state.jobtypes.map((item, index) => {
            return (
              <Title
                groupName='jobType'
                name={item}
                indexValue={index}
                changed={this.toggleCheckboxChange}
                key={index} />
            )
          })}
          <br />
          <textarea className='textBox' rows="4" cols="50" placeholder='Job Description' onChange={this.handleJobDescriptionChanges}/>
          <br />
          <button className='buttonStyle' onClick={this.handleOpenPosition}>Open a position</button>

        </div>
      );
    } else if (this.state.selectedOption === 'add') {
      containerTag = ( <div className='inner-div'>

      <input className='textBox' type="text" placeholder='Interviewer address' onChange={this.changeInterviewerAddress} />

   <br />
   <br />
   <button className='buttonStyle' onClick={this.handleSubmitClick}>Submit</button>
 </div>);
     

    } else { // Close section

      containerTag = (
        <div className='inner-div'>

          {this.props.currentOpenPositions.map((item, index) => {
            return (
              <Title
                groupName='jobType'
                name={item}
                changed={this.toggleCheckboxChange}
                key={index} />
            )
          })}

          <br />
          <br />
          <button className='buttonStyle' onClick={this.handleSubmitClick}>Submit</button>
        </div>
      )
    }

    return (
      <div className='Owner'>
        <br />
        <br />
        <div className='divContainer'>
        <div className='Owner'>

            <div>
              <div className="radio">
                <label>
                 <input type="radio" value="create"
                    checked={this.state.selectedOption === 'create'}
                    onChange={this.handleOptionChange} />
                  Create Openings
                </label>
            </div>
            <div className="radio">
              <label>
                <input type="radio" value="close"
                  checked={this.state.selectedOption === 'close'}
                  onChange={this.handleOptionChange} />
                Close Openings
              </label>
           </div>
            <div className="radio">
              <label>
                <input type="radio" value="add"
                  checked={this.state.selectedOption === 'add'}
                  onChange={this.handleOptionChange} />
                Add interviewer
              </label>
           </div>
          </div>
          </div>
          <br />
          {containerTag}
        </div>
      </div>
    );
  }
}

export default Owner;