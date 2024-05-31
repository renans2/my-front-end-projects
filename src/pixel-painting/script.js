let mouseIsDown = false;
let currentColor = "rgb(0, 0, 0)";
let currentColorDiv = $("#c21");
currentColorDiv.addClass("color-hover");
let lastCellsPaintedHistory = [];
let historyIndex = 0;
let lastCellsPainted = [];

const colors = $(".color");
const cells = $(".cell");

$(".pixels-container").on("mousedown", function(){
    mouseIsDown = true; 
});

$(".pixels-container").on("mouseup", function(){ 
    mouseIsDown = false;
    updateHistory();
});

colors.on("mouseenter", function(){
    $(this).addClass("color-hover");
});

colors.on("mouseleave", function(){
    if(!$(this).is(currentColorDiv))
        $(this).removeClass("color-hover");
});

colors.on("click", function(){
    currentColorDiv.removeClass("color-hover");
    currentColorDiv = $(this);
    currentColorDiv.addClass("color-hover");
    currentColor = currentColorDiv.css("background-color");
});

cells.on("mousedown", function(){
    lastCellsPainted = [];
    pushIfNotPresent(this, currentColor);
    $(this).css("background-color", currentColor);
});

cells.on("mouseenter", function(){
    if(mouseIsDown){
        pushIfNotPresent(this, currentColor);
        $(this).css("background-color", currentColor);
    }
});

$("#clear").on("click", function(){
    lastCellsPainted = [];
    for (const cell of cells) {
        pushIfNotPresent(cell, "white");
    }
    cells.css("background-color", "white");
    updateHistory();
});

$("#undo").on("click", function(){
    if(historyIndex > 0){
        lastCellsPainted = lastCellsPaintedHistory[--historyIndex];
        
        for (const cellInfo of lastCellsPainted)
            $(cellInfo.cell).css("background-color", cellInfo.previousColor);
    }
});

$("#redo").on("click", function(){
    if(historyIndex < lastCellsPaintedHistory.length){
        lastCellsPainted = lastCellsPaintedHistory[historyIndex++];
        
        for (const cellInfo of lastCellsPainted)
            $(cellInfo.cell).css("background-color", cellInfo.currentColor);
    }
});

function getCellInfoObj(cell, currentColor){
    const cellInfo = {
        cell: cell,
        previousColor: $(cell).css("background-color"),
        currentColor: currentColor
    };

    return cellInfo;
}

function pushIfNotPresent(cell, currentColor){
    if(!lastCellsPainted.some(cellFromArray => cellFromArray.cell === cell))
        lastCellsPainted.push(getCellInfoObj(cell, currentColor));
}

function updateHistory(){
    if(lastCellsPainted.length > 0){
        if(historyIndex < lastCellsPaintedHistory.length)
            lastCellsPaintedHistory = lastCellsPaintedHistory.slice(0, historyIndex);
        
        lastCellsPaintedHistory.push(lastCellsPainted);
        historyIndex++;
    }
}
