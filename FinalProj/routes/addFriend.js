var express = require('express');
var router = express.Router();

//Connect string to Oracle
var connectData = { 
		"hostname": "cis550.c9yomnhycrjl.us-west-2.rds.amazonaws.com", 
		"user": "visp", 
		"password": "foreignkey99", 
		"database": "TRIPSTER" };
var oracle =  require("oracle");

function query1(res, req, isPost)
{	
	var username = req.session.name;
	if (isPost)
		var friend_username = req.body.submitAddFriend;
	else
		var friend_username = req.query.submitAddFriend;

	oracle.connect(connectData, function(err, connection) {
		if ( err ) {
			console.log(err);
		} else {
			
			var cmd;
			cmd = "INSERT INTO friends(username1, username2, status, sent_by) "+
				" VALUES( '"+ username+"' , '"+ friend_username+"'"+ ", 'pending', '"+ 
				username+"' )";
				
			console.log(cmd);
			connection.execute(cmd, 
						[], 
				function(err, dbRetVals) 
				{
					if ( err ) 
					{
						console.log(err);
					} 
					else 
					{	
						query2(res, req, isPost);
					}
				}); // end connection.execute
		}
	}); // end oracle.connect

}


function query2(res, req, isPost)
{	
	var username = req.session.name;
	if (isPost)
		var friend_username = req.body.submitAddFriend;
	else
		var friend_username = req.query.submitAddFriend;

	oracle.connect(connectData, function(err, connection) {
		if ( err ) {
			console.log(err);
		} else {
			
			var cmd;
			cmd = "INSERT INTO friends(username1, username2, status, sent_by) "+
				" VALUES( '"+ friend_username+"' , '"+ username+"'"+ ", 'pending', '"+ 
				username+"' )";
				
			console.log(cmd);
			connection.execute(cmd, 
						[], 
				function(err, dbRetVals) 
				{
					if ( err ) 
					{
						console.log(err);
					} 
					else 
					{	
							res.redirect('/login' );
					}
				}); // end connection.execute
		}
	}); // end oracle.connect

}


/* GET home page. */
 router.get('/', function(req, res) {
	if(!req.session.name){
		res.render('index.jade',
						{
							success : 0,
							error : "Please log in first"
						});
	}
	else{
		console.log("Req query for friendAcceptance : "+req.query);
	
		query1(res,req, false);
	}
	//res.send( JSON.stringify(req.body.submitAddFriend.results ) );
});



/////
/* GET home page. */
router.post('/', function(req, res) {
	console.log("Req query for friendAcceptance : "+req.body);
	if(!req.session.name)
	{	
		res.render('index.jade',
						{
							success : 0,
							error : "Please log in first"
						});
	}
	else
	{
		query1(res,req, true);
	}
	//res.send( JSON.stringify(req.body.submitAddFriend.results ) );
});

module.exports = router;
