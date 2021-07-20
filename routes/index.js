const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
	  

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
router.post("/Register", function(req, res){
	let username = req.body.username;
	let password = req.body.password;
	// creating a new user 
	User.register(new User({username: username}), password, function(err, createdUser){
		if(err){
			console.log("failed to create user");
			return res.render("users/registrationForm.ejs");
		} else {
			console.log("the following user data have been saved to the database");
			console.log(createdUser);
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Login successful");
				res.redirect("/campgrounds");
			});
		}
	});
	
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



module.exports = router;