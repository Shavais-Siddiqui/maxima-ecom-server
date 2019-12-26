const ProductModel = require('../models/product');
const CategoryModel = require('../models/category');
const asyncMiddleware = require('../utils/asyncMiddleware');
const status = require('../utils/statusCodes');

const productActions = {
    getAll: asyncMiddleware(async (req, res) => {
        let products = await ProductModel.find();
        res.status(status.success.accepted).json({
            message: 'All Products',
            data: products
        });
    }),

    getSpecific: asyncMiddleware(async (req, res) => {
        let categories = await CategoryModel.find({ parentId: req.params.id }, '_id');
        if (categories.length > 0) {
            // If the given id has childs
            // Loop through all the documents and get the object ids of all the categories, and then find all the products having these ids including the given one.
            let ids = [req.params.id];
            categories.forEach((category, index) => {
                ids.push(category._id);
            });
            let products = await ProductModel.find({
                'categoryId': { $in: ids }
            });
            res.status(status.success.accepted).json({
                message: 'Products Of Specific Category Including Child Categories',
                data: products
            });
        } else {
            // If the given id has no childs categories, get all the products of this category id only.
            let products = await ProductModel.find({ categoryId: req.params.id });
            res.status(status.success.accepted).json({
                message: 'Products Of Specific Category',
                data: products
            });
        }
    }),

    detailProduct: asyncMiddleware(async (req, res) => {
        let product = await ProductModel.findById(req.params.id).populate('reviews');
        res.status(status.success.accepted).json({
            message: 'Product Detail',
            data: product
        });
    }),

    // Admin Actions

    addNew: asyncMiddleware(async (req, res) => {
        let newProduct = new ProductModel(req.body);
        let product = await newProduct.save();
        if (product) {
            res.status(status.success.created).json({
                message: 'Product Added'
            });
        } else {
            res.status(status.client.badRequest).json({
                message: 'Something Went Wrong While Adding product'
            });
        }
    }),

    update: asyncMiddleware(async (req, res) => {
        let updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedProduct) {
            res.status(status.success.created).json({
                message: 'Product Updated Successfully'
            });
        } else {
            res.status(status.client.badRequest).json({
                message: 'Something Went Wrong While Updating Product'
            });
        }
    })
};

module.exports = productActions;