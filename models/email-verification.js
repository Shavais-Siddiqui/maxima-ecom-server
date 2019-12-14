var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userId: {
        type: String
    },
    token: {
        type: String
    }
});

module.exports = mongoose.model('EmailVerification', userSchema);