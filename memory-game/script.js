const buttons = document.querySelectorAll(".button");

addListeners();

function addListeners(){
    for (const button of buttons)
        button.addEventListener("click", buttonClicked);
}

function buttonClicked(event){
    let button = event.target;
    console.log("hi");
}
