const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const createStripeSession = async (cartItem, orderToken) => {
	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			mode: "payment",
			line_items: [
				{
					// Provide the exact Price ID (for example, pr_1234) of the product you want to sell
					price: "{{PRICE_ID}}",
					quantity: 1,
				},
			],
			success_url: `${req.protocol}://${req.get(
				"host",
			)}/api/order/:${orderToken}/success`,
			cancel_url: `${req.protocol}://${req.get(
				"host",
			)}api/order/:${orderToken}/cancel`,
		});
		return session.url;
	} catch (error) {
		throw new Error(error);
	}
};
