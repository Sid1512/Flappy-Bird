// Define board dimensions and context for drawing.
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// Define bird properties and initial position.
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8; // Bird initial x-position.
let birdY = boardHeight / 2; // Bird initial y-position.
let birdImg;

// Define bird object with its properties.
let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

// Define properties and images for pipes.
let pipeArray = []; // Array to store pipes.
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth; // Initial x-position of pipes.
let pipeY = 0; // Initial y-position of pipes.
let topPipeImg;
let bottomPipeImg;

// Define physics parameters.
let velocityX = -2; // Speed at which pipes move left.
let velocityY = 0; // Bird's jump speed.
let gravity = 0.4; // Gravity effect.

// Initialize game state variables.
let gameOver = false;
let score = 0;

// Perform operations once the window is loaded.
window.onload = function () {
    // Get the board element and set its dimensions.
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Load bird image and draw it.
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    // Load images for top and bottom pipes.
    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    // Start game loop and pipe generation.
    requestAnimationFrame(update);
    setInterval(placePipes, 1500); // Generate pipes every 1.5 seconds.
    document.addEventListener("keydown", moveBird);
}

// Define update function to handle game state updates and rendering.
function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height); // Clear the board.

    // Update bird position based on gravity.
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0); // Apply gravity and limit bird to top of the canvas.
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height); // Draw the bird.

    // Check if bird falls out of the board.
    if (bird.y > board.height) {
        gameOver = true;
    }

    // Update and draw pipes.
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX; // Move pipes to the left.
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height); // Draw pipes.

        // Check if bird passed through the pipes and update score.
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; // Increment score by 0.5 for passing each set of pipes.
            pipe.passed = true;
        }

        // Check for collision with pipes.
        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    // Clear off-screen pipes from the array.
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); // Remove the first element from the array.
    }

    // Display score on the board.
    context.fillStyle = "black";
    context.font = "45px Protest Riot";
    context.fillText(score, 5, 45);

    // Display game over message if the game is over.
    if (gameOver) {
        context.fillStyle = "red";
        context.font = "35px Sixtyfour";
        context.fillText("GAME OVER", 20, 320);
    }
}

// Generate pipes on the board.
function placePipes() {
    if (gameOver) {
        return;
    }

    // Calculate random position for pipes.
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    // Create top pipe and add it to the pipe array.
    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    // Create bottom pipe and add it to the pipe array.
    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

// Handle bird movement.
function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp") {
        // Bird jumps.
        velocityY = -6;

        // Reset game if it's over.
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

// Detect collision between two objects.
function detectCollision(a, b) {
    return a.x < b.x + b.width &&   // a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x &&   // a's top right corner passes b's top left corner
        a.y < b.y + b.height &&  // a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y;    // a's bottom left corner passes b's top left corner
}