//deklare express
const express = require("express");
const {
	list,
	detail,
	searchName,
	register,
	login,
	update,
	updatePass,
	updateImage,
	destroy,
} = require("../controller/user.controller");
const deleteFile = require("../middleware/deleteUser");
const userRouter = express.Router();

const jwtAuth = require("../middleware/jwtAuth");
const { isAdmin, isUser } = require("../middleware/authorization");
const uploadUser = require("../middleware/uploadUser");

userRouter
	// .get("/user", jwtAuth, isAdmin, list)
	.get("/user", list)
	.get("/user/:id_user", detail)
	.get("/user/search/:names", searchName)
	.put("/user/:id_user", update)
	.put("/user/pass", updatePass)
	.put("/user/image/:id_user", uploadUser, updateImage)
	.delete("/user/:id_user", deleteFile, destroy)

	// register
	.post("/register", register)
	// login
	.post("/login", login);

module.exports = userRouter;
