const UserModel = require('../models/user');
const CategoryModel = require('../models/category');
const asyncMiddleware = require('../utils/asyncMiddleware');
const status = require('../utils/statusCodes');

const categoryActions = {
    getAll: asyncMiddleware(async (req, res) => {
        let categories = await CategoryModel.find();
        res.status(status.success.accepted).json({
            message: 'All Categories',
            data: categories
        });
    }),

    // Admin Actions

    addNew: asyncMiddleware(async (req, res) => {
        let newCategory = new CategoryModel({
            name: req.body.name,
            parentId: req.body.parentId,
            hasSubCategory: req.body.hasSubCategory
        });
        let category = await newCategory.save();
        if (category) {
            res.status(status.success.created).json({
                message: 'Category Added'
            });
        } else {
            res.status(status.client.badRequest).json({
                message: 'Something Went Wrong While Adding Category'
            });
        }
    }),

    update: asyncMiddleware(async (req, res) => {
        let updatedCategory = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedCategory) {
            res.status(status.success.created).json({
                message: 'Category Updated Successfully'
            });
        } else {
            res.status(status.client.badRequest).json({
                message: 'Something Went Wrong While Updating Category'
            });
        }
    })

};

module.exports = categoryActions;
