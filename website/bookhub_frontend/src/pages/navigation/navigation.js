import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./navigation.css";
import Login from "../login/login.js";
import Signup from "../signup/signup.js";
import Main from "../main/main.js";
import Messages from "../messages/messages.js";
import Profile from "../profile/Profile.js";
import "bootstrap/dist/css/bootstrap.min.css";

class Navigation extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/main" component={Main} />
          <Route path="/messages" component={Messages} />
          <Route path="/profile" component={Profile} />
        </Switch>
      </Router>
    );
  }
}
export default Navigation;
