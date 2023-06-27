// e = empty / a = apple / s = snake
const emptyFrame = "e";
const appleFrame = "a";
const snakeFrame = "s";

const up = "up";
const down = "down";
const right = "right";
const left = "left";

const board = document.getElementById("board");
const gameOverBox = document.getElementById("game-over");
const scoreElement = document.getElementById("score");
const gameOverScoreElement = document.getElementById("go-score");
const bestElement = document.getElementById("best");
let mainArray = [];
let score = 0;
let best = localStorage.getItem("best-snake-game-score");

const boardHeight = 30;
const boardWidth = 30;

const totalSquares = boardHeight * boardWidth;

let appleX = 0;
let appleY = 0;

let snakeHeadX = 0;
let snakeHeadY = 0;

let snakeArray = [];

let direction = up;
let rate = 100;

let intervalUpdate = 0;
let intervalMove = 0;

function initialize() {
  fillMainArray();
  generateApple();
  generateSnake();
  determineStartingDirection();
  intervalUpdate = setInterval(() => {
    updateBoard();
    updateNumbers();
  }, 10);
}

function flushBoard() {
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
}

function updateNumbers() {
  scoreElement.innerText = score;

  if (!best) {
    bestElement.innerText = 0;
  } else {
    bestElement.innerText = localStorage.getItem("best-snake-game-score");
  }
}

function updateBoard() {
  flushBoard();
  updateSnake();

  mainArray.forEach((row) => {
    row.forEach((frame) => {
      switch (frame) {
        case emptyFrame:
          makeFrame("empty");
          break;
        case appleFrame:
          makeFrame("apple");
          break;
        case snakeFrame:
          makeFrame("snake");
          break;
      }
    });
  });
}

function updateSnake() {
  snakeArray.forEach((coord) => {
    mainArray[coord[0]][coord[1]] = snakeFrame;
  });
}

function fillMainArray() {
  mainArray = [];

  for (height = 0; height < boardHeight; height++) {
    mainArray.push([]);
    for (width = 0; width < boardWidth; width++) {
      mainArray[height].push(emptyFrame);
    }
  }
}

function generateApple() {
  appleX = Math.floor(Math.random() * boardWidth);
  appleY = Math.floor(Math.random() * boardHeight);

  for (let i = 0; i < snakeArray.length; i++) {
    const snakeX = snakeArray[i][1];
    const snakeY = snakeArray[i][0];

    if (appleY === snakeY && appleX === snakeX) {
      generateApple();
      return;
    }
  }

  mainArray[appleY][appleX] = appleFrame;
}

function generateSnake() {
  snakeHeadX = Math.floor(Math.random() * boardWidth);
  snakeHeadY = Math.floor(Math.random() * boardHeight);

  if (snakeHeadX == appleX && snakeHeadY == appleY) {
    generateSnake();
    return;
  }

  snakeArray.push([snakeHeadY, snakeHeadX]);
}

function makeFrame(type) {
  const frameElement = document.createElement("div");
  frameElement.classList.add(type);
  board.appendChild(frameElement);
}

function checkIfAteApple() {
  if (snakeHeadX == appleX && snakeHeadY == appleY) {
    generateApple();
    snakeArray.push(snakeArray[0]);
    score += 1;
  }
}

function moveSnake() {
  intervalMove = setInterval(() => {
    let snakeTail = snakeArray.pop();
    let snakeTailX = snakeTail[1];
    let snakeTailY = snakeTail[0];

    switch (direction) {
      case up:
        snakeHeadY -= 1;

        if (snakeHeadY < 0) {
          clearInterval(intervalMove);
          snakeHeadY += 1;
          gameOver();
        }

        snakeArray.unshift([snakeHeadY, snakeHeadX]);
        mainArray[snakeTailY][snakeTailX] = emptyFrame;
        break;
      case down:
        snakeHeadY += 1;

        if (snakeHeadY >= boardHeight) {
          clearInterval(intervalMove);
          snakeHeadY -= 1;
          gameOver();
        }

        snakeArray.unshift([snakeHeadY, snakeHeadX]);
        mainArray[snakeTailY][snakeTailX] = emptyFrame;
        break;
      case left:
        snakeHeadX -= 1;

        if (snakeHeadX < 0) {
          clearInterval(intervalMove);
          snakeHeadX += 1;
          gameOver();
        }

        snakeArray.unshift([snakeHeadY, snakeHeadX]);
        mainArray[snakeTailY][snakeTailX] = emptyFrame;
        break;
      case right:
        snakeHeadX += 1;

        if (snakeHeadX >= boardWidth) {
          clearInterval(intervalMove);
          snakeHeadX -= 1;
          gameOver();
        }

        snakeArray.unshift([snakeHeadY, snakeHeadX]);
        mainArray[snakeTailY][snakeTailX] = emptyFrame;
        break;
    }

    checkIfAteApple();

    checkIfHitItself();
  }, rate);
}

function checkIfHitItself() {
  for (let i = 1; i < snakeArray.length; i++) {
    const bodyX = snakeArray[i][1];
    const bodyY = snakeArray[i][0];

    if (snakeHeadY === bodyY && snakeHeadX === bodyX) {
      if (
        !(i === snakeArray.length - 1 && headY === bodyY && headX === bodyX)
      ) {
        clearInterval(intervalMove);
        gameOver();
      }
    }
  }
}

function gameOver() {
  if (!best) {
    localStorage.setItem("best-snake-game-score", score.toString());
  } else {
    if (score > Number(best)) {
      localStorage.setItem("best-snake-game-score", score.toString());
    }
  }

  gameOverScoreElement.innerText = score;
  gameOverBox.style.visibility = "visible";
}

function restart() {
  gameOverBox.style.visibility = "hidden";
  snakeArray = [];
  snakeHeadX = 0;
  snakeHeadY = 0;
  appleX = 0;
  appleY = 0;
  score = 0;
  clearInterval(intervalUpdate);
  clearInterval(intervalMove);
  initialize();
  moveSnake();
}

function determineStartingDirection() {
  let randomNumber = Math.random();

  // in if there is Y axis and in else there is X axis
  if (randomNumber < 0.5) {
    if (snakeHeadY < 14) {
      direction = down;
    } else {
      direction = up;
    }
  } else {
    if (snakeHeadX < 14) {
      direction = right;
    } else {
      direction = left;
    }
  }
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "w":
      if (!(mainArray[snakeHeadY - 1][snakeHeadX] == snakeFrame)) {
        direction = up;
      }
      break;
    case "s":
      if (!(mainArray[snakeHeadY + 1][snakeHeadX] == snakeFrame)) {
        direction = down;
      }
      break;
    case "a":
      if (!(mainArray[snakeHeadY][snakeHeadX - 1] == snakeFrame)) {
        direction = left;
      }
      break;
    case "d":
      if (!(mainArray[snakeHeadY][snakeHeadX + 1] == snakeFrame)) {
        direction = right;
      }
      break;
    case " ":
      restart();
      break;
  }
});

initialize();
moveSnake();
