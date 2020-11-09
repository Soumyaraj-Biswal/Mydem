const express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var User = require("../models/user");
var Category = require("../models/category");

var s=[];

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

router.post("/search",function(req,res){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    
    
    if(req.body.search){
        const regex = new RegExp(escapeRegex(req.body.search), 'gi');
        Campground.find().where('name').equals(regex).exec(function(err, allcampgrounds){
            if(err)
                console.log(err);
            if(allcampgrounds.length!=0){
                sender(allcampgrounds);
            }
            
            else{    
            Category.findOne({type:regex}).populate("posts").exec(function(err,category){
                if(err){
                    console.log(err);
                }
                
                
                
                if(category){
                    sender(category.posts);
                }
                else{
                    Campground.find().where('author.username').equals(regex).exec(function(err, camps){
        
                        if(camps)
                        
                            sender(camps);
                        
                    });
                }
            });
        }
    });
    
    }else{
        sender([]);
    }
    
    function sender(a){
        s=a;
        
        
    }
    console.log(s);
    res.json(s);
    
    
    
})

module.exports = router;