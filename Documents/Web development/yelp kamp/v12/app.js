var express = require("express");
const app = express();
const session = require("express-session");

var bodyparser = require("body-parser");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comments");
var User = require("./models/user");
app.locals.moment = require('moment');
require('dotenv').config();
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://127.0.0.1:27017/mydem');
// mongoose.connect('mongodb+srv://soum:'+process.env.MPASS+'@cluster0.nlcyp.mongodb.net/mydem',{useNewUrlParser: true});
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(express.json({
    type: ['application/json', 'text/plain']
}))
app.use(flash());
//seed db
/* seedDB(); */

//passport configuration
const MongoStore = require('connect-mongo')(session);
app.use(require("express-session")({
    
    secret: 'secret',
    saveUninitialized: false,
    resave: false,
    cookie:{maxAge:3600000},
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(async function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error= req.flash("error");
    res.locals.success= req.flash("success");
    if(req.user){
        try{
            let user = await User.findById(req.user._id).populate('notifications', null, { isRead: false}).exec();
            res.locals.notifications = user.notifications.reverse();
            

            
            
        } catch(err){
            console.log(err.message);
        }
    }
    

    next();
});

var campgroundRoutes  =require("./routes/campgrounds"),
    commentRoutes  =require("./routes/comments"),
    searchRoutes = require("./routes/search"),
    indexRoutes  =require("./routes/index"),
    categoryRoutes = require("./routes/catagory"),
    notificationRoutes = require("./routes/notification");

app.use(indexRoutes);
app.use(searchRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use(notificationRoutes);
app.use(categoryRoutes);

app.listen(process.env.PORT || 3000,function(){
    console.log("started");
});


