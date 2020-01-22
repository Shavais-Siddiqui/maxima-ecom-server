const ProductModel = require('../models/product');
const CategoryModel = require('../models/category');
const ReviewModel = require('../models/reviews');
const asyncMiddleware = require('../utils/asyncMiddleware');
const status = require('../utils/statusCodes');

const reviewActions = {
    add: asyncMiddleware(async (req, res) => {
        console.log(req.body)
        let ratedBefore = await ReviewModel.findOne({ userId: req.body.userId, product: req.body.productId });
        if (ratedBefore) {
            res.status(status.client.badRequest).json({
                message: 'You Already Reviewed This Product',
            });
        } else {
            let review = new ReviewModel({
                userId: req.body.userId,
                product: req.body.productId,
                rate: req.body.rate,
                reviewText: req.body.reviewText,
                userName: req.body.userName,
                imageUrl: req.body.imageUrl
            });
            let savedReview = await review.save();
            await ProductModel.findByIdAndUpdate(req.body.productId, { $inc: { 'ratingsCount': 1, 'ratingsValue': req.body.rate },  $push: { reviews: savedReview._id } });
            res.status(status.success.created).json({
                message: 'Review Added'
            });
        }
    })
};

module.exports = reviewActions;
