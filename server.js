require("dotenv").config();

// Server
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");

// Auth
var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

// Database
var db = require("./models");


// CONFIG
var app = express();

var PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// AUTH
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
  console.log(profile.name.givenName);
     db.User.findOrCreate({ 
       where: {googleId: profile.id},
       defaults: {
         googleId: profile.id,
         display_name: profile.name.givenName
        }
     }).spread((user, created) => {
       console.log(user.get({
         plain: true
       }))
      console.log(created);
      return done(null, user);
     });
}
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

// ROUTES
app.use(express.static("public"));

require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);

// START SERVER
db.sequelize.sync().then( function() {
  app.listen(PORT, function() {
    console.log("Server listening on: http://localhost:" + PORT);
  });
})
