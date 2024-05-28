let val1 = 0;
let val2 = 0;
let operator = "";
let operations = "";

const display = $("#display");
display.text(val1);

$(".number").on("click", function(){
    const num = parseInt(this.id);

    if(operator == "") {
        val1 *= 10;
        val1 += num;
    } else {
        val2 *= 10;
        val2 += num;
    }

    operations += num.toString();
    display.text(operations);
});

$(".operator").on("click", function(){
    if(operator != "") {
        val1 = calculate(val1, val2, operator);
        val2 = 0;
    }

    operator = this.id;
    operations = val1.toString() + operator;
    display.text(operations);
});

$("#res").on("click", function(){
    val1 = calculate(val1, val2, operator);
    val2 = 0;
    operator = "";
    operations = val1.toString();
    display.text(operations);
});

$("#c").on("click", function(){
    val1 = 0;
    val2 = 0;
    operator = "";
    operations = "";
    display.text(val1);
})

// function calculateAll(){
//     let val1 = 0;
//     let val2 = 0;
//     let operator = "";

//     for (const entry of queue) {
//         if(isOperator(entry)){
//             if(val2 != 0){
//                 val1 = calculate(val1, val2, operator);
//                 val2 = 0;
//             }
//             operator = entry;
//         } else if(operator == ""){
//             val1 *= 10;
//             val1 += parseInt(entry);
//         } else if(operator != ""){
//             val2 *= 10;
//             val2 += parseInt(entry);
//         }
//     }

//     return calculate(val1, val2, operator);;
// }

function calculate(num1, num2, operator){
    let res;
    
    switch (operator) {
        case "+": res = num1 + num2; break;
        case "-": res = num1 - num2; break;
        case "x": res = num1 * num2; break;
        case "/": res = num1 / num2; break;
        default: break;
    }

    return res;
}

// function isOperator(entry){
//     return entry == "+" || entry == "-" || entry == "x" || entry == "/";
// }
