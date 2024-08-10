/**
 * @author Renan Silva (renans2 on GitHub)
 */

const display = $("#display");

$("#c").on("click", function(){
    display.html("");
});

$("#res").on("click", function(){
    try{
        const result = eval(display.html());
        if(!Number.isInteger(result))
            display.html(result.toFixed(2));
        else
            display.html(result);
    } catch (error){
        display.html("Error");
    }
});

$(".number, .operator").on("click", function(){
    display.html(display.html() + $(this).text());
});
