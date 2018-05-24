$(document).ready(function () {

    $("#timer").hide();
    $("#done").hide();
    $("#start").on("click", function () {
        console.log("button works");
        clock.start();
        $("#gitdone").hide();
        $("#timer").show();
        $("#start").hide();
        $("#done").show();
    })
    $("#done").on("click", function () {
        clock.done();
        $("#gitdone").show();
        $("#timer").hide();
        $("#start").show();
        clock.time = 0;
        //push data to the db here???

<<<<<<< HEAD
        var savedTime = $("#timer").text();
        getTime(savedTime);
    })

=======
        var logged = $("#timer").text();
        var savedTime = parseInt(logged.slice(0, logged.indexOf(":")));
        console.log(savedTime);
        getTime(savedTime);

    })



>>>>>>> 3c837c296728573db03b8c99c5e8e93808813d8b
    var getTime = function (time) {
        $.ajax({
            method: "POST",
            url: "/api/time",
            data: {
<<<<<<< HEAD
                "name": "general",
=======
                "activity_type": "general",
>>>>>>> 3c837c296728573db03b8c99c5e8e93808813d8b
                "user_time": time
            }
        })
            .then(function (response) {
                console.log(response);
            })

    }

    // //Noah says that we would want to create an item on the first submission, then after we would update them?

    // Use ajax to send info
    //data=req.body
})

var intervalId;
var clockRunning = false;

var clock = {
    time: 0,
    start: function () {
        if (!clockRunning) {
            intervalId = setInterval(clock.count, 1000);
            clockRunning = true;
        }
    },
    count: function () {
        clock.time++;
        var converted = clock.timeConverter(clock.time);
        // console.log(converted);
        $("#timer").text(converted);

    },
    timeConverter: function (t) {
        var minutes = Math.floor(t / 60);
        var seconds = Math.floor(t - (minutes * 60));
        if (seconds < 10) {
            seconds = "0" + seconds;
        };
        if (minutes === 0) {
            minutes = "00";
        }
        else if (minutes < 10) {
            minutes = "0" + minutes
        }
        return minutes + ":" + seconds;
    },
    done: function () {
        if (clockRunning) {
            clearInterval(intervalId);
            clockRunning = false;
        }
    }
}





