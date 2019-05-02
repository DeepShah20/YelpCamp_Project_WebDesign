var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//Get all campgrounds from database
router.get("/",function(req,res){
    Campground.find({},function(err,allCampground){
        if(err){
            console.log("You have error.!!");
        }else{
            res.render("campgrounds/campgrounds",{campgrounds : allCampground});
        }
    });
  
   
});

//create - add new campground to database
router.post("/",isloggedin,function(req,res){
    console.log(req.body);
    var name = req.body.new_campground;
    var image =req.body.image_url;
    var description = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username
    };
    var newcampground = {name : name ,image : image , description : description, author : author};
    Campground.create(newcampground,function(err,newcreated){
        if(err){
            console.log("Error..!!");
        }else{
            res.redirect("/campgrounds");
        }
    });
});

//Form page and submit button
router.get("/new",isloggedin,function(req, res) {
    res.render("campgrounds/new");
});

//description of campgrounds
router.get("/:id",function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log("Error..!!");
       } else{
           console.log(foundCampground);
            res.render("campgrounds/show",{campground : foundCampground });   
       }
    }); 
        
});

function isloggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;
