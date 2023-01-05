const Role = require("../../db/models/role.model");
const UserModel = require("../../db/models/user.model");
const ApiFeatures = require("../helper/api.feature");
const Helper = require("../helper/helper");
const ModelHelper = require("../helper/model.helper");
class UserController {
	static allUsers = Helper.catchAsyncError(async (req, res, next) => {
		const apiFeatures = new ApiFeatures(UserModel.find(), req.query)
			.filter()
			.pagination()
			.selectedFields()
			.sort();
		const users = await apiFeatures.query;
		Helper.resHandler(res, 200, true, users, "users fetched");
	});

	static getSingleUser = Helper.catchAsyncError(async (req, res, next) => {
		const user = await ModelHelper.findOne(UserModel, { _id: req.params.id });
		if (!user) throw new Error("Invalid user Id");
		await user.populate("role");
		Helper.resHandler(res, 200, true, user, "user fetched");
	});
	static addUser = Helper.catchAsyncError(async (req, res, next) => {
		if (req.body.role) delete req.body.role;
		const user = await ModelHelper.createOne(UserModel, req.body);
		Helper.resHandler(res, 200, true, user, "user created");
	});
	static editUser = Helper.catchAsyncError(async (req, res) => {
		const user = await ModelHelper.updateOne(
			UserModel,
			{ _id: req.params.id },
			req.body,
		);

		Helper.resHandler(res, 200, true, user, "user updated");
	});
	static deleteUser = Helper.catchAsyncError(async (req, res) => {
		await ModelHelper.deleteOne(UserModel, { _id: req.params.id });
		Helper.resHandler(res, 200, true, null, "user deleted");
	});
	static changeToBushinessAccount = Helper.catchAsyncError(async (req, res) => {
		const business = await Role.find({ type: "business" });
		const user = await ModelHelper.update(
			UserModel,
			{ _id: req.params.id },
			{ role: business._id },
		);
		if (!user) throw new Error("Invalid user Id");
		await user.populate("role");
		Helper.resHandler(res, 200, true, null, "user role updated");
	});

	// static register = async (req, res) => {
	// 	try {
	// 		const role = await RoleModel.create({
	// 			name: "admin",
	// 			type: "admin",
	// 			urls: [
	// 				{
	// 					url: "/api/v1/user/",
	// 					methods: {
	// 						GET: "GET",
	// 						POST: "POST",
	// 						PATCH: "PATCH",
	// 						DELETE: "DELETE",
	// 					},
	// 					params: {
	// 						id: "id",
	// 					},
	// 					query: { name: "name" },
	// 				},

	// 				{
	// 					url: "/api/v1/role/",
	// 					methods: {
	// 						GET: "GET",
	// 						POST: "POST",
	// 						PATCH: "PATCH",
	// 						DELETE: "DELETE",
	// 					},
	// 					params: {
	// 						id: "id",
	// 					},
	// 				},
	// 				{
	// 					url: "/api/v1/project/",
	// 					methods: {
	// 						GET: "GET",
	// 						POST: "POST",
	// 						PATCH: "PATCH",
	// 						DELETE: "DELETE",
	// 					},
	// 					params: {
	// 						id: "id",
	// 					},
	// 				},
	// 				{
	// 					url: "/api/v1/building/",
	// 					methods: {
	// 						GET: "GET",
	// 						POST: "POST",
	// 						PATCH: "PATCH",
	// 						DELETE: "DELETE",
	// 					},
	// 					params: {
	// 						id: "id",
	// 					},
	// 				},
	// 				{
	// 					url: "/api/v1/unit/",
	// 					methods: {
	// 						GET: "GET",
	// 						POST: "POST",
	// 						PATCH: "PATCH",
	// 						DELETE: "DELETE",
	// 					},
	// 					params: {
	// 						id: "id",
	// 					},
	// 				},
	// 			],
	// 		});
	// 		const user = await UserModel.create({
	// 			fName: "abdulrhman",
	// 			lname: "ashraf",
	// 			email: "admin@gmail.com",
	// 			password: "12345678",
	// 			role: role._id,
	// 		});
	// 		Helper.resHandler(res, 200, true, user, "user register");
	// 	} catch (error) {
	// 		Helper.resHandler(res, 500, false, error, error.message);
	// 	}
	// };
}
module.exports = UserController;
