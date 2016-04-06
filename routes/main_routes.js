var Yelp = require("yelp");
var mongo = require("mongodb").MongoClient;
var strftime = require("strftime");
var DB = {};

mongo.connect(process.env.MONGOLAB_URI, function(err, db){
  if(err){
    console.log(err)
    return;
  }
  console.log("Successfully connected to MongoDB");
  DB = db;
})

var yelp = new Yelp({
  consumer_key: process.env.YELP_CONSUMER_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_TOKEN,
  token_secret: process.env.YELP_TOKEN_SECRET
})

var Routes = function() {};

Routes.prototype.isAuthenticated = function(req, res, next){
  if(req.session.passport)
    return next();

  res.redirect("/");
}
 
Routes.prototype.home = function(req, res){
  if(req.session.passport){
    res.render("index", { loginlink: "/logout", login: req.session.passport.user.displayName, authed: true });
  } else {
    res.render("index", { loginlink: "/auth/twitter", login: "Twitter Login!", authed: false  });
  }
}

Routes.prototype.search = function(req, res){
  yelp.search({ term: "nightlife", location: req.body.location, offset: req.body.offset }).then(function(data){
    var index = 0;
    for(var i = 0; i < data.businesses.length; i++){
      DB.collection("bars").findAndModify({id: data.businesses[i].id},
                                          [],
                                          {
                                            $setOnInsert: {
                                              id: data.businesses[i].id,
                                              going: [] 
                                            }
                                          },
                                          {
                                            new: true,
                                            upsert: true
                                          },
                                          function(err, doc){
                                            for(var j = 0; j < data.businesses.length; j++){
                                              if(data.businesses[j].id == doc.value.id){
                                                data.businesses[j].going = doc.value.going.length;
                                              }
                                            }
                                            index++;
                                            if(index == data.businesses.length){
                                              res.send(data);
                                            }
                                          }
      )
    }
  })
  .catch(function(err){
    console.error(err);
  })
}

Routes.prototype.registerAt = function(req, res){   
  DB.collection("bars").findOne({ id: req.body.id  }, function(err, doc){
    
    var username = req.session.passport.user.username;
    var usersGoing = doc.going;
    var isGoing = false;

    for(var i = 0; i < usersGoing.length; i++){
      if( username == usersGoing[i]){
        isGoing = true;
      }
    }
    if(isGoing) usersGoing.splice(usersGoing.indexOf(username), 1);
    else usersGoing.push(username);

    DB.collection("bars").findAndModify({ id: req.body.id }, [], { $set: { going: usersGoing } }, { new: true }, function(err, doc){
      console.log(doc.value);
      res.end(doc.value.going.length.toString());
    })
  });
}

Routes.prototype.logout = function(req, res){
  req.logout();
  req.session.destroy();
  res.redirect("/");
}

module.exports = new Routes();
