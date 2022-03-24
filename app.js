//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
// const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
// const session = require('cookie-session');
// const bodyParser = require('body-parser');

// const mongoose = require('mongoose');
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');


// const mongoose = require("mongoose");
const Router = require("./routes")
// const flash = require('connect-flash');


const app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(flash());


app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');








app.use(Router);

app.listen(3000, function() {
  console.log("server is started at port 3000")
});
