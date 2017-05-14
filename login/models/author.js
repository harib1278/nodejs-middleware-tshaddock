var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var Author = mongoose.Schema({
    id: ObjectId,
    authName: {
        type: String,
        unique: true
    },
    authDescription: String,
    authBooks: [{
        bookName: {
            type: String
        },
        bookDescription: String,
        bookComments: [{
            comment: String,
            user: String,
            time: {
                type: Date,
                default: Date.now
            }
        }],
        bookRating: {
            ratingScore: {
                type: Number
            },
            numberOfRatings: {
                type: Number
            }
        }
    }]
});

var Author = module.exports = mongoose.model('Author', Author);

// functions below
module.exports.createAuthor = function(newAuthor, callback){
    
    newAuthor.save(callback);

}

module.exports.addAuthorBook = function(authName, authBooks, callback){

    Author.findOneAndUpdate({
            'authName': authName
        },{ 
            $push: {
                authBooks : authBooks
            }
        },{
            new: true 
        }, function (err, author) {
            console.log(author);
            if (author !== null) {
                if(err){
                    var msg = {
                        code: 400,
                        error_msg:'Error: Problem when saving new book.'
                    };
                    callback(err, msg);
                    
                    console.log(err);
                } else {

                    var msg = {
                        code: 200,
                        success_msg:'Success: New book has been added succesfully.',
                        authName: authName
                    };
                    callback(null, msg);
                }
            } else {
                res.render('error');
                console.log(err);
            }
        });
}