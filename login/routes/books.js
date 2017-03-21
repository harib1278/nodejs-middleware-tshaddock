var express 	= require('express');
var router		= express();
var bodyParser  = require('body-parser');
var mongoose	= require('mongoose');
var moment	    = require('moment');

//system specific declarations - the books schema has been included as part of the main authors schema for speed of development
var Author		= require('../models/author');

//it is presumed that this seperate middleware app would be running on a seperate server in production with a whitelisted IP
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
	console.log(`Books middleware server running on port ${port}`);
});

module.exports = router;