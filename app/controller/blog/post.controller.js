const postModel = require("../../../db/models/blog/post.model");
const reviewModel = require("../../../db/models/review.model");
const ApiFeatures = require("../../helper/api.feature");
const Helper = require("../../helper/helper");
const ModelHelper = require("../../helper/model.helper");

class ProductController {
	static getAllPosts = Helper.catchAsyncError(async (req, res, next) => {
		const apiFeatures = new ApiFeatures(postModel.find(), req.query)
			.filter()
			.pagination()
			.selectedFields()
			.sort();
		const posts = await apiFeatures.query;
		posts.forEach((post) => {
			post._doc.hasOwn =
				post.author._id.toString() === req.user._id.toString() ? true : false;
			return post;
		});
		Helper.resHandler(res, 200, true, posts, "product fetched successfully");
	});

	static getAllUserPosts = Helper.catchAsyncError(async (req, res, next) => {
		const userPosts = await ModelHelper.findAll(postModel, {
			author: req.user._id,
		});
		Helper.resHandler(
			res,
			200,
			true,
			userPosts,
			"product fetched successfully",
		);
	});
	static getSinglePost = Helper.catchAsyncError(async (req, res, next) => {
		const postId = Helper.getIdFromRequest(req, "postId");
		if (!postId) throw new Error("must have a postId id");
		const post = await ModelHelper.findOne(postModel, {
			_id: postId,
		});
		if (!post) throw new Error("No post found");
		Helper.resHandler(res, 200, true, post, "post fetched successfully");
	});
	static createPost = Helper.catchAsyncError(async (req, res, next) => {
		const post = await ModelHelper.createOne(postModel, {
			...req.body,
			author: req.user._id,
		});
		Helper.resHandler(res, 200, true, post, "post created successfully");
	});

	static updatePost = Helper.catchAsyncError(async (req, res, next) => {
		const postId = Helper.getIdFromRequest(req, "postId");
		if (!postId) throw new Error("must have a postId id");
		const post = await ModelHelper.updateOne(
			postModel,
			{ _id: postId, author: req.user._id },
			req.body,
		);
		if (!post) throw new Error("updated failed");
		Helper.resHandler(res, 200, true, post, "post updated successfully");
	});
	static deletePost = Helper.catchAsyncError(async (req, res, next) => {
		const postId = Helper.getIdFromRequest(req, "postId");
		if (!postId) throw new Error("must have a postId id");
		if (req.body.hasOwn || req.user?.role?.roleType == "admin") {
			await ModelHelper.deleteOne(postModel, {
				_id: postId,
			});
			await ModelHelper.deleteOne(reviewModel, { belongTo: postId });
		} else {
			throw new Error("your not authorize to do this action");
		}

		Helper.resHandler(res, 200, true, null, "post deleted successfully");
	});
}
module.exports = ProductController;
