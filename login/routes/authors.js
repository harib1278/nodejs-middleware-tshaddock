var express 	= require('express');
var router		= express();
var bodyParser  = require('body-parser');
var mongoose	= require('mongoose');
var moment	    = require('moment');

//system specific declarations
var Author		= require('../models/author');

/*
var Author = [
	{
		id: 12,
	    authName: 'test au',
	    authDescription: 'Blah desc',
	    authBooks: [{
	        bookName: 'sdasdsd',
	        bookComments: [{
	            comment: 'asdasd',
	            user: 'asdasd',
	            time: 123123123
	        }],
	        
	    }]
	}
]
*/


//it is presumed that this seperate middleware app would be running on a seperate server in production with a whitelisted IP
router.route('/authors') 

    .get(function(req,res){

		Author.find(function(err,authors) {
			if (err) {
				res.json(err);
				console.log(err);
			} else {
				res.json(authors);
			}
		})

	})

	.post(function(req,res){

		var errors = [];

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
				authDescription : authDescription
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
	})

router.route('/authors/:authName') 

	.get(function(req,res){
		Author.findOne({
				'authName': req.params.authName
			}, function(err,author){
				if (author !== null) {
					if(err){
						res.send(err);
						console.log(err);
					} else {
						res.render('index', {
							pageTitle: 'Authors page',
							pageID: 'author',
							author : author
						});
					}
				} else {
					res.send('Error: problem retrieving data');
				}
			});
	})

	.put(function(req,res){

		var errors = new Array;

		if(validate.isEmpty(req.body.bookName)) {
			errors.push('Error: New book name cannot be blank.');
		} else {
			var bookName = req.body.bookName;
		}

		if(validate.isEmpty(errors)) {

			var authBooks = 
			{
				bookName : bookName,
				bookRating : 0
			}
			
			Author.findOneAndUpdate({
				'authName': req.params.authName
			},{ 
					$push: {
						authBooks : authBooks
					} 
			},{
				new: true 
			}, function (err, author) {
				if (author !== null) {
					if(err){
						res.send({
							code: 400,
							message:'Error: Problem when saving new book.'
						});
						console.log(err);
					} else {
						res.send({
							code: 200,
							message:'Success: New book has been added succesfully.',
							authName: author.authName
						});
					}
				} else {
					res.send('error');
					console.log(err);
				}
			});
		} else {
			res.send(errors);
		}
	})

	.delete(function(req,res){
		Author.findOneAndUpdate({
			'authName': req.params.authName
		},{
			$pull: {
				'authName': req.params.authName
			}
		}, function (err,author){
			if(err) {
				res.send(err);
				console.log('Error: Problem locating the author');
			} else {
				console.log('Success: Removed the author');
				res.send({ 
					redirect: '/authors'
				});
			}
		});
	})

var port = 3002;
//server logging
router.use(function(req, res, next) {
	console.log(`App - '${port}': ${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
	next();
});

//set the port and start the server!
router.set('port', (process.env.PORT || port));

router.listen(router.get('port'), function(){
	console.log(`Authors middleware server running on port ${port}`);
});

module.exports = router;