var path = require("path");
var db = require("../models");

module.exports = function(app){

    app.get("/", function(req, res) {
        db.User.findAll().then( function(dbUser){
            var userObj = {
                users: dbUser
            }
            res.render("index", userObj);
        })
    });

}