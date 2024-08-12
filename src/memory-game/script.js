/**
 * @author Renan Silva (renans2 on GitHub)
 */

let images = [
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angularjs/angularjs-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/archlinux/archlinux-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/clion/clion-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/debian/debian-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original-wordmark.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/eclipse/eclipse-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/gitlab/gitlab-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/godot/godot-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/haskell/haskell-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/intellij/intellij-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jquery/jquery-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/json/json-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/p5js/p5js-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/processing/processing-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/stackoverflow/stackoverflow-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ubuntu/ubuntu-original.svg" />',
    '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/visualstudio/visualstudio-original.svg" />',
];
images = shuffle(images);

let canClick = true;
const timeShowingCells = 700;
const dimensions = 4;
const container = $(".container");
const gameOverContainer = $(".gameover-container");
const message = $(".message");
let selected = null;
let pairsFound = 0;
let over = false;

gameOverContainer.hide();
container.css("grid-template-columns", `repeat(${dimensions}, auto)`);
fillContainer();
setListener();

function fillContainer() {
    let array = [];

    for (let i = 0; i < (dimensions * dimensions)/2; i++) {
        const cell1 = $(`<div id='${2*i}' class='cell ${i}'>
                        <div class='back'></div>
                        <div class='front'></div>
                     </div>`); cell1.find(".back").append(images[i]);
        const cell2 = $(`<div id='${2*i+1}' class='cell ${i}'>
                        <div class='back'></div>
                        <div class='front'></div>
                     </div>`); cell2.find(".back").append(images[i]);

        array.push(cell1); array.push(cell2);
    }
    array = shuffle(array);

    for(const cell of array){
        container.append(cell);
    }
}

function setListener(){
    $(".cell").on("click", function(){
        if(isClickable(this)){
            const front = getFront(this);
            const back  = getBack(this);

            if(selected != null && notTheSameCell(this)){
                flip(front, back);
                if(cellsMatch(this))
                    caseMatch(this);
                else
                    caseDoesNotMatch(front, back);
            }else if(selected == null){
                flip(front, back);
                selected = {
                    cell: $(this),
                    front: front,
                    back: back
                }
            }
        }
    });
}

$("#play-again-button").on("click", function(){
    images = shuffle(images);
    $(".cell").remove();
    fillContainer();
    setListener();
    message.show();
    gameOverContainer.hide();
    pairsFound = 0;
    over = false;
    canClick = true;
    selected = null;
});

function notTheSameCell(current){
    return $(current).attr("id") !== selected.cell.attr("id")
}

function isClickable(current){
    return canClick && !$(current).hasClass("found")
}

function getFront(current){
    return $(current).find(".front");
}

function getBack(current){
    return $(current).find(".back");
}

function flip(front, back){
    front.toggleClass("flip-front");
    back.toggleClass("flip-back");
}

function cellsMatch(current){
    return $(current).attr("class") === selected.cell.attr("class");
}

function caseMatch(current){
    $(current).addClass("found");
    selected.cell.addClass("found");
    selected = null;
    pairsFound++;

    if(pairsFound === (dimensions*dimensions)/2){
        over = true;
        gameOverContainer.show();
        message.hide();
    }
}

function caseDoesNotMatch(front, back){
    canClick = false;
    setTimeout(function(){
        selected.cell.removeClass("selected");
        selected.front.toggleClass("flip-front");
        selected.back.toggleClass("flip-back");
        front.toggleClass("flip-front");
        back.toggleClass("flip-back");
        canClick = true;
        selected = null;
    }, timeShowingCells);
}

function shuffle(array){
    let tempArray = [];

    for (let i = array.length; i > 0; i--) {
        const index = getRandomIndex(i);
        tempArray.push(array[index]);
        array.splice(index, 1);
    }

    return tempArray;
}

function getRandomIndex(max){
    return Math.floor(Math.random() * max);
}
