/**
 * @author Renan Silva (renans2 on GitHub)
 */

const body = $("body");
const toggleCircle = $("#toggle-circle");
const toggleBackground = $(".toggle-background");
const toggleMeText = $("#toggle-me-text");

body.addClass("light-off");
toggleCircle.addClass("off");
toggleBackground.addClass("background-off");
toggleMeText.addClass("white-text");

$(".toggle").on("click", function(){
    toggleCircle.toggleClass("off on");
    toggleBackground.toggleClass("background-off background-on");
    body.toggleClass("light-off light-on");
    toggleMeText.toggleClass("white-text black-text");
});
