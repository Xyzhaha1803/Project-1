// Memory game logic
const memoryFruits = ['apple','banana','carrot','kiwi','mango','watermelon','pineapple','raspberry']
let memoryCards = [...memoryFruits, ...memoryFruits]
let memoryFlipped = []
let memoryLocked = false
let memoryMovesCount = 0
let memoryMatchesCount = 0

const memoryGrid = document.getElementById('memoryGrid')
const memoryMovesEl = document.getElementById('memoryMoves')
const memoryMatchesEl = document.getElementById('memoryMatches')
const memoryWin = document.getElementById('memoryWin')

const memoryWinMoves = document.getElementById('memoryWinMoves')
const memoryWinMatches = document.getElementById('memoryWinMatches')

function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5)
}

function buildMemoryGame() {
    memoryFlipped = []
    memoryLocked = false
    memoryMovesCount = 0
    memoryMatchesCount = 0
    memoryMovesEl.textContent = '0'
    memoryMatchesEl.textContent = '0'
    memoryWin.classList.remove('show')
    memoryGrid.innerHTML = ''

    shuffleArray(memoryCards).forEach((fruit, i) => {
        const card = document.createElement('div')
        card.className = 'MemoryCard'
        card.dataset.fruit = fruit
        card.dataset.index = i
        card.innerHTML = `
            <div class="MemoryCardInner">
                <div class="MemoryCardFront">?</div>
                <div class="MemoryCardBack"><img src="../Assets/Pictures/MemoryIcons/${fruit}.png" alt="${fruit}"></div>
            </div>`
        card.addEventListener('click', onMemoryCardClick)
        memoryGrid.appendChild(card)
    })
}

function onMemoryCardClick(e) {
    const card = e.currentTarget
    if (memoryLocked || card.classList.contains('flipped') || card.classList.contains('matched')) return

    card.classList.add('flipped')
    memoryFlipped.push(card)

    if (memoryFlipped.length === 2) {
        memoryLocked = true
        memoryMovesCount++
        memoryMovesEl.textContent = memoryMovesCount
        checkMemoryMatch()
    }
}

function checkMemoryMatch() {
    const [a, b] = memoryFlipped
    if (a.dataset.fruit === b.dataset.fruit) {
        a.classList.add('matched')
        b.classList.add('matched')
        memoryMatchesCount++
        memoryMatchesEl.textContent = memoryMatchesCount
        memoryFlipped = []
        memoryLocked = false
        if (memoryMatchesCount === memoryFruits.length) {
            memoryWinMatches.textContent = memoryMatchesCount
            memoryWinMoves.textContent = memoryMovesCount
            memoryWin.classList.add('show')
        }
    } else {
        setTimeout(() => {
            a.classList.remove('flipped')
            b.classList.remove('flipped')
            memoryFlipped = []
            memoryLocked = false
        }, 900)
    }
}


document.getElementById('memoryReset').addEventListener('click', buildMemoryGame)
document.getElementById('memoryWinReset').addEventListener('click', buildMemoryGame)

document.getElementById('backTo').addEventListener('click', () => {
    window.location.href = "Games.html";
})

buildMemoryGame()