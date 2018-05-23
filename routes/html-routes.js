var path = require("path");
var db = require("../models");

module.exports = function(app){

    app.get("/", function(req, res) {
        res.render("index");
    });

    app.get("/calendar", function (req, res) {
        res.render("calendar");
    });

    app.get("/timer", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/Timer.html"));
    })

    app.get("/addEvent", function (req, res) {
        res.render("addEvent");
    })
    app.get("/login", function (req, res) {
        res.render("login");
    });

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });
}