const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
	user: {
		type: String,
		required: true,
	},
	products: [
		{
			productId: { type: Object },
			quantity: { type: Number, default: 1 },
		},
	],
	totalPrice: {
		type: Number,
		required: true,
		default: 0.0,
	},
});
const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
