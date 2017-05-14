var express 	= require('express');
var expressValidator = require('express-validator');
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

router.use(cors());
router.use(expressValidator())


router.use(bodyParser.urlencoded({
    extended: false
}));

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


router.post("/authors/add" , function(req, res){
    var errors = [];

	var authName  	    = req.body.authName;
	var authDescription = req.body.authDescription;

	req.checkBody('authName','authName is required').notEmpty();
	req.checkBody('authDescription','authDescription is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('index',{
			errors:errors
		});
	} else {
		var newAuthor = new Author({
			authName: authName,
			authDescription: authDescription
		});

		Author.createAuthor(newAuthor, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		//set a success message
		res.render('index',{
			success_msg:'Author saved'
		});	
	}	
});

router.put("/author/addbook" ,function(req,res){

	var errors = [];

	var authName 		= req.body.authName;
	var bookName 		= req.body.bookName;
	var bookDescription = req.body.bookDescription;

	req.checkBody('authName','authName is required').notEmpty();
	req.checkBody('bookName','bookName is required').notEmpty();
	req.checkBody('bookDescription','bookDescription is required').notEmpty();

	var authBooks =
		{
			bookName : bookName,
			bookDescription : bookDescription,
			bookComments: [],
			bookRating: {
	            user: ''
	        }
		};

	Author.addAuthorBook(authName, authBooks, function(err, author){
		if(err) throw err;
		console.log(author);
	});

	//set a success message
	res.render('index',{
		success_msg:'Book saved'
	});	

});


router.put("/author/book/addcomment" ,function(req,res){

	var errors = [];

	var bookName 	 = req.body.bookName;
	var bookcomment  = req.body.bookcomment;
	var user 		 = req.body.user;

	req.checkBody('bookName','bookName is required').notEmpty();
	req.checkBody('bookcomment','bookcomment is required').notEmpty();
	req.checkBody('user','username is required').notEmpty();

	var authComment =
		{
			comment : bookcomment,
			user 	: user,
			time	: Date.now()			
		};

	Author.addBookComment(bookName, user, authComment, function(err, author){
		if(err) throw err;
		console.log(author);
	});

	//set a success message
	res.send({
		success_msg:'Book comment saved',
		comment: bookcomment
	});	

});

router.put("/author/book/addfavorite" ,function(req,res){

	var errors = [];

	var bookName 	 = req.body.bookName;;
	var user 		 = req.body.user;

	console.log(bookName);
	console.log(user);

	req.checkBody('bookName','bookName is required').notEmpty();
	req.checkBody('user','username is required').notEmpty();

	var authFavorite = [
		{
            user: user
        }
	];

	Author.addBookFavorite(bookName, user, authFavorite, function(err, author){
		if(err) throw err;
		console.log(author);
	});

	//set a success message
	res.send({
		success_msg:'Book favorite saved',
		user: user
	});	

});


//set the port and start the server!
router.set('port', (process.env.PORT || port));

router.listen(router.get('port'), function(){
	console.log(`Middleware server running on port ${port}`);
});


module.exports = router;