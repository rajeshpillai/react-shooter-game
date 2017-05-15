import ReactDOM from 'react-dom';


var self;
export class Game  {
    constructor (game) {
        this.game =  game;
        self = this;
        this.size = { x: game.canvas.width, y: game.canvas.height};
        this.center = {x: this.size.x / 2, y: this.size.y / 2};
        //this.bodies = [new Player(this)];
        this.bodies = createInvaders(this).concat(new Player(this));
        this.shootSound = document.getElementById("shoot-sound");

        this.tick();
    }
    
    tick () {
        self.update();
        self.draw(self.game);  
        requestAnimationFrame(self.tick);
    }

    update () {
        var self = this;
        function notCollidingWithAnything (b1) {
            return self.bodies.filter(function (b2) {
                return self._isColliding(b1,b2);
            }).length === 0  ;
        }
        this.bodies = this.bodies.filter(notCollidingWithAnything);

        for(var i = 0; i < this.bodies.length; i++){
            this.bodies[i].update();
        }
    }

    draw (screen) {
        screen.clearRect(0,0, this.size.x, this.size.y);
        for(var i = 0; i < this.bodies.length; i++){
            this.bodies[i].draw(screen);
        }
    }

    addBody(bullet) {
        this.bodies.push(bullet);
    }
    
    invadersBelow (invader) {
        return this.bodies.filter(function (b) {
            return b instanceof Invader && 
                b.center.y > invader.center.y &&
                Math.abs(b.center.x - invader.center.x) < invader.size.x
        }).length > 0;
    }

    _isColliding(b1, b2) {
        return !(
            b1 === b2 ||
                b1.center.x + b1.size.x / 2 <= b2.center.x - b2.size.x / 2 ||
                b1.center.y + b1.size.y / 2 <= b2.center.y - b2.size.y / 2 ||
                b1.center.x - b1.size.x / 2 >= b2.center.x - b2.size.x / 2 ||
                b1.center.y - b1.size.y / 2 >= b2.center.y - b2.size.y / 2 
        );
    }   
}

export class Player {
    constructor(game) {
        this.game = game;
        this.size= {x: 15, y: 15};
        this.center = {x: game.center.x, y: game.size.y - 15};
        this.keyboarder = new Keyboarder();
    }

    update() {
        if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
            this.center.x -= 2;
        } else  if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
            this.center.x += 2;
        }

        if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE)) {
            this.game.addBody(
                new Bullet(this.game, 
                        {x : this.center.x, 
                        y: this.center.y - this.size.x},
                        {x: 0, y: -6})
            );
            //this.game.shootSound.load()
           this.game.shootSound.play();
        }
        
    }
    draw(screen) {
        this.drawBody(screen, this);
    }

    drawBody(screen, body){
        screen.fillRect(body.center.x - body.size.x / 2,
            body.center.y - body.size.y / 2,
            body.size.x,
            body.size.y);
    }
}

export class Invader {
    constructor(game, center) {
        this.game = game;
        this.size= {x: 15, y: 15};
        this.center = center;
        this.patrolX = 0;
        this.speedX = 0.3;
    }

    update() {
        if (this.patrolX < 0 || this.patrolX > 40) {
            this.speedX = -this.speedX;
        }
        this.center.x += this.speedX;
        this.patrolX += this.speedX;

        if (Math.random() > 0.995 && !this.game.invadersBelow(this)) {
            this.game.addBody(
            new Bullet(this.game, 
                    {x : this.center.x, 
                    y: this.center.y + this.size.x},
                    {x: 0, y: 2})
             );
        }
    }
    draw(screen) {
        this.drawBody(screen, this);
    }

    drawBody(screen, body){
        screen.fillRect(body.center.x - body.size.x / 2,
            body.center.y - body.size.y / 2,
            body.size.x,
            body.size.y);
    }

}

export class Bullet {
    constructor(game, center, velocity) {
        this.game = game;
        this.size= {x: 3, y: 3};
        this.center = center;
        this.velocity = velocity;
    }

    update() {
        this.center.x += this.velocity.x;
        this.center.y += this.velocity.y;
    }
    draw(screen) {
        this.drawBody(screen, this);
    }

    drawBody(screen, body){
        screen.fillRect(body.center.x - body.size.x / 2,
            body.center.y - body.size.y / 2,
            body.size.x,
            body.size.y);
    }
}



function createInvaders(game) {
    let invaders = [];
    for(let i = 0; i < 24; i++) {
        let x = 30 + i % 8 * 30;   // 8 columns
        let y = 30 + i % 3 * 30;   // 3 rows of invaders
        invaders.push(new Invader(game, {x: x, y: y}));

    }
    return invaders;
}

function Keyboarder(){
    let keyState = {};
    window.addEventListener("keydown", function (e) {
        keyState[e.keyCode] = true;
    });

    window.addEventListener("keyup", function (e) {
        keyState[e.keyCode] = false;
    });

    this.isDown = function (keyCode){
        return  keyState[keyCode] === true;
    }

    this.KEYS = {LEFT: 37, RIGHT:39, SPACE: 32};
}
