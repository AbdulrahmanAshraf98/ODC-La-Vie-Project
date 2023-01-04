const router = require("express").Router({ mergeParams: true });

const ShopController = require("../app/controller/shop.controller");
const ProductController = require("../app/controller/product.controller");
const ReviewController = require("../app/controller/review.controller");
const {
	checkPermission,
	auth,
	restrictTo,
} = require("../app/middleware/auth.middleware");



router.use(auth);
router.route("/").get(ShopController.getAllShops).post(ShopController.createShop);
router.route("/:shopId").get(ShopController.getSingleShop).patch(ShopController.updateShop).delete(ShopController.deleteShop);
router.route("/:shopId/product/").get(ProductController.getShopProducts).post(ProductController.createProduct).delete(ProductController.deleteAllShopProducts)
router.route("/:shopId/product/:productId").get(ProductController.getSingleProduct).patch(ProductController.updateProduct).delete(ProductController.deleteProduct);

router.route("/:shopId/product/:productId/review").get(ReviewController.getAllReview).post(ReviewController.createReview)
	
module.exports = router;
