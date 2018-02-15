import React, { Component } from 'react'
import App from './App.js'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class AppContainer extends Component {
    constructor(props) {
      super(props)
      this.state = {
        openPosition: 0
      }
    }
  
  
    render() {
      return (
        <div className="App">
          <nav className="navbar pure-menu pure-menu-horizontal">
              <a href="#" className="pure-menu-heading pure-menu-link">Talio hiring DApp</a>
          </nav>
          <main className="container">
            <div className="pure-g">
              <div className="pure-u-1-1">
                <h1>Smart contract example based on ethereum testnetwork!</h1>
                <h2>Current open posisitions are <strong>: {this.state.openPosition}</strong></h2>
                <App/>
              </div>
            </div>
          </main>
        </div>
      );
  
    }
  
  
  }
  
  
  export default AppContainer