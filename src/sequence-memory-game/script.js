const colors = ["red", 
                "orange", 
                "yellow", 
                "green", 
                "blue", 
                "violet"];
const audios = [new Audio("audios/0.mp3"),
                new Audio("audios/1.mp3"),
                new Audio("audios/2.mp3"),
                new Audio("audios/3.mp3"),
                new Audio("audios/4.mp3"),
                new Audio("audios/5.mp3")];
let sequence = [];
let sequenceIndex = 0;
let gameStarted = false;
let gameIsOver = false;
let isShowingSequence = false;
let buttonsClicked = 0;
let roundsPlayed = 0;
let sleepThenShowId;
let setIntervalId;
const delay = 500;
const buttons = $(".button");

$("#display-round").hide();
$("#display-gameover").hide();
$("#play-again").hide();

setListeners();
addNextToSequence();

function setListeners(){
    $("#start-button").on("click", function(){
        gameStarted = true;
        $(this).hide();
        $("#display-round").show();
        updateRoundText();
        showSequence();
    });

    $("#play-again").on("click", function(){
        resetAll();
        $(this).hide();
        $("#display-gameover").hide();
        $("#start-button").show()
    });

    buttons.on("mouseenter", function(){
        if(canClickOrHover()){
            whenIsHovered(this);
        }else{
            $(this).css("cursor", "not-allowed");
        }
    });

    buttons.on("mousemove", function(){
        if(canClickOrHover()){
            whenIsHovered(this);
        }else{
            $(this).css("cursor", "not-allowed");
        }
    });

    buttons.on("mouseleave", function(){
        if(canClickOrHover())
            $(this).css("background-color", "white");
    });

    buttons.on("click", function(){
        if(canClickOrHover()){
            $(this).css("background-color", colors[parseInt(this.id)]);
            buttonClicked(parseInt(this.id));
        }
    });

    buttons.on("mousedown", function(){
        if(canClickOrHover())
            $(this).addClass("button-active");
    });

    buttons.on("mouseup", function(){
        $(this).removeClass("button-active");
    });
}

function updateRoundText(){
    $("#display-round").text("Round " + roundsPlayed);   
}

function whenIsHovered(button){
    $(button).css("background-color", colors[parseInt(button.id)]);
    $(button).css("cursor", "pointer");
}

function buttonClicked(buttonId){
    if(buttonId != sequence[buttonsClicked]){
        gameOver();
    }else{
        buttonsClicked++;
        audios[buttonId].currentTime = 0;
        audios[buttonId].play();
        if(buttonsClicked == sequence.length)
            newRound();
    }
}

function canClickOrHover(){
    return gameStarted && !gameIsOver && !isShowingSequence;
}

function gameOver(){
    gameIsOver = true;
    $("#display-round").hide();
    $("#display-gameover").show();
    $("#display-gameover").text("Game Over! You played for " + roundsPlayed + " rounds");
    $("#play-again").show();
}

function newRound(){
    roundsPlayed++;
    updateRoundText();
    buttonsClicked = 0;
    addNextToSequence();
    showSequence();
}

function showSequence(){
    buttons.addClass("button-locked");
    makeAllWhite();
    isShowingSequence = true;
    sequenceIndex = 0;
    sleepThenShowId = setInterval(sleepThenShowSequence, 750);
}

function sleepThenShowSequence() {
    clearInterval(sleepThenShowId);
    setIntervalId = setInterval(showSequenceAux, delay);
}

function showSequenceAux() {
    if(sequenceIndex > 0)
        makePreviousButtonWhite(sequenceIndex)

    if(sequenceIndex == sequence.length){
        clearInterval(setIntervalId);
        isShowingSequence = false;
        buttons.removeClass("button-locked");
    }else{
        colorizeButton(sequenceIndex);
        playSound(sequenceIndex);
        sequenceIndex++;
    }
}

function playSound(idx) {
    audios[sequence[idx]].currentTime = 0;
    audios[sequence[idx]].play();
}

function resetAll(){
    makeAllWhite();
    sequence = [];
    sequenceIndex = 0;
    gameStarted = false;
    gameIsOver = false;
    isShowingSequence = false;
    buttonsClicked = 0;
    roundsPlayed = 0;
    addNextToSequence();
}

function makeAllWhite(){
    buttons.css("background-color", "white");
}

function makePreviousButtonWhite(idx){
    getButtonIdAtSequence(idx - 1).css("background-color", "white");
}

function colorizeButton(idx){
    getButtonIdAtSequence(idx).css("background-color", getColor(idx));
}

function getButtonIdAtSequence(idx){
    return $("#" + sequence[idx]);
}

function getColor(index){
    return colors[sequence[index]];
}

function addNextToSequence(){
    sequence.push(getNext());
}

function getNext(){
    return Math.floor(Math.random() * colors.length);
}
