var express = require("express");
var flash = require("connect-flash");
var bodyParser = require("body-parser"); 
var mongoose =  require("mongoose");
var Campground = require("./models/campground");
var Comment     = require("./models/comment");
var seedDB = require("./seeds");
var passport = require("passport");
var localStrategy = require("passport-local");
var methodoverride = require("method-override");
var User = require("./models/user");
var app = express();

//requring routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/auth");

//seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v6",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");
app.use(flash({ unsafe: true }));
app.use(methodoverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(require("express-session")({
    secret : "Deep Shah's Application",
    resave : false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/",authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server started for YelpCamp..!!");
});