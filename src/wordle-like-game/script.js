const word = "world";
const lettersByRow = 5;
const rows = 6;
let grid = [];

let currentRow = 0;
let currentCol = 0;

fill();

$(".key").on("click", function(){
    grid[currentRow][currentCol++].text($(this).text());

    if(currentCol == lettersByRow)
        updateAndCheckIfWon();
});

$("#backspace").on("click", function(){
    if(currentCol > 0)
        grid[currentRow][--currentCol].text("");
});

function updateAndCheckIfWon(){
    let won = true;

    for (let col = 0; col < lettersByRow; col++) {
        const letter = getLetterInGrid(currentRow, col);

        if(letter == word.charAt(col)){
            makeBackgroundGreen(currentRow, col);
        } else if(word.includes(letter)){
            makeBackgroundYellow(currentRow, col);
            won = false;
        } else {
            makeBackgroundRed(currentRow, col);
            won = false;
        }
    }

    if(won){
        console.log("you won!!!");
    } else {
        currentCol = 0;
        currentRow++;
        if(currentRow == rows){
            console.log("you lost!!!");
        }
    }
}

function getLetterInGrid(row, col){
    return grid[row][col].text().toLowerCase();
}

function makeBackgroundGreen(row, col) {
    grid[row][col].css("background-color", "green");
    makeTextWhite(row, col);
}

function makeBackgroundYellow(row, col) {
    grid[row][col].css("background-color", "orange");
    makeTextWhite(row, col);
}

function makeBackgroundRed(row, col) {
    grid[row][col].css("background-color", "red");
    makeTextWhite(row, col);
}

function makeTextWhite(row, col){
    grid[row][col].css("color", "white");
}

function fill(){
    for (let i = 0; i < rows; i++){
        grid[i] = [];
        const row = $("<div id='row"+i+"' class='row'></div>");
        $(".words-container").append(row);
        
        for (let j = 0; j < lettersByRow; j++) {
            const letterDiv = $("<div class='letter'></div>");
            row.append(letterDiv);
            grid[i][j] = letterDiv;
        }
    }
}
