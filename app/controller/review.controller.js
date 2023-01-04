const reviewModel = require("../../db/models/review.model");
const productModel = require("../../db/models/product.model");
const Helper = require("../helper/helper");
const ModelHelper = require("../helper/model.helper");

class ReviewController {
	static getAllReview = Helper.catchAsyncError(async (req, res, next) => {
		const reviews = await ModelHelper.findAll(reviewModel, {});
		Helper.resHandler(res, 200, true, reviews, "reviews fetch successfully");
	});
	static createReview = Helper.catchAsyncError(async (req, res, next) => {
		if (!req.body.product) req.body.product = req.params.productId;
		console.log(req.params.productId);
		const review = await ModelHelper.createOne(reviewModel, {
			...req.body,
			user: req.user._id,
		});
		const product = await ModelHelper.findOne(productModel, {
			_id: req.params.productId,
		});
		product.reviews.push(review._id);
		await product.save();
		Helper.resHandler(res, 200, true, review, "review added successfully");
	});
	static editReview=Helper.catchAsyncError(async (req, res, next) => {
		if (!req.body.product) req.body.product = req.params.productId;
		const review = await ModelHelper.updateOne(reviewModel,{_id:req.params._id,user:req.user._id} ,req.body);
		Helper.resHandler(res, 200, true, review, "review edit successfully");
	});
	static deleteReview=Helper.catchAsyncError(async (req, res, next) => {
		if (!req.body.product) req.body.product = req.params.productId;
		await ModelHelper.deleteOne(reviewModel,{_id:req.params._id} ,req.body);
		Helper.resHandler(res, 200, true, null, "review removed successfully");
	});

}
module.exports = ReviewController;
