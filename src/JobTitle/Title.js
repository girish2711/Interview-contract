import React, { Component } from 'react';
import "./JobTitle.css"

const Title = (props) => {
    return (

        <div>
            <label className={props.css}>
                <input  name={props.groupName}
                    type="radio"
                    className='checkmark'
                    value={props.name}
                    key={props.name}
                    onChange={props.changed}
                />
                {props.name}
            </label>
        </div>
    )
}

export default Title;