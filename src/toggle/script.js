let toggleOn = false;
$("body").addClass("light-off");
$("#toggle-circle").addClass("off");
$(".toggle-background").addClass("background-off");
$("#toggle-me").addClass("white-text");

$(".toggle").on("click", toggle);


function toggle(){
    if(toggleOn) turnOff();
    else         turnOn();

    toggleOn = !toggleOn;
    changeLightStateAndTextColor();
}

function turnOn(){
    $("#toggle-circle").removeClass("off");
    $("#toggle-circle").addClass("on");
    $(".toggle-background").removeClass("background-off");
    $(".toggle-background").addClass("background-on");
}

function turnOff(){
    $("#toggle-circle").removeClass("on");
    $("#toggle-circle").addClass("off");
    $(".toggle-background").removeClass("background-on");
    $(".toggle-background").addClass("background-off");
}

function changeLightStateAndTextColor(){
    if(toggleOn){
        $("body").removeClass("light-off");
        $("body").addClass("light-on");
        $("#toggle-me").removeClass("white-text");
        $("#toggle-me").addClass("black-text");
    }else{
        $("body").removeClass("light-on");
        $("body").addClass("light-off");
        $("#toggle-me").removeClass("black-text");
        $("#toggle-me").addClass("white-text");
    }
}
