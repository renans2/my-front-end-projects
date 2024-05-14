/**
 * Developed by Renan Silva
 * GitHub: renans2
 */

let clickCounter = 0;
let clickSound;
const audioVolume = 0.1;

checkLocalStorage();
setAudio();
addListeners();
displayClicks();

function checkLocalStorage(){
    if(localStorage.getItem("clicks"))
        clickCounter = localStorage.getItem("clicks");
    else
        localStorage.setItem("clicks", 0);
}

function setAudio(){
    clickSound = new Audio("click-sound.mp3");
    clickSound.volume = audioVolume;
}

function addListeners(){
    $(".top").on("mousedown", function(){
        buttonClicked();
        $(".middle").addClass("middle-down");
    });
    
    $(document).on("mouseup", function(){
        $(".middle").removeClass("middle-down");
    });
    
    $("#reset-button").on("click", resetCounter);

    $(window).on("unload", saveOnLocalStorage);
}

function displayClicks(){
    $(".clicks").text("You have clicked " + clickCounter + " times!!!");
}

function buttonClicked(){
    clickCounter++;
    playSound();
    displayClicks();
}

function playSound(){
    clickSound.currentTime = 0;
    clickSound.play();
}

function saveOnLocalStorage(){
    localStorage.setItem("clicks", clickCounter);
}

function resetCounter(){
    alert("Reset! The counter is now 0.");
    clickCounter = 0;
    displayClicks();
}
