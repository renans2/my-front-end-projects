const wordStr = "world";
const word = [...wordStr];
const lettersByRow = 5;
const rows = 6;
let grid = [];
let gameIsOver = false;

let currentRow = 0;
let currentCol = 0;

fill();

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

$(".key").on("click", function(){
    if(!gameIsOver){
        grid[currentRow][currentCol++].text($(this).text());
    
        if(currentCol == lettersByRow)
            updateAndCheckIfWon();
    }
});

$("#backspace").on("click", function(){
    if(!gameIsOver && currentCol > 0)
        grid[currentRow][--currentCol].text("");
});

function updateAndCheckIfWon(){
    paintAllReds();
    paintAllGreens();
    paintTheRest();

    let won = allGreens();

    if(won){
        gameIsOver = true;
        console.log("you won!!!");
    }else{
        currentCol = 0;
        currentRow++;
        if(currentRow == rows){
            gameIsOver = true;
            console.log("you lost!!!");
        }
    }
}

function paintAllReds(){
    for (let col = 0; col < lettersByRow; col++) {
        const letter = getLetter(col);

        if(!word.includes(letter))
            makeBackgroundRed(col);
    }
}

function paintAllGreens(){
    for (let col = 0; col < lettersByRow; col++) {
        const letter = getLetter(col);
        
        if(letter === word[col])
            makeBackgroundGreen(col);
    }
}

function paintTheRest(){
    for (let col = 0; col < lettersByRow; col++){
        const letterDiv = grid[currentRow][col];
        if(colorNotDefined(letterDiv)){
            const letter = getLetter(col);
            const leftToPaint = leftToPaintYellow(letter);
            const countBefore = howManyBefore(letter, col);

            if(countBefore >= leftToPaint)
                makeBackgroundRed(col);
            else 
                makeBackgroundYellow(col);
        }
    }
}

function leftToPaintYellow(letter){
    const inCorrectWord = word.filter(l => l === letter).length;
    const inCorrectPos  = grid[currentRow].filter(letterDiv => letterDiv.hasClass("green") && 
                                                               sameLetter(letterDiv, letter)).length;
    return inCorrectWord - inCorrectPos;
}

function howManyBefore(letter, col){
    let count = 0;
    for (let i = 0; i < col; i++)
        if(getLetter(i) === letter)
            count++;

    return count;
}

function getLetter(col){
    return grid[currentRow][col].text().toLowerCase();
}

function makeBackgroundGreen(col) {
    grid[currentRow][col].addClass("green");
}

function makeBackgroundYellow(col) {
    grid[currentRow][col].addClass("yellow");
}

function makeBackgroundRed(col) {
    grid[currentRow][col].addClass("red");
}

function allGreens() {
    return grid[currentRow].filter(letterDiv => letterDiv.hasClass("green"))
                           .length == lettersByRow;
}

function colorNotDefined(div) {
    return !div.hasClass("green") && !div.hasClass("yellow") && !div.hasClass("red")
}

function sameLetter(letterDiv, letter){
    return letterDiv.text().toLowerCase() == letter;
}
