require("dotenv").config();

var db = require("../models");
var passport = require("passport");
const { google } = require("googleapis");
var gAuth;
var moment = require("moment");
const ROOT = process.env.PORT ? "https://kls-time-tracker.herokuapp.com" : "http://localhost:8080";
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
                    `${ROOT}/auth/google/callback`
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

    function addGetReadyTime(auth, data, userId) {
        db.Activity.findAll({
            where: {
                UserId: userId
            }
        }).then(dbActivity => {
            // console.log(dbActivity);
            var sumTime = 0;
            for (var i = 0; i < dbActivity.length; i++) {
                console.log("time " + i);
                console.log(dbActivity[i].dataValues.time);
                sumTime += dbActivity[i].dataValues.time;
                console.log("current sum")
                console.log(sumTime);
            }
            averageTime = Math.ceil(sumTime / dbActivity.length);
            // console.log("sum");
            // console.log(sumTime);
            console.log("Average time");
            console.log(averageTime);

            console.log("ready start:");
            console.log(moment(data.start.dateTime).subtract(averageTime, 'm').format());

            console.log("ready end:")
            console.log(data.start.dateTime);
            var resource = {
                "summary": "Get ready!",
                "start": {
                    "dateTime": moment(data.start.dateTime).subtract(averageTime, 'm')
                },
                "end": {
                    "dateTime": data.start.dateTime,
                },
                "reminders": {
                    "useDefault": false,
                    "overrides": [
                        {
                            "method": "popup",
                            "minutes": 2
                        }
                    ]
                }
            };

            const calendar = google.calendar({ version: 'v3', auth });
            calendar.events.insert({
                auth: auth,
                calendarId: 'primary',
                resource: resource,
            }, function (err, event) {
                if (err) {
                    console.log('There was an error contacting the Calendar service: ' + err);
                    return;
                }
                console.log('Get ready event created!');
            });
        })
    }

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
                console.log(event);
                addGetReadyTime(auth, event.data, req.user.id);
                res.end();
            });
        }
    )

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
        }
    );
}