const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "product must have a name"],
		},
		category: {
			type: String,
			required: [true, "product must have a category"],
		},
		content: {
			type: String,
			required: [true, "post must have a content"],
		},
		reviews: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectID,
					ref: "Review",
				},
			],
		},
		author: {
			type: mongoose.Schema.Types.ObjectID,
			ref: "User",
			required: [true, "post must have a author"],
		},
		rating: {
			type: {
				likeCount: {
					type: Number,
					default: 0,
				},
				disLikeCount: {
					type: Number,
					default: 0,
				},
				totalCount: {
					type: Number,
					default: 0,
				},
			},
			average: Number,
		},
	},
	{
		toJSON: { virtuals: true },
		toOBJECT: { virtuals: true },
	},
);
postSchema.virtual("PostReviews", {
	ref: "Review",
	foreignField: "belongTo",
	localField: "_id",
});
postSchema.pre(/^find/, function (next) {
	this.populate({
		path: "author",
		select: "fName lName profileImage age _id",
	}).populate({
		path: "PostReviews",
		select: "_id review user createdAt",
	});
	next();
});
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
