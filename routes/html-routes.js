var path = require("path");
var db = require("../models");
var passport = require("passport");

module.exports = function (app) {

    app.get("/", function (req, res) {
        res.render("index");
    });

    app.get("/calendar", function (req, res) {
        res.render("calendar");
    });

    app.get("/timer",
        require('connect-ensure-login').ensureLoggedIn(),
        function (req, res) {
            res.render("timer");
        })

    app.get("/addEvent", function (req, res) {
        res.render("addEvent");
    })
    app.get("/login", function (req, res) {
        res.render("login");
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get("/about", function(req, res){
        res.render("about");
    })
}