import React, { Component } from 'react';
import './signup.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom';
import { Redirect } from 'react-router';

class Signup extends Component {
    constructor(props){
        super(props);
        this.state = {
            redirect: false,
            user:{
                username: '',
                email: '',
                password: ''
            }   
        }
    }
   
    signUp = _=>{
        fetch(`http://localhost:4000/addUser?username=${this.state.user.username}&email=${this.state.user.email}&password=${this.state.user.password}`)
            .catch(err => console.err(err))
        this.setState({redirect:true});
    }

    render(){
        const {user} = this.state;
        if (this.state.redirect) {
            return <Redirect push to="/" />;
        }

        return (
        <div>
            <div className = "logo rounded mx-auto d-block">
                <img width="200" height="200" src="https://upload.wikimedia.org/wikipedia/en/thumb/e/ec/San_Jose_State_Spartans_logo.svg/378px-San_Jose_State_Spartans_logo.svg.png"
                alt = "SJSU SAMMY"/>
            <p className="h3 mb-3 text-center font-weight-bold">SJSU Bookhub</p>
            <h1 className="text-center h4 mb-3 font-weight-normal">Sign Up</h1>
            <label htmlFor="inputPassword" className="sr-only">Username</label>
            <input type="name" id="inputPassword" className="form-control" 
                onChange={e =>this.setState({user:{...user,username: e.target.value}})} placeholder="Username" required autoFocus></input>
            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <input type="email" id="inputEmail" className="form-control" onChange={e =>this.setState({user:{...user,email: e.target.value}})} placeholder="Email address" required></input>
            <label htmlFor="inputPassword" className="sr-only">Password</label>
            <input type="password" id="inputPassword" className="form-control" onChange={e =>this.setState({user:{...user,password: e.target.value}})} placeholder="Password" required></input>
            <br/>
            <button className="btn btn-lg btn-primary btn-block" onClick={this.signUp} type="submit">Sign Up</button>
            <div className="mb-3">
                Already have an account? &nbsp;
                <Link to="/">
                Sign in
                </Link>
            </div>
            <p className="mt-5 mb-3 text-muted">&copy; SJSU 2019</p>
            </div>
        </div>
        );
    }
}

export default Signup;
