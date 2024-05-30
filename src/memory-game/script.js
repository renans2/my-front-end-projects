const colors = ["yellow", "blue", "red", "green", "black", "grey"];
let sequence = [];
let gameIsOver = false;
let isShowingSequence = false;
let buttonsClicked = 0;
let roundsPlayed = 0;
let setIntId;
let idx = 0;
let timeByButtonToShow = 500;
const buttons = $(".button");
const audios = [new Audio("audios/0.mp3"),
                new Audio("audios/1.mp3"),
                new Audio("audios/2.mp3"),
                new Audio("audios/3.mp3"),
                new Audio("audios/4.mp3"),
                new Audio("audios/5.mp3")];


setListeners();
addNextToSequence();

function setListeners(){
    $("#start-button").on("click", showSequence);

    buttons.on("mouseenter", function(){
        if(canClickOrHover()){
            $(this).css("background-color", colors[parseInt(this.id)]);
        }
        // else{
        //     $(this).css("cursor", "not-allowed");
        // }
    });

    buttons.on("mousemove", function(){
        if(canClickOrHover()){
            $(this).css("background-color", colors[parseInt(this.id)]);
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
}

function buttonClicked(buttonId){
    console.log(buttonId);
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
    return !gameIsOver && !isShowingSequence;
}

function gameOver(){
    gameIsOver = true;
    console.log("game over!!!");
}

function newRound(){
    roundsPlayed++;
    buttonsClicked = 0;
    addNextToSequence();
    showSequence();
}

function showSequence(){
    makeAllWhite();
    isShowingSequence = true;
    console.log(sequence);
    idx = 0;
    setIntId = setInterval(showSequenceAux, timeByButtonToShow);
}

function showSequenceAux() {
    if(idx > 0)
        makePreviousButtonWhite(idx)

    if(idx == sequence.length){
        clearInterval(setIntId);
        isShowingSequence = false;
    }else{
        colorButton(idx);
        playSound(idx);
        idx++;
    }
}

function playSound(idx) {
    audios[sequence[idx]].currentTime = 0;
    audios[sequence[idx]].play();
}

function makeAllWhite(){
    buttons.css("background-color", "white");
}

function makePreviousButtonWhite(idx){
    getButtonIdAtSequence(idx - 1).css("background-color", "white");
}

function colorButton(idx){
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
