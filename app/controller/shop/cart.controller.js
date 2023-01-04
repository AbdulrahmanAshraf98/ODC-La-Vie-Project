const productModel = require("../../../db/models/shop/product.model");
const cartModel = require("../../../db/models/shop/cart.model");
const Helper = require("../../helper/helper");
const ModelHelper = require("../../helper/model.helper");

class ProductController {
	static getAllCarts = Helper.catchAsyncError(async (req, res, next) => {
		const carts = await ModelHelper.findAll(cartModel, {});
		Helper.resHandler(res, 200, true, carts, "cart fetched successfully");
	});
	static getSingleCart = Helper.catchAsyncError(async (req, res, next) => {
		const cartId = Helper.getIdFromRequest(req, "cartId");
		if (!cartId) throw new Error("cart id  not found ");
		const cart = await ModelHelper.findOne(cartModel, {
			_id: cartId,
		});
		if (!cart) throw new Error("No cart found");
		Helper.resHandler(res, 200, true, cart, "cart fetched successfully");
	});
	static getUserCart = Helper.catchAsyncError(async (req, res, next) => {
		const cart = await ModelHelper.findOne(cartModel, {
			user: req.user._id,
		});
		Helper.resHandler(res, 200, true, cart, "cart fetched successfully");
	});
	static createCart = Helper.catchAsyncError(async (req, res, next) => {
		const cart = await ModelHelper.createOne(cartModel, req.body);
		await cart.save();
		Helper.resHandler(res, 200, true, cart, "cart fetched successfully");
	});
	static updateCart = Helper.catchAsyncError(async (req, res, next) => {
		const cartId = Helper.getIdFromRequest(req, "cartId");
		const cart = await ModelHelper.updateOne(
			cartModel,
			{ _id: cartId },
			req.body,
		);
		if (!cart) throw new Error("No cart found");
		Helper.resHandler(res, 200, true, cart, "cart updated successfully");
	});
	static deleteCart = Helper.catchAsyncError(async (req, res, next) => {
		const cartId = Helper.getIdFromRequest(req, "cartId");
		await ModelHelper.deleteOne(cartModel, { _id: cartId });
		Helper.resHandler(res, 200, true, null, "cart deleted successfully");
	});
}
module.exports = ProductController;
