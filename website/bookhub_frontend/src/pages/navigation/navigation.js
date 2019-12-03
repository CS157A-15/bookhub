import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./navigation.css";
import Login from "../login/login";
import Signup from "../signup/signup";
import Main from "../main/main";
import Messages from "../messages/messages";
import Profile from "../profile/Profile";
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
