var mongoose = require("mongoose");

var categorySchema = new mongoose.Schema({
   type: String,
   posts: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Campground"
      }
   ]
});

module.exports = mongoose.model("Category", categorySchema);