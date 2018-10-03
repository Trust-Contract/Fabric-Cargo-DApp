var passport = require('passport');
var bcrypt = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;

module.exports = () => {
  /* 사용자 정보 세션 저장 */
  passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
    done(null, user.id); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
  });

  passport.deserializeUser((id, done) => { // 매개변수 id는 req.session.passport.user에 저장된 값
    connection.query("SELECT pw FROM users WHERE id= ? ", id, function (err, rows){
       done(err, rows[0]);
   });
  });

passport.use('local', new LocalStrategy({

  useridField: 'userid',

  passwordField: 'password',

  session: true,

  passReqToCallback: true //passback entire req to call back

} , function (req, userid, password, done){

      if(!userid || !password ) { return done(null, false, { 'message' : 'All fields are required.' }); }

      const SEARCH ="select * from customer_info where id = ?";
      connection.query(SEARCH, [userid], function(err, rows){

      //  console.log(rows);

        if (err) return done({ 'message' : err } );

        if(!rows.length){
          console.log('*******  Invalid userid.');
          return done(null, false, { 'message' : 'Invalid userid.' } );
        }

        if(!bcrypt.compareSync(password, rows[0].pw)){
            console.log('*******  Invalid password.');
            return done(null, false,  { 'message' : 'Invalid password.' });
          }

        return done(null, rows[0]);

      });

    }

));
}