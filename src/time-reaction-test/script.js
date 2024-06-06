const minWait = 2; // in seconds
const maxWait = 5; // in seconds
let timeToWait;    // in milliseconds
let waitingToGreen = false;
let waitingToClick = false;
const container = $(".container");
const body = $("body");
let time = 0;
let setIntID;
let greenTime;
let clickTime;

body.addClass("default");
container.text("Click anywhere to start");
setTimeToWait();

$(document).on("mousedown", function(){
    if(!waitingToGreen && !waitingToClick){
        time = 0;
        setTimeToWait();
        waitingToGreen = true;
        body.removeClass("default");
        body.addClass("waiting");
        container.text("wait to green");
        setIntID = setInterval(incAndUpdate, 10)
    }else if(waitingToGreen){
        time = 0;
        container.text("only click when it gets green");
    }else if(waitingToClick){
        clickTime = performance.now();
        waitingToClick = false;
        body.removeClass("green");
        body.addClass("default");
        container.html(`${(clickTime - greenTime).toFixed(0)} ms <br> click to try again`);
    }
});

function incAndUpdate(){
    time += 10;

    if(time > timeToWait){
        waitingToGreen = false;
        waitingToClick = true;
        body.removeClass("waiting");
        body.addClass("green");
        clearInterval(setIntID);
        container.text("click!!!")
        greenTime = performance.now();
    }
}

function setTimeToWait(){
    timeToWait = (Math.floor(Math.random() * (maxWait - minWait)) + minWait) * 1000;
}
