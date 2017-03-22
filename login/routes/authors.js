var express 	= require('express');
var router		= express();
var bodyParser  = require('body-parser');
var mongoose	= require('mongoose');
var moment	    = require('moment');
//essential to allow for a microservices architecture e.g api on different port/domain to the main app
var cors 		= require('cors');

//system specific declarations
var Author		= require('../models/author');


var Author = [
	{
		id: 1,
	    authName: 'Ian Banks',
	    authDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin aliquet ut massa at fermentum. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
	    authBooks: [{
	        bookName: 'sdasdsd',
	        bookDescription: 'Consectetur adipiscing elit',
	        bookComments: [{
	            comment: 'Hello this is a comment',
	            user: 'Jimbob',
	            time: 1490189506910
	        }],
	        bookRating: {
	            ratingScore: 15,
	            numberOfRatings: 3
	        }
	        
	    },{
	    	bookName: 'Blah book',
	        bookDescription: 'Consectetur adipiscing elit. Proin aliquet ut massa at fermentum',
	        bookComments: [{
	            comment: 'asdasd',
	            user: 'asdasd',
	            time: 1490189506910
	        }],
	        bookRating: {
	            ratingScore: 15,
	            numberOfRatings: 3
	        }
	    },{
	    	bookName: 'Blah book 2',
	        bookDescription: 'Interdum et malesuada fames ac ante ipsum primis in faucibus.',
	        bookComments: [{
	            comment: 'asdasd',
	            user: 'asdasd',
	            time: 1490189506910
	        }],
	        bookRating: {
	            ratingScore: 15,
	            numberOfRatings: 3
	        }
	    }]
	}, 
	{
		id: 2,
	    authName: 'Issac Asimov',
	    authDescription: 'Sed ut mauris eu arcu imperdiet facilisis sodales a libero. Aenean pulvinar dolor justo.',
	    authBooks: [{
	        bookName: 'Foundation',
	        bookDescription: 'Eu arcu imperdiet facilisis sodales a libero',
	        bookComments: [
	        	{
		            comment: 'new',
		            user: 'mrw',
		            time: 1490189506800
	        	},
	        	{
	        		comment: 'Hello',
		            user: 'tim',
		            time: 1490189506810
	        	}
	        ],
	        bookRating: {
	            ratingScore: 21,
	            numberOfRatings: 5
	        }
	        
	    }]
	}
];
router.use(cors());


//it is presumed that this seperate middleware app would be running on a seperate server in production with a whitelisted IP
router.route('/authors') 

    .get(function(req,res){

		res.json(Author);

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
						res.json(author);
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
			var bookName 		= req.body.bookName;
			var bookDescription = req.body.bookDescription;
		}

		if(validate.isEmpty(errors)) {

			var authBooks = 
			{
				bookName : bookName,
				bookDescription : bookDescription,
				bookRating: {
		            ratingScore: 0,
		            numberOfRatings: 0
		        }
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
						//replace with flash messages
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
				//replace as above
				console.log('Error: Problem locating the author');
			} else {
				console.log('Success: Removed the author');
				res.send({ 
					redirect: '/authors'
				});
			}
		});
	})


/**
*	Start of the book related sub routes
*/

router.route('/authors/:authName/:bookName')

	.get(function(req,res){

		Author.findOne({ 
		'authBooks.bookName': req.params.bookName 
		}, function(err,author){
			if (author !== null) {      
				if(err){
					res.send(err);
					console.log(err);
				} else {
					checkBook(author,req.params.bookName);                    

					res.render('index', {
						pageTitle: thisBook.bookName,
						pageID: 'book',
						book : thisBook,
						authName : author.authName
					});
				}
			} else {
				res.send('Error: Problem retrieving books');
			}
		});
	})

	.put(function(req,res){

		if(validate.isEmpty(req.body.comment)) {
			res.send({message: 'Add a comment'});
		} else {
			var comment = {
				comment: req.body.comment,
				user: req.user.username
		};

			var bookName = req.params.bookName;
			var authName = req.params.authName;

				Author.findOneAndUpdate({ 
					'authBooks.bookName': bookName
				},{
					$push: { 
						'authBooks.$.bookComments' : comment 
					}
			 	},{ 
					new: true
				},function (err,author){
				if(err){
					res.send(err);
					console.log(err);
				} else {
					console.log('Success: Comment has been added.');
					res.send({
						redirect: '/authors/' + authName + '/' + bookName
					});
				}
			});
		} 

	})

	.delete(function(req,res){

		Author.findOneAndUpdate({
			'authBooks.bookName': req.params.bookName
		},{
			$pull: {
				'authBooks': { 
					bookName : req.params.bookName 
				}
			}
		},function (err,author){
			if(err) {
				res.send({
					code: 400,
					message:'Error: Problem deleting the book'
				});
				console.log('Error: Couldnt find book');
			} else {
				console.log('Success: Book removed.');
				res.send({
					code: 400,
					message:'Problem saving the book',
					authName : author.authName
				});
			}
		});
	})

var port = 3001;
//server logging
router.use(function(req, res, next) {
	console.log(`App - '${port}': ${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
	next();
});


//set the port and start the server!
router.set('port', (process.env.PORT || port));

router.listen(router.get('port'), function(){
	console.log(`Middleware server running on port ${port}`);
});


module.exports = router;