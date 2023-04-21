const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
const width = 500;
const height = 700;

const paddleWidth = 70;
const paddleHeight = 20;
let paddleComputerX = 225;
let paddlePlayerX = 225;
let paddleDiff = 25;
let paddleContact = false;

const ballRadius = 5;
let ballX = width / 2;
let ballY = height / 2;

let playerScore = 0;
let computerScore = 0;

let speedY = -2;
let speedX = -2;
const computerSpeed = 3;
let trajectoryX;

let playerMoved = false;

function renderCanvas() {
  context.fillStyle = 'white';
  context.fillRect(0, 0, width, height);

  context.fillStyle = '#00ff00';
  context.fillRect(paddleComputerX, 10, paddleWidth, paddleHeight);
  context.fillRect(paddlePlayerX, height - 30, paddleWidth, paddleHeight);

  context.beginPath();
  context.setLineDash([4]);
  context.moveTo(0, 350);
  context.lineTo(500, 350);
  context.strokeStyle = '#ff98a3';
  context.stroke();

  context.beginPath();
  context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  context.fillStyle = '#00bfff';
  context.fill();

  context.font = '32px Courier New';
  context.fillText(playerScore, 20, canvas.height / 2 + 50);
  context.fillText(computerScore, 20, canvas.height / 2 - 30);
}

function ballMove() {
  ballY += -speedY;
  if (playerMoved && paddleContact) {
    ballX += speedX;
  }
}

function ballReset() {
  ballX = width / 2;
  ballY = height / 2;
  speedY = -3;
}

function ballBoundaries() {
  if (ballX < 0 && speedX < 0) {
    speedX = -speedX;
  } else if (ballX > width && speedX > 0) {
    speedX = -speedX;
  } else if (ballY > height - paddleDiff) {
    if (ballX > paddlePlayerX && ballX < paddlePlayerX + paddleWidth) {
      paddleContact = true;
      if (playerMoved) {
        speedY -= 1;
      }
      speedY = -speedY;
      trajectoryX = ballX - (paddlePlayerX + paddleDiff);
      speedX = trajectoryX * 0.3;
    } else if (ballY > height) {
      ballReset();
      computerScore++;
    }
  } else if (ballY < paddleDiff) {
    if (ballX > paddleComputerX && ballX < paddleComputerX + paddleWidth) {
      if (playerMoved) {
        speedY += 1;
      }
      speedY = -speedY;
    } else if (ballY < 0) {
      ballReset();
      playerScore++;
    }
  }
}

function computerPaddle() {
  if (playerMoved) {
    paddleComputerX += (ballX - (paddleComputerX + paddleDiff)) * 0.15;
  }
}

function animate() {
  ballBoundaries();
  renderCanvas();
  ballMove();
  computerPaddle();
  requestAnimationFrame(animate);
}

function createCanvas() {
  canvas.height = height;
  canvas.width = width;
  document.body.appendChild(canvas);
  renderCanvas();
}

function startGame() {
    createCanvas();
    animate();
  
    playerScore = 0;
    computerScore = 0;
  
    canvas.addEventListener("mousemove", (e) => {
      playerMoved = true;
      paddlePlayerX = e.clientX - width - paddleDiff;
  
      if (paddlePlayerX < paddleDiff) {
        paddlePlayerX = 0;
      }
      if (paddlePlayerX > width - paddleWidth) {
        paddlePlayerX = width - paddleWidth;
      }
    });
  
    canvas.addEventListener("mousedown", (e) => {
      if (!mouseMoved) {
        mouseMoved = true;
        animate();
      }
    });
  }
  
  startGame();
