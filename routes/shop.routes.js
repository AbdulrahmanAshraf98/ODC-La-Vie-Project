const router = require("express").Router({ mergeParams: true });

const ShopController = require("../app/controller/shop/shop.controller");
const ProductController = require("../app/controller/shop/product.controller");
const ReviewController = require("../app/controller/review.controller");
const {
	checkPermission,
	auth,
	restrictTo,
	hasOwn,
} = require("../app/middleware/auth.middleware");

router.use(auth);
router
	.route("/")
	.get(ShopController.getAllShops)
	.post(
		restrictTo("business", "employee", "admin"),
		checkPermission,
		ShopController.createShop,
	);
router
	.route("/:shopId")
	.get(ShopController.getSingleShop)
	.patch(
		restrictTo("business"),
		checkPermission,
		hasOwn("shops", "shopId"),
		ShopController.updateShop,
	)
	.delete(
		restrictTo("business", "admin"),
		checkPermission,
		hasOwn("shops", "shopId"),
		ShopController.deleteShop,
	);
router
	.route("/:shopId/product/")
	.get(ProductController.getShopProducts)
	.post(
		restrictTo("business"),
		checkPermission,
		hasOwn("shops", "shopId"),
		ProductController.createProduct,
	)
	.delete(
		restrictTo("business", "admin"),
		checkPermission,
		hasOwn("shops", "shopId"),
		ProductController.deleteAllShopProducts,
	);
router
	.route("/:shopId/product/:productId")
	.get(ProductController.getSingleProduct)
	.patch(
		restrictTo("business"),
		checkPermission,
		hasOwn("shops", "shopId"),
		ProductController.updateProduct,
	)
	.delete(ProductController.deleteProduct);

router
	.route("/:shopId/product/:productId/review")
	.get(ReviewController.getAllBelongToReview)
	.post(ReviewController.createReview);
router
	.route("/:shopId/product/:productId/review/:reviewId")
	.get(ReviewController.getSingleReview)
	.patch(ReviewController.editReview)
	.delete(ReviewController.deleteReview);
	
module.exports = router;
