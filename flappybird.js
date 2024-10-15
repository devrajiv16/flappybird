const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

let bird = { x: 50, y: 150, width: 20, height: 20, gravity: 0.6, lift: -15, velocity: 0 };
let pipes = [];
let spaceBetweenPipes = 300;
let frame = 0;
let score = 0;
let gameOver = false;

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    frame = 0;
    score = 0;
    spaceBetweenPipes = 200;
    gameOver = false;
    document.getElementById("score").innerText = "Score: 0";
}

function startGame() {
    resetGame();
    gameLoop();
}

function gameLoop() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bird movement
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        gameOver = true;
        alert("Game Over! Final score: " + score);
        return;
    }

    // Pipe generation
    if (frame % 100 === 0) {
        let pipeY = Math.floor(Math.random() * (canvas.height / 2)) + 50;
        pipes.push({
            x: canvas.width,
            y: pipeY
        });
    }

    // Move pipes and check for collision
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 2;

        if (pipes[i].x + 50 < 0) {
            pipes.splice(i, 1);
            score++;
            document.getElementById("score").innerText = "Score: " + score;

            // Reduce space between pipes every 10 points
            if (score % 10 === 0 && spaceBetweenPipes > 80) {
                spaceBetweenPipes -= 10;
            }
        }

        // Collision detection
        if (
            bird.x < pipes[i].x + 50 &&
            bird.x + bird.width > pipes[i].x &&
            (bird.y < pipes[i].y || bird.y + bird.height > pipes[i].y + spaceBetweenPipes)
        ) {
            gameOver = true;
            alert("Game Over! Final score: " + score);
        }

        // Draw pipes
        ctx.fillStyle = 'green';
        ctx.fillRect(pipes[i].x, 0, 50, pipes[i].y);  // Top pipe
        ctx.fillRect(pipes[i].x, pipes[i].y + spaceBetweenPipes, 50, canvas.height - pipes[i].y - spaceBetweenPipes);  // Bottom pipe
    }

    // Draw bird
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    frame++;
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

window.addEventListener('keydown', () => {
    bird.velocity = bird.lift;
});

document.getElementById("newGameBtn").addEventListener("click", startGame);

startGame();
