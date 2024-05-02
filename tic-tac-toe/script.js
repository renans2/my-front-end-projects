const HORIZONTAL_TOP    = [1,2,3];
const HORIZONTAL_MIDDLE = [4,5,6];
const HORIZONTAL_BOTTOM = [7,8,9];
const VERTICAL_LEFT     = [1,4,7];
const VERTICAL_MIDDLE   = [2,5,8];
const VERTICAL_RIGHT    = [3,6,9];
const DIAGONAL_ONE      = [1,5,9];
const DIAGONAL_TWO      = [7,5,3];

const winningPatternColor = "rgb(30, 255, 0)";
const winningPatterns = [HORIZONTAL_TOP   , 
                         HORIZONTAL_MIDDLE, 
                         HORIZONTAL_BOTTOM,
                         VERTICAL_LEFT    , 
                         VERTICAL_MIDDLE  , 
                         VERTICAL_RIGHT   ,
                         DIAGONAL_ONE     , 
                         DIAGONAL_TWO];

// Player1 == "O"
let player1Array = new Array(9);
const P1Color = "blue";
const P1Symbol = "O";

// Player2 == "X"
let player2Array = new Array(9);
const P2Color = "red";
const P2Symbol = "X";

let countPlays = 0
let currentPlayer = 0;
const buttons = document.querySelectorAll(".button");
const playAgainButton = document.querySelector("#play-again-button");

playAgainButton.addEventListener("click", resetGame);
makeAllButtonsAvailable();

function buttonClicked(event){
    let button = event.target;
    makeButtonUnavailable(button);

    countPlays++;

    if(countPlays == 9)
        gameOver();


    if(isPlayerOne()){
        P1Plays(button);
        checkIfWon();
    }else{
        P2Plays(button);
        checkIfWon();
    }

    changePlayer();
}

function P1Plays(button){
    const buttonIndex = parseInt(button.id) - 1;
    player1Array[buttonIndex] = true;
    button.innerHTML = P1Symbol;
    button.style.color = P1Color;
}

function P2Plays(button){
    const buttonIndex = parseInt(button.id) - 1;
    player2Array[buttonIndex] = true;
    button.innerHTML = P2Symbol;
    button.style.color = P2Color;
}

function checkIfWon(){
    let arrayToCheck;

    if(isPlayerOne())
        arrayToCheck = [...player1Array];
    else
        arrayToCheck = [...player2Array];

    for (let pattern of winningPatterns){
        if(arrayToCheck[pattern[0] - 1] && 
           arrayToCheck[pattern[1] - 1] &&
           arrayToCheck[pattern[2] - 1]){
                gameOver();
                colorizePattern(pattern);
                return;
        }
    }
}

function makeAllButtonsAvailable(){
    for (const button of buttons)
        makeButtonAvailable(button);
}

function makeAllButtonsUnavailable(){
    for (const button of buttons)
        makeButtonUnavailable(button);
}

function colorizePattern(pattern){
    for (const index of pattern)
        buttons[index - 1].style.backgroundColor = winningPatternColor;
}

function gameOver() {
    makeAllButtonsUnavailable();
    displayPlayAgainButton();
}

function makeButtonAvailable(button){
    button.innerHTML = "";
    button.style.backgroundColor = "black";
    button.style.cursor = "pointer";
    button.addEventListener("click", buttonClicked);
    button.addEventListener("mouseenter", whenMouseEnters);
    button.addEventListener("mouseleave", whenMouseLeaves);
}

function makeButtonUnavailable(button){
    button.style.backgroundColor = "black";
    button.style.cursor = "not-allowed";
    button.removeEventListener("click", buttonClicked);
    button.removeEventListener("mouseenter", whenMouseEnters);
    button.removeEventListener("mouseleave", whenMouseLeaves);
}

function resetGame(){
    countPlays = 0;
    currentPlayer = 0;
    resetPlayersArrays();
    hidePlayAgainButton();
    makeAllButtonsAvailable();
}

function resetPlayersArrays(){
    player1Array = new Array(9);
    player2Array = new Array(9);
}

function whenMouseEnters(event){
    event.target.style.backgroundColor = "rgb(79, 79, 79)";
}

function whenMouseLeaves(event){
    event.target.style.backgroundColor = "black";
}

function displayPlayAgainButton(){
    playAgainButton.style.display = "flex"
}

function hidePlayAgainButton(){
    playAgainButton.style.display = "none"
}

function changePlayer(){
    currentPlayer = (currentPlayer + 1) % 2;
}

function isPlayerOne(){
    return currentPlayer == 0;
}
