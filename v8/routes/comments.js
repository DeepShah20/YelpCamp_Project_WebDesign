var express = require("express");
var router = express.Router({mergeParams : true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// =======================
// Comment Routs
// =======================

//comment form to add new comment
router.get("/new",isloggedin,function(req, res) {
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground : campground});
        }
    });
});

// //Add comments to database
router.post("/",isloggedin,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                        comment.author.id = req.user._id;
                        comment.author.username = req.user.username;
                        comment.save();
                        foundCampground.comments.push(comment);
                        foundCampground.save();
                        res.redirect("/campgrounds/" + req.params.id );
                    }
            });
        }
    });
});


//checking user is login or not
function isloggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;