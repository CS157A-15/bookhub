const mysql  = require('mysql');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//sql connection
const connection = mysql.createConnection({
  host: 'localhost',
  user:'root',
  password: '!Salmonfoodie22',
  database:'cs157a'
});

connection.connect(function(err){
  (err)? console.log(err + '++++++++++++++++////////'):
  console.log('******connection ******');
  require('./routes/html-routes')(app,connection);
});

//added the Access-Control-Allow-Origin
app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next()
});
//GET request
require('./routes/html-routes')(app,connection);

//POST request for the database?
app.post('/users', function(req,res) {
  var user = req.body;
  var query = connection.query('INSERT INTO user SET ? ', user, function(err, reseult){

  });
  res.end("Success");
})

app.listen(3000, function(){
  console.log("Example app listening on port 3000!");
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/emp', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
,ju