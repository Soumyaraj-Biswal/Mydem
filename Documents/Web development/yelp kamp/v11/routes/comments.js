var express = require("express");
var routes = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments")
var middleware = require("../middleware");//index is a special automatically gets identified as the main file



//comments save
routes.post("/",middleware.isLoggedIn,function(req,res){
    //lookup campgrounds using id
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
            res.render("/campgrounds");

        }
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //save comment
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }

    })

});

//comment edit route
routes.get("/:comment_id/edit", middleware.checkCommentownership,function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect(back);
        }else{
            res.render("comments/edit",{camp_id: req.params.id, comment: foundComment});
        }
    })

});

//comment update route
routes.put("/:comment_id", middleware.checkCommentownership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, update){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//destroy comment route
routes.delete("/:comment_id",middleware.checkCommentownership,function(req,res){
    Comment.findByIdAndDelete(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Comment deleted");
            res.redirect("back");
        }
    })
})


//middleware



module.exports = routes
