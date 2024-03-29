const UserModel = require("../../db/models/user.model");
const Helper = require("../helper/helper");
const { decodedToken } = require("../helper/jwttoken.helper");

const auth = Helper.catchAsyncError(async (req, res, next) => {
	let token = req.header("Authorization");
	if (!token) throw new Error("must have a token");
	token = token.replace("Bearer ", "");
	const decoded = decodedToken(token);
	const userData = await UserModel.findOne({
		_id: decoded._id,
		"tokens.token": token,
	});
	if (!userData) throw new Error("unauthorized");
	await userData.populate("role");
	req.user = userData;
	req.token = token;
	next();
});
const restrictTo = (...roles) =>
	Helper.catchAsyncError(async (req, res, next) => {
		if (!roles.includes(req.user.role?.type)) throw new Error("unauthorized");
		next();
	});

const checkPermission = Helper.catchAsyncError(async (req, res, next) => {
	let validUrl;
	let requestUrl = req.originalUrl;
	const requestParamsKey = Object.keys(req.params);
	const requestQueryKey = Object.keys(req.query);

	validUrl = req.user.role.urls.find((item) => {
		if (requestParamsKey.length > 0) {
			requestParamsKey.forEach((paramKey) => {
				if (item.params[paramKey]) {
					requestUrl = requestUrl.replace(`${req.params[paramKey]}`, "");
				}
			});
		}
		// if (requestQueryKey.length > 0) {
		// 	requestQueryKey.forEach((queryKey) => {
		// 		if (item.query[queryKey]) {
		// 			requestUrl = requestUrl.replace(
		// 				`${queryKey}=${req.query[queryKey]}`,
		// 				"",
		// 			);
		// 		}
		// 	});

		// 	requestUrl = requestUrl.replace("?", "");
		// }

		return item.url == requestUrl;
	});

	if (!validUrl) throw new Error("unauthorized");
	if (!validUrl.methods[req.method]) throw new Error("unauthorized");

	next();
});

const hasOwn = (userKey, requestKey) =>
	Helper.catchAsyncError(async (req, res, next) => {
		if (req.user.role.type != "admin") {
			const requestKeyValue = Helper.getIdFromRequest(req, requestKey);
			const hasOwn = req.user[userKey].find(
				(item) => item.toString() == requestKeyValue,
			);
			if (!hasOwn) throw new Error("unauthorized");
		}
		next();
	});

module.exports = { auth, restrictTo, checkPermission, hasOwn };
