const userModel = require("../model/user.model");
const { success, failed, successWithToken } = require("../helper/file.respons");
const { v4: uuidv4 } = require("uuid");

const bcrypt = require("bcrypt");
const jwtToken = require("../helper/generateJWT");
const cloudinary = require("../helper/cloudinary");

const userController = {
	// method
	list: (req, res) => {
		userModel
			.selectAll()
			.then((results) => {
				success(res, results.rows, "success", "get all user success");
			})
			.catch((err) => {
				failed(res, err.message, "failed", "get all user failed");
			});
	},
	detail: (req, res) => {
		const id_user = req.params.id_user;
		userModel
			.selectDetail(id_user)
			.then((results) => {
				success(res, results.rows, "success", "get user success");
			})
			.catch((err) => {
				failed(res, err.message, "failed", "get all user failed");
			});
	},

	searchName: (req, res) => {
		const names = req.params.names;
		const limit = parseInt(req.query.limit) || 2;
		const page = parseInt(req.query.page) || 1;
		const offset = (page - 1) * limit;
		userModel
			.selectName(names, limit, offset)
			.then((results) => {
				success(res, results.rows, "success", "get user success");
			})
			.catch((err) => {
				failed(res, err.message, "failed", "get all user failed");
			});
	},

	register: (req, res) => {
		try {
			// tangkap data dari body
			// const profile_pic = req.file.filename;
			const id = uuidv4();
			const { names, email, password, phone } = req.body;
			bcrypt.hash(password, 10, (err, hash) => {
				if (err) {
					failed(res, err.message, "failed", "fail hash password");
				}

				const data = {
					id_user: id,
					names,
					email,
					phone,
					password: hash,
					level: 1,
					profile_pic: req.file ? req.file.filename : "avatar.png",
					picture_link:
						"https://res.cloudinary.com/dhm4yjouq/image/upload/v1667927307/u9aetcgfmpnybyhudeao.jpg",
					// profile_pic: req.file ? req.file.filename : "avatar.png",
				};

				console.log(data);
				userModel.checkEmail(email).then((result) => {
					if (result.rowCount == 0) {
						userModel
							.register(data)
							.then((result) => {
								success(res, result, "success", "Akun berhasil dibuat");
							})
							.catch((err) => {
								failed(res, err.message, "failed", "Gagal membuat akun");
							});
					}

					if (result.rowCount > 0) {
						failed(res, null, "failed", "Email telah terdaftar");
					}
				});
			});
		} catch (err) {
			failed(res, err.message, "failed", " internal server error");
		}
	},
	login: (req, res) => {
		const { email, password } = req.body;
		userModel
			.checkEmail(email)
			.then((result) => {
				const user = result.rows[0];
				if (result.rowCount > 0) {
					bcrypt
						.compare(password, result.rows[0].password)
						.then(async (result) => {
							if (result) {
								const token = await jwtToken({
									email: user.email,
									level: user.level,
								});
								successWithToken(
									res,
									{ token, data: user },
									"success",
									"login success"
								);
							} else {
								// ketika pass salah
								failed(res, null, "failed", "email atau password salah");
							}
						});
				} else {
					// ketika username salah
					failed(res, null, "failed", "email atau password salah");
				}
			})
			.catch((err) => {
				failed(res, err.message, "failed", "internal server error");
			});
	},
	update: (req, res) => {
		// tangkap data dari body
		const id_user = req.params.id_user;
		const { names, job_desc, domisili, tempat_kerja, description } = req.body;

		const data = {
			id_user,
			names,
			job_desc,
			domisili,
			tempat_kerja,
			description,
		};

		userModel
			.update(data)
			.then((results) => {
				res.json(results);
			})
			.catch((err) => {
				res.json(err);
			});
	},
	updatePass: (req, res) => {
		// console.log(req.file);
		// const profile_pic = req.file.filename;

		// const id_user = req.params.id_user;
		const { email, password } = req.body;
		bcrypt.hash(password, 10, (err, hash) => {
			if (err) {
				failed(res, err.message, "failed", "fail hash password");
			}

			const data = {
				email,
				password: hash,
			};

			userModel
				.updatePass(data)
				.then((results) => {
					res.json(results);
				})
				.catch((err) => {
					res.json(err);
				});
		});
	},

	updateImage: async (req, res) => {
		const id_user = req.params.id_user;
		// const profile_pic = req.file.filename;
		const profile_pic = await cloudinary.uploader.upload(req.file.path);
		console.log(profile_pic);
		const data = {
			profile_pic: profile_pic.original_filename,
			picture_link: profile_pic.secure_url,
		};
		userModel
			.updateImage(id_user, data)
			.then((results) => {
				res.json(results);
			})
			.catch((err) => {
				res.json(err);
			});
	},

	destroy: (req, res) => {
		const id = req.params.id_user;
		userModel
			.destroy(id)
			.then((results) => {
				res.json(results);
			})
			.catch((err) => {
				res.json(err);
			});
	},
};

module.exports = userController;
