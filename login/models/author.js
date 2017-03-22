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
        }
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


var User = module.exports = mongoose.model('Author', Author);
