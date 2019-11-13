window.onload = function () {
    const EL_CANVAS = document.querySelector('#canvas');

    class GameArea {
        constructor(canvas, interval) {
            this.canvas = canvas;
            this.ctx = this.canvas.getContext("2d");
            this.counter = 0;
            this.interval = interval;
            this.canvas.addEventListener('keydown', this.keyDownHandler.bind(this), false);
            this.canvas.addEventListener('keyup', this.keyUpHandler.bind(this), false);
        }
        start() {
            this.interval = setInterval(this.update.bind(this), this.interval);
        }
        stop() {
            clearInterval(this.interval);
        }
        update() {
            this.counter++;
        }
        keyDownHandler(event) {
            if (event.key == 'ArrowLeft') {
            } else if (event.key == 'ArrowRight') {
                console.log('RIGHT');
            }
        }
        keyUpHandler(event) {
            if (event.key == 'ArrowLeft') {
                console.log('LEFTup');
            } else if (event.key == 'ArrowRight') {
                console.log('RIGHTup');
            }
        }
    }

    let gameArea = new GameArea(EL_CANVAS);
    // gameArea.start();
}