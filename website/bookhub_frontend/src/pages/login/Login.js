import React, { Component } from 'react';
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class Login extends Component {

  state ={
    books: []
  }

  componentDidMount(){
    this.getBooks();
  }
  getBooks = _ => {
    fetch('http://localhost:4000/books')
    .then(res => res.json())
    .then(res => this.setState({books: res.data}))
    .catch(err => console.error(err))

  }

  renderBooks = ({title, price}) => <div key = {title} > Name: {title}, Price: {price} </div>
  render(){
    const {books} = this.state;
    return (
      <div>
        <div className = "logo rounded mx-auto d-block">
            <img width="200" height="200" src="https://upload.wikimedia.org/wikipedia/en/thumb/e/ec/San_Jose_State_Spartans_logo.svg/378px-San_Jose_State_Spartans_logo.svg.png"
            alt = "SJSU SAMMY"/>
        <p className="h3 mb-3 text-center font-weight-bold">SJSU Bookhub</p>
        <link href="/docs/4.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous"/>
        <link href="signin.css" rel="stylesheet"></link>
        <form className="form-signin">
          <img className="mb-4" src="/docs/4.3/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72"/>
          <h1 className="text-center h4 mb-3 font-weight-normal">Sign In</h1>
          <label htmlFor="inputEmail" className="sr-only">Email address</label>
          <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required autoFocus></input>
          <label htmlFor="inputPassword" className="sr-only">Password</label>
          <input type="password" id="inputPassword" className="form-control" placeholder="Password" required></input>
          <div className="checkbox mb-3">
            <label>
              <input type="checkbox" value="remember-me"/> Remember me
            </label>
          </div>
          <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
          <div className="mb-3">
            Need an account? Sign up
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; SJSU 2019</p>
        </form>
        </div>
        {books.map(this.renderBooks)}
      </div>
    );
  }
}

export default Login;
