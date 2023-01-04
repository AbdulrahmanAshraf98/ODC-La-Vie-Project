class Helper {
	static resHandler = (res, statusCode, apiStatus, data, message) => {
		res.status(statusCode).send({
			apiStatus,
			data,
			message,
		});
	};
	static catchAsyncError = (cb) => async (req, res, next) => {
		try {
			await cb(req, res, next);
		} catch (error) {
			Helper.resHandler(res, 500, false, error, error.message);
		}
	};
	static getIdFromRequest = (req, key) => {
		let id;
		if (req.params[key]) id = req.params[key];
		else if (req.body[key]) id = req.body[key];
		return id;
	};
}
module.exports = Helper;
