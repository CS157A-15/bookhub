import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./navigation.css";
import Login from "../login/Login.js";
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
          <Route path="/signup" exact component={Signup} />
          <Route path="/Main" exact component={Main} />
          <Route path="/Messages" exact component={Messages} />
          <Route path="/Profile/:handle" exact component={Profile} />
        </Switch>
      </Router>
    );
  }
}
export default Navigation;
