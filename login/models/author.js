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
            type: String,
            unique: true
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
            user: String
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




module.exports.addBookComment = function(bookName, user, authComment, callback){

    Author.findOneAndUpdate({ 
                'authBooks.bookName': bookName
            },{
                $push: { 
                    'authBooks.$.bookComments' : authComment 
                }
            },{ 
                new: true
            }, function (err, author) {
            console.log(author);
            if (author !== null) {
                if(err){
                    var msg = {
                        code: 400,
                        error_msg:'Error: Problem when saving new comment.'
                    };
                    callback(err, msg);
                    
                    console.log(err);
                } else {

                    var msg = {
                        code: 200,
                        success_msg:'Success: New comment has been added succesfully.',
                        user: user
                    };
                    callback(null, msg);
                }
            } else {
                res.render('error');
                console.log(err);
            }
        });
}

module.exports.addBookFavorite = function(bookName, user, authFavorite, callback){
    console.log(authFavorite);


    Author.findOneAndUpdate({ 
                'authBooks.bookName': bookName
            },{
                $push: { 
                    'authBooks.$.bookRating' : authFavorite 
                }
            },{ 
                new: true
            }, function (err, author) {
            console.log(author);
            if (author !== null) {
                if(err){
                    var msg = {
                        code: 400,
                        error_msg:'Error: Problem when saving new rating.'
                    };
                    callback(err, msg);
                    
                    console.log(err);
                } else {

                    var msg = {
                        code: 200,
                        success_msg:'Success: New comment has been added succesfully.',
                        user: user
                    };
                    callback(null, msg);
                }
            } else {
                res.render('error');
                console.log(err);
            }
        });
}