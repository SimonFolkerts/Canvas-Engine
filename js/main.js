window.onload = function () {
    const EL_CANVAS = document.querySelector('#canvas'),
        INTERVAL = 10;

    class GameArea {
        constructor(canvas, interval) {
            this.canvas = canvas;
            this.ctx = this.canvas.getContext("2d");
            this.counter = 0;
            this.interval = interval;
            this.pieces = [];
        }
        start() {
            this.interval = setInterval(this.update.bind(this), this.interval);
        }
        stop() {
            clearInterval(this.interval);
        }
        update() {
            this.counter++;
            this.ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < this.pieces.length; i++) {
                const piece = this.pieces[i];
                piece.update(keyboardController.keys);
                piece.draw();
            }
        }
    }

    class KeyboardController {
        constructor() {
            this.keys = {
                left: false,
                right: false,
                up: false,
                space: false
            };
        }
        addListeners(target) {
            target.addEventListener('keydown', this.keyDownEvent.bind(this));
            target.addEventListener('keyup', this.keyUpEvent.bind(this));
        }
        keyDownEvent(event) {
            console.log(this.keys);
            switch (event.key) {
                case 'ArrowLeft':
                    this.keys.left = true;
                    break;
                case 'ArrowRight':
                    this.keys.right = true;
                    break;
                case 'ArrowUp':
                    this.keys.up = true;
                    break;
                case " ":
                    this.keys.space = true;
                    break;
            }
        }
        keyUpEvent(event) {
            console.log(this.keys);
            switch (event.key) {
                case 'ArrowLeft':
                    this.keys.left = false;
                    break;
                case 'ArrowRight':
                    this.keys.right = false;
                    break;
                case 'ArrowUp':
                    this.keys.up = false;
                    break;
                case " ":
                    this.keys.space = false;
                    break;
            }
        }
    }

    class Ship {
        constructor(area) {
            area.pieces.push(this);
            this.canvas = area.canvas;
            this.ctx = area.ctx;
            this.acc = 1;
            this.rotVel = 2;
            this.vel = 0;
            this.x = canvas.width / 2;
            this.y = canvas.height / 2;
            this.angle = 0;
            this.width = 10;
            this.height = 30;
        }
        update(keys) {
            if (keys.left) {
                this.angle += -this.rotVel;
            } else if (keys.right) {
                this.angle += this.rotVel;
            }
            if (keys.up) {
                if (this.vel < 30) {
                    this.vel++
                }
            } else {
                if (this.vel > 0) {
                    this.vel--;
                }
            }
            this.x += this.vel / 10 * Math.cos((this.angle - 90) * Math.PI / 180);
            this.y += this.vel / 10 * Math.sin((this.angle - 90) * Math.PI / 180);
            if (this.x < 0) {
                this.x = this.canvas.width;
            } else if (this.x > this.canvas.width) {
                this.x = 0;
            }
            if (this.y < 0) {
                this.y = this.canvas.height;
            } else if (this.y > this.canvas.height) {
                this.y = 0;
            }
        }
        draw() {
            //ctx, x, y, width, height, angle
            this.ctx.save();
            this.ctx.translate(this.x, this.y);
            this.ctx.rotate(this.angle * Math.PI / 180);
            this.ctx.fillRect(
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height);
            this.ctx.restore();
        }
    }

    let gameArea = new GameArea(EL_CANVAS, INTERVAL);
    let keyboardController = new KeyboardController();
    keyboardController.addListeners(gameArea.canvas);

    let ship = new Ship(gameArea);

    gameArea.start();
}