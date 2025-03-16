let currentGame = null;
let gameMode = null;

function openGame(gameId) {
    document.getElementById('game-selection').style.display = 'none';
    if (gameId === 'snake') {
        document.getElementById('snake-game').style.display = 'block';
        initSnake();
    } else {
        document.getElementById(gameId + '-options').style.display = 'block';
    }
    currentGame = gameId;
}

function startGame(gameId, mode) {
    gameMode = mode;
    document.getElementById(gameId + '-options').style.display = 'none';
    document.getElementById(gameId + '-game').style.display = 'block';
    if (gameId === 'tic-tac-toe') {
        initTicTacToe();
    } else if (gameId === 'rock-paper-scissors') {
        initRockPaperScissors();
    }
}

function goBack() {
    if (currentGame === 'snake') {
        document.getElementById('snake-game').style.display = 'none';
        resetSnake();
    } else if (currentGame) {
        document.getElementById(currentGame + '-game').style.display = 'none';
        document.getElementById(currentGame + '-options').style.display = 'none';
        resetGame(currentGame);
    }
    document.getElementById('game-selection').style.display = 'grid';
    currentGame = null;
    gameMode = null;
}

function resetGame(gameId) {
    if (gameId === 'tic-tac-toe') {
        initTicTacToe();
    } else if (gameId === 'rock-paper-scissors') {
        initRockPaperScissors();
    } else if (gameId === 'snake') {
        resetSnake();
        initSnake();
    }
}

// Tic Tac Toe Logic
let board;
let currentPlayer;
let tttPlayerScore = 0;
let tttComputerScore = 0;
let tttWinsToWin = 3;

function initTicTacToe() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    const cells = document.querySelectorAll('#tic-tac-toe-game .cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('occupied');
        cell.onclick = handleTicTacToeClick;
    });
    document.querySelector('#tic-tac-toe-game .message').textContent = `Player ${currentPlayer}'s turn`;
    if (gameMode === 'first-to-3') {
        document.getElementById('ttt-player-score').textContent = tttPlayerScore;
        document.getElementById('ttt-computer-score').textContent = tttComputerScore;
    } else {
        document.getElementById('ttt-player-score').textContent = tttPlayerScore;
        document.getElementById('ttt-computer-score').textContent = tttComputerScore;
    }
}

function handleTicTacToeClick(event) {
    const cell = event.target;
    const index = parseInt(cell.dataset.index);

    if (board[index] === '') {
        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add('occupied');
        cell.onclick = null;
        const winner = checkTicTacToeWinner();
        if (winner) {
            endTicTacToeGame(winner === 'Draw' ? 'Draw!' : `${winner} wins!`);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.querySelector('#tic-tac-toe-game .message').textContent = `Player ${currentPlayer}'s turn`;
            if (currentPlayer === 'O' && gameMode !== 'first-to-3') {
                setTimeout(computerMoveTicTacToe, 500);
            } else if (currentPlayer === 'O' && gameMode === 'first-to-3') {
                setTimeout(computerMoveTicTacToeFirstTo3, 500);
            }
        }
    }
}

function checkTicTacToeWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    if (!board.includes('')) {
        return 'Draw';
    }

    return null;
}

function endTicTacToeGame(message) {
    document.querySelector('#tic-tac-toe-game .message').textContent = message;
    const cells = document.querySelectorAll('#tic-tac-toe-game .cell');
    cells.forEach(cell => cell.onclick = null);

    if (message.includes('X wins!')) {
        tttPlayerScore++;
    } else if (message.includes('O wins!')) {
        tttComputerScore++;
    }

    if (gameMode === 'first-to-3') {
        document.getElementById('ttt-player-score').textContent = tttPlayerScore;
        document.getElementById('ttt-computer-score').textContent = tttComputerScore;
        if (tttPlayerScore === tttWinsToWin) {
            document.querySelector('#tic-tac-toe-game .message').textContent = 'Player wins the set!';
        } else if (tttComputerScore === tttWinsToWin) {
            document.querySelector('#tic-tac-toe-game .message').textContent = 'Computer wins the set!';
        } else {
            setTimeout(initTicTacToe, 1500); // Start next round
        }
    } else {
        document.getElementById('ttt-player-score').textContent = tttPlayerScore;
        document.getElementById('ttt-computer-score').textContent = tttComputerScore;
    }
}

