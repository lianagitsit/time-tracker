var path = require("path");
var db = require("../models");

module.exports = function(app){

    app.get("/", function(req, res) {
        res.render("index");
    });

    app.get("/calendar", function (req, res) {
        res.render("calendar");
    });

    app.get("/login", function (req, res) {
        res.render("login");
    });

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });
}