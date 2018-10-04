'use strict';

var passport = require('passport');
var bcrypt = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;
const mysql=require('mysql');
const dbconfig = require('./components/dbconfig');


module.exports = () => {
  var conn = mysql.createConnection(dbconfig);
  /* 사용자 정보 세션 저장 */
  passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
    // console.log("serializeUser")
    done(null, user.id); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
  });

  passport.deserializeUser((id, done) => { // 매개변수 id는 req.session.passport.user에 저장된 값
    conn.query("SELECT pw FROM users WHERE id= ? ", id, function (err, rows){
        // console.log("deserial")
       done(err, rows[0]);
   });
  });

  passport.use('local', new LocalStrategy({

    useridField: 'userid',

    passwordField: 'password',

    session: true,

    passReqToCallback: true //passback entire req to call back

  } , function (req, userid, password, done){
        console.log(userid);
        if(!userid || !password ) { return done(null, false, req.flash('message','All fields are required.')); }

        const SEARCH ="select * from users where id = ?";
        conn.query(SEARCH, [userid], function(err, rows){

         console.log(rows);

          if (err) return done(req.flash('message',err) );

          if(!rows.length){
            console.log('*******  Invalid userid.');
            return done(null, false, req.flash('message','Invalid userid.') );
          }

          if(!bcrypt.compareSync(password, rows[0].pw)){
              console.log('*******  Invalid password.');
              return done(null, false,  req.flash('message','Invalid userid.'));
            }
            // conn.end();

          return done(null, rows[0]);

        });

      }

  ));
}