function computerMoveTicTacToe() {
    let bestMove;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            if (checkTicTacToeWinner() === 'O') {
                bestMove = i;
                board[i] = '';
                break;
            }
            board[i] = '';
        }
    }
    if (bestMove === undefined) {
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                if (checkTicTacToeWinner() === 'X') {
                    bestMove = i;
                    board[i] = '';
                    break;
                }
                board[i] = '';
            }
        }
    }
    if (bestMove === undefined) {
        const availableMoves = board.reduce((acc, val, index) => {
            if (val === '') acc.push(index);
            return acc;
        },);
        bestMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    if (bestMove !== undefined) {
        const cell = document.querySelector(`#tic-tac-toe-game .cell[data-index="${bestMove}"]`);
        board[bestMove] = 'O';
        cell.textContent = 'O';
        cell.classList.add('occupied');
        cell.onclick = null;
        const winner = checkTicTacToeWinner();
        if (winner) {
            endTicTacToeGame(winner === 'Draw' ? 'Draw!' : `${winner} wins!`);
        } else {
            currentPlayer = 'X';
            document.querySelector('#tic-tac-toe-game .message').textContent = `Player ${currentPlayer}'s turn`;
        }
    }
}

function computerMoveTicTacToeFirstTo3() {
    if (tttPlayerScore < tttWinsToWin && tttComputerScore < tttWinsToWin) {
        let bestMove;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                if (checkTicTacToeWinner() === 'O') {
                    bestMove = i;
                    board[i] = '';
                    break;
                }
                board[i] = '';
            }
        }
        if (bestMove === undefined) {
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    if (checkTicTacToeWinner() === 'X') {
                        bestMove = i;
                        board[i] = '';
                        break;
                    }
                    board[i] = '';
                }
            }
        }
        if (bestMove === undefined) {
            const availableMoves = board.reduce((acc, val, index) => {
                if (val === '') acc.push(index);
                return acc;
            },);
            bestMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }

        if (bestMove !== undefined) {
            const cell = document.querySelector(`#tic-tac-toe-game .cell[data-index="${bestMove}"]`);
            board[bestMove] = 'O';
            cell.textContent = 'O';
            cell.classList.add('occupied');
            cell.onclick = null;
            const winner = checkTicTacToeWinner();
            if (winner) {
                endTicTacToeGame(winner === 'Draw' ? 'Draw!' : `${winner} wins!`);
            } else {
                currentPlayer = 'X';
                document.querySelector('#tic-tac-toe-game .message').textContent = `Player ${currentPlayer}'s turn`;
            }
        }
    }
}

// Rock Paper Scissors Logic
let rpsPlayerScore = 0;
let rpsComputerScore = 0;
let rpsWinsToWin = 3;
let rpsAnimationInterval;

function initRockPaperScissors() {
    document.getElementById('rps-player-choice').textContent = '';
    document.getElementById('rps-computer-choice').textContent = '';
    document.getElementById('rps-result').textContent = '';
    document.getElementById('rps-player-score').textContent = rpsPlayerScore;
    document.getElementById('rps-computer-score').textContent = rpsComputerScore;
}

function playRPS(playerChoice) {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    const computerChoice = playerChoice === 'random' ? choices[randomIndex] : choices[randomIndex];

    const animationDiv = document.querySelector('#rock-paper-scissors-game .animation');
    const animationTexts = animationDiv.querySelectorAll('p');
    let animationIndex = 0;
    animationDiv.style.height = '30px';
    animationInterval = setInterval(() => {
        animationTexts.forEach((p, index) => {
            p.style.transform = `translateY(-${animationIndex * 30}px)`;
        });
        animationIndex++;
        if (animationIndex > 3) {
            clearInterval(animationInterval);
            animationDiv.style.height = '0';
            determineRPSWinner(playerChoice === 'random' ? computerChoice : playerChoice, computerChoice);
        }
    }, 200);
}

