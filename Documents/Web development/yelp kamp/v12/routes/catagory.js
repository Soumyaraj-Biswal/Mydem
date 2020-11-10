var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
const { closeDelimiter } = require("ejs");
const { Router } = require("express");
var Campground = require("../models/campgrounds");
var async = require('async');
var Category = require("../models/category");
const { isLoggedIn } = require("../middleware");



router.get("/category/:id", function(req,res){

    Category.findById(req.params.id).populate("posts").exec(function(err, cat){
        if(err)
            console.log(err);
        else{
            
                    res.render("category/index",{camps:cat.posts,category:cat});
                    
            
            
            
            
        }
    });
});
    
module.exports = router;
