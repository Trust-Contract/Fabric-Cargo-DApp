const mysql=require('mysql');
const helper = require('./helper')();
const cahelper =require('./cahelper')();
const config = require('./dbconfig');

module.exports = function(req,res){

    try{req.body = JSON.parse(Object.keys(req.body)[0])}catch(err){req.body = req.body}
    console.log(req.body);
    console.log('start register User');
    var userid=req.body.userid ,
            password=req.body.password,
            dcert=req.body.dcert,
            bnum=req.body.bnum,
            first_name =req.body.first_name,
            last_name=req.body.last_name,
            email=req.body.email,
            phone=req.body.phone,
            tel=req.body.tel,
            cnum=req.body.cnum,
            anum=req.body.anum,
            uname=req.body.uname;
    var flag = true;
    if(flag){
        var userid=req.body.userid ||  req.body.email,
        password=req.body.password,
        dcert=req.body.dcert || "000",
        bnum=req.body.bnum || "000",
        first_name =req.body.first_name,
        last_name=req.body.last_name,
        email=req.body.email,
        phone=req.body.phone || "000-0000-0000",
        tel=req.body.tel || "000-0000-0000",
        cnum=req.body.cnum || "000",
        anum=req.body.anum || "000",
        uname=req.body.uname || "000";
    }
  
    
            console.log(userid);
//   if(userid === undefined && userid.trim()=="" && password.trim()=="" ){
  if(email === undefined && email.trim()=="" && password.trim()=="" ){
        var result = {
            data:"[fail] arguments error"
        };
        res.json(result)
  }
    // if(userid!="" && password!="" && dcert!="" && bnum!="" && phone!="" && tel!="" && cnum!="" && anum!="" && uname!=""){
//mysql 회원db에 회원등록

    var connection = mysql.createConnection(config);
    var member = req.body;
  var member = {
 'id':email,
//  'id':userid,
 'pw':password,
 'first_name' : first_name,
 'last_name' : last_name,
 'email' : email,
 'dcert':dcert,
     'bnum':bnum,
     'phone':phone,
     'tel':tel,
     'cnum':cnum,
     'anum':anum,
     'uname':uname
  };

    // connection.connect();
    new Promise(function(resolve,reject){
        connection.query("SELECT * FROM users WHERE id= ? ", [userid], function(err, rows, fields){
            if(err) throw err;

            var dup = rows[0];
            if(dup!=undefined){
                        console.log('double-check fail');
                        reject();
            }else{
                console.log('double-check clear');
                resolve();
            }
        });
}).then(function(){
    //resolve호출시 (아이디 중복 없음)
    //mysql member Insert
    connection.query('INSERT INTO users set ?',member ,function(err, rows,fields){

        if(err) throw err;

        console.log('[mysql] member Insert success ');
        //fabric ca에 사용자 등록
        cahelper.registerCaUser(userid,password,handler.bind(this, res),errhandler.bind(this, res));
        connection.end();
    });//connection query end
}).catch((err)=>{
    connection.end();
    var result = {
        status : "error"
    };
    console.log("error");
    res.json(result);
});



    function handler(){
        console.log("ca user register complete");
        var result = {
            data:"ca user register complete"
        };
        var key = userid;
        var point = "1000";
        var tx_id;
        var user = "admin";

        const request = helper.getChaincodeRequest('cargo-app', tx_id, 'addPoint', 'mychannel', [key, point]); 
        // helper.transaction(request, txHandler, resHandler);
        helper.transaction(user,request, invokeHandler.bind(this, res));
        // res.json(result);
    }

    function errhandler(){
        console.log("ca user register failed");
        var result = {
            data : "ca user register failed"
        };
        res.json(result);
    }

    function invokeHandler(res, results, tx_id) {
        console.log('Send transaction promise and event listener promise have completed');
        // check the results in the order the promises were added to the promise all list
        function isAvailalbe(data, data_index, data_key, statement){
            if(data  && data[data_index] && data[data_index][data_key] === statement){
                return true;
            }
            return false;
        }
        if (isAvailalbe(results, 0, "status", "SUCCESS")) {
            // if (results && results[0] && results[0].status === 'SUCCESS') {
            console.log('Successfully sent transaction to the orderer.');
            // res.send(tx_id.getTransactionID());
        } else {
            // console.error('Failed to order the transaction. Error code: ' + response.status);
        }
    
        if(isAvailalbe(results, 1, "event_status", "VALID")) {
            // if(results && results[1] && results[1].event_status === 'VALID') {
            console.log('Successfully committed the change to the ledger by the peer');
            res.json({'tx_id' : tx_id.getTransactionID(), 'success' : true });
        } else {
            console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
            res.json({'success' : false });
        }
    }

}
