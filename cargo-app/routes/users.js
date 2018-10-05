const express = require('express');
const router = express.Router();
const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;

const controller = require('../controller.js');
const registeruser = require('../components/user');

// router.post('/login', passport.authenticate('local',{failureRedirect: '/login', failureFlash: true}
// ),function(req, res){
//   console.log('ID : '+ req.body.username);
//   console.log('******* signin *******');
//   res.json({success: true, msg: 'signin success'});
//   // res.redirect('/');
// });


// //로그인처리
router.post('/login', (req, res) => {
 controller.loginuser(req,res);
});

//로그아웃처리
router.get('/logout',(req,res) => {
  var sess=req.session;
  if(sess.userid){
	  console.log("logout user:"+sess.userid);
    req.session.destroy(function(err){
              if(err){
                  console.log(err);
              }else{
				  // console.log("logout success");
				  // var result={
					//   data:"logout success"
				  // }
                  // res.send(result);
                  res.redirect('/');
              }
          })
  }else{
    var result={
		data:"fail login please"
	}
    console.log("fail login please");
    res.send(result);
  }
});

//회원가입처리
router.post('/register',(req,res)=>{
  registeruser(req,res);
//  controller.registeruser(req,res);
});

router.get('/logininfo',(req,res)=>{
  console.log(req.user);
  sess=req.session;
  if(sess.userid){
    var info={
      userid:sess.userid,
      userobj:sess.userobj
    };
    res.json(info);
  }else{
    res.send("logininfo not found, login please!~");
  }
});

module.exports = router;
