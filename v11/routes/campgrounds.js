var express = require("express");
var router = express.Router({mergeParams : true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware")

//show all campgrounds from database
router.get("/",function(req,res){
    var noMatch;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({name : regex},function(err,allCampground){
        if(err){
            console.log("You have error.!!");
        }else{
            
            if(allCampground.length < 1){
              noMatch = "No Campground Match,Please Try Again"
            }
            res.render("campgrounds/campgrounds",{campgrounds : allCampground, noMatch : noMatch});
        }
    });
    }else{
    //get all campground from database
    Campground.find({},function(err,allCampground){
        if(err){
            console.log("You have error.!!");
        }else{
            res.render("campgrounds/campgrounds",{campgrounds : allCampground , noMatch : noMatch});
        }
    });
    }
});

//create - add new campground to database
router.post("/",middleware.isloggedin,function(req,res){
    console.log(req.body);
    var name = req.body.new_campground;
    var price = req.body.new_price;
    var image =req.body.image_url;
    var description = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username
    };
    var newcampground = {name : name ,price : price ,image : image , description : description, author : author};
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
       if(err || !foundCampground){
           req.flash("error","Campground not found");
           return res.redirect("back");
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

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
