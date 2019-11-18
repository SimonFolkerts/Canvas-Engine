window.onload = function () {
    const EL_CANVAS = document.querySelector('#canvas');
    const INTERVAL = 10;

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
            this.pieces = this.pieces.filter(piece => piece.active === true);
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
            this.active = true;
            area.pieces.push(this);
            this.area = area;
            this.canvas = area.canvas;
            this.ctx = area.ctx;
            this.rotVel = 2;
            this.dx = 0;
            this.dy = 0;
            this.acc = 0.05;
            this.thrust = 0;
            this.x = canvas.width / 2;
            this.y = canvas.height / 2;
            this.angle = 0;
            this.width = 20;
            this.height = 30;
            this.fireRate = 5;
            this.canFire = true;
            this.flikr = 1;
        }
        update(keys) {
            if (keys.space && this.canFire) {
                this.pow();
            }
            if (keys.left) {
                this.angle += -this.rotVel;
            } else if (keys.right) {
                this.angle += this.rotVel;
            }
            //make a joocy vector from angle and increment displacement per tick if thrusting
            if (keys.up) {
                this.thrust = this.acc;
                this.dx += Math.cos((this.angle - 90) * Math.PI / 180);
                this.dy += Math.sin((this.angle - 90) * Math.PI / 180);
            } else {
                this.thrust = 0;
            }
            this.x += this.dx * this.acc;
            this.y += this.dy * this.acc;

            // console.log(Math.sin(this.angle - 90) * Math.PI / 180);
            // this.x += this.vel / 10 * Math.cos((this.angle - 90) * Math.PI / 180);
            // this.y += this.vel / 10 * Math.sin((this.angle - 90) * Math.PI / 180);
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
            //prepare for rotation
            this.ctx.save();
            this.ctx.translate(this.x, this.y);
            this.ctx.rotate(this.angle * Math.PI / 180);
            //draw shape

            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(0, -this.height / 2);
            this.ctx.lineTo(this.width / 2, this.height / 2);
            if (this.thrust) {
                if (this.flikr > 0) {
                    this.flikr--;
                } else {
                    this.flikr = 6
                }
                console.log(this.flikr);
                this.ctx.lineTo(this.width / 4, this.height / 2);
                this.ctx.lineTo(0, this.height * 1.2 + this.flikr * 1.0);
                this.ctx.lineTo(-this.width / 4, this.height / 2);
                // this.ctx.lineTo(this.width / 4, this.height / 2);
            }
            this.ctx.lineTo(-this.width / 2, this.height / 2);
            this.ctx.closePath();
            this.ctx.stroke();

            //return
            this.ctx.restore();
        }
        pow() {
            let missile = new Missile(this.x, this.y, this.dx * this.acc, this.dy * this.acc, this.angle, this.area);
            this.canFire = false;
            setTimeout(function () {
                this.canFire = true;
            }.bind(this), (1 / this.fireRate) * 1000);
        }
    }

    class Missile {
        constructor(x, y, dx, dy, angle, area) {
            this.active = true;
            area.pieces.push(this);
            this.area = area;
            this.canvas = area.canvas;
            this.ctx = area.ctx;
            this.x = x;
            this.y = y;
            this.width = 4;
            this.height = 8;
            this.angle = angle;
            this.counter = 0;
            this.vel = 8;
            this.dx = dx + (Math.cos((this.angle - 90) * Math.PI / 180)) * this.vel;
            this.dy = dy + (Math.sin((this.angle - 90) * Math.PI / 180)) * this.vel;
        }
        update() {
            this.counter++;
            if (this.counter > 500) {
                this.active = false;
            }
            this.dx += 0.5 * Math.cos((this.angle - 90) * Math.PI / 180);
            this.dy += 0.5 * Math.sin((this.angle - 90) * Math.PI / 180);
            this.x += this.dx;
            this.y += this.dy;
            this.height += 0.5;
        }
        draw() {
            this.ctx.save();
            this.ctx.translate(this.x, this.y);
            this.ctx.rotate(this.angle * Math.PI / 180);

            this.ctx.lineWidth = this.width;
            this.ctx.beginPath();
            this.ctx.moveTo(0, -this.height / 2);
            this.ctx.lineTo(0, this.height / 2);
            this.ctx.closePath();
            this.ctx.stroke();

            //return
            this.ctx.restore();
        }
    }

    class Roid {
        constructor(size, area) {
            this.active = true;
            area.pieces.push(this);
            this.area = area;
            this.canvas = area.canvas;
            this.ctx = area.ctx;
            this.x = this.canvas.width / 2;
            this.y = this.canvas.height / 2;
            this.width = size;
            this.height = size;
            this.dx = 0;
            this.dy = 0;
            this.rotVel = 1;
            this.angle = 0;
        }
        update() {
            this.dx = 0.5 * Math.cos((this.angle - 90) * Math.PI / 180);
            this.dy = 0.5 * Math.sin((this.angle - 90) * Math.PI / 180);
            this.x += this.dx;
            this.y += this.dy;
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
            this.ctx.save();
            this.ctx.translate(this.x, this.y);
            this.ctx.rotate(this.angle * Math.PI / 180);

            this.ctx.lineWidth = this.width;
            this.ctx.fillRect(-this.width / 2, 0, this.width, this.height);

            //return
            this.ctx.restore();
        }
    }

    let gameArea = new GameArea(EL_CANVAS, INTERVAL);
    let keyboardController = new KeyboardController();
    keyboardController.addListeners(gameArea.canvas);

    let ship = new Ship(gameArea);
    let roid = new Roid(40, gameArea);

    gameArea.start();
};