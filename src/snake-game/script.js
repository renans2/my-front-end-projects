const dimensions = 25;
const delay = 65;
let score = 0;
let gameIsWaiting = true;
let gameIsOn = false;
let grid = [];
let headRow = 0;
let headCol = 0;
let tailRow = headRow;
let tailCol = headCol;
let trail = [];
let dir = "right";
let tempDir = dir;
let setIntID;

const gameContainer = $(".game-container");
gameContainer.css("grid-template-columns", "repeat("+dimensions+", auto)");
const gameOverMsg = $(".gameover-msg");
const gameOverContainer = $(".gameover-container");
gameOverContainer.hide();
const startContainer = $(".start-container");

fill();

$(document).on("keydown", function(e){
    if(gameIsWaiting && e.key == " "){
        orderToStart();
    }else if(gameIsOn){
        switch (e.key) {
            case "ArrowUp":    tempDir = "up";    break;
            case "ArrowRight": tempDir = "right"; break;
            case "ArrowDown":  tempDir = "down";  break;
            case "ArrowLeft":  tempDir = "left";  break;
            case "w":          tempDir = "up";    break;
            case "d":          tempDir = "right"; break;
            case "s":          tempDir = "down";  break;
            case "a":          tempDir = "left";  break;
            default: break;
        }
    }
});

startContainer.on("click", orderToStart);

$("#playagain-button").on("click", function(){
    resetGame();
    gameOverContainer.hide();
    startContainer.show();
    gameIsWaiting = true;
});

function orderToStart(){
    gameIsWaiting = false;
    startContainer.hide();
    startGame();
}

function startGame(){
    gameIsOn = true;
    grid[headRow][headCol].toggleClass("body");
    newApple();
    setIntID = setInterval(update, delay);
}

function update(){
    updateDir();
    moveHead();
    if(hitBorderOrBody()){
        gameEnded("lost");
    }else{
        pushToTrail();
        if(hasEatenApple()) {
            score++;
            if(hasWon())
                gameEnded("won");
            else
                newApple();
        }else{
            eraseTail();
        }                
        grid[headRow][headCol].addClass("body");
    }
}

function hasWon(){
    return (score + 1) == dimensions * dimensions;
}

function updateDir() {
    if((dir == "up"    && tempDir != "down") ||
       (dir == "right" && tempDir != "left") ||
       (dir == "down"  && tempDir != "up")   ||
       (dir == "left"  && tempDir != "right"))
           dir = tempDir;
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
    score = 0;
    headRow = 0;
    headCol = 0;
    tailRow = headRow;
    tailCol = headCol;
    trail = [];
    dir = "right";
    tempDir = dir;
    $(".cell").removeClass("body")
              .removeClass("dead")
              .removeClass("apple");
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
