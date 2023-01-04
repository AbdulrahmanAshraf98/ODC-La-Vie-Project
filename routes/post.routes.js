const router = require("express").Router({ mergeParams: true });
const PostController = require("../app/controller/blog/post.controller");
const ReviewController = require("../app/controller/review.controller");
const {
	checkPermission,
	auth,
	restrictTo,
} = require("../app/middleware/auth.middleware");

router.use(auth);

router
	.route("/")
	.get(PostController.getAllPosts)
	.post(PostController.createPost);
router
	.route("/:postId")
	.get(PostController.getSinglePost)
	.patch(PostController.updatePost)
	.delete(PostController.deletePost);

router
	.route("/:postId/review")
	.get(ReviewController.getAllBelongToReview)
	.post(ReviewController.createReview);
router
	.route("product/:postId/review/:reviewId")
	.get(ReviewController.getSingleReview)
	.patch(ReviewController.editReview)
	.delete(ReviewController.deleteReview);

module.exports = router;
