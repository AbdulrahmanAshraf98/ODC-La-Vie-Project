const router = require("express").Router({ mergeParams: true });
const MeController = require("../app/controller/me.controller");
const UserController = require("../app/controller/user.controller");
const {
	checkPermission,
	auth,
	restrictTo,
} = require("../app/middleware/auth.middleware");


router.use(auth);
router.route("/").get(MeController.me).patch(MeController.updateMe);
router.route("/updatePassword").post(MeController.changePassword);



	
module.exports = router;
