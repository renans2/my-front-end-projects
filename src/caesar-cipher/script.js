/**
 * @author Renan Silva (renans2 on GitHub)
 */

for (let i = 0; i < 26; i++) {
    $("#shift-amount-select").append(`<option value=${i}>${i}</option>`);
}

$("#cipher-button").on("click", function (){
   const input = $("#input").val();
   const shiftAmount = parseInt($("#shift-amount-select").val());
   const shiftDirection = $("#shift-direction-select").val();

   if(shiftDirection === "left")
       $("#output").html(cipherInput(input, 26 - shiftAmount));
   else
       $("#output").html(cipherInput(input, shiftAmount));
});

function cipherInput(input, shift){
    let result = "";

    for (let i = 0; i < input.length; i++) {
        const shiftedChar = String.fromCharCode((((input.charCodeAt(i) % 97) + shift) % 26) + 97);
        result += shiftedChar;
    }

    return result
}