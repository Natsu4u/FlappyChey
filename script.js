const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load gambar burung (pacarmu)
const birdImage = new Image();
birdImage.src = "bird.png"; // Ganti dengan gambar pacarmu

// Load background
const bgImage = new Image();
bgImage.src = "background.png"; // Ganti dengan background yang kamu suka

// Load sounds
const jumpSound = new Audio("jump.mp3");
const gameOverSound = new Audio("gameover.mp3");
const backgroundMusic = new Audio("background.mp3");
backgroundMusic.loop = true;
backgroundMusic.play();

// Atur ukuran canvas agar pas di layar hp 412x915px
function resizeCanvas() {
    canvas.width = 412;
    canvas.height = 915;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Variabel game
let bird = { x: 50, y: canvas.height / 2, width: 50, height: 50, velocity: 0, gravity: 0.5, jump: -8 };
let pipes = [];
let pipeWidth = 80;
let pipeGap = 180;
let score = 0;
let gameOver = false;

// Fungsi menggambar burung berbentuk hati ❤️
function drawHeart(x, y, width, height) {
    ctx.save();
    ctx.beginPath();

    // Bentuk hati menggunakan path
    ctx.moveTo(x + width / 2, y + height / 4);
    ctx.bezierCurveTo(x + width, y - height / 4, x + width, y + height / 2, x + width / 2, y + height);
    ctx.bezierCurveTo(x, y + height / 2, x, y - height / 4, x + width / 2, y + height / 4);

    ctx.closePath();
    ctx.clip();

    // Tempelkan foto pacarmu ke dalam bentuk hati ❤️
    ctx.drawImage(birdImage, x, y, width, height);
    ctx.restore();
}

// Update game
function update() {
    if (gameOver) return;

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
        let height = Math.random() * (canvas.height / 2);
        pipes.push({ x: canvas.width, y: height, width: pipeWidth, height });
    }

    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 3;

        if (
            bird.x < pipes[i].x + pipes[i].width &&
            bird.x + bird.width > pipes[i].x &&
            (bird.y < pipes[i].y || bird.y + bird.height > pipes[i].y + pipeGap)
        ) {
            gameOver = true;
            gameOverSound.play();
        }

        if (pipes[i].x + pipes[i].width < 0) {
            pipes.splice(i, 1);
            score++;
        }
    }

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
        gameOverSound.play();
    }
}

// Gambar game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    // Gambar burung berbentuk hati ❤️
    drawHeart(bird.x, bird.y, bird.width, bird.height);

    // Gambar pipa
    ctx.fillStyle = "green";
    ctx.strokeStyle = "darkgreen";
    ctx.lineWidth = 5;
    for (let pipe of pipes) {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.y);
        ctx.strokeRect(pipe.x, 0, pipe.width, pipe.y);
        ctx.fillRect(pipe.x - 5, pipe.y - 30, pipe.width + 10, 30);
        ctx.strokeRect(pipe.x - 5, pipe.y - 30, pipe.width + 10, 30);

        ctx.fillRect(pipe.x, pipe.y + pipeGap, pipe.width, canvas.height - pipe.y - pipeGap);
        ctx.strokeRect(pipe.x, pipe.y + pipeGap, pipe.width, canvas.height - pipe.y - pipeGap);
        ctx.fillRect(pipe.x - 5, pipe.y + pipeGap, pipe.width + 10, 30);
        ctx.strokeRect(pipe.x - 5, pipe.y + pipeGap, pipe.width + 10, 30);
    }

    // Gambar skor di bagian atas layar
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Score: " + score, canvas.width / 2, 60);

    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Cupu Kamu Cheyy!", canvas.width / 2, canvas.height / 2);
    }
}

// Input (Lompat)
function jump() {
    if (!gameOver) {
        bird.velocity = bird.jump;
        jumpSound.play();
    } else {
        bird.y = canvas.height / 2;
        bird.velocity = 0;
        pipes = [];
        score = 0;
        gameOver = false;
    }
}
document.addEventListener("keydown", jump);
canvas.addEventListener("touchstart", jump);

// Game Loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
gameLoop();
