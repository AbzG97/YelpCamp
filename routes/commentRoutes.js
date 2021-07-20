const express = require("express");
const router = express.Router();
const Comment = require("../models/comment.js");
const Campground = require("../models/campground.js");
const middleware = require("../middleware");
// ==============================
//		 COMMENT ROUTES
// ==============================

// NEW ROUTE GET for comments of the selected campground
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn,  function(req, res){
	let id = req.params.id;
	Campground.findById(id, function(err, campground){
		if(err){
			console.log("camp not found");
		} else {
			console.log("camp found sending you the comment form page");
			res.render("comments/new.ejs", {campground: campground});
		}
	});
});

// CREATE ROUTE POST for comments of the slected campgrounds
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
	let id = req.params.id; // getting the id 
	// getting info from the form
	let text = req.body.text;
	let author = req.body.author;
	let comment = {text: text, author: author}; // creating a new comment object
	Campground.findById(id, function(err, selectedCamp){
		if(err){
			console.log("cant find camp");
		}
		else {
			Comment.create(comment, function(err, newComment){
				if(err){
					console.log("failed to add comment to the selectedCamp");
				} else {
					// adding a new username
					 newComment.author.id = req.user._id;
					 newComment.author.username = req.user.username;
					 newComment.save();
					// linking the posted comment to the user
					selectedCamp.comments.push(newComment);
					selectedCamp.save();
					console.log(selectedCamp);
					//console.log(comment);
					
					res.redirect("/campgrounds/" + id);
				} // end of inner else
			}); // end of create
		} // end of else
	}); // end of exec
}); // end of app.post


// editing the comments/ sending the comment edit form 

router.get("/campgrounds/:id/comments/:commentId/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.commentId, function(err, foundComment){
		if(err){
			console.log("can't find comment");
		} else {
			res.render("comments/edit.ejs", {campground: foundCampground, comment: foundComment});
		}
	}); // end of Comment find 	
}); // end of router.get


// updating the comment
router.put("/campgrounds/:id/comments/:commentId", middleware.checkCommentOwnership, function(req, res){
	let updatedtext = req.body.text;
	let updatedComment = {text: updatedtext};
	Comment.findByIdAndUpdate(req.params.commentId, updatedComment, function(err, updatedComment){
		if(err){
			console.log("failed to update comment");
			res.redirect("back");
		} else {
			console.log("comment updated");
			res.redirect("/campgrounds/"+ req.params.id );
		} // end of nested else 
	}); // end of Comment find 
}); // end of put method

// deleting comments
router.delete("/campgrounds/:id/comments/:commentId", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.commentId, function(err, foundComment){
		if(err){
			console.log("can't find comment");
		} else {
			console.log("comment deleted");
			res.redirect("/campgrounds/"+ req.params.id);
		}
	}); // end of Comment find 	
});

module.exports = router;
