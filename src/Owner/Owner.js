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
    selectedOption: 'create'
  }

  getInitialState = function () {
    return {
      selectedOption: 'create'
    };
  }

  componentWillMount = () => {
    this.selectedCheckboxes = new Set();
  }



  handleOptionChange = (e) => {
    this.setState({
      selectedOption: e.target.value
    });

  }

  toggleCheckboxChange = (event) => {
    console.log(event.target.value);
    if (this.selectedCheckboxes.has(event.target.value)) {
      this.selectedCheckboxes.delete(event.target.value);
    } else {
      this.selectedCheckboxes.add(event.target.value);
    }
  }

  handleJobDescriptionChanges = (event) => {
    this.setState({ jobDesc: event.target.value })
  }

  handleJobTitleChanges = (event) => {
    this.setState({ jobTitel: event.target.value })
  }


  handleSubmitClick = event => {
    event.preventDefault();
    console.log('showOpen = ' + this.state.showOpen);
    if (!this.state.showOpen) {
      for (const checkbox of this.selectedCheckboxes) {
        console.log(checkbox, 'is selected.');
      }
    } else {
      console.log(this.state.jobTitel + "  " + this.state.jobDesc);
    }
  }


  render() {
    let containerTag = null;
    if (this.state.selectedOption == 'create') {
      containerTag = (
        
          <div className='inner-div'>
            {this.state.jobtypes.map((item, index) => {
              return (
                <Title
                  name={item}
                  changed={this.toggleCheckboxChange}
                  key={item} />
              )
            })}
            </div>
      );
    } else if (this.state.selectedOption == 'add') {


    } else { // Close section

      containerTag = (
        <div className='inner-div'>

          {this.state.items.map((item, index) => {
            return (
              <Title
                name={item}
                changed={this.toggleCheckboxChange}
                key={item} />
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
          <br />
          {containerTag}
        </div>
      </div>
    );
  }
}

export default Owner;