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