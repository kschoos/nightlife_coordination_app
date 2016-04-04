var express = require("express");
var app = express();
var passport = require("passport");
var session = require("express-session");
var bodyparser = require("body-parser");
var mongo = require("mongodb").MongoClient;
var routes = require("./routes/main_routes.js");

var port = process.env.PORT || 5000;

app.use(express.static(__dirname + "/public"));
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "jade");

app.get("/", routes.home);
app.post("/search", routes.search);

app.listen(port, function(){
  console.log("Server listening on port " + port);
})
