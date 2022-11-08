const fs = require("fs");
const userModel = require("../model/user.model");

const removeUser = async (req, res, next) => {
	const id_user = req.params.id_user;
	const data = await userModel.selectDetail(id_user);
	console.log(data.rows[0]);

	if (data.rows[0].profile_pic == "avatar.png") {
		next();
	} else {
		if (data.rows[0].profile_pic) {
			const photo = data.rows[0].profile_pic;
			// console.log(photo);
			fs.unlink(`./public/${photo}`, (err) => {
				if (err) {
					console.log(err);
					next();
				}
			});
			next();
		} else {
			res.json("image not found");
		}
	}
};

module.exports = removeUser;
