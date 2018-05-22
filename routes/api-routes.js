var db = require("../models");
var passport = require("passport");
const { google } = require('googleapis');

module.exports = function (app) {

    app.get('/auth/google',
        passport.authenticate('google', { scope: ['profile'] }
        ));

    // Maybe idk what this does or if I need it
    app.get('/auth/google/calendar', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/calendar.readonly'] }
    ));

    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/secret');
        });

    // app.get('/secret',
    //     require('connect-ensure-login').ensureLoggedIn(),
    //     function(req, res){
    //         var userObj = req.user;
    //         res.render('secret', { user: userObj });
    // });

    // Test stuff, who knows, use the above original
    app.get('/secret',
        require('connect-ensure-login').ensureLoggedIn(),
        function (req, res) {
            // console.log("REQUEST");
            // console.log(req);
            // console.log("RES");
            // console.log(res);
            listEvents(passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/calendar.readonly'] }));
            var userObj = req.user;
            res.render('secret', { user: userObj });
        });

    // Copied from the node quickstart, who knows
    function listEvents(auth) {
        const calendar = google.calendar({ version: 'v3', auth });
        calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        }, (err, { data }) => {
            if (err) return console.log('The API returned an error: ' + err);
            const events = data.items;
            if (events.length) {
                console.log('Upcoming 10 events:');
                events.map((event, i) => {
                    const start = event.start.dateTime || event.start.date;
                    console.log(`${start} - ${event.summary}`);
                });
            } else {
                console.log('No upcoming events found.');
            }
        });
    }


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

    app.post("/api/time", function (req, res) {
        var activityTime = req.body.time;
        db.Activity.create({
            name: "general",
            time: activityTime
        }).then(dbActivity => {
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