/**
 * @author Renan Silva (renans2 on GitHub)
 */

// starts with red -> turn 0
let turn = 0;
let board = [];
let over = false;
const paths = $(".place");
const borders = $(".border");
const gameOverContainer = $(".game-over-container");
const gameOverMessage   = $("#game-over-message");
const playAgainButton   = $("#play-again-button");
borders.addClass("red-border");
gameOverContainer.hide();
resetBoard();

function resetBoard() {
    for (let i = 0; i < 11; i++) {
        board[i] = [];
        for (let j = 0; j < 11; j++) {
            board[i][j] = "";
        }
    }
}

playAgainButton.on("click", function() {
    resetGame();
    gameOverContainer.hide();
});

function resetGame(){
    resetBoard();
    turn = 0;
    borders.addClass("red-border");
    borders.removeClass("blue-border");
    paths.removeClass("red blue");
    over = false;
}

paths.on("click", function() {
    if(!over && !isPainted(this)){
        const i = parseInt($(this).attr("data-i"));
        const j = parseInt($(this).attr("data-j"));

        if(turn === 0){
            $(this).addClass("red");
            $(this).removeClass("hovered-red-turn");
            board[i][j] = "red";

            if(connected("red"))
                gameOver("Red");
            else
                changeTurn();
        } else {
            $(this).addClass("blue");
            $(this).removeClass("hovered-blue-turn");
            board[i][j] = "blue";

            if(connected("blue"))
                gameOver("Blue");
            else
                changeTurn();
        }
    }
});

function connected(color){
    return atLeastOneOnEachBorder(color) && atLeastOneConnection(color);
}

function atLeastOneConnection(color){
    if(color === "red"){
        for (let i = 0; i < 11; i++){
            if(board[i][0] === "red" && followTrail("red", [{i: i, j: 0}]))
                return true;
        }
        return false;
    } else {
        for (let j = 0; j < 11; j++){
            if(board[0][j] === "blue" && followTrail("blue", [{i: 0, j: j}]))
                return true;
        }
        return false;
    }
}

function followTrail(color, passedPlaces){
    const currI = passedPlaces[passedPlaces.length - 1].i;
    const currJ = passedPlaces[passedPlaces.length - 1].j;

    if((color === "red" && currJ === 10) || (color === "blue" && currI === 10))
        return true;
    else {
        if(isValidNeighbour(color, passedPlaces, currI, currJ - 1) &&
            followTrail(color, [...passedPlaces, {i: currI, j: currJ - 1}]))
            return true;
        else if(isValidNeighbour(color, passedPlaces, currI, currJ + 1) &&
            followTrail(color, [...passedPlaces, {i: currI, j: currJ + 1}]))
            return true;
        else if(isValidNeighbour(color, passedPlaces, currI - 1, currJ) &&
            followTrail(color, [...passedPlaces, {i: currI - 1, j: currJ}]))
            return true;
        else if(isValidNeighbour(color, passedPlaces, currI + 1, currJ) &&
            followTrail(color, [...passedPlaces, {i: currI + 1, j: currJ}]))
            return true;
        else if(isValidNeighbour(color, passedPlaces, currI - 1, currJ - 1) &&
            followTrail(color, [...passedPlaces, {i: currI - 1, j: currJ - 1}]))
            return true;
        else
            return isValidNeighbour(color, passedPlaces, currI + 1, currJ + 1) &&
                   followTrail(color, [...passedPlaces, {i: currI + 1, j: currJ + 1}]);
    }
}

function isValidNeighbour(color, passedPlaces, i, j){
    return 0 <= i && i <= 10 &&
           0 <= j && j <= 10 &&
           board[i][j] === color &&
           !inPassedPlaces(passedPlaces, i, j);
}

function inPassedPlaces(passedPlaces, i, j){
    for (const place of passedPlaces) {
        if(place.i === i && place.j === j)
            return true;
    }

    return false;
}

function atLeastOneOnEachBorder(color){
    let hasOnLeftBorder = false;
    let hasOnRightBorder = false;

    if(color === "red"){
        for (let i = 0; i < 11; i++) {
            if(board[i][0] === "red")
                hasOnLeftBorder = true;
            if(board[i][10] === "red")
                hasOnRightBorder = true;
            if(hasOnLeftBorder && hasOnRightBorder)
                break;
        }
        return hasOnLeftBorder && hasOnRightBorder;
    } else {
        for (let j = 0; j < 11; j++) {
            if(board[0][j] === "blue")
                hasOnLeftBorder = true;
            if(board[10][j] === "blue")
                hasOnRightBorder = true;
            if(hasOnLeftBorder && hasOnRightBorder)
                break;
        }
        return hasOnLeftBorder && hasOnRightBorder;
    }
}

function gameOver(winner){
    over = true;
    gameOverMessage.html(winner + " Won!");
    gameOverContainer.show();
}

function isPainted(path){
    return $(path).hasClass("red") ||
           $(path).hasClass("blue");
}

paths.on("mouseenter", function() {
    if(!over && !isPainted(this)){
        if(turn === 0)
            $(this).addClass("hovered-red-turn");
        else
            $(this).addClass("hovered-blue-turn");
    }

});

paths.on("mouseleave", function() {
    if(!over && !isPainted(this)){
        $(this).removeClass("hovered-red-turn");
        $(this).removeClass("hovered-blue-turn");
    }
});

function changeTurn(){
    turn = (turn + 1) % 2;
    borders.toggleClass("red-border blue-border");
}
