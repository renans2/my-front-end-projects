let canClick = true;
const timeShowingCells = 700;
const dimensions = 4;
const container = $(".container");
let selected = null;

container.css("grid-template-columns", `repeat(${dimensions}, auto)`);

let array = [];
const offset = 360 / ((dimensions * dimensions)/2) 
for (let i = 0; i < (dimensions * dimensions)/2; i++) {
    const color = `hsl(${i* offset}, 100%, 50%)`;
    const cell1 = $(`<div id='${2*i}' class='cell ${i}'>
                        <div class='back'></div>
                        <div class='front'></div>
                     </div>`); cell1.find(".back").css("background-color", color);
    const cell2 = $(`<div id='${2*i+1}' class='cell ${i}'>
                        <div class='back'></div>
                        <div class='front'></div>
                     </div>`); cell2.find(".back").css("background-color", color);

    array.push(cell1); array.push(cell2);
}
array = shuffle(array);

for(const cell of array){
    container.append(cell);
}

$(".cell").on("click", function(){
    if(isClicable(this)){
        const front = getFront(this);
        const back  = getBack(this);

        if(selected != null && notTheSameCell(this)){
            flip(front, back);
            if(cellsMatch(this))
                caseMatch(this);
            else
                caseDoesNotMatch(front, back);
        }else if(selected == null){
            flip(front, back);
            selected = {
                cell: $(this),
                front: front,
                back: back
            }
        }
    }
});

function notTheSameCell(current){
    return $(current).attr("id") != selected.cell.attr("id")
}

function isClicable(current){
    return canClick && !$(current).hasClass("found")
}

function getFront(current){
    return $(current).find(".front");
}

function getBack(current){
    return $(current).find(".back");
}

function flip(front, back){
    front.toggleClass("flip-front");
    back.toggleClass("flip-back");
}

function cellsMatch(current){
    return $(current).attr("class") == selected.cell.attr("class");
}

function caseMatch(current){
    $(current).addClass("found");
    selected.cell.addClass("found");
    selected = null;
}

function caseDoesNotMatch(front, back){
    canClick = false;
    setTimeout(function(){
        selected.cell.removeClass("selected");
        selected.front.toggleClass("flip-front");
        selected.back.toggleClass("flip-back");
        front.toggleClass("flip-front");
        back.toggleClass("flip-back");
        canClick = true;
        selected = null;
    }, timeShowingCells);
}

function shuffle(array){
    tempArray = [];

    for (let i = array.length; i > 0; i--) {
        const index = getRandomIndex(i);
        tempArray.push(array[index]);
        array.splice(index, 1);
    }

    return tempArray;
}

function getRandomIndex(max){
    return Math.floor(Math.random() * max);
}

function getRandomColor(){
    return `rgb(${getRandomValue()}, ${getRandomValue()}, ${getRandomValue()})`
}

function getRandomValue(){
    return Math.floor(Math.random() * 256);
}
