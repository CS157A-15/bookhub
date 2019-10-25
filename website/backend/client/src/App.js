import React from 'react';
import logo from './logo.svg';
import './App.css';

// const express = require('express');
// const bodyParser = require('body-parser');
// const mysql = require('mysql');

// const connection = mysql.createPool({
//   host     : 'localhost',
//   user     : 'root',
//   password : '!Salmonfoodie22',
//   database : 'cs157a'
// });

// const app = express();

// // Creating a GET route that returns data from the 'users' table.
// app.get('/emp', function (req, res) {
//     // Connecting to the database.
//     connection.getConnection(function (err, connection) {

//     // Executing the MySQL query (select all data from the 'users' table).
//     connection.query('SELECT * FROM emp', function (error, results, fields) {
//       // If some error occurs, we throw an error.
//       if (error) throw error;

//       // Getting the 'response' from the database and sending it to our route. This is were the data is.
//       res.send(results)
//     });
//   });
// });

// const querydata =  require('./routes/html-routes')(app,connection);


export default class App extends React.Component {
  state = {
    people: []
  }

  componentDidMount() {
    fetch('http://localhost:3001')
    // .then(response => console.log(response))
    // .then(({response}) => this.setState({people: 'emp'}))
    .then(response => response.json())
    .then(response =>{
      const emp = response.users
      this.setState({people: {emp}})
      })
    .catch(error => console.log(error));
  }

  showPeople = p => <div key={p.id}>{p.name}</div>
  

  render() {
    //console.log("peeps")
    console.log(((this.state !== [])? this.state.people.map(this.showPeople): undefined))
   // const peeps = this.state.people.response.users.map((p) => <div key={p.id}>{p.name}</div>);
    return (
 
      <div className= "App">
        <h1>testing</h1>
   
      </div>
    );
  }
}

// function App() {
//   state = {
//     people: []
//   }
//   // componentDidMount(){
//   //   this.getPeople();
//   // }
//   getPeople = _ => {
//     fetch('http://localhost:3001')
//     .then(response => console.log(response))
//     .then(({response}) => this.setState({people: 'response.people'}))
//     .catch(error => console.log(error));
//   }

//   showPeople = people.array.forEach(element => {
//     <div>element</div>
//   });

//   return (
//     <div className="App">
//       {/* <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header> */}
//       <h1>testing</h1>
//       {people.map(this.showPeople)}
//     </div>
//   );
// }

// export default App;
