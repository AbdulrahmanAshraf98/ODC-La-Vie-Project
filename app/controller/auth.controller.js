const crypto = require('crypto');
const Helper = require("../helper/helper");
const ModelHelper = require("../helper/model.helper");
const ArrayHelper = require("../helper/array.helper");
const UserModel = require("../../db/models/user.model");



const sendEmail = require("../helper/email.helper");

class AuthController {
	//register
	static register=Helper.catchAsyncError( async(req,res,next)=>{
		if (req.body.role) delete req.body.role;
		const user = await ModelHelper.createOne(UserModel,req.body) ;
		await sendEmail({
			email: user.email,
			subject: "active Email",
			text: `${req.protocol}://${req.get("host")}/api/v1/user/${
				user._id
			}/active`,
		});
		Helper.resHandler(
			res,
			200,
			true,
			{ user },
			"user added successfully",
		);
	})
	//login
	static login =Helper.catchAsyncError( async (req, res) => {		
			const user = await UserModel.loginUser(
				req.body.email,
				req.body.password,
			);
			if(!user.isActive)throw new Error("you must active your email ")
			const token = await user.generateToken();
			Helper.SendUserToken(user, token, "user added successfully", req, res);

	});

	static logout=Helper.catchAsyncError( async (req, res) => {		
		req.user.tokens=ArrayHelper.removeItemFromArray(req.user.tokens,req.user.token)
		req.user.save();
		Helper.resHandler(
			res,
			200,
			true,
			null,
			"user logout successfully",
		);

	});
	static logoutAll=Helper.catchAsyncError( async (req, res) => {		
		req.user.tokens=undefined;
		req.user.save();
		Helper.resHandler(
			res,
			200,
			true,
			null,
			"user logout in all devices  successfully",
		);

	});

	//email 
	static activeEmail=Helper.catchAsyncError( async (req, res,next) => {
		const user = await ModelHelper.findOne(UserModel, { _id: req.params.id });
		if (user.isActive) throw new Error("email actived ");
		user.isActive = true;
		await user.save();

		Helper.resHandler(res, 200, true, { user }, "user active  successfully");
	});
	static resendActiveEmail=Helper.catchAsyncError( async(req,res,next)=>{
		const user = await ModelHelper.findOne(UserModel,req.body.email) ;
		await sendEmail({
			email: user.email,
			subject: "active Email",
			text: `${req.protocol}://${req.get("host")}/api/v1/user/${
				user._id
			}/active`,
		});
		Helper.resHandler(
			res,
			200,
			true,
			null,
			"resendActiveEmail successfully",
		);
	})
	//forgetPassword
	static forgetPassword=Helper.catchAsyncError( async(req,res,next)=>{
		const user = await ModelHelper.findOne(UserModel,{email:req.body.email}) ;
		
		if (!user) return next(new Error('there no user with this email '));
		const resetToken = await user.generateResetToken();
		const resetUrl = `${req.protocol}://${req.get(
			'host'
		  )}/api/v1/user/resetPassword/${resetToken}`;
		  const massage =
			'Forget your password ? submit  a patch request  with your new password and password confirm';
		try{
			await sendEmail({
				email: user.email,
				subject: 'reset password  valid for 10 m',
				massage,
				text:resetUrl
			  });
		}
		catch(error){
			user.passwordResetToken = undefined;
			user.passwordResetExpires = undefined;
			user.save();
			throw new Error(error);
		}
		Helper.resHandler(res, 200, true, { user }, "resetToken send to email");
	})
	static resetPassword=Helper.catchAsyncError( async(req,res,next)=>{
		const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
		const user = await ModelHelper.findOne(UserModel,{
			passwordResetToken: hashToken,
			passwordResetExpires: { $gt: Date.now() },
		  }) ;
		if (!user)  throw new Error('token is invalid or expired ', 400);
  		user.password = req.body.password;
  		user.passwordResetToken = undefined;
  		user.passwordResetExpires = undefined;
  		await user.save();
		Helper.resHandler(
			res,
			200,
			true,
			{ user },
			"resetPassword  successfully",
		);
	})

}
module.exports = AuthController;
