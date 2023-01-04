const orderModel = require("../../../db/models/shop/order.model");
const cartModel = require("../../../db/models/shop/cart.model");

const Helper = require("../../helper/helper");
const ModelHelper = require("../../helper/model.helper");

class ProductController {
	static getAllOrders = Helper.catchAsyncError(async (req, res, next) => {
		const orders = await ModelHelper.findAll(orderModel, {});
		Helper.resHandler(res, 200, true, carts, "order fetched successfully");
	});
	static getSingleOrder = Helper.catchAsyncError(async (req, res, next) => {
		const orderId = Helper.getIdFromRequest(req, "orderId");
		if (!orderId) throw new Error("cart id  not found ");
		const order = await ModelHelper.findOne(cartModel, {
			_id: orderId,
		});
		if (!cart) throw new Error("No cart found");
		Helper.resHandler(res, 200, true, order, "cart fetched successfully");
	});
	static getUserOrder = Helper.catchAsyncError(async (req, res, next) => {
		const order = await ModelHelper.findOne(cartModel, {
			user: req.user._id,
		});
		Helper.resHandler(res, 200, true, order, "order fetched successfully");
	});
	static createOrder = Helper.catchAsyncError(async (req, res, next) => {
		const order = await ModelHelper.createOne(cartModel, req.body);
		Helper.resHandler(res, 200, true, order, "order created successfully");
	});
	static updateOrder = Helper.catchAsyncError(async (req, res, next) => {
		const orderId = Helper.getIdFromRequest(req, "orderId");
		const order = await ModelHelper.updateOne(
			productModel,
			{ _id: orderId },
			req.body,
		);
		if (!order) throw new Error("No order found");
		Helper.resHandler(res, 200, true, order, "order updated successfully");
	});
	static deleteOrder = Helper.catchAsyncError(async (req, res, next) => {
		const orderId = Helper.getIdFromRequest(req, "orderId");
		await ModelHelper.deleteOne(productModel, { _id: req.params.orderId });
		Helper.resHandler(res, 200, true, null, "order deleted successfully");
	});
}
module.exports = ProductController;
