var express = require('express');
var router = express.Router();

//Connect string to Oracle
var connectData = { 
		"hostname": "cis550.c9yomnhycrjl.us-west-2.rds.amazonaws.com", 
		"user": "visp", 
		"password": "foreignkey99", 
		"database": "TRIPSTER" };
var oracle =  require("oracle");

// Indicator class for success or failure.
SuccessEnum = {
		SUCCESS : 1,
		FAIL : 0
};
// Indicator class saying what type of error occurred.
LoginErrorCodeEnum = {
	    CONNECTION_ERROR : 0,
	    INCORRECT_ID_PASSWORD : 1
};
console.log("INCORRECT : "+LoginErrorCodeEnum.CONNECTION_ERROR);

function  insertNewData(res, req)
{
	var username = req.session.name;
	var new_password = req.body.new_password;
	var new_password_retype = req.body.new_password_retype;
	var email = req.body.email;
	var lastname = req.body.lastname;
	var firstname = req.body.firstname;
	var affiliation = req.body.affiliation;
	var interests = req.body.interests;
	var dob = req.body.dob;
	var photo_url = req.body.photo_url;

	oracle.connect(connectData, function(err, connection) {
		if ( err ) {
			console.log(err);
		} else {
			
			var cmd;
			var password;

			if (new_password  && new_password==new_password_retype && new_password!="")
			{
				password = new_password;
			}
			else
			{
				password = req.body.password;
			}
				
			var cmd = "UPDATE users SET firstname = '"+firstname+"', " +
			" lastname = '"+lastname+"', affiliation = '"+affiliation+"',  " +
			" dob='"+dob+"', photo_url = '"+photo_url+"', " +
			" interests = '"+interests+"', email='"+email+"', password = '"+password+"' " +
			" WHERE username='" +username+"'";
		
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
						req.session.firstname = firstname;
						req.session.lastname = lastname;
						req.session.affiliation = affiliation;
						req.session.interests = interests;
						req.session.dob = dob;
						req.session.email = email;
						req.session.photo_url = photo_url;
						res.redirect('/editprofile');
					}
				}); // end connection.execute
		}
	}); // end oracle.connect

}

function checkPassword(res, req)
{
	var username = req.session.name;
	var password = req.body.password;


	oracle.connect(connectData, function(err, connection) {
		if ( err ) {
			console.log(err);
		} else {
			
			var cmd;
			cmd = "SELECT * FROM USERS WHERE username='"+username+"' AND password = '"+password+"'";

				
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
							console.log("\n\n\n\n\n\n\n");
							console.log(dbRetVals.length);
							if (dbRetVals.length==0)
							{
								res.redirect('/editprofile');
							}
							else
							{
								insertNewData(res, req);
							}
					}
				}); // end connection.execute
		}
	}); // end oracle.connect

}


/////
router.post('/', function(req, res) {
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
	console.log("Req query for changeuserdata : ");
	checkPassword(res, req);
	}
});

module.exports = router;
