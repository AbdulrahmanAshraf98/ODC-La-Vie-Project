const router = require("express").Router({ mergeParams: true });
const AuthController = require("../app/controller/auth.controller");
const UserController = require("../app/controller/user.controller");
const {
	checkPermission,
	auth,
	restrictTo,
} = require("../app/middleware/auth.middleware");

router.route("/login").post(AuthController.login);
router.route("/register").post(AuthController.register);
router.route("/:id/active").get(AuthController.activeEmail);
router.post('/forgetPassword', AuthController.forgetPassword);
router.post('/resetPassword/:token', AuthController.resetPassword);
router.use(auth);
// router.use(restrictTo("admin", "employee"));
router
	.route("/")
	.get( UserController.allUsers)
	.post( UserController.addUser);

router
	.route("/:id")
	.get( UserController.getSingleUser)
	.patch( UserController.editUser)
	.delete( UserController.deleteUser);


	
module.exports = router;
