var express = require("express");
var router = express.Router({mergeParams : true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware")

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
router.post("/",middleware.isloggedin,function(req,res){
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
router.get("/new",middleware.isloggedin,function(req, res) {
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

//edit campground
router.get("/:id/edit",middleware.checkcampground,function(req, res) {
    Campground.findById(req.params.id,function(err,foundCampground){
            res.render("campgrounds/edit",{campground : foundCampground});    
        
         
    }); 
});


//update campground
router.put("/:id",middleware.checkcampground,function(req,res){
    //Find and update campgrounds
    var data = { name : req.body.new_campground  , 
                image : req.body.image_url , 
                description : req.body.description };
                
    Campground.findByIdAndUpdate(req.params.id,data,function(err, updatedcampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    //redirect somewhere
});

//Delete route

router.delete("/:id",middleware.checkcampground,function(req,res){
   Campground.findByIdAndDelete(req.params.id,function(err){
       if(err){
           console.log(err);
       }else{
           res.redirect("/campgrounds");
       }
   }); 
});




module.exports = router;
