const mongoose = require("mongoose");
const Campground = require("./models/campground.js");
const Comment = require("./models/comment.js");
const user_model = require("./models/user");

// creating starter data 
var data = [
	{
		name: "Grand Canyon",
		image: "https://www.tripsavvy.com/thmb/sVcUCGnMX9RakuMr0j9aux-w2mo=/3776x2832/smart/filters:no_upscale()/grand-canyon--north-rim----cape-royal-574877869-			592436375f9b58f4c0803ca8.jpg",
		desc: "Blah blah blah blah"
	},
	{
		name: "Grand Canyon",
		image: "https://www.tripsavvy.com/thmb/sVcUCGnMX9RakuMr0j9aux-w2mo=/3776x2832/smart/filters:no_upscale()/grand-canyon--north-rim----cape-royal-574877869-			592436375f9b58f4c0803ca8.jpg",
		desc: "Blah blah blah blah"
	},
	{
		name: "Grand Canyon",
		image: "https://www.tripsavvy.com/thmb/sVcUCGnMX9RakuMr0j9aux-w2mo=/3776x2832/smart/filters:no_upscale()/grand-canyon--north-rim----cape-royal-574877869-			592436375f9b58f4c0803ca8.jpg",
		desc: "Blah blah blah blah"
	},
]

/*
	this function will delete all of the current campgrounds
	then add new ones with starter data using the data array
	then for each of those campgrounds a new comment will be added to these newly added camps
*/
const seedDB = async () => {
	await user_model.deleteMany({});
	console.log("users collection cleared");
	// remove camp ground
	// Campground.deleteMany({}, function(err){
	// 	if(err){
	// 		console.log("failed to remove data");
	// 	} else {
	// 		console.log("deletion successful");
	// 		// add campground automatically
	// 		for(let camp of data){
	// 			Campground.create(camp, function(err, addedCamp){
	// 				if(err){
	// 					console.log("Failed to add camp");
	// 					} else {
	// 						console.log("added campground");
	// 						// create comment for the newly added camps (addedCamp)
	// 						Comment.create({
	// 							text:"This place is great place to spend the weekdend",
	// 							author:"Alex"
	// 						}, function(err, comment){
	// 							if(err){
	// 								console.log("failed to add comment");
	// 							} else {
	// 								console.log("comment has been added");
	// 								// adds the comment to the campground
	// 								addedCamp.comments.push(comment);
	// 								addedCamp.save();
	// 								console.log(addedCamp);
	// 							} // end of 2nd nested else	
	// 						}); // end of Comment.create 
	// 					} // end of 1st nested else
	// 			}); // end of Campground.create
	// 		} // end of for loop
	// 	} // end of the outter else 
	//  }); // end of Campground.remove
}; // end of functions

module.exports = seedDB;