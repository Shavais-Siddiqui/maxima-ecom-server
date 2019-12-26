var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var provinceSchema = new Schema({
    name: String,
    active: {
        type: Boolean,
        default: true
    }
});

var citySchema = new Schema({
    name: String,
    active: {
        type: Boolean,
        default: true
    },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Province' },

});

module.exports = {
    province: mongoose.model('Province', provinceSchema),
    city: mongoose.model('City', citySchema)
};