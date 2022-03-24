require('dotenv').config();
const express = require("express");
const _ = require("lodash");
const mongoose = require("mongoose");
// const md5 = require("md5"):
//
const bcrypt = require("bcrypt");
const saltRound =10;



//////////////database part//////////////////////





const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
});



// userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});


const User = new mongoose.model("User", userSchema);

const models = {};
const getModel = (collectionName) => {
  if (!(collectionName in models)) {
    models[collectionName] = connection.model(
      collectionName, ArticleSchema, collectionName
    );
  }
  return models[collectionName];
};












////////////////server routes part//////////////////////////





const app = express();


///////////////////////////////routes for /home path of url////////////////////////////////////

app.route("/")
  .get((req, res) => {
           res.render("home");});

///////////////////////////////routes for /home path of url////////////////////////////////////
app.route("/home")
  .get((req, res) => {
           res.render("home");});





///////////////////////////////routes for /register path of url////////////////////////////////////
app.route("/register")
  .get((req, res) => {
           res.render("register");})


   .post((req,res)=>{

    bcrypt.hash(req.body.password,saltRound,function(err,hash){
      const newUserName=req.body.username;
       const newPassword =hash;
       const newUser= new User({email:newUserName,password:newPassword}) ;
       newUser.save((err)=>{
         if(err){res.send(err)}
         else{ res.render("secrets");}
       })

    })




  });
   ///////////////////////////////routes for /login path of url////////////////////////////////////
   app.route("/login")
     .get((req, res) => {
                res.render("login",{message:""});})

      .post((req, res) => {

        const enteredUserName=req.body.username;
        const enteredPassword =req.body.password;
        User.findOne({email:enteredUserName},(err,foundUser)=>{
              if(err){res.send(err)}

              else{ if(foundUser)
                         {

                           bcrypt.compare(enteredPassword,foundUser.password,function(err,result){

                             if(result === true){   res.render("secrets")}
                             else {res.render("login",{message:"Your password is incorrect please re-enter your password."})
                                  }

                           }


                         )


                          }
                    else{res.render("login",{message:" Please check your username is correct or You need to Register with us."})
                        }



              }


               })


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
  .get((req,res)=>{res.render("home")});

module.exports = app;
