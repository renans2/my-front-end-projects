const body = $("body");
const toggleCircle = $("#toggle-circle");
const toggleBackgroud = $(".toggle-background");
const toggleMeText = $("#toggle-me-text");

body.addClass("light-off");
toggleCircle.addClass("off");
toggleBackgroud.addClass("background-off");
toggleMeText.addClass("white-text");

$(".toggle").on("click", function(){
    toggleCircle.toggleClass("off on");
    toggleBackgroud.toggleClass("background-off background-on");
    body.toggleClass("light-off light-on");
    toggleMeText.toggleClass("white-text black-text");
});
