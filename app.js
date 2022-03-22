//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const Router = require("./routes")

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');


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






app.use(Router);

app.listen(3000, function() {
  console.log("server is started at port 3000")
});
