const ArrayHelper = require("../helper/array.helper");
const Helper = require("../helper/helper");

class BookmarkController {
	static addToBookmark=Helper.catchAsyncError(async(req,res,next)=>{
        req.user.bookmark.push(req.body)
        await req.user.save();
        Helper.resHandler(
			res,
			200,
			true,
			req.user ,
			"item bookmarked   successfully",
		);
    })
    static removeItemFromBookmark=Helper.catchAsyncError(async(req,res,next)=>{
        req.user.bookmark=ArrayHelper.deleteObjectFromArray( req.user.bookmark,"id",req.params.bookmarkItemId);
        await req.user.save();
          Helper.resHandler(
			res,
			200,
			true,
			req.user ,
			"item removed successfully",
		);
    })
}
module.exports = BookmarkController;
