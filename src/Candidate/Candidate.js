import React, { Component } from 'react';
import Title from '../JobTitle/Title';
import './Candidate.css';

class Candidate extends Component {

    state = {
        jobtypes: [
            'Android Developer',
            'iOS Developer',
            'Java Developer',
            'QA Automation',
        ],
        jobTitel: '',
        jobDesc: ''
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
        return (
            <div className='Candidate'>
                <h1> Candidate </h1>
                <div className='inner-div'>

                    {this.state.jobtypes.map((item, index) => {
                        return (
                            <Title
                                name={item}
                                changed={this.toggleCheckboxChange}
                                key={item} />
                        )
                    })}
                    <br />
                    <input className='textBox' type="text" placeholder='Candidate Name' />
                    <br />
                    <input className='textBox' type="text" placeholder='Candidate SSN' />
                    <br />
                </div>
                <button className='buttonStyle' onClick={this.handleSubmitClick}>Apply</button>
            </div>
        );
    }
}

export default Candidate;