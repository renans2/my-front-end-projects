const dimensions = 25;
const delay = 65;
let score = 0;
let gameIsOver = false;
let grid = [];
let headRow = 0;
let headCol = 0;
let tailRow = headRow;
let tailCol = headCol;
let trail = [];
let dir = "right";
let tempDir = "right";
const gameContainer = $(".game-container");
gameContainer.css("grid-template-columns", "repeat("+dimensions+", auto)");

fill();
grid[headRow][headCol].toggleClass("body");
newApple();
setInterval(update, delay);

$(document).on("keydown", function(e){
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
});

function update(){
    if(!gameIsOver){
        updateDir();
        moveHead();
        if(hitBorderOrBody())
            gameOver();
        else{
            pushToTrail();
            if(hasEatenApple()) {
                score++;
                newApple();
            }else{
                eraseTail();
            }                
            grid[headRow][headCol].addClass("body");
        }
    }
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

function gameOver(){
    gameIsOver = true;
    console.log("gameOver");
    $(".body").addClass("dead");
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
