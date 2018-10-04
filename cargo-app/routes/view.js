var express = require('express');
var router = express.Router();
var controller = require('../controller.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
  });
  
router.get('/login',(req, res, next) => {
    // console.log("call login")
    res.render('login');
});

router.get('/signup',(req, res, next) => {
    res.render('sign-up');
});

  
// //로그인처리
// router.post('/logon', (req, res) => {
//  controller.loginuser(req,res);
// });

module.exports = router;

