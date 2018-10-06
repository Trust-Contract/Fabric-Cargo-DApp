const mysql=require('mysql');
const helper = require('./components/helper')();
const cahelper =require('./components/cahelper');
// const config = require('./config');

var controller = function(){};
var invokeHandler = function(res, results, tx_id) {
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
		res.send(tx_id.getTransactionID());
	} else {
		console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
	}
}

var queryhandler = function(res, query_responses){
	// res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
		if (query_responses && query_responses.length == 1) {
			if (query_responses[0] instanceof Error) {
				console.error("error from query = ", query_responses[0]);
				res.send("ERROR")
				// 에러처리 귀찮...
			} else {
				console.log("test");
				console.log(query_responses[0].toString());
				console.log(query_responses);
				console.log("Response is ", query_responses[0].toString());
				res.send(query_responses[0].toString())
			}
		} else {
			console.log("No payloads were returned from query");
			res.send("ERROR")
		}
}


// controller.prototype.get_all_cargo = function(req, res){

// 	var tx_id = null;
// 	var user = req.session.userid;
	
// 	const request = helper.getChaincodeRequest('cargo-app', tx_id, 'queryAllCargo', 'mychannel', ['all']); 
// 	helper.query(user,request, handler);

// 	function handler(query_responses){
// 		// res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
// 		console.log("Query has completed, checking results");
// 		// query_responses could have more than one  results if there multiple peers were used as targets
// 		if (query_responses && query_responses.length == 1) {
// 			if (query_responses[0] instanceof Error) {
// 				console.error("error from query = ", query_responses[0]);
// 			} else {
// 				console.log(query_responses);
// 				console.log(query_responses[0].toString());
// 				console.log("Response is ", query_responses[0].toString());
// 				res.json(JSON.parse(query_responses[0].toString()));
// 			}
// 		} else {
// 			console.log("No payloads were returned from query");
// 		}
// 	}

// }

controller.prototype.get_cargo = function(req, res){
	var tx_id = null;
	var key = "CARGO" + new Date().toISOString().slice(0,10).replace(/-/g,"");
	// var key = req.params.id
	var user = "redtree0";
	// var user = req.session.userid;

	const request = helper.getChaincodeRequest('cargo-app', tx_id, 'queryMylist', 'mychannel', [user]); 
	// const request = helper.getChaincodeRequest('cargo-app', tx_id, 'queryCargo', 'mychannel', [key]); 

	helper.query("e",request, queryhandler.bind(this, res));

}

controller.prototype.add_cargo = function(req, res){
	console.log("submit recording of a Cargo: ");
	
		try{req.body = JSON.parse(Object.keys(req.body)[0])}catch(err){req.body = req.body}
		// console.log(req.body);
		var key =  (new Date().toISOString().slice(0,10).replace(/-/g,""));
		console.log(key);
		// var key = req.body.Key;
		var weight = String(req.body.weight);
		var registrant = req.body.Registrant;
        var driver = req.body.Driver;
        var date = (req.body.date).slice(0,10);
		var status = "YET";
		var distance = req.body.distance;
		var money = req.body.money;
		var tx_id = null;
		var user = req.session.userid;
	
		const request = helper.getChaincodeRequest('cargo-app', tx_id, 'createContract', 'mychannel', [key, weight, distance, money, date, registrant, driver,registrant, status]); 
		// helper.transaction(request, txHandler, resHandler);
		helper.transaction(user,request, invokeHandler.bind(this, res));
}

controller.prototype.change_status = function(req, res){
	
	try{req.body = JSON.parse(Object.keys(req.body)[0])}catch(err){req.body = req.body}
	console.log(req.body);
	// res.send("ok");
	var key = req.body.Key;
	var tx_Id_org = req.body.TxId;
	var status = req.body.Status;
	var user = req.session.userid;
	
	var tx_id;

	// helper.transaction(request, txHandler, resHandler);
	const request = helper.getChaincodeRequest('cargo-app', tx_id, 'changeStatus', 'mychannel', [key, tx_Id_org,status]); 

	helper.transaction(user,request, invokeHandler.bind(this, res));

}

controller.prototype.get_point = function(req, res){
	var tx_id = null;
	var key = req.session.userid;
		var user = req.session.userid;
	const request = helper.getChaincodeRequest('cargo-app', tx_id, 'queryPoint', 'mychannel', [key]); 

	helper.query(user,request, queryhandler.bind(this, res));

}

controller.prototype.add_point = function(req, res){
	// try{req.body = JSON.parse(Object.keys(req.body)[0])}catch(err){req.body = req.body}
	// console.log(req.body);
	var key = req.session.userid;
	var point = req.body.point;
		var tx_id;
		var user = req.session.userid;
	const request = helper.getChaincodeRequest('cargo-app', tx_id, 'addPoint', 'mychannel', [key, point]); 
	// helper.transaction(request, txHandler, resHandler);
	helper.transaction(user,request, invokeHandler.bind(this, res));

}
controller.prototype.subtract_point = function(req, res){
	
	try{req.body = JSON.parse(Object.keys(req.body)[0])}catch(err){req.body = req.body}
	// console.log(req.body);
	var key = req.session.userid;
	var point = req.body.point;
	var tx_id;
	var user = req.session.userid;
	const request = helper.getChaincodeRequest('cargo-app', tx_id, 'subtractPoint', 'mychannel', [key, point]); 
	// helper.transaction(request, txHandler, resHandler);
	helper.transaction(user,request,  invokeHandler.bind(this, res));

}

var dbconfig = require('./components/dbconfig');

controller.prototype.loginuser = function(req,res){
		try{req.body = JSON.parse(Object.keys(req.body)[0])}catch(err){req.body = req.body}
		console.log("loginuser start")
		var userid=req.body.userid,
		    password=req.body.password;

    if(userid!="" && password!=""){
			var conn = mysql.createConnection(dbconfig);

		conn.query("SELECT pw FROM users WHERE id='"+userid+"'",function(err,rows,fields){
			if(err) throw err;

			if(rows[0]===undefined){
				var result={
					data:"fail"
				}
				console.log("faile user not found");
				res.send(result);
			}

			if(password==rows[0].pw){
				console.log("auth success");
				cahelper.enrollCaUser(userid,password,handler,errhandler);
			}else{
				console.log("auth fail");
				var result={
					data:"fail"
				}
				res.send(result);
			}
		});
		conn.end();
			}else{
				console.log("[fail] arguments error");
				var result={
					data:"fail"
				}
					res.send(result);
		}

		function handler(user){
			console.log("handler");
			req.session.userid=userid;
			req.session.userobj=JSON.stringify(JSON.parse(user));
			console.log("user login sucess");
			var result = {
				data:"user login success"
			};
			// res.send(result);
			res.redirect("/");
		}

		function errhandler(err){
			console.log(err);
			var result={
				data:err
			}
			// res.send(result);
			return res.redirect("/login");
		}
	}//loginuser end



module.exports = new controller() ;
