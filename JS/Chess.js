// chess game logic [2 player only]
// Gonna be rewritten so WIP

// Chess pieces from 'https://www.namecheap.com/visual/font-generator/chess-symbols/'
const PIECES = {
    wK:'♔', wQ:'♕', wR:'♖', wB:'♗', wN:'♘', wP:'♙',
    bK:'♚', bQ:'♛', bR:'♜', bB:'♝', bN:'♞', bP:'♟'
}

let board = []
let selectedSquare = null
let currentTurn = 'w' // White always starts first
let validMoves = []

const chessBoard = document.getElementById('chessBoard')
const chessTurnEl = document.getElementById('chessTurn')
const chessStatusEl = document.getElementById('chessStatus')
const chessWinner = document.getElementById('chessWinner')
const chessWinBanner = document.getElementById('chessWinBanner')

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
    ]
    selectedSquare = null
    validMoves = []
    currentTurn = 'w'
    chessTurnEl.textContent = "White's turn"
    chessStatusEl.textContent = 'Click a piece to select it, then click a square to move.'
    renderChess()
}

// Render in the chess board
function renderChess() {
    chessBoard.innerHTML = ''
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const sq = document.createElement('div')
            const isLight = (row + col) % 2 === 0
            sq.className = 'ChessSquare ' + (isLight ? 'light' : 'dark')

            if (selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col) {
                sq.classList.add('selected')
            }
            if (validMoves.some(m => m[0] === row && m[1] === col)) {
                sq.classList.add('valid-move')
            }

            const piece = board[row][col]
            if (piece) sq.textContent = PIECES[piece]

            sq.addEventListener('click', () => onChessClick(row, col))
            chessBoard.appendChild(sq)
        }
    }
}

function onChessClick(row, col) {
    const piece = board[row][col]

    // If a square with a valid move is clicked — move there
    if (selectedSquare && validMoves.some(m => m[0] === row && m[1] === col)) {
        movePiece(selectedSquare[0], selectedSquare[1], row, col)
        return
    }

    // Select a piece belonging to current player
    if (piece && piece[0] === currentTurn) {
        selectedSquare = [row, col]
        validMoves = getValidMoves(row, col, piece)
        chessStatusEl.textContent = `Selected ${PIECES[piece]} — click a highlighted square to move.`
        renderChess()
        return
    }

    // Deselect
    selectedSquare = null
    validMoves = []
    chessStatusEl.textContent = 'Click a piece to select it, then click a square to move.'
    renderChess()
}

// Moving piece function
function movePiece(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol]
    const captured = board[toRow][toCol]

    board[toRow][toCol] = piece
    board[fromRow][fromCol] = null

    // Pawn promotion, auto promote to Queen for kids simplicity
    if (piece === 'wP' && toRow === 0) board[toRow][toCol] = 'wQ'
    if (piece === 'bP' && toRow === 7) board[toRow][toCol] = 'bQ'

    selectedSquare = null
    validMoves = []

    // Check if king captured (simplified win condition)
    if (captured === 'wK') {
        chessWinBanner.classList.add('show')
        chessStatusEl.textContent = 'Black wins!'
        chessTurnEl.textContent = 'Game over'
        chessWinner.textContent = 'Black!'
        renderChess()
        return
    }
    if (captured === 'bK') {
        chessWinBanner.classList.add('show')
        chessStatusEl.textContent = 'White wins!'
        chessTurnEl.textContent = 'Game over'
        chessWinner.textContent = 'White!'
        renderChess()
        return
    }

    currentTurn = currentTurn === 'w' ? 'b' : 'w'
    chessTurnEl.textContent = currentTurn === 'w' ? "White's turn" : "Black's turn"
    chessStatusEl.textContent = 'Click a piece to select it, then click a square to move.'
    renderChess()
}

function inBounds(r, c) {
    return r >= 0 && r < 8 && c >= 0 && c < 8
}

function isEnemy(piece, r, c) {
    const target = board[r][c]
    return target && target[0] !== piece[0]
}

function isEmpty(r, c) {
    return inBounds(r, c) && board[r][c] === null
}

function getValidMoves(row, col, piece) {
    const moves = []
    const color = piece[0]
    const type = piece[1]

    const addIfValid = (r, c) => {
        if (!inBounds(r, c)) return false
        const target = board[r][c]
        if (!target) { moves.push([r, c]); return true }
        if (target[0] !== color) { moves.push([r, c]); return false }
        return false
    }

    const slide = (dr, dc) => {
        let r = row + dr, c = col + dc
        while (inBounds(r, c)) {
            const target = board[r][c]
            if (!target) { moves.push([r, c]) }
            else { if (target[0] !== color) moves.push([r, c]); break }
            r += dr; c += dc
        }
    }

    if (type === 'P') {
        const dir = color === 'w' ? -1 : 1
        const startRow = color === 'w' ? 6 : 1
        if (isEmpty(row + dir, col)) {
            moves.push([row + dir, col])
            if (row === startRow && isEmpty(row + 2 * dir, col)) {
                moves.push([row + 2 * dir, col])
            }
        }
        [-1, 1].forEach(dc => {
            if (inBounds(row + dir, col + dc) && isEnemy(piece, row + dir, col + dc)) {
                moves.push([row + dir, col + dc])
            }
        })
    }

    if (type === 'R' || type === 'Q') {
        [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr,dc]) => slide(dr,dc))
    }

    if (type === 'B' || type === 'Q') {
        [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dr,dc]) => slide(dr,dc))
    }

    if (type === 'N') {
        [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]
            .forEach(([dr,dc]) => addIfValid(row+dr, col+dc))
    }

    if (type === 'K') {
        [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]
            .forEach(([dr,dc]) => addIfValid(row+dr, col+dc))
    }

    return moves
}

// Back button
const backTo = document.getElementById('backTo')

document.getElementById('backTo').addEventListener('click', () => {
    window.location.href = "Games.html"
})

document.getElementById('chessReset').addEventListener('click', initBoard)
document.getElementById('chessWinReset').addEventListener('click', initBoard)
initBoard()