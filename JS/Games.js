// Switch between the different games using the games tab
const tabButtons = document.querySelectorAll('.TabButton');
const gamePanels = document.querySelectorAll('.GamePanel');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        gamePanels.forEach(p => p.classList.remove('active'));
        button.classList.add('active');
        document.getElementById('game-' + button.dataset.game).classList.add('active');
    });
});


// Memory game logic
const memoryEmojis = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'];
let memoryCards = [...memoryEmojis, ...memoryEmojis];
let memoryFlipped = [];
let memoryLocked = false;
let memoryMovesCount = 0;
let memoryMatchesCount = 0;

const memoryGrid = document.getElementById('memoryGrid');
const memoryMovesEl = document.getElementById('memoryMoves');
const memoryMatchesEl = document.getElementById('memoryMatches');
const memoryWin = document.getElementById('memoryWin');

function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

function buildMemoryGame() {
    memoryFlipped = [];
    memoryLocked = false;
    memoryMovesCount = 0;
    memoryMatchesCount = 0;
    memoryMovesEl.textContent = '0';
    memoryMatchesEl.textContent = '0';
    memoryWin.classList.remove('show');
    memoryGrid.innerHTML = '';

    shuffleArray(memoryCards).forEach((emoji, i) => {
        const card = document.createElement('div');
        card.className = 'MemoryCard';
        card.dataset.emoji = emoji;
        card.dataset.index = i;
        card.innerHTML = `
            <div class="MemoryCardInner">
                <div class="MemoryCardFront">?</div>
                <div class="MemoryCardBack">${emoji}</div>
            </div>`;
        card.addEventListener('click', onMemoryCardClick);
        memoryGrid.appendChild(card);
    });
}

function onMemoryCardClick(e) {
    const card = e.currentTarget;
    if (memoryLocked || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    memoryFlipped.push(card);

    if (memoryFlipped.length === 2) {
        memoryLocked = true;
        memoryMovesCount++;
        memoryMovesEl.textContent = memoryMovesCount;
        checkMemoryMatch();
    }
}

function checkMemoryMatch() {
    const [a, b] = memoryFlipped;
    if (a.dataset.emoji === b.dataset.emoji) {
        a.classList.add('matched');
        b.classList.add('matched');
        memoryMatchesCount++;
        memoryMatchesEl.textContent = memoryMatchesCount;
        memoryFlipped = [];
        memoryLocked = false;
        if (memoryMatchesCount === memoryEmojis.length) {
            memoryWin.classList.add('show');
        }
    } else {
        setTimeout(() => {
            a.classList.remove('flipped');
            b.classList.remove('flipped');
            memoryFlipped = [];
            memoryLocked = false;
        }, 900);
    }
}

document.getElementById('memoryReset').addEventListener('click', buildMemoryGame);
document.getElementById('memoryWinReset').addEventListener('click', buildMemoryGame);
buildMemoryGame();


// puzzle logic
let puzzleTiles = [];
let puzzleMoveCount = 0;
const puzzleGrid = document.getElementById('puzzleGrid');
const puzzleMovesEl = document.getElementById('puzzleMoves');
const puzzleWin = document.getElementById('puzzleWin');
const PUZZLE_SIZE = 3;
const SOLVED = [1,2,3,4,5,6,7,8,0]; // 0 = empty tile

function buildPuzzle() {
    puzzleMoveCount = 0;
    puzzleMovesEl.textContent = '0';
    puzzleWin.classList.remove('show');
    puzzleTiles = shufflePuzzle([...SOLVED]);
    renderPuzzle();
}

function shufflePuzzle(tiles) {
    let emptyIdx = tiles.indexOf(0);
    for (let i = 0; i < 300; i++) {
        const neighbors = getNeighbors(emptyIdx);
        const swap = neighbors[Math.floor(Math.random() * neighbors.length)];
        tiles[emptyIdx] = tiles[swap];
        tiles[swap] = 0;
        emptyIdx = swap;
    }
    return tiles;
}

function getNeighbors(idx) {
    const row = Math.floor(idx / PUZZLE_SIZE);
    const col = idx % PUZZLE_SIZE;
    const neighbors = [];
    if (row > 0) neighbors.push(idx - PUZZLE_SIZE);
    if (row < PUZZLE_SIZE - 1) neighbors.push(idx + PUZZLE_SIZE);
    if (col > 0) neighbors.push(idx - 1);
    if (col < PUZZLE_SIZE - 1) neighbors.push(idx + 1);
    return neighbors;
}

function renderPuzzle() {
    puzzleGrid.innerHTML = '';
    puzzleTiles.forEach((val, idx) => {
        const tile = document.createElement('div');
        tile.className = 'PuzzleTile' + (val === 0 ? ' empty' : '');
        tile.textContent = val === 0 ? '' : val;
        if (val !== 0) {
            tile.addEventListener('click', () => onPuzzleTileClick(idx));
        }
        puzzleGrid.appendChild(tile);
    });
}

function onPuzzleTileClick(idx) {
    const emptyIdx = puzzleTiles.indexOf(0);
    if (!getNeighbors(emptyIdx).includes(idx)) return;

    puzzleTiles[emptyIdx] = puzzleTiles[idx];
    puzzleTiles[idx] = 0;
    puzzleMoveCount++;
    puzzleMovesEl.textContent = puzzleMoveCount;
    renderPuzzle();

    if (puzzleTiles.join() === SOLVED.join()) {
        puzzleWin.classList.add('show');
    }
}

document.getElementById('puzzleReset').addEventListener('click', buildPuzzle);
document.getElementById('puzzleWinReset').addEventListener('click', buildPuzzle);
buildPuzzle();


// chess game logic [2 player only + winning condition broke]
const PIECES = {
    wK:'♔', wQ:'♕', wR:'♖', wB:'♗', wN:'♘', wP:'♙',
    bK:'♚', bQ:'♛', bR:'♜', bB:'♝', bN:'♞', bP:'♟'
};

let board = [];
let selectedSquare = null;
let currentTurn = 'w'; // White always starts first
let validMoves = [];

const chessBoard = document.getElementById('chessBoard');
const chessTurnEl = document.getElementById('chessTurn');
const chessStatusEl = document.getElementById('chessStatus');

// inital chess board
function initBoard() {
    board = [
        ['bR','bN','bB','bQ','bK','bB','bN','bR'],
        ['bP','bP','bP','bP','bP','bP','bP','bP'],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        ['wP','wP','wP','wP','wP','wP','wP','wP'],
        ['wR','wN','wB','wQ','wK','wB','wN','wR']
    ];
    selectedSquare = null;
    validMoves = [];
    currentTurn = 'w';
    chessTurnEl.textContent = "White's turn";
    chessStatusEl.textContent = 'Click a piece to select it, then click a square to move.';
    renderChess();
}

function renderChess() {
    chessBoard.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const sq = document.createElement('div');
            const isLight = (row + col) % 2 === 0;
            sq.className = 'ChessSquare ' + (isLight ? 'light' : 'dark');

            if (selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col) {
                sq.classList.add('selected');
            }
            if (validMoves.some(m => m[0] === row && m[1] === col)) {
                sq.classList.add('valid-move');
            }

            const piece = board[row][col];
            if (piece) sq.textContent = PIECES[piece];

            sq.addEventListener('click', () => onChessClick(row, col));
            chessBoard.appendChild(sq);
        }
    }
}

