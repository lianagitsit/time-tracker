window.onload = function () {
    $("#start").on("click", function(){
        console.log("booty");
    })
    
};

var intervalId;
var clockRunning = false;

var clock = function () {
    time: 0
    start= function () { 
        if (!clockRunning) {
            intervalId = setInterval(clock.count, 1000);
            clockRunning = true;
        }
    }
}

count= function () {
    clock.time++;
}
