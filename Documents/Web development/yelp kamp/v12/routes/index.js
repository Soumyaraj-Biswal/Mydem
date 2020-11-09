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


//root route
routes.get("/", function(req,res){

    res.render("landing");

});

routes.get("/register",function(req,res){
    res.render("register");
});

routes.post("/register", function(req,res){
    
    /* var end = newuser.indexOf(',');
    var key = 0;
    if(end !== -1){
    key = newuser.substring(end+1,newuser.length);
    newuser = newuser.substring(0,end);
    }  */
    var key = req.body.admin;
    var newuser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    });
    if(req.body.avatar.length !== 0){
        newuser.avatar = req.body.avatar;
    }
    if(key == process.env.ADMINCD){
        newuser.isAdmin = true;
    }
    
   User.register(newuser, req.body.password,function(err, user){
            if(err){
                req.flash("error", err.message);  
                return res.redirect("/register");
            }
            passport.authenticate("local")(req,res,function(){
                req.flash("success", "Welcome to YelpCamp "+user.username);
                res.redirect("/campgrounds");
            });
        });
    
});

//Show login form
routes.get("/login", function(req,res){
    res.render("login");
});

//handling login route
routes.post("/login", passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect: "/login"
}), function(req,res){
});

//logout route
routes.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/campgrounds");
});

//show Reset password form
routes.get('/forgot',function(req, res){
    res.render('user/forgot');
});

routes.post('/forgot',function(req,res,next){
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                if(err){
                    console.log(err);
                }
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user){
                if(err){
                    console.log(err);
                }
                if(!user){
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;

                user.save(function(err){
                    done(err, token, user);
                });
            });
        },
        function(token, user , done){
          
        
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'sizzlingpooja789@gmail.com',
                    pass: process.env.GMAILPW
                }
            });var mailOptions = {
                to: user.email,
                from: 'sizzlingpooja789@gmail.com',
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                  'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
              };
              smtpTransport.sendMail(mailOptions, function(err) {
                if(err){
                    console.log(err);
                }
                console.log('mail sent');
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
              });
             }
          ], function(err) {
             if(err) 
                return next(err);
             res.redirect('/forgot');
           });
         });
        
        routes.get('/reset/:token', function(req, res) {
          User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
              if(err){
                  console.log(err);
              }
            if (!user) {
              req.flash('error', 'Password reset token is invalid or has expired.');
              
              return res.redirect('/forgot');
            }
            res.render('user/reset', {token: req.params.token});
          });
        });
        
        routes.post('/reset/:token', function(req, res) {
          async.waterfall([
            function(done) {
              User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                if(err){
                    console.log(err);
                }
                if (!user) {
                  req.flash('error', 'Password reset token is invalid or has expired.');
                  return res.redirect('back');
                }
                if(req.body.password === req.body.confirm) {
                  user.setPassword(req.body.password, function(err) {
                    if(err){
                        console.log(err);
                    }
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
        
                    user.save(function(err) {
                        if(err){
                            console.log(err);
                        }
                      req.logIn(user, function(err) {
                        if(err){
                            console.log(err);
                        }
                        done(err, user);
                      });
                    });
                  })
                } else {
                    req.flash("error", "Passwords do not match.");
                    return res.redirect('back');
                }
              });
            },
            function(user, done) {
            
            var smtpTransport = nodemailer.createTransport({  
                service: 'Gmail',  
                auth: {  
                  user: 'sizzlingpooja789@gmail.com',
                    pass: process.env.GMAILPW  
                }  
              }); 
            
            
              var mailOptions = {
                to: user.email,
                from: 'sizzlingpooja789@gmail.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                  'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
              };
              smtpTransport.sendMail(mailOptions, function(err) {
                if(err){
                    console.log(err);
                }
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
              });
            }
          ], function(err) {
            if(err){
                console.log(err);
            }
            res.redirect('/campgrounds');
          });
        });

//Users profiles route

routes.get("/user/:id", isLoggedIn, async function(req,res){

    try{
        let member=false;
        let user = await User.findById(req.params.id).populate('followers').exec();
        Campground.find().where('author.id').equals(user._id).exec(function(err, camps){
        
        var flag = 0;
        user.followers.forEach(async follower => { 
            if(follower._id == req.user.id) 
            {
                flag = 1
                member = true;
                
            }
        });
            
        if(flag==0){
            member = false;
        }
        
            
            res.render("user/show", {user, camps ,member});
        });

    } catch(err){
        req.flash(err.message);
        return res.redirect("/");
    }
});

routes.get('/follow/:id', followChecker, async function(req, res){
    try{
        let user = await User.findById(req.params.id);
        user.followers.push(req.user._id);
        let cUser = await User.findById(req.user._id);
        cUser.following.push(req.params.id);
        cUser.save();
        user.save();
        req.flash('success', 'Successfully followed '+user.username + '!');
        res.redirect('/user/' + req.params.id);
    }catch(err){
        req.flash('error', err.message);
        res.redirect('back');
    }
});


function followChecker(req,res,next){
    let user = User.findById(req.params.id).populate('followers').exec();
    // user.followers.forEach(follower => { 
    //     if(follower._id == req.user.id) 
    //     {
    //         req.flash("error", "You already follow him");
    //         res.redirect("/campgrounds");
            
    //     }
    // });
    console.log(user);
    next();
    
    
}




module.exports = routes;