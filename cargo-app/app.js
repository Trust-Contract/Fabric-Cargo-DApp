var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
//body-parser
var bodyParser = require('body-parser');
//
var logger = require('morgan');

var dappRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var viewsRouter = require('./routes/view');

var app = express();
//session
var mysql=require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
//

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//
app.use(express.static(path.join(__dirname, 'public')));
//session
app.use(session({
   secret: '1234DSFs@adf1234!@#$asd',
   resave: false,
   saveUninitialized: true,
  //  store:new MySQLStore({
  //    host:'localhost',
  //    port:3306,
  //    user:'root',
  //    password:'konyang',
  //    database:'test'
  //  })
 }));
//

app.use('/', dappRouter);
app.use('/', usersRouter);
app.use('/', viewsRouter);

var port = process.env.PORT || 8000;

// Start the server and listen on port
app.listen(port,function(){
  console.log("HTTP Listen on port: " + port);
});
module.exports = app;
