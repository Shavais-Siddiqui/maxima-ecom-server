var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userName: String,
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    rate: Number,
    reviewText: String,
    date: { type: Date, default: Date.now }
}, { versionKey: false });

reviewSchema.index({
    "user": 1,
    "product": 1
}, {
    "unique": true
});

module.exports = mongoose.model('Reviews', reviewSchema);