//Connect string to Oracle
var connectData = { 
		"hostname": "cis550.c9yomnhycrjl.us-west-2.rds.amazonaws.com", 
		"user": "visp", 
		"password": "foreignkey99", 
		"database": "TRIPSTER" };
var oracle =  require("oracle");

/////
//Query the oracle database, and call output_actors on the results

//res = HTTP result object sent back to the client
//name = Name to query for
function query_db(res,username,password) {
	oracle.connect(connectData, function(err, connection) {
		if ( err ) {
			console.log(err);
		} else {
			// selecting rows
//			connection.execute("SELECT * FROM users WHERE last_name='" + name + 
//			"' AND rownum <= 10",
			var cmd = "SELECT firstname, lastname, affiliation, photo\_url FROM users " +
			"WHERE username = '"+username+"' AND password = '"+password+"'";
			console.log(cmd);
			connection.execute(cmd, 
						[], 
				function(err, results) 
				{
					if ( err ) 
					{
						console.log(err);
					} 
					else 
					{
						connection.close(); // done with the connection
						console.log(results[0].PHOTO_URL);
						output_actors(res, username, results);
					}
	
				}); // end connection.execute
		}
	}); // end oracle.connect
}

/////
//Given a set of query results, output a table

//res = HTTP result object sent back to the client
//name = Name to query for
//results = List object of query results
function output_actors(res,username,results) {
	res.render('home.jade',
			{ title: "Username " + username,
		results: results }
	);
}

/////
//This is what's called by the main app 
exports.do_work = function(req, res){
	//.render('home.jade');
	query_db(res,req.query.username, req.query.password);
};
