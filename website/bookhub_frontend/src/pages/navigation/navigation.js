import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './navigation.css';
import Login from '../login/Login.js';
import Signup from '../signup/signup.js';
import Main from '../main/main.js';
import 'bootstrap/dist/css/bootstrap.min.css';

class Navigation extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/main" component={Main} />
        </Switch>
      </Router>
    );
  }
}
export default Navigation;
