// Set the canvas size using the "size" variable
const size = 600;
const gridSize = 25;
const canvas = document.getElementById("game-board");
canvas.width = size;
canvas.height = size;

// Get the 2D drawing context from the canvas
const ctx = canvas.getContext("2d");

// Get DOM elements for buttons and texts
const playButton = document.getElementById("play-button");
const gameOverText = document.getElementById("game-over");
const gameOverScore = document.getElementById("game-over-score");
const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("high-score");

// Initialize game variables
let snake = [{x: size / 2, y: size / 2}];
let direction = {x: gridSize, y: 0};
let food = {x: 0, y: 0};
let score = 0;
let highScore = 0;
let interval;
let gameActive = false;

// Function to generate random food positions
function randomFoodPosition() {
    return Math.floor(Math.random() * (size / gridSize)) * gridSize;
}

// Function to create food at a random position
function createFood() {
    food = {x: randomFoodPosition(), y: randomFoodPosition()};
}

// Function to draw the snake on the canvas
function drawSnake() {
    ctx.fillStyle = "green";
    for (const part of snake) {
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
    }
}

// Function to draw the food on the canvas
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Function to move the snake to a new position based on its current direction
function moveSnake() {
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    snake.unshift(head);

    // Check if the snake has eaten food
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score++;
        scoreText.textContent = score;
        createFood();
    } else {
        // If not, remove the tail of the snake
        snake.pop();
    }
}

// Function to clear the canvas for the next frame
function clearBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Function to check if the game is over (snake hits the wall or its own tail)
function checkGameOver() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    return (
        snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height
    );
}

// Function to show the game over text and score
function showGameOver() {
    gameOverText.classList.remove("hidden");
    gameOverScore.textContent = score;
}

// Function to hide the game over text
function hideGameOver() {
    gameOverText.classList.add("hidden");
}

// Function to handle game over logic
function gameOver() {
    clearInterval(interval);
    gameActive = false;
    showGameOver();

    if (score > highScore) {
        highScore = score;
        highScoreText.textContent = highScore;
    }

    playButton.classList.remove("hidden");
}

// Main game loop function, called repeatedly with setInterval
function gameLoop() {
    clearBoard();
    drawFood();
    drawSnake();
    moveSnake();

    if (checkGameOver()) {
        gameOver();
    }
}

// Function to start the game
function startGame() {
    playButton.classList.add("hidden");
    hideGameOver();

    snake = [{x: size / 2, y: size / 2}];
    direction = {x: gridSize, y: 0};
    createFood();
    score = 0;
    scoreText.textContent = score;

    if (!gameActive) {
        gameActive = true;
        interval = setInterval(gameLoop, 100);
    }
}

// Event listeners for play button and arrow keys
playButton.addEventListener("click", () => {
    playButton.classList.add("hidden");
    setTimeout(() => startGame(), 1000);
});

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            if (direction.y === 0) {
                direction = {x: 0, y: -gridSize};
            }
            break;
        case "ArrowDown":
            if (direction.y === 0) {
                direction = {x: 0, y: gridSize};
            }
            break;
        case "ArrowLeft":
            if (direction.x === 0) {
                direction = {x: -gridSize, y: 0};
            }
            break;
        case "ArrowRight":
            if (direction.x === 0) {
                direction = {x: gridSize, y: 0};
            }
            break;
    }
});