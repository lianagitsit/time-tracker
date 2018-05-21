var db = require("../models");
var passport = require("passport");

module.exports = function (app) {

    app.get('/auth/google',
        passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));


    app.get('/auth/google/callback', 
        passport.authenticate('google', { failureRedirect: '/login' }),
        function(req, res) {
          res.redirect('/');
    });
    ////////////////
    app.get("/api/users", function (req, res) {
        db.User.findAll({
            include: [db.Activity]
        }).then(function (dbUser) {
            res.json(dbUser);
        });
    });

    app.get("/api/users/:id", function (req, res) {
        db.User.findOne({
            where: {
                id: req.params.id
            },
            include: [db.Activity]
        }).then(function (dbPost) {
            res.json(dbPost);
        });
    });

    app.post("/api/time", function(req, res) {
        var activityTime = req.body.time;
        db.Activity.create({
            name: "general",
            time: activityTime
        }).then( dbActivity => {
            res.send(dbActivity);
        });

    })

    app.post("/api/users", function (req, res) {
        db.User.create(req.body).then(function (dbUser) {
            res.json(dbUser);
        });
    });

    app.delete("/api/users/:id", function (req, res) {
        db.User.destroy({
            where: {
                id: req.params.id
            }
        }).then(function (dbUser) {
            res.json(dbUser);
        });
    });
}