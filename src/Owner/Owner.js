import React, { Component } from 'react';
import Title from '../JobTitle/Title';
import './Owner.css';

class Owner extends Component {

  state = {
    showOpen: true,
    items: [
      'Software Engineer',
      'Senior Software Engineer',
      'Module Lead',
      'Tech Lead',
      'Senior Tech Lead'
    ],
    jobTitel:'',
    jobDesc:''
  }

  componentWillMount = () => {
    this.selectedCheckboxes = new Set();
  }

  handleOpenBtnClick = (e) => {
    e.preventDefault();
    this.setState({ showOpen: true })
  }

  handleCloseBtnClick = (e) => {
    e.preventDefault();
    this.setState({ showOpen: false })
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
    this.setState({jobDesc:event.target.value})
  }

  handleJobTitleChanges = (event) => {
    this.setState({jobTitel:event.target.value})
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
    if (this.state.showOpen) {
      containerTag = (
        <div>
          <input className='textBox' type="text" placeholder='Job Title' onChange={this.handleJobTitleChanges}/>
          <br />
          <br />
          <textarea className='textBox' rows="4" cols="50" placeholder='Job Description' onChange={this.handleJobDescriptionChanges}/>
          <br />
          <br />
          <button  className='buttonStyle' onClick={this.handleSubmitClick}>Submit</button>

        </div>
      );
    } else {

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
            <button  className='buttonStyle' onClick={this.handleOpenBtnClick}>Open</button>
            <button  className='buttonStyle' onClick={this.handleCloseBtnClick}>Close</button>
          </div>
          <br />
          {containerTag}
        </div>  
      </div>
    );
  }
}

export default Owner;