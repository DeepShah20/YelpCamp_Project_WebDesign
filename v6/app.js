var express = require("express");
var flash = require("connect-flash");
var bodyParser = require("body-parser"); 
var mongoose =  require("mongoose");
var Campground = require("./models/campground");
var Comment     = require("./models/comment");
var seedDB = require("./seeds");
var passport = require("passport");
var localStrategy = require("passport-local");
var User = require("./models/user");
var app = express();


seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v6",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");
app.use(flash({ unsafe: true }));
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

app.get("/",function(req,res){
    res.render("landing");
});

//Get all campgrounds from database
app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allCampground){
        if(err){
            console.log("You have error.!!");
        }else{
            res.render("campgrounds/campgrounds",{campgrounds : allCampground});
        }
    });
  
   
});

//create - add new campground to database
app.post("/campgrounds",function(req,res){
    console.log(req.body);
    var name = req.body.new_campground;
    var image =req.body.image_url;
    var description = req.body.description;
    var newcampground = {name : name ,image : image , description : description};
    Campground.create(newcampground,function(err,newcreated){
        if(err){
            console.log("Error..!!");
        }else{
            res.redirect("/campgrounds");
        }
    });
});

//Form page and submit button
app.get("/campgrounds/new",function(req, res) {
    res.render("campgrounds/new");
});

//description of campgrounds
app.get("/campgrounds/:id",function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log("Error..!!");
       } else{
           console.log(foundCampground);
            res.render("campgrounds/show",{campground : foundCampground });   
       }
    }); 
        
});

// =======================
// Comment Routs
// =======================

//comment form to add new comment
app.get("/campgrounds/:id/comments/new",isloggedin,function(req, res) {
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground : campground});
        }
    });
});

// //Add comments to database
app.post("/campgrounds/:id/comments",isloggedin,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                     foundCampground.comments.push(comment);
                     foundCampground.save();
                     res.redirect("/campgrounds/" + req.params.id );
                    }
            });
        }
    });
});

/*=======================
Authentication Routes
=======================*/

app.get("/register",function(req, res) {
    res.render("register");
});

app.post("/register",function(req, res) {
    User.register(new User({username : req.body.username}),req.body.password,function(err,user){
       if(err){
           console.log(err.message);
           return res.render("register");
       } 
       passport.authenticate("local")(req,res,function(){
           res.redirect("/");
       });
    });
});

app.get("/login",function(req, res) {
    res.render("login");
});

app.post("/login",passport.authenticate("local",{
     successRedirect : "/",
     failureRedirect : "/login",
     //failureFlash : "Deep Shah"
}),function(req,res){
});

app.get("/logout",function(req, res) {
    req.logout();
    res.redirect("/");
});

function isloggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server started for YelpCamp..!!");
});