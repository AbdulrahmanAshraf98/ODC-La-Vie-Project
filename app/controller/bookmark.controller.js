const ArrayHelper = require("../helper/array.helper");
const Helper = require("../helper/helper");

class BookmarkController {
	static getAllBookMark = Helper.catchAsyncError(async (req, res, next) => {
		Helper.resHandler(
			res,
			200,
			true,
			req.user.bookmark,
			"item bookmarked   successfully",
		);
	});
	static addToBookmark = Helper.catchAsyncError(async (req, res, next) => {
		req.user.bookmark.push(req.body);
		await req.user.save();
		Helper.resHandler(
			res,
			200,
			true,
			req.user,
			"item bookmarked   successfully",
		);
	});
	static getSingleBookmark = Helper.catchAsyncError(async (req, res, next) => {
		const bookmark = ArrayHelper.getObjectBy(
			req.user.bookmark,
			"id",
			req.params.bookmarkItemId,
		);
		if (!bookmark) throw new Error("No bookmark found");

		Helper.resHandler(res, 200, true, bookmark, "item removed successfully");
	});
	static removeItemFromBookmark = Helper.catchAsyncError(
		async (req, res, next) => {
			req.user.bookmark = ArrayHelper.deleteObjectFromArray(
				req.user.bookmark,
				"id",
				req.params.bookmarkItemId,
			);
			await req.user.save();
			Helper.resHandler(res, 200, true, req.user, "item removed successfully");
		},
	);
}
module.exports = BookmarkController;
