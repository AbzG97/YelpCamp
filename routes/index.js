const express = require("express");
const router = express.Router();
const user_model = require("../models/user.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware/index");
const bcrypt = require("bcrypt");
	  

router.get("/",function(req,res){
	res.render("landing.ejs");
	
});


// ==============================
//		 REGISTRATION ROUTES
// ==============================

// this will take us to the registration form
router.get("/Register", function(req, res){
	res.render("users/registrationForm.ejs");
});

// take information from the form and create a new user to for registation and saving it to the database
router.post("/Register", async (req, res) => {

	// creating a new user 
	const new_user = new user_model(req.body);
	try {
		// generate token
		const new_token = jwt.sign({id: new_user._id.toString()}, "secretKey");
		new_user.auth_tokens = new_user.auth_tokens.concat({token: new_token});

		// hash password
		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(new_user.password, salt);
		new_user.password = hashed;
		
		res.cookie('auth_token',new_token, { httpOnly: true, secure: false, maxAge: 3600000 });
		await new_user.save();
		res.status(201).send({message: "user created", new_user: new_user});
	} catch {
		return res.status(500).send({message: "Server error"});
	}
});

// ==============================
//		 LOGIN ROUTES
// ==============================

// this will take us to the registration form
router.get("/Login", function(req, res){
	req.flash("error", "Please login first");
	res.render("users/loginForm.ejs");
});

// take information from the form and create a new user to for registation and saving it to the database
router.post("/Login", async (req, res) =>  {
	try {
		// find user
		const user_in_db = await user_model.findOne({username: req.body.username});
		if(!user_in_db){
			res.status(404).send({message: "username not found in database"});
		}

		// verify password
		const check = await bcrypt.compare(req.body.password, user_in_db.password);
		
		if(!check){
			res.status(404).send({message: "username or password are wrong"});
		}
		// generate token
		const new_token = jwt.sign({id: user_in_db._id}, "secretKey");
		user_in_db.auth_tokens = user_in_db.auth_tokens.concat({token: new_token});

		// set auth token in cookie
		res.cookie('auth_token',new_token, { httpOnly: true, secure: false, maxAge: 3600000 });
		await user_in_db.save();
		res.status(200).send({message: "user login successful", user_in_db: user_in_db});
		
	} catch {
		return res.status(500).send({message: "Server error"});
	}

});


// ==============================
//		 LOGOUT ROUTES
// ==============================

// this will take us to the registration form
router.get("/Logout", middleware.authenticate, async (req, res) => {
	try {
		const user_in_db = await user_model.findOne({_id: req.user._id});
		user_in_db.auth_tokens = [];
		await user_in_db.save();
		res.status(200).send({message: "Logout successful"});


	} catch {
		res.status(500).send({message: "Server error"});
	}
	
});


// get user info 
router.get("/profile", middleware.authenticate, async (req, res) => {
	try {
		res.send({user: req.user});

	} catch {
		res.status(500).send({message: "Server error"});
	}
});


module.exports = router;