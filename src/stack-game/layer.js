const LEFT = -1;

class Layer {
    constructor(fixed, width, spawnSide) {
        this.width = width;
        this.y = 2 * (containerHeight/3);

        if(fixed){
            this.x = containerWidth/2 - this.width/2;
        } else {
            if(spawnSide === LEFT) {
                this.x = -width;
                this.speed = LAYER_STARTING_SPEED;
            } else {
                this.x = containerWidth;
                this.speed = -LAYER_STARTING_SPEED;
            }
        }
    }

    move() {
        this.x += this.speed;

        if(this.speed < 0 && this.x + this.width/2 < 0)
            this.speed *= -1;

        else if(this.speed > 0 && this.x + this.width/2 > containerWidth)
            this.speed *= -1;
    }

    draw() {
        rect(this.x, this.y, this.width, LAYER_HEIGHT);
    }

    getX() {
        return this.x;
    }

    shiftDown() {
        this.y -= LAYER_HEIGHT;
    }

    stackAndGetNewWidth(prevLayer) {
        let newWidth = constrain(this.width - Math.abs(this.x - prevLayer.getX()), 0, this.width);
        this.width = newWidth;

        if(this.x < prevLayer.getX())
            this.x = prevLayer.getX();

        return newWidth;
    }
}
