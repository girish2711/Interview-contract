import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import  Switch  from 'react-router'


import './index.css';

import App from './App';
import Owner from './Owner/Owner';

ReactDOM.render( (
<Router>
  <div>
      <Route exact path="/" component={App} />
      <Route  path="/Owner" component={Owner} />
  </div>
</Router>), document.getElementById('root'));
