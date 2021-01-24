//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParse = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const encrypt = require("mongoose-encryption");
//const md5 = require("md5");
//const bcrypt = require('bcrypt');
//const saltRounds = 10;
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


const app = express();

app.set("view engine", 'ejs');
app.use(express.static("public"));
app.use(bodyParse.urlencoded({
    extended: true
}));
app.use(session({
    secret: "My little secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    secret: String
});

userSchema.plugin(passportLocalMongoose);

//var secret = process.env.SECRET;
//userSchema.plugin(encrypt, { secret: secret,  encryptedFields: ['password']  });

const User = mongoose.model('User', userSchema);


// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/secrets", function (req, res) {
//    if (req.isAuthenticated()) {
//        res.render("secrets");
//    } else {
//        res.redirect("/login")
//    }
    User.find({"secret": {$ne: null}}, function(err,foundusers){
        if(err){
            console.log(err);
        } else {
            if(foundusers){
                res.render("secrets", {
                    userWithSecrets: foundusers
                });
            }
        }
    });
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

app.get("/submit", function(req, res){
    if (req.isAuthenticated()) {
        res.render("submit");
    } else {
        res.redirect("/login")
    }    
});

app.post("/submit", function(req, res){
    const submitedSecret= req.body.secret;
    User.findById(req.user.id, function(err,founduser){
        if(err){
            console.log(err);   
        } else {
            if(founduser){
                founduser.secret = submitedSecret;
                founduser.save(function(){
                    res.redirect("/secrets");
                });
            }
        }
    });
});


app.post("/register", function (req, res) {
    User.register({
        username: req.body.username
    }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        }
    });
    //    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    //        // Store hash in your password DB.
    //        const newUser = new User({
    //            email: req.body.username,
    //            password: hash
    //            //       md5(req.body.password)
    //        });
    //        newUser.save(function (err) {
    //            if (err) {
    //                console.log(err);
    //            } else {
    //                res.render("secrets");
    //            }
    //        })
    //    });
});


app.post("/login", function (req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        }
    });

    //
    //    const username = req.body.username;
    //    const password = req.body.password;
    //    //          md5(req.body.password);
    //    User.findOne({
    //        email: username
    //    }, function (err, foundUser) {
    //        if (err) {
    //            console.log(err);
    //        } else {
    //            if (foundUser) {
    //                bcrypt.compare(password, foundUser.password, function (err, result) {
    //                    if (result === true) {
    //                        res.render("secrets");
    //                    } else {
    //                        res.send(result);
    //                    }
    //                }); //.compare
    //            }
    //            else {
    //                res.send("Username do not match");
    //            }
    //        } //else
    //    });
});








app.listen(3000, function () {
    console.log("Connected to port 3000");
});