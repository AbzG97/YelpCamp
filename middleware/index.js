// MODELS
const Campground = require("../models/campground.js"),
 	  Comment = require("../models/comment.js");

const user_model = require("../models/user");
const jwt = require("jsonwebtoken");

var middleware = {};

middleware.authenticate = async (req, res, next) => {
	try {
		const user_token = req.cookies.auth_token;
		console.log(user_token);
		const decoded_token = jwt.verify(user_token, 'secretKey');
		const auth_user = await user_model.findOne({_id: decoded_token.id, 'auth_tokens.token': user_token});
		console.log(auth_user);
		if (!auth_user) {
			return res.status(401).send({message :"Please authenticate"});
		}
		req.user = auth_user;
		next();

	} catch {
		res.status(500).send({message: "Please authenticate to procced"});
	}

}




middleware.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				console.log("campground not found");
			} else {
				// check if user owns the comment if so they can edit / delete it
				Comment.findById(req.params.commentId, function(err, foundComment){
					if(foundComment.author.id.equals(req.user._id)){
						return next();
					} else {
						req.flash("error", "This comment is not created by you thus you are not authorized to edit/delete  it");	
						res.redirect("/login");
					}	
				});
			}
		});
	} else {
		console.log("you need to login first to edit");
		res.redirect("/login");
		}	
	
};

middleware.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				console.log("campground not found");
			} else {
				// check if user owns the campground if so they can edit it
				if(foundCampground.createdBy.id.equals(req.user._id)){
					return next();
				} else {
					req.flash("error","This campground is not created you thus you are not authorized to edit/delete  it");	
					res.redirect("/login");
				}
			}
		});
	} else {
		console.log("you need to login first to edit");
		res.redirect("/login");
		}		
};

middleware.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next(); // if the user is logged it will run next() method which means exactly to move on the next method which is 
		// the callback function of every app.(get/post) method in express
	} else {
		req.flash("error", "You need to be logged in first");
		res.redirect("/Login");
	}	
};

module.exports = middleware;