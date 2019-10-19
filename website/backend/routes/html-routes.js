const path = require('path');

const mysql = require('mysql');

module.exports =  function (app, connection) {
    app.get('/', function(red, res) {
        connection.query('SELECT * FROM cs157s.emp', function(err, data) {
            (err)? res.send(err): res.json({users: data});
        });
    });
}