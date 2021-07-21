const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
	username: {
		type: "string",
		required: true,
		unique: true
	},
	password: {
		type: "string",
		required: true,
		unique: false
	},

	auth_tokens: [
			{
				token: {
					type: "string",
					required: true
				}
			}
		]
});


userSchema.plugin(passportLocalMongoose);

const user_model = mongoose.model("User", userSchema);

module.exports = user_model;