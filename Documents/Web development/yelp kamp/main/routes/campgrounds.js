var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var Comment = require('../models/comments');
var User = require("../models/user");
var Category = require("../models/category");
var middleware = require("../middleware");//index is a special automatically gets identified as the main file
require('dotenv').config();
var Notification = require("../models/notification");


//image upload feature
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
const { Mongoose } = require("mongoose");
cloudinary.config({ 
  cloud_name: 'dw3s4vvcf', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});



//routes

router.get("/", function(req,res){
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({name: regex}, function(err, allcampgrounds){
            if(err)
                console.log(err);
            if(allcampgrounds.length!=0){
                res.render("campgrounds/campground",{camps:allcampgrounds, currentUser: req.user});
            }
            
                
            Category.findOne({type:regex}).populate("posts").exec(function(err,category){
                if(err){
                    console.log(err);
                }
                
                
                
                if(category){
                    
                    res.render("campgrounds/campground",{camps: category.posts, currentUser: req.user});
                }
                else{
                    Campground.find().where('author.username').equals(regex).exec(function(err, camps){
        
                        if(camps)
                            res.render("campgrounds/campground",{camps:camps, currentUser: req.user});
                        else
                            res.render("campgrounds/campground",{camps:[], currentUser: req.user});
                    });
                        
                    
                    
                }
            });

            
                
            
                
        });
    }
    else{
        Campground.find({}, function(err, allcampgrounds){
            if(err)
                console.log(err);
            else
                res.render("campgrounds/campground",{camps:allcampgrounds, currentUser: req.user});
        });
    }
 
});
//new campground route
router.get("/new", middleware.isLoggedIn,function(req,res){
    Category.find({}, function(err, allcat){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/new", {cat: allcat});
        }
    })
});

//show route
router.get("/:id", function(req,res){
    var id = req.params.id;
    //find campground with provided id
    Campground.findById(id).populate("comments").exec(function(err,foundcampgrounds){

        if(err)
            console.log(err);
        else{
            
            res.render("campgrounds/show", {camp:foundcampgrounds});
        }
    });
    
});

//adding new campground route
router.post("/", middleware.isLoggedIn, upload.single('image'),async function(req,res){
    
    cloudinary.v2.uploader.upload(req.file.path,async function(err,result) {
        if(err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        // add cloudinary url for the image to the campground object under image property
        req.body.campground.image = result.secure_url;

        req.body.campground.imageId = result.public_id;
        // add author to campground
        req.body.campground.author = {
          id: req.user._id,
          username: req.user.username
        }
        
        Campground.create(req.body.campground,async function(err,campground){
            try{
                
                let user = await User.findById(req.user._id).populate('followers').exec();
                
                Notification.findOne({campgroundId: campground._id},async function(err,notification){
                    if(notification){
                        for(const follower of user.followers){
                            let notification = await Notification.create(newNotification);
                            follower.notifications.push(notification);
                            follower.save();
                        }
                    }else{
                        let newNotification = {
                            username: req.user.username,
                            campgroundId: campground._id
                        };
                        for(const follower of user.followers){
                            let notification = await Notification.create(newNotification);
                            follower.notifications.push(notification);
                            follower.save();
                        }
                    }
                });
                
                //category adding
                var a = req.body.category;
                a = a.toLowerCase();
                Category.findOne({type:a},function(err,cate){
                    
                        if(err){
                            console.log(err);
                        }
                    
                        if(cate){
                            cate.posts.push(campground);
                            cate.save();
                            campground.category=cate;
                            
                            campground.save();
                            
                            
                        }
                        else{
                            console.log("New Category Added");
                            var o = {type: a};
                            Category.create(o,function(err,category){
                                if(err){
                                    console.log(err);
                                }
                                category.posts.push(campground);
                                category.save();
                                campground.category=category;
                        
                                campground.save();
                            });

                        }
                        
                    });
                
                res.redirect("/campgrounds/" + campground._id);
            }catch(err){
                req.flash('error', err.message);
                res.redirect('back');
            }
        });
    });
});

//edit campground route

router.get("/:id/edit",middleware.checkCampgroundownership,function(req,res){

    Campground.findById(req.params.id).populate("category").exec(function(err,foundcampgrounds){
        Category.find({}, function(err, allcat){
        res.render("campgrounds/edit",{camp: foundcampgrounds,cat:allcat});
        });
    });
    //does user own the campground

    

});

//update campground route
router.put("/:id",middleware.checkCampgroundownership, upload.single('image'), function(req,res){
    
    Campground.findById(req.params.id, async function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(campground.imageId);
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  campground.imageId = result.public_id;
                  campground.image = result.secure_url;
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }

                var a = req.body.category;
            
                a = a.toLowerCase(a);

                Category.findById(campground.category,function(err,cat){
                    if(cat){
                        cat.posts.forEach(id=>{
                            if(id.equals(campground.id)){
                                cat.posts.pop(id);
                                cat.save();
                                
                            } 
                         });
                    }
                })
                
                
                a = a.toLowerCase();
                Category.findOne({type:a},function(err,cate){
                    if(err){
                        console.log(err);
                    }
                
                    if(cate){
                        cate.posts.push(campground);
                        cate.save();
                        campground.category=cate;
                        campground.name = req.body.name;
                        campground.description = req.body.description;
                        campground.markdown = req.body.markdown;
                        
                        
                        campground.save();
                        
                    }
                    else{
                        console.log("New Category Added");
                        var o = {type: a};
                        Category.create(o,function(err,category){
                            if(err){
                                console.log(err);
                            }
                            category.posts.push(campground);
                            category.save();
                            campground.category=category;
                            campground.name = req.body.name;
                            campground.description = req.body.description;
                            campground.save();
                            
                        });
                        
                    }
                })
                

            
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
});

//destroy campground route
router.delete("/:id", middleware.checkCampgroundownership,function(req,res){
    Campground.findById(req.params.id, async function(err, campground) {
        if(err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
        try {
            await cloudinary.v2.uploader.destroy(campground.imageId);
            campground.comments.forEach(e=>{
                Comment.findByIdAndDelete(e,function(err,comment){
                    if(err){
                        console.log(err);
                    }
                    
                });
                
            });
            
            Category.findById(campground.category,function(err,cat){
            
                if(cat.posts){
                    cat.posts.forEach(id=>{
                        if(id.equals(campground.id)){
                            cat.posts.pop(id);
                            cat.save();
                            
                        } 
                     });
                }
            });
            User.findById(campground.author.id,function(err,user){
                
                user.followers.forEach(us=>{
                    User.findById(us,function(err,u){
                        if(u){
                            u.notifications.forEach(n=>{
                                Notification.findById(n,async function(err,not){
    
                                    if(not){
                                        if(not.campgroundId==req.params.id)
                                        {   
                                            not.remove();
                                            u.notifications.pop(n);
                                            u.save();
                                        }
                                    }
                                })
                            })
                        
                        }
                    })
                })
            })
            campground.remove();
            req.flash('success', 'Campground deleted successfully!');
            res.redirect('/campgrounds');
        } catch(err) {
            if(err) {
              req.flash("error", err.message);
              return res.redirect("back");
            }
        }
      });
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}





module.exports = router;
