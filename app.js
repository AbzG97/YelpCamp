// PACKAGES
const express = require("express"),
	  app = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  passport = require("passport"),
	  localStrategy = require("passport-local"),
	  passportLocalMongoose = require("passport-local-mongoose"),
      methodOverride = require("method-override"),
	  flash = require("connect-flash");
	  cookieParser = require("cookie-parser");

// MODELS
const Campground = require("./models/campground.js"),
 	  Comment = require("./models/comment.js"),
	  seedDB = require("./seeds.js"),
	  User = require("./models/user.js");

// ROUTES
const campgroundRoutes = require("./routes/campgroundRoutes.js"),
	  commentRoutes = require("./routes/commentRoutes.js"),
	  authenRoutes = require("./routes/index.js");



app.use(express.urlencoded({extended: true}));
app.use(express.json());
mongoose.connect("mongodb://localhost/yelp_camp_db", {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});
app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(cookieParser());

// seedDB();


// PASSPORT CONFIGs
// app.use(require("express-session")({
// 	secret: "is yall finished, or yall done ?",
// 	resave: false,
// 	saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new localStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use(function(req, res, next){
// 	res.locals.currentUser = req.user;
// 	res.locals.error = req.flash("error");
// 	res.locals.success = req.flash("success");
// 	next();
// });

// using the routes
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(authenRoutes);



app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("YelpCamp server has started");
});
