var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var album = require('./routes/createalbum');
var media = require('./routes/viewmedia');
var albumlist = require('./routes/viewalbums');
var addmedia = require('./routes/addmedia');
var users = require('./routes/users');
var signup = require('./routes/signup');
var login = require('./routes/login');
var tripRequestAccept = require('./routes/tripRequestAccept');
var friendRequestAccept = require('./routes/friendRequestAccept');
var editprofile = require('./routes/editprofile');
var search = require('./routes/search');
var mytrips=require('./routes/mytrips');
var createTrip=require('./routes/createTrip');
var tripspage=require('./routes/tripspage');
var saveNewUserData=require('./routes/saveNewUserData');
var yelp = require('./routes/yelp');
var locationrecommender = require('./routes/locationrecommender');


var session = require('express-session');
var app = express();

app.use(cookieParser());
app.use(session({secret:'harkarsausup',
        saveUninitialized : true,
        resave : true}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
app.use('/album', album);
app.use('/users', users);
app.use('/media', media);
app.use('/login', login);
app.use('/mytrips',mytrips);
app.use('/createTrip', createTrip);
app.use('/signup', signup);
app.use('/viewalbums', albumlist);
app.use('/tripRequestAccept', tripRequestAccept);
app.use('/friendRequestAccept', friendRequestAccept);
app.use('/editprofile', editprofile);
app.use('/search', search);
app.use('/tripspage',tripspage);
app.use('/addmedia', addmedia);
app.use('/saveNewUserData', saveNewUserData);
app.use('/yelp', yelp);
app.use('/locrec', locationrecommender);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
