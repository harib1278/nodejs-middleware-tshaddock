var express 	= require('express');
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

router.use(bodyParser.urlencoded({
    extended: false
}));

var port = 3001;
//server logging
router.use(function(req, res, next) {
	//console.log(`App - '${port}': ${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
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
    console.log(req.body);

	var authName  	    = req.body.authName;
	var authDescription = req.body.authDescription;

	console.log(req.body.authName);
	console.log(req.body.authDescription);

	//console.log(`App - '${port}': ${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
	
	/*
	if(errors){
		res.render('register',{
			errors:errors
		});
	}

	if (validate.isEmpty(req.body.authName)) {
		errors.push('Error: Author Name can not be left blank');
	} else {
		authName = req.body.authName;
	}

	if (validate.isEmpty(req.body.authDescription)) {
		errors.push('Error: Author Description cannot be left blank.');
	} else {
		authDescription = req.body.authDescription;
	}

	


	if (validate.isEmpty(errors)) {
		var author = new Author ({
			authName : authName,
			authDescription : authDescription,
			authBooks: []
		});
		
		author.save(function(err) {
			if (err) {
				console.log('Error: Failure when saving user');
				console.log(err);
			} else {
				res.send('Success: Author added succesfully');
			}
		});

	} else {
		res.send(errors);
	} 
	*/
});







//set the port and start the server!
router.set('port', (process.env.PORT || port));

router.listen(router.get('port'), function(){
	console.log(`Middleware server running on port ${port}`);
});


module.exports = router;