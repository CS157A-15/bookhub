const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors')

// Create connection
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Maninderpal51',
    database : 'bookhub'
});

// Connect
db.connect((err) => {
    if(err){
        console.log(err);
    }
});

app.use(cors());


app.get('/', (req,res) => {
    res.send('go to /books to see books')
});

app.get('/books', (req, res) => {
    db.query('SELECT * FROM BOOKS', (err, results) =>{
        if(err){
            return res.send(err)
        }
        else {
            return res.json({
                data: results
            })
        }
    });
});

app.get('/courses', (req, res) => {
    db.query('SELECT * FROM courses', (err, results) =>{
        if(err){
            return res.send(err)
        }
        else {
            return res.json({
                data: results
            })
        }
    });
});

app.get('/department', (req, res) => {
    db.query('SELECT * FROM department', (err, results) =>{
        if(err){
            return res.send(err)
        }
        else {
            return res.json({
                data: results
            })
        }
    });
});

app.get('/addUser', (req, res) => {
    console.log("added a user")
    const {username,email, password} = req.query;
    const INSERT_USER_QUERY = `INSERT INTO users (email,username,password) VALUES( '${email}','${username}','${password}')`;
    db.query(INSERT_USER_QUERY, (err, results) =>{
        if(err){
            return res.send(err)
        }
        else {
          return res.json({
              data: results
          })
        }
    });
});

app.get('/login', (req, res) => {
    const {email} = req.query;
    db.query(`SELECT * FROM users WHERE email = '${email}'`, (err, results) =>{
        if(err){
            return res.send(err)
        }
        else {
            return res.json({
                data: results
            })
        }
    });
});


app.get('/message_received', (req, res) => {
    const {email} = req.query;
    db.query(`SELECT content, date, sender.sender_email AS "received_from" FROM messages, sender where messages.message_id IN (SELECT message_id FROM receiver WHERE receiver_email = '${email}') AND messages.message_id = sender.message_id`, (err, results) =>{
        if(err){
            return res.send(err)
        }
        else {
            return res.json({
                data: results
            })
        }
    });
});

app.get('/message_sent', (req, res) => {
    const {email} = req.query;
    db.query(`SELECT content, date, receiver.receiver_email AS "sent_to" FROM messages, receiver where messages.message_id IN (SELECT message_id FROM sender WHERE sender_email = '${email}') AND messages.message_id = receiver.message_id`, (err, results) =>{
        if(err){
            return res.send(err)
        }
        else {
            return res.json({
                data: results
            })
        }
    });
});



app.listen('4000', () => {
    console.log('Server started on port 4000');
});