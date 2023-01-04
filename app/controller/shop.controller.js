const shopModel = require("../../db/models/shop.model");
const Helper = require("../helper/helper");
const ModelHelper = require("../helper/model.helper");

class ShopController {
	static getAllShops = Helper.catchAsyncError(async (req, res, next) => {
		const shops = await ModelHelper.findAll(shopModel, {});
		Helper.resHandler(res, 200, true, shops, "shops fetch successfully");
	});
	static getSingleShop = Helper.catchAsyncError(async (req, res, next) => {
		const shop = await ModelHelper.findOne(shopModel, {
			_id: req.params.shopId,
		});
		
		await shop.populate("ShopProducts");
		if (!shop) throw new Error("No shop found");
		Helper.resHandler(res, 200, true, shop, "shop fetch successfully");
	});

	static createShop = Helper.catchAsyncError(async (req, res, next) => {
		const shop = await ModelHelper.createOne(shopModel, req.body);
		Helper.resHandler(res, 200, true, shop, "shops added successfully");
	});
	static updateShop = Helper.catchAsyncError(async (req, res, next) => {
		const shop = await ModelHelper.updateOne(
			shopModel,
			{ _id: req.params.shopId },
			req.body,
		);
		if (!shop) throw new Error("No shop found");
		Helper.resHandler(res, 200, true, shop, "shop updated successfully");
	});
	static deleteShop = Helper.catchAsyncError(async (req, res, next) => {
		await ModelHelper.deleteOne(shopModel, { _id: req.params.shopId });
		Helper.resHandler(res, 200, true, null, "shop deleted successfully");
	});
}
module.exports = ShopController;
