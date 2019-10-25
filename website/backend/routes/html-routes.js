const path = require('path');

const mysql = require('mysql');

module.exports =  function (app, connection) {

    app.get('/', function(req, res,next) {
        console.log("in funct");
        connection.query('SELECT * FROM cs157a.emp;', function(err, data) {
            console.log("in query");
            (err)? res.send(err): res.json({users: data});
        });
    });
}