var db = require("../models");

module.exports = function (app) {
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
        db.Post.create({
            user_time: req.body.user_time
        }).then(function(dbPost){
            res.json(dbPost);
            res.send("It worked!");
        })
        
        // req.body.user_time in order to access the info from the timer
    });

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