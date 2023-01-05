const router = require("express").Router({ mergeParams: true });
const upload = require("../app/middleware/multer.middleware");

const MeController = require("../app/controller/me.controller");
const PostController = require("../app/controller/blog/post.controller");
const ShopController = require("../app/controller/shop/shop.controller");
const CartController = require("../app/controller/shop/cart.controller");
const UserController = require("../app/controller/user.controller");
const BookmarkController = require("../app/controller/bookmark.controller");
const { auth } = require("../app/middleware/auth.middleware");

router.use(auth);
router.route("/").get(MeController.me).patch(MeController.updateMe);
router.route("/updatePassword").post(MeController.changePassword);
router.route("/changeEmail").post(MeController.changeEmail);
router
	.route("/change-to-bushiness-account")
	.get(UserController.changeToBushinessAccount);
router
	.route("/changeProfileImage")
	.patch(upload.single("photo"), MeController.changeProfileImage);
router
	.route("/bookmark")
	.get(BookmarkController.getAllBookMark)
	.post(BookmarkController.addToBookmark);
router
	.route("/bookmark/:bookmarkItemId")
	.delete(BookmarkController.removeItemFromBookmark);
router.route("/post").get(PostController.getAllUserPosts);
router.route("/shop").get(ShopController.getUserShops);
router.route("/cart").get(CartController.getUserCart);
module.exports = router;
