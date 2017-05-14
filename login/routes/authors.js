var express 	= require('express');
var expressValidator = require("express-validator");
var bodyParser  = require('body-parser');
var router		= express();
var mongoose	= require('mongoose');
var MongoClient	= require('mongodb').MongoClient;
var dburl 		= 'mongodb://127.0.0.1:27017/loginapp';
var moment	    = require('moment');
//essential to allow for a microservices architecture e.g api on different port/domain to the main app
var cors 		= require('cors');

//system specific declarations
var Author		= require('../models/author');

router.use(expressValidator())

router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());

var port = 3001;
//server logging
router.use(function(req, res, next) {
	console.log(`App - '${port}': ${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
	next();
});



//it is presumed that this seperate middleware app would be running on a seperate server in production with a whitelisted IP
router.get("/authors", function(req, res) {
	MongoClient.connect(dburl, function(err, db) {

		if(err) {  
			console.log(err); throw err; 
		}

		db.collection('authors').find().toArray(function(err, docs){
			if(err) throw err;

			res.json(docs);

			db.close();
		});

	});
});


router.post("/authors" , function(req, res){
    var errors = [];

	var authName  	    = req.body.authName;
	var authDescription = req.body.authDescription;

	req.checkBody('authName','authName is required').notEmpty();
	req.checkBody('authDescription','authDescription is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newAuthor = new Author({
			authName: name,
			authDescription: authDescription,
			authBooks: []
		});

		Author.createAuthor(newAuthor, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		//set a success message
		req.flash('success_msg','Author saved');
		//redirect
		res.redirect('/');
	}

	
});


//set the port and start the server!
router.set('port', (process.env.PORT || port));

router.listen(router.get('port'), function(){
	console.log(`Middleware server running on port ${port}`);
});


module.exports = router;