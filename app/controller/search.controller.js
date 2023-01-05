const postModel = require("../../db/models/blog/post.model");
const productModel = require("../../db/models/shop/product.model");
const shopModel = require("../../db/models/shop/shop.model");
const ApiFeatures = require("../helper/api.feature");

const Helper = require("../helper/helper");
const ModelHelper = require("../helper/model.helper");
class SearchController {
	static searchForAllTypes = Helper.catchAsyncError(async (req, res, next) => {
		const productApiQuery = new ApiFeatures(productModel.find(), req.query)
			.filter()
			.pagination()
			.selectedFields()
			.sort();

		const postApiQuery = new ApiFeatures(postModel.find(), req.query)
			.filter()
			.pagination()
			.selectedFields()
			.sort();
		const shopApiQuery = new ApiFeatures(shopModel.find(), req.query)
			.filter()
			.pagination()
			.selectedFields()
			.sort();

		const productResult = await productApiQuery.query;
		const postResult = await postApiQuery.query;
		const shopResult = await shopApiQuery.query;

		const result = {
			productResult,
			postResult,
			shopResult,
		};
		console.log(result);
		Helper.resHandler(res, 200, true, result, "search result fetched");
	});
	static searchForProducts = Helper.catchAsyncError(async (req, res, next) => {
		const productApiQuery = new ApiFeatures(productModel.find(), req.query)
			.filter()
			.pagination()
			.selectedFields()
			.sort();
		const productResult = await productApiQuery.query;
		Helper.resHandler(res, 200, true, productResult, "search result fetched");
	});
	static searchForPosts = Helper.catchAsyncError(async (req, res, next) => {
		const postApiQuery = new ApiFeatures(postModel.find(), req.query)
			.filter()
			.pagination()
			.selectedFields()
			.sort();
		const postResult = await postApiQuery.query;
		Helper.resHandler(res, 200, true, postApiQuery, "search result fetched");
	});
	static searchForShops = Helper.catchAsyncError(async (req, res, next) => {
		const shopApiQuery = new ApiFeatures(shopModel.find(), req.query)
			.filter()
			.pagination()
			.selectedFields()
			.sort();
		const shopResult = await shopApiQuery.query;
		Helper.resHandler(res, 200, true, shopResult, "search result fetched");
	});
}
module.exports = SearchController;
