const path = require("path");
const express = require("express");
const app = express();
const formData = require("express-form-data");
const userRoutes = require("../routes/user.routes");
const roleRoutes = require("../routes/role.routes");
const meRoutes = require("../routes/me.routes");
const shopRoutes = require("../routes/shop.routes");
const productRoutes = require("../routes/product.routes");
const postRoutes = require("../routes/post.routes");
const reviewRoutes = require("../routes/review.routes");
const searchRoutes = require("../routes/search.routes");

app.use(express.json());
app.use(formData.parse());
app.use(express.static(path.join(__dirname, "../public/uploads")));
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/me", meRoutes);

app.use("/api/v1/shop", shopRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/review", reviewRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/role", roleRoutes);
app.all("*", (req, res) => {
	res.status(404).send({
		apisStatus: false,
		message: "Invalid URL",
		data: {},
	});
});
module.exports = app;
