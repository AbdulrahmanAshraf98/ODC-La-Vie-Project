const shopModel = require("../../../db/models/shop/shop.model");
const productModel = require("../../../db/models/shop/product.model");
const reviewModel = require("../../../db/models/review.model");
const Helper = require("../../helper/helper");
const ModelHelper = require("../../helper/model.helper");
const ApiFeatures = require("../../helper/api.feature");

class ShopController {
	static getAllShops = Helper.catchAsyncError(async (req, res, next) => {
		const apiFeatures = new ApiFeatures(shopModel.find(), req.query)
			.filter()
			.pagination()
			.selectedFields()
			.sort();
		const shops = await apiFeatures.query;
		Helper.resHandler(res, 200, true, shops, "shops fetch successfully");
	});
	static getUserShops = Helper.catchAsyncError(async (req, res, next) => {
		const shopId = Helper.getIdFromRequest(req, "shopId");
		if (!shopId) throw new Error("must have a shopId id");
		const shops = await ModelHelper.findOne(shopModel, {
			owner: req.user._id,
		});
		if (!shops) throw new Error("No shop found");
		Helper.resHandler(res, 200, true, shops, "shop fetch successfully");
	});
	static getSingleShop = Helper.catchAsyncError(async (req, res, next) => {
		const shopId = Helper.getIdFromRequest(req, "shopId");
		if (!shopId) throw new Error("must have a shopId id");
		const shop = await ModelHelper.findOne(shopModel, {
			_id: shopId,
		});
		if (!shop) throw new Error("No shop found");
		Helper.resHandler(res, 200, true, shop, "shop fetch successfully");
	});

	static createShop = Helper.catchAsyncError(async (req, res, next) => {
		const shop = await ModelHelper.createOne(shopModel, req.body);
		req.user.shops.push(shop._id);
		await req.user.save();
		Helper.resHandler(res, 200, true, shop, "shop created successfully");
	});
	static updateShop = Helper.catchAsyncError(async (req, res, next) => {
		const shopId = Helper.getIdFromRequest(req, "shopId");
		if (!shopId) throw new Error("must have a shopId id");

		const shop = await ModelHelper.updateOne(
			shopModel,
			{ _id: shopId, owner: req.user._id },
			req.body,
		);
		if (!shop) throw new Error("No shop found");
		Helper.resHandler(res, 200, true, shop, "shop updated successfully");
	});
	static deleteShop = Helper.catchAsyncError(async (req, res, next) => {
		const shopId = Helper.getIdFromRequest(req, "shopId");
		if (!shopId) throw new Error("must have a shopId id");
		const shop = await ModelHelper.findOne(shopModel, { _id: shopId });
		if (!shop) throw new Error("shop Not Found");
		await shop.products.forEach(async (product) => {
			await product.reviews.forEach(async (review) => {
				await ModelHelper.deleteALl(reviewModel, { belongTo: review._id });
			});
			await ModelHelper.deleteALl(productModel, { _id: product.productId });
		});
		await ModelHelper.deleteOne(shopModel, { _id: shopId });
		Helper.resHandler(res, 200, true, null, "shop deleted successfully");
	});
}
module.exports = ShopController;
