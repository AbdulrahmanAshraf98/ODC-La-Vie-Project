const router = require("express").Router({ mergeParams: true });
const CartController = require("../app/controller/shop/cart.controller");

const BookmarkController = require("../app/controller/bookmark.controller");
const {
	checkPermission,
	auth,
	restrictTo,
} = require("../app/middleware/auth.middleware");

router.use(auth);
router
	.route("/")
	.get(CartController.getAllCarts)
	.post(CartController.createCart);
router
	.route("/:cartId")
	.get(CartController.getSingleCart)
	.patch(CartController.updateCart)
	.delete(CartController.deleteCart);
module.exports = router;
