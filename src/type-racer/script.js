/**
 * @author Renan Silva (renans2 on GitHub)
 */

const validKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-.:,; Backspace";
let phrase;
let author;
setNewPhrase();
let playerInput = "";
let index = 0;
let lastCorrectIndex = 0;
let forwardIndex = 0;
let wordCounter = 0;
let timePassed = 0;
let started = false;
let over = false;
let setIntID;
let wordsPerMinute = 0;
let maxWordsPerMinute = "0.00";

$(".max-wpm-div").html(`max wpm = <em class='max-wpm'>${maxWordsPerMinute}</em>`);
$(".wpm-div").html(`<em id='start-typing'>Start typing</em>`);
$("#try-again").hide();

$("#try-again").on("click", function(){
    reset();
    $(".phrase-container").html(`<p id='phrase'>${phrase}</p>`);
    $(this).hide();
});

$("#new-phrase").on("click", function(){
    maxWordsPerMinute = "0.00";
    $(".max-wpm-div").html(`max wpm = <em class='max-wpm'>${maxWordsPerMinute}</em>`);
    clearInterval(setIntID);
    reset();
    setNewPhrase();
});

function reset(){
    playerInput = "";
    index = 0;
    lastCorrectIndex = 0;
    forwardIndex = 0;
    wordCounter = 0;
    timePassed = 0;
    started = false;
    over = false;
    wordsPerMinute = 0;
    $(".phrase-container").removeClass("over");
    $(".wpm-div").html(`<em id='start-typing'>Start typing</em>`);
}

function setNewPhrase(){
    $.get("https://api.quotable.io/random", function(data){
        author = data.author
        phrase = data.content + " - " + author;
        $(".phrase-container").html(`<p id='phrase'>${phrase}</p>`);
    });
}

$(document).on("keydown", function(e){
    if(!over && validKeys.includes(e.key)){
        if(!started)
            start();
    
        const keyPressed = e.key
    
        if(keyPressed === "Backspace"){
            if(playerInput.length > 0)
                caseBackspace();
        }else if(index < phrase.length){
            caseValidKey(keyPressed);
        }
    }
});

function incTime(){
    timePassed += (100 / 1000);
}

function updateWordsPerMinute() {
    wordsPerMinute = wordCounter / (timePassed / 60);
    $(".wpm-div").html(`wpm = <em class='wpm'>${wordsPerMinute.toFixed(2)}</em>`);
}

function start(){
    started = true;
    setIntID = setInterval(incTime, 100);
}

function caseBackspace(){
    index--;

    if(index < lastCorrectIndex)
        lastCorrectIndex = index;
    
    playerInput = playerInput.slice(0, playerInput.length - 1);
    updatePlayerInputDisplay();
}

function caseValidKey(key){
    playerInput += key;
        
    if(index === lastCorrectIndex && playerInput.charAt(index) === phrase.charAt(index)){
        if(forwardIndex === lastCorrectIndex){
            forwardIndex++;
            
            if(phrase.charAt(forwardIndex) === " "){
                wordCounter++;
                updateWordsPerMinute();
            }
        }
        
        lastCorrectIndex++;
    }

    index++;
    updatePlayerInputDisplay();

    if(index === lastCorrectIndex && index === phrase.length){
        over = true;
        wordCounter++;
        updateWordsPerMinute();
        clearInterval(setIntID);
        $(".phrase-container").addClass("over");
        $("#try-again").show();

        if(parseFloat(wordsPerMinute.toFixed(2)) > parseFloat(maxWordsPerMinute)){
            maxWordsPerMinute = wordsPerMinute.toFixed(2);
            localStorage.setItem("maxWpm", maxWordsPerMinute);
            $(".max-wpm-div").html(`max wpm = <em class='max-wpm'>${maxWordsPerMinute}</em>`);
        }
    }
}

function updatePlayerInputDisplay(){
    $(".phrase-container").html(`<p id='phrase'><em class='correct'>${phrase.slice(0, lastCorrectIndex)}</em><em class='incorrect'>${phrase.slice(lastCorrectIndex, playerInput.length)}</em><em class='rest'>${phrase.slice(index, phrase.length)}</em></p>`);
}
