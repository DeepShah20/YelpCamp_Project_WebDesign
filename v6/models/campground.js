var mongoose = require("mongoose");
var campgroundsSchema = new mongoose.Schema({
    name : String,
    image : String,
    description : String,
    comments : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "comment"
    }]
});
var Campground = mongoose.model("Campground",campgroundsSchema);
module.exports = Campground;
