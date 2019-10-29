import React from 'react';
import logo from './logo.svg';
import './App.css';


export default class App extends React.Component {
  state = {
    people: []
  }

  componentDidMount() {
    fetch('http://localhost:3001')
    .then(response => response.json())
    .then(response =>{
      const emp = response.users
      this.setState({people: {emp}})
      })
    .catch(error => console.log(error));
  }

  showPeople = p => <div key={p.id}>{p.name}</div>
  

  render() {
    const peeps = this.state.people.emp;
    console.log(Array.isArray(peeps))
    if( Array.isArray(this.state.people.emp)) console.log(peeps[0].id)


   const printThisPlease = Array.isArray(this.state.people.emp)? (peeps.map(p => <div key={p.id}>{p.name}</div>) ):( <div></div>)

    return ( 
      <div className= "App">
        <h1>testing</h1>
        {printThisPlease}
      </div>
    );
  }
}
