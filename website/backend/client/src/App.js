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

  // showPeople = p => <div key={p.id}>{p.name}</div>
  

  render() {
      
    return ( 
      <div className= "App">
        <h1>testing</h1>

      </div>
    );
  }
}
