var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    parentId: String,
    hasSubCategory: Boolean
}, { versionKey: false });

module.exports = mongoose.model('Category', categorySchema);