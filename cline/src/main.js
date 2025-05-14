const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let bird;
let pipes;
let score = 0;
let gameOver = false;
let scoreText;

const game = new Phaser.Game(config);

function preload() {
    // Placeholder assets - using Phaser's graphics API instead of loading images
}

function create() {
    // Create bird
    bird = this.add.circle(100, 250, 15, 0xffffff);
    this.physics.add.existing(bird);
    bird.body.velocity.y = -300;

    // Create pipes
    pipes = this.physics.add.group();

    // Create score text
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    // Input
    this.input.keyboard.on('keydown-SPACE', () => {
        if (gameOver) {
            restartGame();
        } else {
            bird.body.velocity.y = -300;
        }
    });

    // Timer for pipe generation
    this.time.addEvent({
        delay: 1500,
        callback: addPipe,
        callbackScope: this,
        loop: true
    });
}

function update() {
    // Check for collisions
    this.physics.overlap(bird, pipes, () => {
        gameOver = true;
        scoreText.setText('Game Over! Score: ' + score);
    });

    // Move pipes
    pipes.getChildren().forEach(pipe => {
        pipe.x -= 200 * this.game.loop.delta;

        // Reset pipe position
        if (pipe.x < -50) {
            score++;
            scoreText.setText('Score: ' + score);
            pipe.x = 850;
            pipe.y = Phaser.Math.Between(50, 550);
        }
    });
}

function addPipe() {
    // Create top pipe
    const topPipe = this.add.rectangle(850, Phaser.Math.Between(50, 250), 50, Phaser.Math.Between(100, 400));
    this.physics.add.existing(topPipe);
    topPipe.body.setImmovable(true);

    // Create bottom pipe
    const bottomPipe = this.add.rectangle(850, Phaser.Math.Between(350, 550), 50, Phaser.Math.Between(100, 400));
    this.physics.add.existing(bottomPipe);
    bottomPipe.body.setImmovable(true);

    pipes.add(topPipe);
    pipes.add(bottomPipe);
}

function restartGame() {
    score = 0;
    gameOver = false;
    scoreText.setText('Score: 0');
    bird.setPosition(100, 250);
    bird.body.velocity.y = -300;
    pipes.getChildren().forEach(pipe => {
        pipe.setPosition(850, Phaser.Math.Between(50, 550));
    });
}
