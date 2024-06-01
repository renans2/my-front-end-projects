const wordStr = "caixa";
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
    if(!gameIsOver && currentCol < lettersByRow){
        const letterDiv = grid[currentRow][currentCol++];
        letterDiv.text($(this).text());
    
        if(currentCol == lettersByRow)
            $(".enter").toggleClass("enter-locked enter-available");
    }
});

$(".enter").on("click", function(){
    if($(this).hasClass("enter-available")){
        updateAndCheckIfWon();
        $(this).toggleClass("enter-locked enter-available");
    }
});

$(".backspace").on("click", function(){
    if(!gameIsOver && currentCol > 0){
        grid[currentRow][--currentCol].text("");
        
        if($(".enter").hasClass("enter-available"))
            $(".enter").toggleClass("enter-locked enter-available");
    }
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
            makeBackgroundRed(col, letter);
    }
}

function paintAllGreens(){
    for (let col = 0; col < lettersByRow; col++) {
        const letter = getLetter(col);
        
        if(letter === word[col])
            makeBackgroundGreen(col, letter);
    }
}

function paintTheRest(){
    for (let col = 0; col < lettersByRow; col++){
        const letterDiv = grid[currentRow][col];
        if(colorNotDefinedLetter(letterDiv)){
            const letter = getLetter(col);
            const leftToPaint = leftToPaintYellow(letter);
            const countBefore = howManyBefore(letter, col);

            if(countBefore >= leftToPaint)
                makeBackgroundRed(col, letter);
            else 
                makeBackgroundYellow(col, letter);
        }
    }
}

function leftToPaintYellow(letter){
    const inCorrectWord = word.filter(l => l === letter).length;
    const inCorrectPos  = grid[currentRow].filter(letterDiv => letterDiv.hasClass("letter-green") && 
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

function makeBackgroundGreen(col, letter) {
    addClassToLetterDivAndKey(col, letter, "letter-green");
}

function makeBackgroundYellow(col, letter) {
    addClassToLetterDivAndKey(col, letter, "letter-yellow");
}

function makeBackgroundRed(col, letter) {
    addClassToLetterDivAndKey(col, letter, "letter-red");
}

function addClassToLetterDivAndKey(col, letter, className){
    grid[currentRow][col].addClass(className);

    const key = $(".key").filter((_, letterDiv) => $(letterDiv).text().toLowerCase() === letter);
    
    if(className == "letter-green"){
        key.removeClass("key-yellow");
        key.removeClass("key-red");
        key.addClass("key-green");
    }else if(colorNotDefinedKey(key)){
        key.addClass(getClassForKey(className));
    }
}

function getClassForKey(className){
    switch (className) {
        case "letter-green":
            return "key-green";
    
        case "letter-yellow":
            return "key-yellow";

        case "letter-red":
            return "key-red";            

        default:
            break;
    }
}

function allGreens() {
    return grid[currentRow].filter(letterDiv => letterDiv.hasClass("letter-green"))
                           .length == lettersByRow;
}

function colorNotDefinedLetter(letterDiv) {
    return !letterDiv.hasClass("letter-green")  && 
           !letterDiv.hasClass("letter-yellow") && 
           !letterDiv.hasClass("letter-red")
}

function colorNotDefinedKey(keyDiv) {
    return !keyDiv.hasClass("key-green")  && 
           !keyDiv.hasClass("key-yellow") && 
           !keyDiv.hasClass("key-red")
}

function sameLetter(letterDiv, letter){
    return letterDiv.text()
                    .toLowerCase() == letter;
}
