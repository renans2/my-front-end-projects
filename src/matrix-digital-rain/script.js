/**
 * @author Renan Silva (renans2 on GitHub)
 */

const FONT_SIZE = 20;
const SIDE_LENGTH = FONT_SIZE;
let N_HORIZONTAL;
let N_VERTICAL;
const MIN_REVEALER_LENGTH = 3;
const MAX_REVEALER_LENGTH = 13;
const MIN_REVEALER_SPEED = 1;
const MAX_REVEALER_SPEED = 15;
let cells = [];
let revealers = [];

function setup() {
    N_HORIZONTAL = windowWidth / SIDE_LENGTH;
    N_VERTICAL = windowHeight / SIDE_LENGTH;
    createCanvas(windowWidth, windowHeight);
    background(0);
    noStroke();
    textAlign(LEFT, TOP);
    textFont('Noto Serif JP Regular', FONT_SIZE);
    textLeading(20);

    for (let i = 0; i < N_HORIZONTAL; i++) {
        revealers[i] = [];
        revealers[i][0] = createRevealer();
        cells[i] = [];
        for (let j = 0; j < N_VERTICAL; j++) {
            cells[i][j] = new Cell(i * SIDE_LENGTH, j * SIDE_LENGTH);
        }
    }
}

function draw() {
    fill(0, 0, 0, 20);
    rect(0, 0, width, height);

    for (let i = 0; i < N_HORIZONTAL; i++) {
        let r1 = revealers[i][0];
        if (r1 != null) {
            for (let pos of r1.getRevealed()) {
                cells[i][pos].draw(70);
            }

            if (r1.getRevealed().length > 0) {
                cells[i][r1.getRevealed()[r1.getRevealed().length - 1]].draw(255);
            }

            r1.update();
            if (r1.isOut()) {
                revealers[i][0] = null;
            } else if (r1.hitBottom() && revealers[i][1] == null) {
                revealers[i][1] = createRevealer();
            }
        }

        let r2 = revealers[i][1];
        if (r2 != null) {
            for (let pos of r2.getRevealed()) {
                cells[i][pos].draw(70);
            }

            if (r2.getRevealed().length > 0) {
                cells[i][r2.getRevealed()[r2.getRevealed().length - 1]].draw(255);
            }

            r2.update();
            if (r2.isOut()) {
                revealers[i][1] = null;
            } else if (r2.hitBottom() && revealers[i][0] == null) {
                revealers[i][0] = createRevealer();
            }
        }
    }
}

function createRevealer() {
    let length = floor(random(MIN_REVEALER_LENGTH, MAX_REVEALER_LENGTH));
    let speed = floor(random(MIN_REVEALER_SPEED, MAX_REVEALER_SPEED));
    return new Revealer(length, speed);
}

$(window).on('resize', function(){
    location.reload();
});
