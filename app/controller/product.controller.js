const productModel = require("../../db/models/product.model");
const shopModel=require("../../db/models/shop.model");
const Helper = require("../helper/helper");
const ModelHelper = require("../helper/model.helper");

class ProductController {
	static getAllProducts = Helper.catchAsyncError(async (req, res, next) => {
		const products = await ModelHelper.findAll(productModel, {});
		Helper.resHandler(res, 200, true, products, "product fetched successfully");
	});
	static getSingleProduct = Helper.catchAsyncError(async (req, res, next) => {
		const product = await ModelHelper.findOne(productModel, {
			_id: req.params.productId,
		});
    // await product.populate("ProductReviews");
		if (!product) throw new Error("No product found");
		Helper.resHandler(res, 200, true, product, "product fetched successfully");
	});
	static createProduct = Helper.catchAsyncError(async (req, res, next) => {
		if (!req.body.shop) req.body.shop = req.params.shopId;
		const product = await ModelHelper.createOne(productModel, req.body);
    const shop=await ModelHelper.findOne(shopModel,{_id:req.body.shop });
    
    shop.products.push(product._id);
    await shop.save();
		Helper.resHandler(res, 200, true, product, "product fetched successfully");
	});
	static updateProduct = Helper.catchAsyncError(async (req, res, next) => {
		const product = await ModelHelper.updateOne(
			productModel,
			{ _id: req.params.productId },
			req.body,
		);
		if (!product) throw new Error("No product found");
		Helper.resHandler(res, 200, true, product, "product updated successfully");
	});
	static deleteProduct = Helper.catchAsyncError(async (req, res, next) => {
		await ModelHelper.deleteOne(productModel, { _id: req.params.productId });
		Helper.resHandler(res, 200, true, product, "product deleted successfully");
	});
	static getShopProducts = Helper.catchAsyncError(async (req, res, next) => {
		const products = await ModelHelper.findAll(productModel, {
			shop: req.params.shopId,
		});
		if (!products) throw new Error("No shop found");
		Helper.resHandler(res, 200, true, products, "product fetched successfully");
	});
	static deleteAllShopProducts = Helper.catchAsyncError(
		async (req, res, next) => {
			await ModelHelper.deleteALl(productModel, { shop: req.params.shopId });
			Helper.resHandler(
				res,
				200,
				true,
				null,
				"all product deleted successfully",
			);
		},
	);
}
module.exports = ProductController;
