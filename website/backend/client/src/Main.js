import React, { Component } from 'react';
import './Main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar, Nav, Form, FormControl, Button} from 'react-bootstrap';
import Card from './Components/Card.js';

export default class Main extends Component {
    state = {
        listings:[]
    }
    //getting the data from the backend
    componentDidMount() {
        fetch('http://localhost:3001')
        .then(response => response.json())
        .then(response =>{
          const emp = response.users //change this based on the table name 
          this.setState({listings: {emp}})
          })
        .catch(error => console.log(error));
      }

    generateListingCards = () => {
        const listings = Array.isArray(this.state.listings)?(
            this.state.listings.map(l => { return <Card cardTitle={l.id}cardDescription={l.cardDescription}/>})):(<div></div>);
    }

    clearLogin = () => {
        document.getElementById("login").innerHTML = "";
    }
    render() {
        console.log("in main render");
        if(document.getElementById("login")){this.clearLogin();}
        return(
            <div>
                <Navbar bg="primary" variant="dark">
                    <Navbar.Brand href="#Main">BookHub</Navbar.Brand>
                    <Nav className="mr-auto">
                        {/* buttons for the Nav bar will got here  
                         here is an example:
                         <Nav.Link href="#home">Home</Nav.Link>
                         */}
                    </Nav>   
                    <Form inline>
                         <FormControl type="text" placeholder="Search" style={{width: "370px"}} className="mr-sm-2"/>
                         <Button variant="outline-light">Search</Button>
                    </Form>            
                </Navbar>
                {this.generateListingCards}
            </div>
        )
    }
}