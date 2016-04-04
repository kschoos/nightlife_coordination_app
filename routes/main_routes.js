var Yelp = require("yelp");

var yelp = new Yelp({
  consumer_key: process.env.YELP_CONSUMER_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_TOKEN,
  token_secret: process.env.YELP_TOKEN_SECRET
})

var Routes = function() {};
 
Routes.prototype.home = function(req, res){
  res.render("index");
}

Routes.prototype.search = function(req, res){
  yelp.search({ term: "nightlife", location: req.body.location }).then(function(data){
    res.send(data);
  })
  .catch(function(err){
    console.error(err);
  })
}

module.exports = new Routes();
