class Cell {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.symbol = '';
        this.changeDelay = 0;
        this.previousTime = 0;
        this.timer = 0;
        this.setNewSymbol();
        this.setNewChangeDelay();
    }

    // Draws the cell on the canvas
    draw(extraColor) {
        let currentTime = millis();
        this.timer += currentTime - this.previousTime;
        this.previousTime = currentTime;

        if (this.timer > this.changeDelay) {
            this.setNewSymbol();
            this.setNewChangeDelay();
            this.timer = 0;
        }

        fill(extraColor, 255, extraColor);
        text(this.symbol, this.pos.x, this.pos.y);
    }

    // Sets a new symbol for the cell
    setNewSymbol() {
        this.symbol = this.getNewSymbol();
    }

    // Gets a random new symbol from the characters string
    getNewSymbol() {
        const CHARACTERS =
            "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let i = floor(random(CHARACTERS.length));
        return CHARACTERS.charAt(i);
    }

    // Sets a new delay time for when the symbol changes
    setNewChangeDelay() {
        const MIN_DELAY = 800;
        const MAX_DELAY = 3000;
        this.changeDelay = floor(random(MIN_DELAY, MAX_DELAY));
    }
}