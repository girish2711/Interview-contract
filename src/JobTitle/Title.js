import React, { Component } from 'react';
import "./JobTitle.css"

const Title = (props) => {
    return (
        <div>
            <label className='inner-div'>
                <input type="label"
                    type="checkbox"
                    className='checkmark'
                    value={props.name}
                    key={props.name}
                    onChange={props.changed}
                />
                {props.name}
               <br/>

            </label>
            <br />
        </div>
    )
}

export default Title;