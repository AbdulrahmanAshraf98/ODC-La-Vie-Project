const { default: mongoose } = require("mongoose");
const ValidateHelper = require("../../../app/helper/validate.helper");

const orderSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectID,
		required: true,
	},
	Phone: {
		type: String,
		validate(value) {
			if (!ValidateHelper.validateMobilePhone(value))
				throw new Error("invalid number");
		},
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
	address: { type: Object, required: [true, "must have a address"] },
	status: { type: String, default: "penning" },
	paymentMethod: {
		type: String,
		enum: ["creditCard", "Cash"],
		required: [true, "must have a payment method"],
	},
	paymentStatus: { type: String, default: "Not" },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
