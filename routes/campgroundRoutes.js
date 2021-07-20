const express = require("express");
const router = express.Router();
const Campground = require("../models/campground.js");
const middleware = require("../middleware");

//========================
//   CAMPGROUND ROUTES
//=======================

//INDEX (GET)route -  shows all of the current campgrounds
router.get("/campgrounds",function(req,res){
	// get all campgrounds from db 
	
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log("FAILED TO RETRIEVE CAMPS");
		} else{
			res.render("campgrounds/index.ejs", {campgrounds : allCampgrounds});
		}
		
	});
//	
	
});
// NEW (GET) ROUTE - sends the form to add camps
router.get("/campgrounds/campgroundsForm", middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new.ejs");
	
});

// CREATE (POST) ROUTE - creates a new campground
router.post("/campgrounds", middleware.isLoggedIn,  function(req,res){
	console.log(req.body);
	let name= req.body.campName;
	let image= req.body.campImg;
	let desc = req.body.campDesc;
	let newCampground = {name: name , image: image, desc: desc};
	Campground.create(newCampground, function(err, newCampground){
		if(err){
			console.log("SOMETHING WENT WRONG");
		}else{
			// adding user associations to the campground
			newCampground.createdBy.id = req.user._id;
			newCampground.createdBy.username = req.user.username;
			console.log(newCampground);
			newCampground.save();
			res.redirect("/campgrounds");
		}	
	});	
});


// SHOW (GET) ROUTE - displays info about the selected campground
router.get("/campgrounds/:id", function(req, res){
	// find the selected campground with the provided ID
	let id = req.params.id;
	Campground.findById(id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log("failed to retrive the selected campground");
		}else {
			// show template of that campground by returning the found campground giving a variable so it can be used in ejs
			//console.log(foundCampground);
			res.render("campgrounds/show.ejs", {campground: foundCampground});
			
		}
	});
	
});

// send the edit form to the selected campground
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log("campground not found");
		} else {
			// check if user owns the campground if so they can edit it
			res.render("campgrounds/edit.ejs", {campground : foundCampground});
		}
	});
});


// updating the campground
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
	let id = req.params.id;
	let updatedName = req.body.campName;
	let updatedImage = req.body.campImg;
	let updatedDesc = req.body.campDesc;
	let updatedCampground = {name: updatedName, image: updatedImage, desc: updatedDesc};
	Campground.findByIdAndUpdate(id, updatedCampground, function(err, updatedCampground){
		if(err){
			console.log("failed to updated campground");
			res.redirect("/campgrounds");
		} else {
			console.log("updated info display: \n " + updatedCampground);
			res.redirect("/campgrounds/"+ id);
		}
	});
});

// Deleting campgrounds
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership,  function(req, res){
	let id = req.params.id;
	Campground.findByIdAndRemove(id, function(err, removedCampground){
		if(err){
			console.log("failed to remove camp");
		} else {
			console.log("camp removed redirecting to main page....");
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;
