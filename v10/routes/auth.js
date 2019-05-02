var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


router.get("/",function(req,res){
    res.render("landing");
});

/*=======================
Authentication Routes
=======================*/

//register form for user
router.get("/register",function(req, res) {
    res.render("register");
});

//save data of register in mongodb
router.post("/register",function(req, res) {
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

//ask user for username and password
router.get("/login",function(req, res) {
    res.render("login");
});

//check weather username and password is correct
router.post("/login",passport.authenticate("local",{
     successRedirect : "/",
     failureRedirect : "/login",
     //failureFlash : "Deep Shah"
}),function(req,res){
});

//logout route
router.get("/logout",function(req, res) {
    req.logout();
    res.redirect("/");
});

//check user is log in or logout
function isloggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;