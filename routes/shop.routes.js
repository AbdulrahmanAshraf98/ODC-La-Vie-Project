const router = require("express").Router({ mergeParams: true });

const ShopController = require("../app/controller/shop/shop.controller");
const ProductController = require("../app/controller/shop/product.controller");
const ReviewController = require("../app/controller/review.controller");
const {
	checkPermission,
	auth,
	restrictTo,
} = require("../app/middleware/auth.middleware");

router.use(auth);
router
	.route("/")
	.get(ShopController.getAllShops)
	.post(ShopController.createShop);
router
	.route("/:shopId")
	.get(ShopController.getSingleShop)
	.patch(ShopController.updateShop)
	.delete(ShopController.deleteShop);
router
	.route("/:shopId/product/")
	.get(ProductController.getShopProducts)
	.post(ProductController.createProduct)
	.delete(ProductController.deleteAllShopProducts);
router
	.route("/:shopId/product/:productId")
	.get(ProductController.getSingleProduct)
	.patch(ProductController.updateProduct)
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