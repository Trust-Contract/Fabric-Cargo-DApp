var config = require('./config');
var mysql = require('mysql');

console.log(config);
var conn = mysql.createConnection(config);
//     host : 'localhost',
//     user : 'root',
//     password : 'root',
//     port:3306,
//     database : 'blockchain'});
var userid = "Test";
conn.query("SELECT pw FROM users WHERE id='"+userid+"'",function(err,rows,fields){
    if(err) throw err;
    console.log(rows);
    console.log(fields);

    conn.end();
});