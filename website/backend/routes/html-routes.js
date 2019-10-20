const path = require('path');

const mysql = require('mysql');

module.exports =  function (app, connection) {
    app.get('/emp', function(req, res) {
        connection.query('SELECT * FROM cs157a.emp;', function(err, data) {
            (err)? res.send(err): res.json({users: data});
        });
    });
}