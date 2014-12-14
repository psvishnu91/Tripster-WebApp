var express = require('express');
var router = express.Router();

var connectData = {
	hostname: "cis550.c9yomnhycrjl.us-west-2.rds.amazonaws.com",
	port: "1521",
	user:"visp",
	password: "foreignkey99",
	database: "TRIPSTER"};

var contents;
var username;
var oracle = require("oracle");	
var results={};

function query_users(res, req) 
{
    console.log("In query users");

    if(!req.query.user_search)
    {
    console.log("User not selected going to locations");

      query_locations(res,req);
    }
    else
    {
    	oracle.connect(connectData, function(err, connection) 
      {
    		if (err) 
        {
    			console.log(err);
    		} 
        else 
        {
            var cmd = "SELECT username, firstname, lastname, photo_url FROM USERS " + 
            "WHERE username LIKE '%"+contents+"%' AND ROWNUM<5";
            console.log(cmd);
            connection.execute(cmd,
              [],
              function(err, user_results) 
              {
                if (err) 
                {
                  console.log(err);
                } 
                else 
                {
                  connection.close();
                  results.user_results = user_results;
                  console.log('calling locations search');
                  query_locations(res,req);
                }
              });
  		    } 
  	   });
    }
}

function query_locations(res, req) 
{   
    console.log("In query locations");
    if(!req.query.location_search)
    {
      console.log('No need for locations rendering page');
      //query_trips(res,req);
      res.render('search.jade',results);

    }
    else
    {
      oracle.connect(connectData, function(err, connection) 
      {
        if (err) 
        {
          console.log(err);
        } 
        else 
        {
            var cmd = "SELECT id, name FROM location " + 
            "WHERE name LIKE '%"+contents+"%'  AND ROWNUM<5";
            console.log(cmd);
            connection.execute(cmd,
              [],
              function(err, location_results) 
              {
                if (err) 
                {
                  console.log(err);
                } 
                else 
                {
                  connection.close();
                  results.location_results = location_results;
                  res.render('search.jade',results);
                  //query_trips(res,req);
                }
              });
          } 
       });
    }
}

function query_trips(res, req) 
{
    if(!req.query.trip_search)
    {
      res.send(results);
      // res.render( 'searchResults.jade',{results:results});
    }
    else
    {
      oracle.connect(connectData, function(err, connection) 
      {
        if (err) 
        {
          console.log(err);
        } 
        else 
        {
            var cmd = " WITH TripParticipates AS( " +
                      " SELECT trip\_id " +
                      " FROM Participates P " +
                      " WHERE P.username = '"+username+"') " +
                      " SELECT T.id AS trip\_id, T.name AS trip\_name " +
                      " FROM Trips T " +
                      " WHERE ( T.privacy = 'public' " +
                      " OR T.id IN (SELECT * FROM TripParticipates) " +
                      " OR T.admin = '"+username+"' ) " +
                      " AND T.name LIKE '%"+contents+"%'  AND ROWNUM<5 ";
            console.log(cmd);
            connection.execute(cmd,
              [],
              function(err, trip_results) 
              {
                if (err) 
                {
                  console.log(err);
                } 
                else 
                {
                  connection.close();
                  results.trip_results = trip_results;
                  // res.send(results);
                  console.log("Im here before res render");

                  var a = {results: results};
                  console.log(a);
                  res.send(results);
                  // res.render( 'searchResults.jade',{results:results});

                }
              });
          } 
       });
    }
}

router.get('/', function(req, res) 
{
    console.log("\n-----------------------------");
    console.log("\n-----In Seach.js----");
    username = req.session.name;
    contents =  req.query.contents;
    console.log("Req query : ", req.query);
	  query_users(res, req);
});



module.exports = router;
