const multer = require("multer");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, `public/uploads`);
	},
	filename: (req, file, cb) => {
		const ext = file.originalname.split(".").pop();
		const newName = `user-${req.user.id}${Date.now()}.${ext}`;
		cb(null, newName);
	},
});
const upload = multer({
	storage,
	limits: { fileSize: 2000000 },
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype == "image/png" ||
			file.mimetype == "image/jpg" ||
			file.mimetype == "image/jpeg"
		) {
			cb(null, true);
		} else {
			cb(null, false);
			return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
		}
	},
});

module.exports = upload;
