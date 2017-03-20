var express 	= require('express');
var router     	= express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var moment      = require('moment');

//system specific declarations 
var Author      = require('../models/author');
var reqLog      = require('../app.js');


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
                res.send('error');
            }
        });        
    })

    .put(function(req,res){

        if(validate.isEmpty(req.body.comment)) {
            res.send({message: 'Add a comment!'});
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
                	console.log('Comment added.');
					res.send({redirect: '/authors/' + authName + '/' + bookName });
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
                    code: 6001,
                    message:'Problem deleting book'
                });
                console.log('Couldnt find book');
            } else {
                 console.log('Book removed.');
                 res.send({
                    code: 6001,
                    message:'Problem saving book',
                    authName : author.authName
                });
            }
        });
    })

//server logging
router.use(function(req, res, next) {
	console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
	next();
});

router.listen(3001);

console.log("Middleware app running on port 3001");

module.exports = router;