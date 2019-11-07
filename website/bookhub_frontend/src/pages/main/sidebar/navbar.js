import React, { Component } from 'react';
import './node_modules/bootstrap/dist/css/bootstrap.min.css';
import './sidebar.css'
import {Link} from 'react-router-dom';
import { Redirect } from 'react-router';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from 'mdbreact';


class Sidebar extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }

    render(){
        return (
            <div class="wrapper">
                <nav id="sidebar">
                    <div class="sidebar-header">
                        <h3>Bookhub Sidebar</h3>
                    </div>
        
                    <ul class="list-unstyled components">
                        <p>Category</p>
                    <li className="selected">
                        <a href="#"></a>
                    </li>
                    <li>
                        <a href="#">About</a>
                    </li>
                    <li>
                        <a href="#">Portfolio</a>
                    </li>
                    <li>
                        <a href="#">Contact</a>
                    </li>
                </ul>
        
            </nav>
            <div id="content">
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                </nav>
            </div>
        </div>
        );
    }
}
export default Sidebar;