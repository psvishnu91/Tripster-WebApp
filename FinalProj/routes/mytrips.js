var express = require('express');
var router = express.Router();
var oracle = require('oracle');
var connectData = {
    hostname: "cis550.c9yomnhycrjl.us-west-2.rds.amazonaws.com",
    port: 1521,
    database: "TRIPSTER", // System ID (SID)
    user: "visp",
    password: "foreignkey99"
}
var tripid;
var admin;
/*get the mytrips page*/
router.get('/',function(req,res){

   admin = req.session.name;
   // console.log("\n\n\n\n\n\n\n\n----------------------------\n\n\nADMIN NAME");
   // console.log("\n\");
	//res.render('mytrips',{ title: 'My Trips'}); //the render is performed on mytrips.jade
	getdata(res);
    });

function getdata(res) {

oracle.connect(connectData, function(err, connection) {
    var myquery = "SELECT T.NAME AS NAME, T.ID AS ID FROM TRIPS T WHERE T.ADMIN='"+admin+"' " + "UNION SELECT T.NAME AS NAME , P.TRIP_ID AS ID FROM PARTICIPATES P "+
     "INNER JOIN TRIPS T ON P.TRIP_ID=T.ID WHERE P.USERNAME='"+admin+"'";
    if (err) { console.log("Error connecting to db:", err); return; }
    connection.execute(myquery, [], function(err,results) {
    	if(err) {console.log("Error executing query: ",err); return;}
    	console.log(results);
    	connection.close();
    	getMyTrips(res,results);
    });
});
}

function getMyTrips(res,results) {
	res.render('mytrips', { result: results, tid: tripid});
}

module.exports=router;