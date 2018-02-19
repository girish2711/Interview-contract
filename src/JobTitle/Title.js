import React, { Component } from 'react';
import "./JobTitle.css"

const Title = (props) => {

 
    return (

        <div>
            <label className='inner-div'>
                <input  name="group"
                    type="radio"
                    className='checkmark'
                    value={props.indexValue}
                    key={props.name}
                    onChange={props.changed}
                />
                {props.name}
            </label>
        </div>
    )
}

export default Title;