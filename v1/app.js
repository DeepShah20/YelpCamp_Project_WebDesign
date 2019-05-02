var express = require("express");
var app = express();
var bodyParser = require("body-parser"); 

app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");
var campgrounds = [
       {name : "Paris" ,image : "https://cdn.pixabay.com/photo/2015/12/08/00/32/london-1081820__340.jpg"},
       {name : "London", image : "https://cdn.pixabay.com/photo/2015/12/08/00/32/london-1081820__340.jpg"},
       {name : "New York", image : "https://cdn.pixabay.com/photo/2015/12/08/00/32/london-1081820__340.jpg"},
       {name : "Paris" ,image : "https://cdn.pixabay.com/photo/2015/12/08/00/32/london-1081820__340.jpg"},
       {name : "London", image : "https://cdn.pixabay.com/photo/2015/12/08/00/32/london-1081820__340.jpg"},
       {name : "New York", image : "https://cdn.pixabay.com/photo/2015/12/08/00/32/london-1081820__340.jpg"},
       {name : "Paris" ,image : "https://cdn.pixabay.com/photo/2015/12/08/00/32/london-1081820__340.jpg"},
       {name : "London", image : "https://cdn.pixabay.com/photo/2015/12/08/00/32/london-1081820__340.jpg"},
       {name : "New York", image : "https://cdn.pixabay.com/photo/2015/12/08/00/32/london-1081820__340.jpg"},
       ]

app.get("/",function(req,res){
    res.render("landing");
});

app.get("/campgrounds",function(req,res){
    res.render("campgrounds",{campgrounds : campgrounds});
});

app.get("/campgrounds/new",function(req, res) {
    res.render("new");
})

app.post("/campgrounds",function(req,res){
    console.log(req.body);
    var name = req.body.new_campground;
    var image =req.body.image_url;
    var newcampground = {name : name ,image : image}
    campgrounds.push(newcampground);
    res.redirect("/campgrounds");
});

app.listen(process.env.PORT,process.env.ID,function(){
    console.log("Server started for YelpCamp..!!");
});