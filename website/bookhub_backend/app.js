const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors')

var SELECT_BOOKS_QUERY = 'SELECT * FROM BOOKS';

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
    db.query(SELECT_BOOKS_QUERY, (err, results) =>{
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