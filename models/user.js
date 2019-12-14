var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        select: false
    },
    provider: {
        type: String,
    },
    active: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', userSchema);