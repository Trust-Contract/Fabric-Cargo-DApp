var express = require('express');
var router = express.Router();
var controller = require('../controller.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.userid){
        res.render('index', { session : true});
    }else{
        res.render('index', { session : false});
    }
  });
  
router.get('/login',(req, res, next) => {
    if(req.session.userid){
        res.render('login', { session : true});
    }else{
        res.render('login', { session : false});
    }
});

router.get('/signup',(req, res, next) => {
    res.render('sign-up');
});

router.get('/history',(req, res, next) => {
    res.render('history');
});


router.get('/online-booking',(req, res, next) => {
    if(req.session.userid){
        res.render('online-booking', { session : true});
    }else{
        res.redirect('/');
    }
});


router.get('/standard-fare',(req, res, next) => {
    if(req.session.userid){
        res.render('standard-fare', { session : true});
    }else{
        res.redirect('/');
    }
});


// //로그인처리
// router.post('/logon', (req, res) => {
//  controller.loginuser(req,res);
// });

module.exports = router;

