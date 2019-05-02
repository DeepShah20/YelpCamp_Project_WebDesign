var express = require("express");
var app = express();
var bodyParser = require("body-parser"); 
var mongoose =  require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");

var campgroundsSchema = new mongoose.Schema({
    name : String,
    image : String,
    description : String
});
var Campground = mongoose.model("Campground",campgroundsSchema);

/*Campground.create(
    {
        name : "London", 
        image : "https://ipadable.com/wp-content/uploads/2017/10/orange_flower_macro_3-4k-wallpaper-300x300.jpg",
        description :"London is the capital and largest city of England and the United Kingdom."
       
    },function(err,campground){
        if(err) {
        console.log("You have error");
    } else {
        console.log("Campground has been saved");
        console.log(campground);
    }
});*/

app.get("/",function(req,res){
    res.render("landing");
});

//Get all campgrounds from database
app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allCampground){
        if(err){
            console.log("You have error.!!");
        }else{
            res.render("campgrounds",{campgrounds : allCampground});
        }
    })
  
   
});

//create - add new campground to database
app.post("/campgrounds",function(req,res){
    console.log(req.body);
    var name = req.body.new_campground;
    var image =req.body.image_url;
    var description = req.body.description;
    var newcampground = {name : name ,image : image , description : description}
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
    res.render("new");
});

//description of campgrounds
app.get("/campgrounds/:id",function(req, res) {
    Campground.findById(req.params.id,function(err, foundCampground){
       if(err){
           console.log("Error..!!");
       } else{
            res.render("show",{campground : foundCampground});   
       }
    }); 
        
})


app.listen(process.env.PORT,process.env.ID,function(){
    console.log("Server started for YelpCamp..!!");
});