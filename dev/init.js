require("dotenv").config();
const connectToMongoDb = require("../db/connection");
const fs = require("fs");
const role = require("../db/models/role.model");
const user = require("../db/models/user.model");
connectToMongoDb();

const roles = JSON.parse(fs.readFileSync("./dev/roles.json", "utf-8"));
//import Data into db
const importData = async () => {
	try {
		await role.create(roles);
		const adminRole = await role.findOne({ type: "admin" });
		await user.create({
			fName: "admin",
			lName: "admin123",
			email: "admin@odc.com",
			password: "Admin1234@odc.com",
			isActive: true,
			role: adminRole,
		});
		console.log("data successfully loaded");
	} catch (error) {
		console.log(error);
	}
	process.exit();
};

// delete all data from db

const deleteData = async () => {
	try {
		await role.deleteMany();
		console.log("data successfully deleted");
	} catch (error) {
		console.log(error);
	}
	process.exit();
};

if (process.argv[2] === "--import") {
	importData();
} else if (process.argv[2] === "--delete") {
	deleteData();
}
