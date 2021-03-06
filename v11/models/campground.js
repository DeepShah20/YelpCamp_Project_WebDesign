var mongoose = require("mongoose");
var campgroundsSchema = new mongoose.Schema({
    name : String,
    price : String,
    image : String,
    description : String,
    createdAt : { type : Date , default : Date.now },
    comments : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "comment"
    }],
     author : {
        id : {
            type :  mongoose.Schema.Types.ObjectId,
            ref : "user"
        },
        username : String 
    }
});
var Campground = mongoose.model("Campground",campgroundsSchema);
module.exports = Campground;
