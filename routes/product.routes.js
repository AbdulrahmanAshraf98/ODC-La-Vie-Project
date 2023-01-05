const router = require("express").Router({ mergeParams: true });
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
	.get(ProductController.getAllProducts)
	.post(
		restrictTo("business", "admin"),
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
	.route("/:productId")
	.get(ProductController.getSingleProduct)
	.patch(
		restrictTo("business"),
		checkPermission,
		hasOwn("shops", "shopId"),
		ProductController.updateProduct,
	)
	.delete(ProductController.deleteProduct);

router
	.route("/:productId/review")
	.get(ReviewController.getAllBelongToReview)
	.post(ReviewController.createReview);
router
	.route("product/:productId/review/:reviewId")
	.get(ReviewController.getSingleReview)
	.patch(ReviewController.editReview)
	.delete(ReviewController.deleteReview);

module.exports = router;