function determineRPSWinner(playerChoice, computerChoice) {
    document.getElementById('rps-player-choice').textContent = `You chose: ${playerChoice}`;
    document.getElementById('rps-computer-choice').textContent = `Computer chose: ${computerChoice}`;

    let result = '';
    if (playerChoice === computerChoice) {
        result = "It's a tie!";
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        result = "You win!";
        rpsPlayerScore++;
    } else {
        result = "Computer wins!";
        rpsComputerScore++;
    }
    document.getElementById('rps-result').textContent = result;
    document.getElementById('rps-player-score').textContent = rpsPlayerScore;
    document.getElementById('rps-computer-score').textContent = rpsComputerScore;

    if (gameMode === 'first-to-3') {
        if (rpsPlayerScore === rpsWinsToWin) {
            document.getElementById('rps-result').textContent = 'You win the set!';
            disableRPSButtons();
        } else if (rpsComputerScore === rpsWinsToWin) {
            document.getElementById('rps-result').textContent = 'Computer wins the set!';
            disableRPSButtons();
        }
    }
}

function disableRPSButtons() {
    const buttons = document.querySelectorAll('#rock-paper-scissors-game .choices button');
    buttons.forEach(button => button.disabled = true);
}

function resetRockPaperScissorsScores() {
    rpsPlayerScore = 0;
    rpsComputerScore = 0;
    document.getElementById('rps-player-score').textContent = rpsPlayerScore;
    document.getElementById('rps-computer-score').textContent = rpsComputerScore;
    document.getElementById('rps-result').textContent = '';
    document.getElementById('rps-player-choice').textContent = '';
    document.getElementById('rps-computer-choice').textContent = '';
    const buttons = document.querySelectorAll('#rock-paper-scissors-game .choices button');
    buttons.forEach(button => button.disabled = false);
}

// Snake Game Logic
const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 10 };
let dx = 10;
let dy = 0;
let score = 0;
let gameInterval;
const gridSize = 20;
let isGameOver = false;

function initSnake() {
    snake = [{ x: 10 * gridSize, y: 10 * gridSize }];
    food = createFood();
    dx = gridSize;
    dy = 0;
    score = 0;
    isGameOver = false;
    document.getElementById('snake-score').textContent = score;
    clearInterval(gameInterval);
    gameInterval = setInterval(updateSnake, 100);
    document.addEventListener('keydown', changeDirection);
}

function resetSnake() {
    clearInterval(gameInterval);
    document.removeEventListener('keydown', changeDirection);
}

function updateSnake() {
    if (isGameOver) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('snake-score').textContent = score;
        food = createFood();
    } else {
        snake.pop();
    }

    checkCollision();
    drawSnake();
    drawFood();
}

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function createFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const UP_KEY = 38;
    const RIGHT_KEY = 39;
    const DOWN_KEY = 40;

    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingLeft = dx === -gridSize;
    const goingRight = dx === gridSize;

    if (event.keyCode === LEFT_KEY && !goingRight) { dx = -gridSize; dy = 0; }
    if (event.keyCode === UP_KEY && !goingDown) { dy = -gridSize; dx = 0; }
    if (event.keyCode === RIGHT_KEY && !goingLeft) { dx = gridSize; dy = 0; }
    if (event.keyCode === DOWN_KEY && !goingUp) { dy = gridSize; dx = 0; }
}

function checkCollision() {
    const head = snake[0];
    // Hit walls
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        gameOverSnake();
    }

    // Hit itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOverSnake();
        }
    }
}

function gameOverSnake() {
    isGameOver = true;
    clearInterval(gameInterval);
    document.removeEventListener('keydown', changeDirection);
    alert(`Game Over! Your score: ${score}`);
}