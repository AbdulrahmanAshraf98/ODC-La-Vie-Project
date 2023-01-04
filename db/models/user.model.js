const crypto = require('crypto');
const mongoose = require("mongoose");
const { hash, validatePassword } = require("../../app/helper/crypt.helper");
const { generateJwtToken } = require("../../app/helper/jwttoken.helper");
const ValidateHelper = require("../../app/helper/validate.helper");

const userSchema = mongoose.Schema(
	{
		fName: {
			type: String,	
			lowercase: true,
			minLength: 5,
			maxLength: 20,
			required: true,
			validate: function () {
				if (!ValidateHelper.validateName(this.fName)) throw new Error("Invalid first name must be without any spaces ");
			},
		},
		lName: {
			type: String,
			lowercase: true,
			minLength: 5,
			maxLength: 20,
			required: true,
			validate: function () {
				if (!ValidateHelper.validateName(this.lName)) throw new Error("Invalid last name must be without any spaces ");
			},
		},
		age: {
			type: Number,
			min: 18,
			default: 18,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			validate: function () {
				if (!ValidateHelper.validateEmail(this.email)) throw new Error("Invalid email");
			},
		},
		password: {
			type: String,
			lower: true,
			trim: true,
			required: true,
			validate: function () {
				if (!ValidateHelper.validatePassword(this.password)) throw new Error("Invalid email");
			},
		},
		Phone: [
			{
				type: String,
				validate(value) {
					if (!ValidateHelper.validateMobilePhone(value))
						throw new Error("invalid number");
				},
			},
		],
		education:{
			type:String,

		},
		gender: {
			type: String,
			trim: true,
			lowercase: true,
			enum: ["male", "female"],
		},
		dOfBirth: {
			type: Date,
		},
		profileImage:String,
		tokens: [
			{
				token: { type: String, required: true },
			},
		],
		isActive:{
			type:Boolean,
			default:false,
		},
		passwordChangeAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
		bookmark:[],
	},
	{
		timestamps: true,
	},
);

userSchema.pre("save", async function () {
	if (this.isModified("password")) {
		this.password = await hash(this.password, 10);
	}
});
userSchema.statics.loginUser = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) return new Error("invalid Email");
	const validPassword=await validatePassword(password, user.password)
	if (!validPassword)
		throw new Error("invalid password");
	return user;
};
userSchema.methods.generateResetToken=async function(){
	const resetToken = crypto.randomBytes(32).toString('hex');
  	this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
	return this.passwordResetToken;
}
userSchema.methods.generateToken = async function () {
	const user = this;
	const token = generateJwtToken({ _id: user._id });
	user.tokens.push({ token });
	await user.save();
	return token;
};

userSchema.methods.toJSON = function () {
	const data = this.toObject();
	delete data.password;
	delete data.tokens;
	delete data._v;
	return data;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
