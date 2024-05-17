let hours   = 0;
let minutes = 0;
let seconds = 0;

setInterval(update, 1000);

function update(){
    //console.log(hours + ":" + minutes + ":" + seconds);
    changeDisplay();
    incSeconds();
}

function incSeconds(){
    seconds = (seconds + 1) % 60;

    if(seconds == 0){
        minutes = (minutes + 1) % 60;
        
        if(minutes == 0)
            hours++;
    }
}

function changeDisplay(){
    $("#display-text").text(hours + ":" + minutes + ":" + seconds);
    console.log(hours + ":" + minutes + ":" + seconds);
}
