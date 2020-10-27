const mongoose = require("mongoose");
const marked = require("marked");
const createDomPurify = require("dompurify");
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);

const campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   imageId: String,
   description: String,
   markdown: String,
   sanitizedHtml: String,
   category:
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Category"
      }
   ,
   createdAt: { type: Date, default: Date.now},
   author: {
      id:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"User"

      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

campgroundSchema.pre('validate', function(next){
   if(this.markdown){
      this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
   }
   next();
})

module.exports = mongoose.model("Campground", campgroundSchema);