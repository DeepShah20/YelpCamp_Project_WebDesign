var express = require("express");
var router = express.Router({mergeParams : true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// =======================
// Comment Routs
// =======================

//comment form to add new comment
router.get("/new",middleware.isloggedin,function(req, res) {
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground : campground});
        }
    });
});

// //Add comments to database
router.post("/",middleware.isloggedin,function(req,res){
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

//Edit Route
router.get("/:comment_id/edit",middleware.checkcomment,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("comments/edit",{campground_id : req.params.id, comment : foundComment});         
        }
    });
});

//Update Route
router.put("/:comment_id",middleware.checkcomment,function(req,res){
   Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updateComment){
       if(err){
           console.log(err);
       }else{
            res.redirect("/campgrounds/" + req.params.id);        
       }
   }); 
});

//Delete Route
router.delete("/:comment_id",middleware.checkcomment,function(req,res){
    Comment.findByIdAndDelete(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});



module.exports = router;