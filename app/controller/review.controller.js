const reviewModel = require("../../db/models/review.model");
const productModel = require("../../db/models/shop/product.model");
const postModel = require("../../db/models/blog/post.model");
const Helper = require("../helper/helper");
const ModelHelper = require("../helper/model.helper");
const ArrayHelper = require("../helper/array.helper");
const ApiFeatures = require("../helper/api.feature");

const getBelongTo = (req) => {
	let belongTo;
	if (req.params.productId) belongTo = req.params.productId;
	else if (req.params.postId) belongTo = req.params.postId;
	else belongTo = req.body.belongTo;
	return belongTo;
};

class ReviewController {
	static getAllReview = Helper.catchAsyncError(async (req, res, next) => {
		const apiFeatures = new ApiFeatures(reviewModel.find(), req.query)
			.filter()
			.pagination()
			.selectedFields()
			.sort();
		const reviews = await apiFeatures.query;
		Helper.resHandler(res, 200, true, reviews, "reviews fetch successfully");
	});
	static getAllBelongToReview = Helper.catchAsyncError(
		async (req, res, next) => {
			let belongTo = getBelongTo(req);
			const reviews = await ModelHelper.findAll(reviewModel, { belongTo });
			Helper.resHandler(res, 200, true, reviews, "reviews fetch successfully");
		},
	);
	static getSingleReview = Helper.catchAsyncError(async (req, res, next) => {
		const review = await ModelHelper.findAll(reviewModel, {
			_id: req.params.reviewId,
		});
		Helper.resHandler(res, 200, true, review, "reviews fetch successfully");
	});
	static createReview = Helper.catchAsyncError(async (req, res, next) => {
		let belongTo = getBelongTo(req);
		const review = await ModelHelper.createOne(reviewModel, {
			...req.body,
			belongTo,
			user: req.user._id,
		});
		if (req.body.belongToType === "product") {
			const product = await ModelHelper.findOne(productModel, {
				_id: belongTo,
			});
			if (!product.reviews) product.reviews = [];

			product.reviews.push(review._id);
			await product.save();
		} else if (req.body.belongToType === "post") {
			const post = await ModelHelper.findOne(postModel, {
				_id: belongTo,
			});
			post.reviews.push(review._id);
			await post.save();
		}

		Helper.resHandler(res, 200, true, review, "review created successfully");
	});
	static editReview = Helper.catchAsyncError(async (req, res, next) => {
		const review = await ModelHelper.updateOne(
			reviewModel,
			{ _id: req.params.reviewId, user: req.user._id },
			req.body,
		);
		Helper.resHandler(res, 200, true, review, "review edit successfully");
	});

	static deleteReview = Helper.catchAsyncError(async (req, res, next) => {
		let belongTo = getBelongTo(req);
		if (!req.body.user) {
			throw new Error("must have a user id");
		}
		await ModelHelper.deleteOne(reviewModel, {
			_id: req.params.reviewId,
			user: req.body.use,
		});

		if (req.params.productId || req.body.belongToType == "product") {
			const product = await ModelHelper.findOne(productModel, {
				id: belongTo,
			});
			product._doc.reviews = ArrayHelper.deleteObjectFromArray(
				product._doc.reviews,
				"_id",
				req.params.id,
			);
			await product.save();
		} else if (req.params.postId || req.body.belongToType == "post") {
			const post = await ModelHelper.findOne(productModel, {
				_id: belongTo,
			});
			post.reviews = ArrayHelper.deleteObjectFromArray(
				post._doc.reviews,
				"_id",
				req.params.id,
			);
			await product.save();
		}


		Helper.resHandler(res, 200, true, null, "review removed successfully");
	});
}
module.exports = ReviewController;
