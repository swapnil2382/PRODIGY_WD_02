let currentPlayer = "X"; 
let gameState = Array(9).fill(""); 
const cells = document.querySelectorAll(".cell");
const playerTurn = document.getElementById("player-turn");
const gameStatus = document.getElementById("game-status");
const celebration = document.getElementById("celebration");
const sadMessage = document.getElementById("sad-message");
const restartButton = document.getElementById("restartButton");

document.getElementById("game-mode").addEventListener("change", (e) => {
    resetGame();
    if (e.target.value === "AI") {
        startGameAgainstAI();
    } else {
        startGameAgainstFriend();
    }
});

function startGameAgainstAI() {
    resetGame();
    playerTurn.textContent = `Player X's Turn`;
    currentPlayer = "X"; 
    cells.forEach(cell => {
        cell.addEventListener("click", handleCellClick);
    });
}

function startGameAgainstFriend() {
    resetGame();
    playerTurn.textContent = `Player X's Turn`;
    currentPlayer = "X";
    cells.forEach(cell => {
        cell.addEventListener("click", handleCellClick);
    });
}

function handleCellClick(event) {
    const cell = event.target;
    const index = Array.from(cells).indexOf(cell);

    if (gameState[index] === "") {
        cell.textContent = currentPlayer;
        cell.classList.add("occupied");
        gameState[index] = currentPlayer;

        if (checkWin()) {
            return;
        }

        
        currentPlayer = currentPlayer === "X" ? "O" : "X"; 
        playerTurn.textContent = `Player ${currentPlayer}'s Turn`;

        
        if (document.getElementById("game-mode").value === "AI" && currentPlayer === "O") {
            setTimeout(aiMove, 500); 
        }
    }
}

function aiMove() {
    const bestMove = findBestMove();
    if (bestMove !== undefined) {
        cells[bestMove].textContent = currentPlayer;
        cells[bestMove].classList.add("occupied");
        gameState[bestMove] = currentPlayer;

        if (checkWin()) {
            return; 
        }

        currentPlayer = "X"; 
        playerTurn.textContent = `Player X's Turn`;
    }
}

function findBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === "") {
            gameState[i] = "O";
            let score = minimax(gameState, 0, false);
            gameState[i] = ""; 
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    const scores = {
        X: -10,
        O: 10,
        draw: 0
    };
    let result = checkWinner(board);
    if (result !== null) {
        return scores[result];
    }
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O"; 
                let score = minimax(board, depth + 1, false);
                board[i] = ""; 
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X"; 
                let score = minimax(board, depth + 1, true);
                board[i] = ""; 
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWin() {
    const winner = checkWinner(gameState);
    if (winner) {
        endGame(winner);
        return true;
    }

    if (!gameState.includes("")) {
        endGame(null);
        return true;
    }

    return false; 
}

function checkWinner(board) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; 
        }
    }
    return null; 
}

function endGame(winner) {
    cells.forEach(cell => cell.removeEventListener("click", handleCellClick));

    if (winner) {
        celebration.textContent = `Congratulations Player ${winner}! 🎉`;
        celebration.classList.add("show");
        sadMessage.classList.remove("show");
    } else {
        sadMessage.textContent = `Better Luck Next Time! 😢`;
        sadMessage.classList.add("show");
        celebration.classList.remove("show");
    }

    gameStatus.textContent = `Game Over!`;
}

function resetGame() {
    gameState.fill("");
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("occupied");
    });
    playerTurn.textContent = "";
    gameStatus.textContent = "";
    celebration.classList.remove("show");
    sadMessage.classList.remove("show");
}


restartButton.addEventListener("click", () => {
    resetGame();
    const selectedMode = document.getElementById("game-mode").value;
    if (selectedMode === "AI") {
        startGameAgainstAI();
    } else {
        startGameAgainstFriend();
    }
});
