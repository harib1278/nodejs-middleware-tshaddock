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
        bookName: String,
        bookComments: [{
            comment: String,
            user: String,
            time: {
                type: Date,
                default: Date.now
            }
        }],
        bookRating: {
            type: Number,
            min: 1,
            max: 10
        }
    }]
});


var User = module.exports = mongoose.model('Author', Author);