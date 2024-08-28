/**
 * @author Renan Silva (renans2 on GitHub)
 */

const container = $(".container");
const containerWidth = container.width();
const containerHeight = container.height();
const scoreElem = $(".score");
const playAgainButton = $("#play-again-button");
playAgainButton.hide();

const LAYER_HEIGHT = 30;
const LAYER_STARTING_WIDTH = 0.7 * containerWidth;
const LAYER_STARTING_SPEED = 28;
let layers = [];
let nextSpawnSide = -1;
let score;
let isOver;

$(playAgainButton).on("click", function() {
    reset();
    $(this).hide();
});

function reset(){
    score = 0;
    $(scoreElem).html(score);
    $(scoreElem).removeClass("game-over");
    layers = [];
    isOver = false;

    layers.push(new Layer(
        true,
        LAYER_STARTING_WIDTH,
        nextSpawnSide));

    layers[0].shiftDown();

    layers.push(new Layer(
        false,
        LAYER_STARTING_WIDTH,
        nextSpawnSide));
}

function setup() {
    frameRate(20);
    createCanvas(containerWidth, containerHeight);

    reset();
}

function draw() {
    translate(0, height);
    scale(1, -1);
    background(0);

    layers[layers.length - 1].move();

    for (const layer of layers) {
        layer.draw();
    }
}

function mousePressed() {
    if(!isOver) {
        const current = layers[layers.length - 1];
        const lastStacked = layers[layers.length - 2];

        const newWidth = current.stackAndGetNewWidth(lastStacked);

        if(newWidth === 0) {
            isOver = true;
            $(playAgainButton).show();
            $(scoreElem).addClass("game-over");
        } else {
            score++;
            $(scoreElem).html(score);
            nextSpawnSide *= -1;

            for (const layer of layers) {
                layer.shiftDown();
            }

            layers.push(new Layer(
                false,
                newWidth,
                nextSpawnSide));
        }
    }
}
