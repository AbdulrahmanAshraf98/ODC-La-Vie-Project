const router = require("express").Router({ mergeParams: true });

const ReviewController = require("../app/controller/review.controller");
const {
	checkPermission,
	auth,
	restrictTo,
} = require("../app/middleware/auth.middleware");


router.use(auth);
router.route("/").get(ReviewController.getAllReview).post(ReviewController.createReview);
router.route("/:id");



	
module.exports = router;
