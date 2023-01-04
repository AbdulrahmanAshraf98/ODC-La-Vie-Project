const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
	{
		content: {
			type: String,
			required: [true, "contant can not be empty"],
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
			default: 1,
		},

		user: {
			type: mongoose.Schema.Types.ObjectID,
			ref: "User",
			required: [true, "review must have a author"],
		},
		belongTo: {
			type: mongoose.Schema.Types.ObjectID,
			required: [true, "review must belongTo product or post "],
		},
		belongToType: {
			type: String,
			enum: ["product", "post"],
		},
		createAt: {
			type: Date,
			default: Date.now,
		},
		updateAt: {
			type: Date,
		},
	},
	{
		toJSON: { virutals: true },
		toOBJECT: { virutals: true },
	},
);

reviewSchema.pre(/^find/, function (next) {
	this.populate({
		path: "user",
		select: "fName lName",
	});

	next();
});
const ReviewsPost = mongoose.model("Review", reviewSchema);
module.exports = ReviewsPost;
