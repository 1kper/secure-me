require('dotenv').config();
const express = require("express");
const _ = require("lodash");
const mongoose = require("mongoose");
const app = express();

///////////////////////////////////////////////////for cookies and session ////////////////////////////////////////
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose =require("passport-local-mongoose");

app.use(session({
  secret:"Our little secret.",
  resave: false,
  saveUninitialized:false

}))
/////////////////////////////////////////////////from configure part of passport module documentation ////////////
app.use(passport.initialize());
app.use(passport.session());
////////////////////////////////////////////////for hashing the plaintext///////////////////////////////////////////

/// const md5 = require("md5"):

const bcrypt = require("bcrypt");
const saltRound =10;



/////////////////////////////////////////////////database with  mongoose schema-connection part//////////////////////





const userSchema = new mongoose.Schema({
  email: {
    type: String,
    // required: true,
  },
  password: {
    type: String,
    // required: true,
  }
});
////////////////////////////////////////////////////////
userSchema.plugin(passportLocalMongoose);


// userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});


const User = new mongoose.model("User", userSchema);

// // use static authenticate method of model in LocalStrategy
// passport.use(new LocalStrategy(User.authenticate()));
//
// // use static serialize and deserialize of model for passport session support
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

mongoose.connect('mongodb://localhost:27017/userDb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully to userDb");
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////
const models = {};
const getModel = (collectionName) => {
  if (!(collectionName in models)) {
    models[collectionName] = connection.model(
      collectionName, ArticleSchema, collectionName
    );
  }
  return models[collectionName];
};












//////////////////////////////////////////////////server routes part///////////////////////////////////////////////////////








/////////////////////////////////////////////////routes for / path of url////////////////////////////////////

app.route("/")
  .get((req, res) => {
           res.render("home");});

////////////////////////////////////////////////routes for /home path of url////////////////////////////////////
app.route("/home")
  .get((req, res) => {
           res.render("home");});





///////////////////////////////routes for /register path of url////////////////////////////////////
app.route("/register")
  .get((req, res) => {
           res.render("register");})


   .post((req,res)=>{
    //  THIS IS METHOD OF HASHING WITHOUT USING COOKIES AND SESSION - here  we don't have a login route
    // bcrypt.hash(req.body.password,saltRound,function(err,hash){
    //
    //
    //   const newUserName=req.body.username;
    //    const newPassword =hash;
    //    const newUser= new User({email:newUserName,password:newPassword}) ;
    //    newUser.save((err)=>{
    //      if(err){res.send(err)}
    //      else{ res.render("secrets");}
    //    })
    //    HERE WE HAVE TO DEFINE A LOGIN ROUTE THUS
    console.log(req.body);
    User.register(new User({username:req.body.username}),req.body.password , function(err,user){
      if(err){

       res.send(err);
       // res.redirect("/register");
     }
     else{

       passport.authenticate("local")(req,res,function(){res.redirect("/secrets")});
     }

    })

  });

///////////////////////////////routes for /secrets path of url////////////////////////////////////


app.route("/secrets")
       .get((req,res)=>{

                    if(req.isAuthenticated()){res.render("secrets")}
                    else{res.redirect("/login")};

       })


   ///////////////////////////////routes for /login path of url////////////////////////////////////
   app.route("/login")
     .get((req, res) => {
                res.render("login",{message:""});})

      .post( passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function(req, res) {
    res.redirect('/secrets');



        // (req, res) => {
        //
        // const enteredUserName=req.body.username;
        // const enteredPassword =req.body.password;




        // User.findOne({email:enteredUserName},(err,foundUser)=>{
        //       if(err){res.send(err)}

              // else{ if(foundUser)
              //            {
              //
              //              bcrypt.compare(enteredPassword,foundUser.password,function(err,result){
              //
              //                if(result === true){   res.render("secrets")}
              //                else {res.render("login",{message:"Your password is incorrect please re-enter your password."})
              // //                     }
              // //
              // //              }
              // //
              // //
              // //            )
              // //
              // //
              // //             }
              // //       else{res.render("login",{message:" Please check your username is correct or You need to Register with us."})
              // //           }
              // //
              // //
              // //
              // // }
              //
              //
              //  })


      });

///////////////////////////////routes for /secrets path of url////////////////////////////////////
// app.route("/secrets")
//   .get((req, res) => {
//            res.render("secrets");})
//////////////////////////////routes for / submit path of url////////////////////////////////////
app.route("/submit")
  .get((req, res) => {
           res.render("submit");});
///////////////////////////////routes for logout path of url////////////////////////////////////
app.route("/logout")
  .get((req,res)=>{
    req.logout();
    res.render("home")});

module.exports = app;
