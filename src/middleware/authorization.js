// pengecekan admin dan user

const { failed } = require("../helper/file.respons");

module.exports = {
	isAdmin: (req, res, next) => {
		if (req.APP_DATA.tokenDecode.level === 0) {
			next();
		} else {
			failed(res, null, "failed", "user do not have access");
		}
	},
	isUser: (req, res, next) => {
		if (req.APP_DATA.tokenDecode.level === 1) {
			next();
		} else {
			failed(res, null, "failed", "user do not have access");
		}
	},
};
