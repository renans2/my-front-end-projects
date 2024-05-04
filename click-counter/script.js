/**
 * Developed by Renan Silva
 * GitHub: renans2
 */
let clickCounter = 0;

if(localStorage.getItem("clicks"))
    clickCounter = localStorage.getItem("clicks");
else
    localStorage.setItem("clicks", 0);

let clickSound = new Audio("click-sound.mp3");
clickSound.volume = 0.1;

$(".clicks").text("You have clicked " + clickCounter + " times!!!");

$(".top").on("mousedown", function(){
    buttonClicked();
    $(".middle").addClass("middle-down");
});

$(document).on("mouseup", function(){
    $(".middle").removeClass("middle-down");
});

function buttonClicked(){
    clickCounter++;
    playSound();
    $(".clicks").text("You have clicked " + clickCounter + " times!!!");
}

function playSound(){
    if(clickSound.paused)
        clickSound.play();
    else
        clickSound.currentTime = 0;
}

$(window).on("unload", saveOnLocalStorage);

function saveOnLocalStorage(){
    alert("hi");
    localStorage.setItem("clicks", clickCounter);
}
