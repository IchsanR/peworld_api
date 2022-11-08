// import multer
const multer = require("multer");
// import path
const path = require("path");

// management file
const multerUpload = multer({
	storage: multer.diskStorage({
		destination: (req, res, cb) => {
			cb(null, "./public");
		},
		filename: (req, file, cb) => {
			const ext = path.extname(file.originalname);
			const fileName = Date.now() + "" + ext;
			cb(null, fileName);
		},
	}),
	fileFilter: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		// console.log(ext);
		if (ext === ".jpg" || ext === ".png" || ext === ".JPG" || ext === ".PNG") {
			cb(null, true);
		} else {
			const error = {
				message: "file harus gambar",
			};
			cb(error, false);
		}
	},
	limits: { fileSize: 2 * 1024 * 1024 },
});

// untuk middleware
const uploadUser = (req, res, next) => {
	const multerSingle = multerUpload.single("profile_pic");
	multerSingle(req, res, (err) => {
		if (err) {
			res.json({
				message: "err",
				error: err,
			});
		} else {
			next();
		}
	});
};

module.exports = uploadUser;
