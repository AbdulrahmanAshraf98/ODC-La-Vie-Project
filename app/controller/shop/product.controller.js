const productModel = require("../../../db/models/shop/product.model");
const shopModel = require("../../../db/models/shop/shop.model");
const reviewModel = require("../../../db/models/review.model");
const ArrayHelper = require("../../helper/array.helper");
const Helper = require("../../helper/helper");
const ModelHelper = require("../../helper/model.helper");
const ApiFeatures = require("../../helper/api.feature");

class ProductController {
	static getAllProducts = Helper.catchAsyncError(async (req, res, next) => {
		const apiFeatures = new ApiFeatures(productModel.find(), req.query)
			.filter()
			.pagination()
			.selectedFields()
			.sort();
		const products = await apiFeatures.query;
		Helper.resHandler(res, 200, true, products, "product fetched successfully");
	});
	static getSingleProduct = Helper.catchAsyncError(async (req, res, next) => {
		const productId = Helper.getIdFromRequest(req, "productId");
		if (!productId) throw new Error("must have a productId id");
		const product = await ModelHelper.findOne(productModel, {
			_id: productId,
		});
		if (!product) throw new Error("No product found");
		Helper.resHandler(res, 200, true, product, "product fetched successfully");
	});
	static createProduct = Helper.catchAsyncError(async (req, res, next) => {
		const shopId = Helper.getIdFromRequest(req, "shopId");
		if (!shopId) throw new Error("product must have a shop id");
		const product = await ModelHelper.createOne(productModel, {
			...req.body,
			shop: shopId,
		});
		const shop = await ModelHelper.findOne(shopModel, { _id: shopId });
		shop.products.push(product._id);
		await shop.save();
		Helper.resHandler(res, 200, true, product, "product fetched successfully");
	});
	static updateProduct = Helper.catchAsyncError(async (req, res, next) => {
		const productId = Helper.getIdFromRequest(req, "productId");
		if (!productId) if (!productId) throw new Error("must have a productId id");
		const product = await ModelHelper.updateOne(
			productModel,
			{ _id: productId },
			req.body,
		);
		if (!product) throw new Error("No product found");
		Helper.resHandler(res, 200, true, product, "product updated successfully");
	});
	static deleteProduct = Helper.catchAsyncError(async (req, res, next) => {
		const productId = Helper.getIdFromRequest(req, "productId");
		if (!productId) if (!productId) throw new Error("must have a productId id");
		const shopId = Helper.getIdFromRequest(req, "shopId");
		if (!shopId) throw new Error("product must have a shop id");
		await ModelHelper.deleteOne(productModel, { _id: productId });
		const shop = await ModelHelper.findOne(shopModel, {
			_id: shopId,
		});
		shop.products = ArrayHelper.deleteObjectFromArray(
			shop._doc.products,
			"_id",
			req.params.productId,
		);
		await shop.save();
		Helper.resHandler(res, 200, true, null, "product deleted successfully");
	});
	static getShopProducts = Helper.catchAsyncError(async (req, res, next) => {
		const shopId = Helper.getIdFromRequest(req, "shopId");
		if (!shopId) throw new Error("product must have a shop id");
		const products = await ModelHelper.findAll(productModel, {
			shop: shopId,
		});
		if (!products) throw new Error("No shop found");
		Helper.resHandler(res, 200, true, products, "product fetched successfully");
	});
	static deleteAllShopProducts = Helper.catchAsyncError(
		async (req, res, next) => {
			console.log(req.params.shopId);
			const shopId = Helper.getIdFromRequest(req, "shopId");

			if (!shopId) throw new Error("product must have a shop id");
			await ModelHelper.deleteALl(productModel, { shop: shopId });
			const shop = await ModelHelper.findOne(shopModel, {
				_id: shopId,
			});
			console.log(shop);
			await shop.products.forEach(async (product) => {
				await ModelHelper.deleteALll(reviewModel, { belongTo: product });
			});
			shop.products = [];
			await shop.save();

			Helper.resHandler(
				res,
				200,
				true,
				shop,
				"all product deleted successfully",
			);
		},
	);
}
module.exports = ProductController;
