var path = require("path");

module.exports = function(app){

    app.get("/", function(req, res) {
        var myObj = { 
            items: ["thingOne", "thingTwo"] 
        };

        res.render("index", myObj);
    });
}