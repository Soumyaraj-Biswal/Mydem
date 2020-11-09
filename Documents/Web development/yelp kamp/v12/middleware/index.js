var Campground = require("../models/campgrounds");
var Comment = require("../models/comments")

var middlewareObj = {};

middlewareObj.checkCampgroundownership = function(req,res,next){
    if(req.isAuthenticated()){
        
        Campground.findById(req.params.id,function(err,foundcampground){
            if(err){
                req.flash("error", "CAmpground not found!!");
                res.redirect("back");
            }else{
                //does user own the campground
                if(foundcampground.author.id.equals(req.user._id) || req.user.isAdmin){
                    next()
                }else{
                    req.flash("error", "You dont have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
}

middlewareObj.checkCommentownership = function(req,res,next){
    if(req.isAuthenticated()){
        
        Comment.findById(req.params.comment_id, function(err,foundcomment){
            if(err){
                res.redirect("back");
            }else{
                //does user own the campground
                if(foundcomment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next()
                }else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to belogged in");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!!");
    res.redirect("/login");
}


module.exports = middlewareObj;