var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var expressValidator = require("express-validator");
var flash = require("connect-flash");
var session = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local"), Strategy;
var mongo = require("mongodb");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/login");
var db = mongoose.connection;

var routes = require("./routes/index");
var users = require("./routes/users");

//initialise applicaiton


var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", exphbs({defaultLayout: 'layout'}));
app.set("view engine", "handlebars");

// set up the body parser and cookie parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

