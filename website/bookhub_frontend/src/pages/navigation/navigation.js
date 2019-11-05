import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './navigation.css';
import Login from '../login/login';
import Signup from '../signup/signup'
import Main from '../main/main'
import 'bootstrap/dist/css/bootstrap.min.css';

class Navigation extends Component {

    render(){
        return(
            <Router>
                <Switch>
                    <Route path = "/" exact component = {Login}/>
                    <Route path = "/signup" component = {Signup}/>
                    <Route path = "/main" component = {Main}/>
                </Switch>
            </Router>
        );
    }
}
export default Navigation;