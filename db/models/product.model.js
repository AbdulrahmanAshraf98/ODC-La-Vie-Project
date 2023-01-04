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
            select:false
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
	foreignField: "product",
	localField: "_id",
});
productSchema.pre(/^find/, function (next) {
	this.populate({
		path: "ProductReviews",
		select: "_id review user createdAt",
	});
	next();
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
