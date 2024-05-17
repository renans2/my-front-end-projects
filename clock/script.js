let currentDate = new Date();
let hours   = currentDate.getHours();
let minutes = currentDate.getMinutes();
let seconds = currentDate.getSeconds();

const displayText = $("#display-text");

setInterval(update, 1000);

function update(){
    incSeconds();
    changeDisplay();
}

function incSeconds(){
    seconds = (seconds + 1) % 60;
    if(seconds == 0){
        minutes = (minutes + 1) % 60;
        if(minutes == 0)
            hours = (hours + 1) % 24;
    }
}

function changeDisplay(){
    displayText.text(getFormattedTime());
}

function getFormattedTime(){
    return hours  .toString().padStart(2, "0") + ":" + 
           minutes.toString().padStart(2, "0") + ":" + 
           seconds.toString().padStart(2, "0");
}
