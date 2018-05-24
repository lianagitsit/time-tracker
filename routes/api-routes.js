require("dotenv").config();

var db = require("../models");
var passport = require("passport");
const { google } = require("googleapis");
var gAuth;

module.exports = function (app) {

    app.get('/auth/google',
        passport.authenticate('google', {
            scope: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/plus.login'],
            accessType: 'offline'
        }
        ));

    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/login'
    }),
        function (req, res) {
            res.redirect('/calendar');
        }
    );

    app.get('/calendar',
        require('connect-ensure-login').ensureLoggedIn(),
        function (req, res) {
            var accessToken, refreshToken;
            db.User.findOne({
                where: {
                    googleId: req.user.googleId
                }
            }).then(dbUser => {
                accessToken = dbUser.access_token;
                refreshToken = dbUser.refresh_token;
                console.log("ACCESS FROM DB");
                console.log(accessToken);
                console.log("REFRESH FROM DB");
                console.log(refreshToken);

                const oauth2Client = new google.auth.OAuth2(
                    process.env.GOOGLE_CLIENT_ID,
                    process.env.GOOGLE_CLIENT_SECRET,
                    "http://localhost:8080/auth/google/callback"
                );

                var tokens = {
                    access_token: accessToken,
                    refresh_token: refreshToken
                }

                oauth2Client.setCredentials(tokens);
                function getAuth() {
                    var gAuth = oauth2Client;
                    return gAuth;
                }
                gAuth = getAuth();

                listEvents(oauth2Client, function (CALENDAR_URL) {
                    res.render('calendar', { url: CALENDAR_URL });
                });
            });
        });


    // Copied from the node quickstart, who knows
    function listEvents(auth, cb) {
        const calendar = google.calendar({ version: 'v3', auth });
        calendar.events.list({
            calendarId: 'primary',
        }, (err, { data }) => {
            if (err) return console.log('The API returned an error: ' + err);

            var CALENDAR_ID = data.summary;
            var CALENDAR_URL = "https://calendar.google.com/calendar/embed?src=" + CALENDAR_ID + "&ctz=America%2FNew_York";

            cb(CALENDAR_URL);
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
        }).then(function (dbUser) {
            res.json(dbUser);
        });
    });

    app.post("/api/addEvent",
        require('connect-ensure-login').ensureLoggedIn(),
        function (req, res) {
            var auth = gAuth;
            const calendar = google.calendar({ version: 'v3', auth });
            calendar.events.insert({
                auth: auth,
                calendarId: 'primary',
                resource: req.body.resource,
            }, function (err, event) {
                if (err) {
                    console.log('There was an error contacting the Calendar service: ' + err);
                    return;
                }
                console.log('Event created!');
            });

        })

    app.post("/api/time",
        require('connect-ensure-login').ensureLoggedIn(),
        function (req, res) {
            db.Activity.create({
                name: req.body.activity_type,
                time: req.body.user_time,
                UserId: req.user.id
            }).then(function (dbActivity) {
                res.json(dbActivity);
                // res.send("It worked!");
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