import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Link, Redirect} from 'react-router-dom';
import Main from "./Main.js";
import Login from"./Login.js";

export default class App extends React.Component {
  state = {
    people: []
  }

  // componentDidMount() {
  //   fetch('http://localhost:3001')
  //   .then(response => response.json())
  //   .then(response =>{
  //     const emp = response.users
  //     this.setState({people: {emp}})
  //     })
  //   .catch(error => console.log(error));
  // }

  // showPeople = p => <div key={p.id}>{p.name}</div>
  

  render() {
  //   const peeps = this.state.people.emp;
  //   console.log(Array.isArray(peeps))
  //   if( Array.isArray(this.state.people.emp)) console.log(peeps[0].id)


  //  const printThisPlease = Array.isArray(this.state.people.emp)? (peeps.map(p => <div key={p.id}>{p.name}</div>) ):( <div></div>)

    return ( 
      <Router>
        <Route path="/Main" component={Main} />
        <Route path="/" component={Login} />
      </Router>
      // <div className= "App">
      //   <h1>testing</h1>
      //   {printThisPlease}
      // </div>
    );
  }
}
