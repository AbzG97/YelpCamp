const express = require("express");
const router = express.Router();
const campground_model = require("../models/campground.js");
const middleware = require("../middleware");



//shows all of the current campgrounds
router.get("/campgrounds", async(req, res) => {
	try {
		const campgrounds = await campground_model.find({});
		if(campgrounds.length === 0){
			res.status(304).send({message: "No campgrounds were found in the database"});
		}
		// res.render("campgrounds/index.ejs", {campgrounds : campgrounds, currentUser: req.user});
		res.status(200).send({campgrounds: campgrounds});
	}
	catch {
		res.status(500).send({message: "Server error"});

	}
		
});

router.get("/campgrounds/campgroundsForm", middleware.authenticate, async (req,res) => {
	res.render("campgrounds/new.ejs");
});

router.post("/campgrounds", middleware.authenticate, async (req,res) => {
	let name= req.body.campName;
	let image= req.body.campImg;
	let desc = req.body.campDesc;
	let data = {name: name , image: image, desc: desc};
	try {
		const new_campground = new campground_model(data);
		new_campground.createdBy.id = req.user._id;
		new_campground.createdBy.username = req.user.username;
		await new_campground.save();
		res.status(201).send({message:"campground created", new_campground: new_campground});
		// res.redirect("/campgrounds")
	}
	catch {
		res.status(500).send({message: "Server error"});
	}
			
});


// displays info about the selected campground
router.get("/campgrounds/:id", async (req, res) => {
	try {
		const found_campground = await campground_model.findById(req.params.id);
		if(!found_campground){
			res.status(304).send({message: "No campground was found in the database"});
		}
		res.status(200).send({message: "Campground found", found_campground: found_campground});
		// res.render("campgrounds/show.ejs", {campground: foundCampground});
	}
	catch {
		res.status(500).send({message: "Server error"});
	}
});

// send the edit form to the selected campground
router.get("/campgrounds/:id/edit", middleware.authenticate, async (req, res) => {
	try {
		const found_campground = await campground_model.findOne({_id: req.params.id, 'createdBy.id': req.user._id});
		if(!found_campground){
			res.status(304).send({message: "No campground was found in the database"});
		}
		res.render("campgrounds/edit.ejs", {campground : found_campground});


	} 
	catch {

	}
});


// updating the campground
router.put("/campgrounds/:id", middleware.authenticate, async (req, res) => {
	let id = req.params.id;
	let updatedName = req.body.campName;
	let updatedImage = req.body.campImg;
	let updatedDesc = req.body.campDesc;
	let updated_data = {name: updatedName, image: updatedImage, desc: updatedDesc};
	try {
		const updated_campground = await campground_model.findOneAndUpdate({_id: req.params.id, 'createdBy.id': req.user._id}, updated_data);
		res.status(200).send({message: "Campground data updated", updated_campground: updated_campground});
	} catch {
		res.status(500).send({message: "Server error"});
	}
});

// Deleting campgrounds
router.delete("/campgrounds/:id", middleware.authenticate,  async (req, res) => {
	try {
		const updated_campground = await campground_model.findOneAndDelete({_id: req.params.id, 'createdBy.id': req.user._id});
		res.status(200).send({message: "Delete successful"});
	} catch {
		res.status(500).send({message: "Server error"});

	}
});

module.exports = router;
