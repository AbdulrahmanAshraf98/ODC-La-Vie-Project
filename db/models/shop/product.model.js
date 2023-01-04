const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "product must have a name"],
		},
		category: {
			type: String,
			required: [true, "product must have a category"],
		},
		price: {
			type: Number,
			required: [true, "product must have a price"],
		},
		reviews: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectID,
					ref: "Review",
				},
			],
			default: [],
		},
		shop: {
			type: mongoose.Schema.Types.ObjectID,
			ref: "Shop",
		},
	},
	{
		toJSON: { virtuals: true },
		toOBJECT: { virtuals: true },
	},
);
productSchema.virtual("ProductReviews", {
	ref: "Review",
	foreignField: "belongTo",
	localField: "_id",
});
productSchema.pre(/^find/, function (next) {
	this.populate({
		path: "ProductReviews",
		select: "_id content rating user createdAt",
	});
	next();
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
