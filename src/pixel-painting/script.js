let mouseIsDown = false;
let currentColor = "rgb(0, 0, 0)";

let currentColorDiv = $("#c21");
currentColorDiv.addClass("color-hover")

$(document).on("mousedown", function(){
    mouseIsDown = true;
});

$(document).on("mouseup", function(){
    mouseIsDown = false;
});

$(".color").on("mouseenter", function(){
    $(this).addClass("color-hover");
});

$(".color").on("mouseleave", function(){
    if(!$(this).is(currentColorDiv)){
        $(this).removeClass("color-hover");
    }
});

$(".color").on("click", function(){
    currentColorDiv.removeClass("color-hover");
    currentColorDiv = $(this);
    currentColorDiv.addClass("color-hover");
    currentColor = currentColorDiv.css("background-color");
});

$(".cell").on("click", function(){
    $(this).css("background-color", currentColor);
});

$(".cell").on("mouseenter", function(){
    if(mouseIsDown)
        $(this).css("background-color", currentColor);
});

$("#clear").on("click", function(){
    $(".cell").css("background-color", "white");
})
