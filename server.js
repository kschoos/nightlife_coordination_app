var express = require("express");
var app = express();
var passport = require("passport");
var session = require("express-session");
var bodyparser = require("body-parser");
var routes = require("./routes/main_routes.js");
var TwitterStrategy = require("passport-twitter").Strategy;

var port = process.env.PORT || 5000;

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK_URL
},function(accessToken, refreshToken, profile, done){
  process.nextTick(function(){
    return done(null, profile);
  })
}))

passport.serializeUser(function(user, done) { done(null, user); });
passport.deserializeUser(function(user, done) { done(null, user); });


app.use(session({secret: "im a little pony lel"}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + "/public"));
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "jade");

app.get("/auth/twitter", passport.authenticate("twitter"), function(req, res){})
app.get("/auth/callback", passport.authenticate("twitter", { failureRedirect: "/" }), function(req, res){ res.redirect("/"); })
app.get("/logout", routes.isAuthenticated, routes.logout);
app.get("/", routes.home);
app.post("/search", routes.search);
app.post("/registerAt", routes.isAuthenticated, routes.registerAt);

app.listen(port, function(){
  console.log("Server listening on port " + port);
})
