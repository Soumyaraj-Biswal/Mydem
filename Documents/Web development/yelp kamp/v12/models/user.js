var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var randomAvatar = require('random-avatar');

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: String,
    avatar: {type: String, default: randomAvatar({extension: 'jpg'})},
    firstName: String,
    lastName: String,
    email: {type: String,unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {type: Boolean, default: false},
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Notification'
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});
userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema);
