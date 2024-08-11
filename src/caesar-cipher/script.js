/**
 * @author Renan Silva (renans2 on GitHub)
 */

const typeSelect = $("#type-select");
const cipherButton = $("#cipher-button");

for (let i = 0; i < 26; i++) {
    $("#shift-amount-select").append(`<option value=${i}>${i}</option>`);
}

typeSelect.on("change", function(){
    if(typeSelect.val() === "encrypt") {
        cipherButton.html("Encrypt");
        $("label[for='input']").html("Text to be encrypted:");
        $("label[for='output']").html("Encrypted text:");
    } else {
        cipherButton.html("Decrypt");
        $("label[for='input']").html("Text to be decrypted:");
        $("label[for='output']").html("Decrypted text:");
    }
});

cipherButton.on("click", function (){
   const input = $("#input").val();
   const shiftAmount = parseInt($("#shift-amount-select").val());
   const type = typeSelect.val();

   if(type === "encrypt")
       $("#output").html(cipherInput(input, shiftAmount));
   else
       $("#output").html(cipherInput(input, 26 - shiftAmount));
});

function cipherInput(input, shift){
    let result = "";

    for (let i = 0; i < input.length; i++) {
        const charCode = input.charCodeAt(i);

        if(65 <= charCode && charCode <= 90){ // Uppercase letters
            const shiftedChar = String.fromCharCode((((charCode % 65) + shift) % 26) + 65);
            result += shiftedChar;
        } else if(97 <= charCode && charCode <= 122){ // Lowercase letters
            const shiftedChar = String.fromCharCode((((charCode % 97) + shift) % 26) + 97);
            result += shiftedChar;
        } else {
            result += input.charAt(i);
        }
    }

    return result
}