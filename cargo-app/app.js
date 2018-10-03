const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
//body-parser
const bodyParser = require('body-parser');
//
const logger = require('morgan');
const passport = require('passport');

const passportConfig = require('./passport');
const dappRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const viewsRouter = require('./routes/view');

const app = express();
//session
const mysql=require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
//

app.use(passport.initialize()); // passport 구동
app.use(passport.session()); // 세션 연결
passportConfig();

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