function onChessClick(row, col) {
    const piece = board[row][col];

    // If a square with a valid move is clicked — move there
    if (selectedSquare && validMoves.some(m => m[0] === row && m[1] === col)) {
        movePiece(selectedSquare[0], selectedSquare[1], row, col);
        return;
    }

    // Select a piece belonging to current player
    if (piece && piece[0] === currentTurn) {
        selectedSquare = [row, col];
        validMoves = getValidMoves(row, col, piece);
        chessStatusEl.textContent = `Selected ${PIECES[piece]} — click a highlighted square to move.`;
        renderChess();
        return;
    }

    // Deselect
    selectedSquare = null;
    validMoves = [];
    chessStatusEl.textContent = 'Click a piece to select it, then click a square to move.';
    renderChess();
}

function movePiece(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    const captured = board[toRow][toCol];

    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = null;

    // Pawn promotion — auto promote to Queen for kids simplicity
    if (piece === 'wP' && toRow === 0) board[toRow][toCol] = 'wQ';
    if (piece === 'bP' && toRow === 7) board[toRow][toCol] = 'bQ';

    selectedSquare = null;
    validMoves = [];

    // Check if king captured (simplified win condition)
    if (captured === 'wK') {
        chessStatusEl.textContent = 'Black wins!';
        chessTurnEl.textContent = 'Game over';
        renderChess();
        return;
    }
    if (captured === 'bK') {
        chessStatusEl.textContent = 'White wins!';
        chessTurnEl.textContent = 'Game over';
        renderChess();
        return;
    }

    currentTurn = currentTurn === 'w' ? 'b' : 'w';
    chessTurnEl.textContent = currentTurn === 'w' ? "White's turn" : "Black's turn";
    chessStatusEl.textContent = 'Click a piece to select it, then click a square to move.';
    renderChess();
}

function inBounds(r, c) {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function isEnemy(piece, r, c) {
    const target = board[r][c];
    return target && target[0] !== piece[0];
}

function isEmpty(r, c) {
    return inBounds(r, c) && board[r][c] === null;
}

function getValidMoves(row, col, piece) {
    const moves = [];
    const color = piece[0];
    const type = piece[1];

    const addIfValid = (r, c) => {
        if (!inBounds(r, c)) return false;
        const target = board[r][c];
        if (!target) { moves.push([r, c]); return true; }
        if (target[0] !== color) { moves.push([r, c]); return false; }
        return false;
    };

    const slide = (dr, dc) => {
        let r = row + dr, c = col + dc;
        while (inBounds(r, c)) {
            const target = board[r][c];
            if (!target) { moves.push([r, c]); }
            else { if (target[0] !== color) moves.push([r, c]); break; }
            r += dr; c += dc;
        }
    };

    if (type === 'P') {
        const dir = color === 'w' ? -1 : 1;
        const startRow = color === 'w' ? 6 : 1;
        if (isEmpty(row + dir, col)) {
            moves.push([row + dir, col]);
            if (row === startRow && isEmpty(row + 2 * dir, col)) {
                moves.push([row + 2 * dir, col]);
            }
        }
        [-1, 1].forEach(dc => {
            if (inBounds(row + dir, col + dc) && isEnemy(piece, row + dir, col + dc)) {
                moves.push([row + dir, col + dc]);
            }
        });
    }

    if (type === 'R' || type === 'Q') {
        [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr,dc]) => slide(dr,dc));
    }

    if (type === 'B' || type === 'Q') {
        [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dr,dc]) => slide(dr,dc));
    }

    if (type === 'N') {
        [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]
            .forEach(([dr,dc]) => addIfValid(row+dr, col+dc));
    }

    if (type === 'K') {
        [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]
            .forEach(([dr,dc]) => addIfValid(row+dr, col+dc));
    }

    return moves;
}

document.getElementById('chessReset').addEventListener('click', initBoard);
initBoard();