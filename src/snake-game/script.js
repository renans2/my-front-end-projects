const dimensions = 25;
const delay = 65;
let score = 1;
let maxScore = 0;
let gameIsWaiting = true;
let gameIsOn = false;
let grid = [];
let headRow = Math.floor(dimensions/2);
let headCol = 0;
let tailRow = headRow;
let tailCol = headCol;
let trail = [];
let dir = "right";
let dirQueue = [dir];
let setIntID;
const startAudio = new Audio("audios/start.mp3");
const eatAudio   = new Audio("audios/eat.mp3");
const deadAudio  = new Audio("audios/dead.mp3");

const gameContainer = $(".game-container");
const gameOverMsg = $(".gameover-msg");
const gameOverContainer = $(".gameover-container");
const startContainer = $(".start-container");
const currentScoreDisplay = $(".current-score-display");
const maxScoreDisplay = $(".max-score-display");
const optionsContainer = $(".options-container");
gameContainer.css("grid-template-columns", "repeat("+dimensions+", auto)");
gameOverContainer.hide();

if(localStorage.getItem("maxScore") != null){
    maxScore = parseInt(localStorage.getItem("maxScore"));
}else{
    localStorage.setItem("maxScore", 0);
}

setVolume(($("#volume-slider").val()) / 100);
updateScoreDisplay();
updateMaxScoreDisplay();
fill();

$("#volume-slider").on("change", function(){
    setVolume(this.value / 100);
});

function setVolume(newVolume){
    startAudio.volume = newVolume;
    eatAudio.volume = newVolume;
    deadAudio.volume = newVolume;
}

$(document).on("keydown", function(e){
    if(e.key == " "){
        if(gameIsWaiting)
            orderToStart();
        else if(!gameIsOn && !gameIsWaiting) //when the game is over
            orderToReset();
    }else if(gameIsOn){
        switch (e.key) {
            case "ArrowUp":    dirQueue.push("up");    break;
            case "ArrowRight": dirQueue.push("right"); break;
            case "ArrowDown":  dirQueue.push("down");  break;
            case "ArrowLeft":  dirQueue.push("left");  break;
            case "w":          dirQueue.push("up");    break;
            case "d":          dirQueue.push("right"); break;
            case "s":          dirQueue.push("down");  break;
            case "a":          dirQueue.push("left");  break;
            case "W":          dirQueue.push("up");    break;
            case "D":          dirQueue.push("right"); break;
            case "S":          dirQueue.push("down");  break;
            case "A":          dirQueue.push("left");  break;
            default: break;
        }
    }
});

startContainer.on("click", orderToStart);

$("#playagain-button").on("click", function(){
    orderToReset();
});

function orderToReset(){
    resetGame();
    gameOverContainer.hide();
    startContainer.show();
    optionsContainer.show();
    gameIsWaiting = true;
}

function orderToStart(){
    gameIsWaiting = false;
    startContainer.hide();
    optionsContainer.hide();
    startGame();
}

function startGame(){
    gameIsOn = true;
    playAudio(startAudio);
    grid[headRow][headCol].toggleClass("body");
    newApple();
    setIntID = setInterval(update, delay);
}

function update(){
    updateDir();
    moveHead();
    if(hitBorderOrBody()){
        playAudio(deadAudio);
        gameEnded("lost");
    }else{
        grid[headRow][headCol].addClass("body");
        pushToTrail();
        if(hasEatenApple()) {
            playAudio(eatAudio);
            score++;
            updateScoreDisplay();
            if(hasWon())
                gameEnded("won");
            else
                newApple();
        }else{
            eraseTail();
        }                
    }
}

function updateScoreDisplay(){
    currentScoreDisplay.html("SCORE: <em class='score'>" + score + "</em>");
}

function updateMaxScoreDisplay(){
    maxScoreDisplay.html("MAX SCORE: <em class='max-score'>" + maxScore + "</em>");
}

function playAudio(audio){
    audio.currentTime = 0;
    audio.play();
}

function hasWon(){
    return score == dimensions * dimensions;
}

function updateDir() {
    let tempDir;

    if(dirQueue.length > 0){
        tempDir = dirQueue.shift();

        if((dir == "up"    && tempDir != "down") ||
           (dir == "right" && tempDir != "left") ||
           (dir == "down"  && tempDir != "up")   ||
           (dir == "left"  && tempDir != "right"))
           dir = tempDir;
    }
}

function moveHead() {
    switch (dir) {
        case "up":    headRow--; break;
        case "right": headCol++; break;
        case "down":  headRow++; break;
        case "left":  headCol--; break;
        default: break;
    }
}

function hitBorderOrBody(){
    return headRow < 0 || headRow >= dimensions ||
           headCol < 0 || headCol >= dimensions ||
           grid[headRow][headCol].hasClass("body");
}

function gameEnded(result){
    gameIsOn = false;
    clearInterval(setIntID);
    
    if(score > maxScore){
        maxScore = score;
        localStorage.setItem("maxScore", maxScore);
        updateMaxScoreDisplay();
    }

    if(result == "won")
        won();
    else 
        lost();

    gameOverContainer.show();
}

function lost(){
    gameOverMsg.html("GAME OVER!!! <br> SCORE: <em class='score'>" + score + "</em>");
    $(".body").addClass("dead");
}

function won(){
    gameOverMsg.html("<em class='won'>YOU WON!!!</em>");
}

function pushToTrail(){
    trail.push(dir);
}

function hasEatenApple(){
    const hasEaten = grid[headRow][headCol].hasClass("apple");
    if(hasEaten)
        grid[headRow][headCol].removeClass("apple");

    return hasEaten;
}

function newApple(){
    const availableCells = $(".cell").filter((_, cellDiv) => !$(cellDiv).hasClass("body"));
    const randomIndex = getRandom(availableCells.length);
    $(availableCells.get(randomIndex)).addClass("apple");
}

function eraseTail(){
    grid[tailRow][tailCol].removeClass("body");
    const nextDir = trail.shift();
    switch (nextDir) {
        case "up":    tailRow--; break;
        case "right": tailCol++; break;
        case "down":  tailRow++; break;
        case "left":  tailCol--; break;
        default: break;
    }
}

function resetGame(){
    score = 1;
    headRow = Math.floor(dimensions/2);
    headCol = 0;
    tailRow = headRow;
    tailCol = headCol;
    trail = [];
    dir = "right";
    dirQueue = [dir];
    $(".cell").removeClass("body")
              .removeClass("dead")
              .removeClass("apple");
    updateScoreDisplay();
}

function fill() {
    for (let i = 0; i < dimensions; i++) {
        grid[i] = [];
        for (let j = 0; j < dimensions; j++) {
            const cell = $("<div class='cell'></div>");
            gameContainer.append(cell);
            grid[i][j] = cell;
        }        
    }
}

function getRandom(max){
    return Math.floor(Math.random() * max);
}
