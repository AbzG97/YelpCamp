const mongoose = require("mongoose");
// schema set up

const campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	desc: String,
	comments : [
		{
			 // adding the comments model to our campground schema
			type : mongoose.Schema.Types.ObjectId,
			ref : "Comment" // model name 
		}
	],
	// associate the newly created campground with a the user who created it 
	createdBy: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

const campground = mongoose.model("Campground", campgroundSchema);

// created a model which we can use in order to access mongoose method and interact with mongodb and our database
module.exports = campground;