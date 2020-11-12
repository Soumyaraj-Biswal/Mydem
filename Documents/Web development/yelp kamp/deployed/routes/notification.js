var express = require("express");
var routes = express.Router();
var passport = require("passport");
var User = require("../models/user");
const { closeDelimiter } = require("ejs");
const { Router } = require("express");
var Campground = require("../models/campgrounds");
var async = require('async');
require('dotenv').config();
var nodemailer = require('nodemailer');
var crypto = require('crypto');
const { isLoggedIn } = require("../middleware");
var Notification = require("../models/notification");
const { measureMemory } = require("vm");



routes.get('/notifications', isLoggedIn, async function(req, res){
    try{
        let user = await User.findById(req.user._id).populate({
            path: 'notifications',
            options: { sort: {"_id": -1} }
        }).exec();
        let allNotifications = user.notifications;
        
        
        let note = [];
        if(allNotifications.length){
            allNotifications.forEach(async (n,i)=>{
                
                
                note.push(await Campground.findOne().where('_id').equals(n.campgroundId).exec());
                if((i+1) == allNotifications.length){
                    res.render('notification/index', { allNotifications:note});
                }
                
                
                
            });
        }else{
            res.render('notification/index', { allNotifications:note});
        }
        
        
        
        
    } catch(err) {
        req.flash('error', err.message);
        res.redirect('back');
    }
});

routes.get('/notifications/:id', isLoggedIn, async function(req, res) {
    try{
        let notification = await Notification.findById(req.params.id);
        notification.isRead = true;
        notification.save();
        res.redirect(`/campgrounds/${notification.campgroundId}`);

    }catch(err){
        req.flash('error',err.message);
        res.redirect('back');
    }
});




module.exports = routes;