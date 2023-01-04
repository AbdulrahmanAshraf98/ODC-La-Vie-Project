const mongoose = require("mongoose");

const shopSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "shop must have a name"],
		},
		owner: {
			type: mongoose.Schema.Types.ObjectID,
			required: [true, "shop must have a owner"],
		},
		products: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectID,
					ref: "Product",
				},
			],
			default: [],
		},
	},
	{
		toJSON: { virtuals: true },
		toOBJECT: { virtuals: true },
	},
);
shopSchema.virtual("ShopProducts", {
	ref: "Product",
	foreignField: "shop",
	localField: "_id",
});
shopSchema.pre(/^find/, function (next) {
	this.populate("ShopProducts");
	next();
});

const shop = mongoose.model("Shop", shopSchema);
module.exports = shop;
