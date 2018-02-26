import React, { Component } from 'react';
import Title from '../JobTitle/Title';
import './Candidate.css';

class Candidate extends Component {

    state = {
        candidateSSN: '',
        candidateName: '',
        selectedJob: ''

    }

    handleCandidateNameChanges = (event) => {
        this.setState({ candidateName: event.target.value })
    }

    handleCandidateSSNChanges = (event) => {
        this.setState({ candidateSSN: event.target.value })
    }


    handleRadioGroupSelection = (e) => {
        console.log(e.target.value)

        this.setState({
            selectedJob: e.target.value
        })

        console.log(this.state.selectedJob)
    }


    handleSubmitClick = event => {
        event.preventDefault();
        console.log('Candidate Info = ' + this.state.candidateName, this.state.candidateSSN, this.state.selectedJob);

    }


    render() {
        return (
            <div className='Candidate'>
                <h1> Candidate </h1>
                <div className='inner-div'>

                    {this.props.currentOpenPositions.map((item, index) => {
                        return (
                            <Title
                                groupName='jobType'
                                name={item} css='inner-div'
                                changed={this.handleRadioGroupSelection}
                                key={index} />
                        )
                    })}
                    <br />
                    <input className='textBox' type="text" placeholder='Candidate Name' onChange={this.handleCandidateNameChanges} />
                    <br />
                    <input className='textBox' type="text" placeholder='Candidate SSN' onChange={this.handleCandidateSSNChanges} />
                    <br />
                </div>
                <button className='buttonStyle' onClick={this.handleSubmitClick}>Apply</button>
            </div>
        );
    }
}

export default Candidate;