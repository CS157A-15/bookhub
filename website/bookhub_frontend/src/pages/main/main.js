import React, { Component } from 'react';
import './main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom';
import { Redirect } from 'react-router';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from 'mdbreact';
import Navbar from './navbar/navbar'



class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
            books:[],
            depts:[]
        }
    }

    componentDidMount(){
        this.getBooks();
        this.getDepartments();
      }

    getBooks = async _ => {
        await fetch('http://localhost:4000/books')
        .then(res => res.json())
        .then(res => this.setState({books: res.data}))
        .catch(err => console.error(err))
    }

    getDepartments = async _ => {
       await fetch('http://localhost:4000/department')
        .then(res => res.json())
        .then(res => this.setState({depts: res.data}))
        .catch(err => console.error(err))
    }

    renderDepartments = ({dept_name, chair, building}) =>
    <div key = {dept_name}>
        <li>
            <a >{dept_name}</a>
        </li>
    </div>


    
    renderBooks = ({list_id, title, edition, isbn, price,book_type,book_condition}) => 
        <div className="card-inline" key = {list_id}>
            <MDBCol>
            <MDBCard style={{ width: "17rem" }}>
                <MDBCardImage className="img-fluid" src="https://www.qualtrics.com/m/assets/blog/wp-content/uploads/2018/08/shutterstock_1068141515.jpg" waves />
                <MDBCardBody>
                <MDBCardTitle>{title}</MDBCardTitle>
                <MDBCardText>
                    Edition: {edition}, ISBN: {isbn}
                </MDBCardText>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item"> Book Type: {book_type}</li>
                    <li className="list-group-item"> Book Condition: {book_condition}</li>
                    <li className="list-group-item"> Price: ${price}</li>
                </ul>
                <MDBBtn class="btn btn-primary">Contact</MDBBtn>
                </MDBCardBody>
            </MDBCard>
            </MDBCol>
        </div>

    render(){
        return (
            <div class="wrapper">
                <nav id="sidebar" align="center">
                <div class="sidebar-header">
                    <img  class="center" width="100" height="100" src="https://upload.wikimedia.org/wikipedia/en/thumb/e/ec/San_Jose_State_Spartans_logo.svg/378px-San_Jose_State_Spartans_logo.svg.png" alt = "SJSU SAMMY"/>
                    <h3>Bookhub</h3>
                </div>
                <ul class="list-unstyled CTAs">
                    <li>
                        <button type="button" class="btn btn-light">Add Book</button>
                    </li>
                </ul>
                <ul class="list-unstyled components">
                    <p>Categories</p>
                    {this.state.depts.map(this.renderDepartments)}
                </ul>
            </nav>
    
            {/* <!-- Page Content  --> */}
            <div id="content">
               <Navbar/>
            <h1> Welcome to SJSU Bookhub, {this.props.location.state.username} </h1>
            <div className="card-inline">
                {this.state.books.map(this.renderBooks)}
            </div>
            </div>
        </div>
        );
    }
}

export default Main;
