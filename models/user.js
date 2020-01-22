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
    },
    imageUrl: {
        type:  String,
        default: 'https://res.cloudinary.com/dz8zgvu8s/image/upload/v1570542639/user1.jpg'
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, { versionKey: false });

module.exports = mongoose.model('User', userSchema);