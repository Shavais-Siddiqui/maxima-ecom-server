var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    images: [Object],
    oldPrice: Number,
    newPrice: Number,
    discount: Number,
    ratingsCount: Number,
    ratingsValue: Number,
    description: String,
    availibilityCount: Number,
    color: [String],
    size: [String],
    weight: Number,
    orders: Number,
    type: String,
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Reviews'
    }]

}, { versionKey: false });

module.exports = mongoose.model('Product', productSchema);