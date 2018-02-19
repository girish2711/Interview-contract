import React, { Component } from 'react';
import Title from '../JobTitle/Title';
import '../Candidate/Candidate.css';

class Interviewer extends Component {

    state = {
        jobtypes: [
            'Android Developer',
            'iOS Developer',
            'Java Developer',
            'QA Automation',
        ],
        status: [
            'Accept',
            'Reject'

        ],
        selectedJob: '',
        selectionStatus: false
    }

    handleRadioGroupSelection = event => {
        console.log(event.target.value)
        this.setState({ selectedJob: event.target.value })
    }

    handleStatusRadioGroupSelection = event => {
        console.log(event.target.value)
        if (event.target.value === 'Accept') {
            this.setState({ selectionStatus: true })
        } else {
            this.setState({ selectionStatus: false })
        }

    }

    handleSubmitClick = event => {
        event.preventDefault();
        console.log(this.state.selectedJob, this.state.selectionStatus);
    }


    render() {
        return (
            <div className='Candidate'>
                <h1> Schedules  </h1>
                <div className='inner-div'>

                    {this.state.jobtypes.map((item, index) => {
                        return (
                            <Title
                                groupName='jobType'
                                name={item} css='inner-div'
                                changed={this.handleRadioGroupSelection}
                                key={item} />
                        )
                    })}
                    <br />
                </div>
                <div className='div-horiz'>

                    <Title
                        groupName='status'
                        name='Accept' css='div-child-horiz'
                        changed={this.handleStatusRadioGroupSelection}
                        key='Accept' />
                    <Title
                        groupName='status'
                        name='Reject' css='div-child-horiz'
                        changed={this.handleStatusRadioGroupSelection}
                        key='Reject' />

                </div>
                <button className='buttonStyle' onClick={this.handleSubmitClick}>Submit</button>
            </div>
        );
    }
}

export default Interviewer;