const express = require("express");
const router = express.Router();
const user_model = require("../models/user.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware/index");
	  

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
	// console.log(new_user);
	try {
		const new_token = jwt.sign({id: new_user._id}, "secretKey");
		new_user.auth_tokens = new_user.auth_tokens.concat({token: new_token});
		await new_user.save();
		res.cookie('auth_token',new_token, { httpOnly: true, secure: false, maxAge: 3600000 });
		res.status(201).send({message: "user created", new_user: new_user});
	} catch {
		res.status(500).send({message: "Server error"});
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
router.post("/Login", passport.authenticate("local", {
	successRedirect:"/campgrounds",
	failureRedirect:"/Login"
	}), function(req, res){
});


// ==============================
//		 LOGOUT ROUTES
// ==============================

// this will take us to the registration form
router.get("/Logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out");
	res.redirect("/campgrounds");
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