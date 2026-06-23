// Image Puzzle Logic!!!
// Default image shown before the user picks one from the slider cause
let currentPuzzleImage = '../Assets/Pictures/Puzzle1.jpg'

const COLS = 6
const ROWS = 5
const TOTAL_PIECES = COLS * ROWS // 30

const PIECE_SIZE = 80 // px of individual puzzle piece

const puzzleBoard = document.getElementById('puzzleBoard')
const puzzleTray = document.getElementById('puzzleTray')
const puzzlePlacedEl = document.getElementById('puzzlePlaced')
const puzzleTotalEl = document.getElementById('puzzleTotal')
const puzzleWin = document.getElementById('puzzleWin')

let piecesPlaced = 0

puzzleTotalEl.textContent = TOTAL_PIECES


// Board Buildind
function buildBoard() {
    puzzleBoard.innerHTML = ''

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const slot = document.createElement('div')
            slot.className = 'PuzzleSlot'
            slot.dataset.row = row
            slot.dataset.col = col

            // Drag and Drop
            slot.addEventListener('dragover', onSlotDragOver)
            slot.addEventListener('dragleave', onSlotDragLeave)
            slot.addEventListener('drop', onSlotDrop)

            puzzleBoard.appendChild(slot)
        }
    }
}


// Tray and scatter pieces
function buildPieces() {
    puzzleTray.innerHTML = ''
    piecesPlaced = 0
    puzzlePlacedEl.textContent = '0'
    puzzleWin.classList.remove('show')

    const trayWidth = puzzleTray.clientWidth || 400
    const trayHeight = puzzleTray.clientHeight || 420

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const piece = document.createElement('div')
            piece.className = 'PuzzlePiece'
            piece.draggable = true
            piece.dataset.row = row
            piece.dataset.col = col

            // Slice the image: show only the (col, row) section of the full picture
            piece.style.backgroundImage = `url('${currentPuzzleImage}')`
            piece.style.backgroundSize = `${COLS * PIECE_SIZE}px ${ROWS * PIECE_SIZE}px`
            piece.style.backgroundPosition = `-${col * PIECE_SIZE}px -${row * PIECE_SIZE}px`

            // Scatter randomly inside the puzzle tray
            const maxX = Math.max(trayWidth - PIECE_SIZE, 0)
            const maxY = Math.max(trayHeight - PIECE_SIZE, 0)
            piece.style.left = Math.random() * maxX + 'px'
            piece.style.top = Math.random() * maxY + 'px'

            piece.addEventListener('dragstart', onPieceDragStart)
            piece.addEventListener('dragend', onPieceDragEnd)

            puzzleTray.appendChild(piece)
        }
    }
}


// Drag and drop handlers
function onPieceDragStart(e) {
    e.dataTransfer.effectAllowed = 'move'
    e.target.classList.add('dragging')
    window.draggedPiece = e.target
}

function onPieceDragEnd(e) {
    e.target.classList.remove('dragging')
}

function onSlotDragOver(e) {
    e.preventDefault()
    e.currentTarget.classList.add('drag-over')
}

function onSlotDragLeave(e) {
    e.currentTarget.classList.remove('drag-over')
}

function onSlotDrop(e) {
    e.preventDefault()
    const slot = e.currentTarget
    slot.classList.remove('drag-over')

    const piece = window.draggedPiece
    if (!piece || slot.classList.contains('filled')) return

    const correctRow = piece.dataset.row
    const correctCol = piece.dataset.col
    const slotRow = slot.dataset.row
    const slotCol = slot.dataset.col

    // Only accept the piece if it matches/correct slot
    if (correctRow === slotRow && correctCol === slotCol) {
        // Reset piece styling for its fixed home inside the slot
        piece.style.left = ''
        piece.style.top = ''
        piece.draggable = false
        slot.appendChild(piece)
        slot.classList.add('filled')

        piecesPlaced++
        puzzlePlacedEl.textContent = piecesPlaced

        if (piecesPlaced === TOTAL_PIECES) {
            puzzleWin.classList.add('show')
        }
    }

    window.draggedPiece = null
}


// Puzzle initalization and reset
function startPuzzle() {
    buildBoard()
    buildPieces()
}

// Called by Slider.js when the user clicks "Use This Picture"
// Swaps the active image
function startPuzzleWithImage(imageSrc) {
    currentPuzzleImage = imageSrc
    startPuzzle()
}

document.getElementById('puzzleReset').addEventListener('click', startPuzzle)
document.getElementById('puzzleWinReset').addEventListener('click', startPuzzle)



document.getElementById('backTo').addEventListener('click', () => {
    window.location.href = "Games.html";
})

startPuzzle()