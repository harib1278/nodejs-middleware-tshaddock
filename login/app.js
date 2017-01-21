var express = require("express");
var cookieParser = require('cookie-parser');
var path = require("path");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var expressValidator = require("express-validator");
var flash = require("connect-flash");
var session = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongo = require("mongodb");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/loginapp");
var db = mongoose.connection;

var routes = require("./routes/index");
var users = require("./routes/users");


//initialise applicaiton
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
//create tje handlebars engine
app.engine("handlebars", exphbs({defaultLayout: 'layout'}));
app.set("view engine", "handlebars");

// set up the body parser and cookie parser middlewaregit
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());
// set up the static folder for publically accessable content e.g images/ js 
app.use(express.static(path.join(__dirname, 'public')));

// create the express session
app.use(session({
	secret: 'secret',
	resave: true,
    saveUninitialized: true
}));

//initalising the passport module
app.use(passport.initialize());
app.use(passport.session());

// code was utilised and adapted from: https://github.com/ctavan/express-validator#middleware-options
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// load the connect flash middleware
app.use(flash());

// Set some generic messages for the flash messages
app.use(function(req, res, next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg   = req.flash('error_msg');
	res.locals.error 	   = req.flash('error');
	//set user variable for front end logic
	res.locals.user 	   = req.user || null;

	next();
});




// next up add the middleware for the route files
app.use('/', routes);
app.use('/users', users);

//set the port and start the server!
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server running on port 3000');
});