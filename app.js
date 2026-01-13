let currentPuzzle = null;
let queens = new Set();
let marks = new Set();
let timerInterval;
let startTime;

// 1. De volledige logica voor het initialiseren van het spel
function initGame() {
    const sizeSelect = document.getElementById('gridSize');
    const diffSelect = document.getElementById('difficulty');
    const size = sizeSelect ? parseInt(sizeSelect.value) : 10;
    const difficulty = diffSelect ? diffSelect.value : 'expert';
    
    queens.clear();
    marks.clear();
    clearInterval(timerInterval);

    // Expert modus gebruikt de SHAPES uit puzzles.js
    if (difficulty === 'expert' && size === 10 && typeof SHAPES !== 'undefined') {
        const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        currentPuzzle = { size: 10, regions: shape.regions };
    } else if (typeof PUZZLES !== 'undefined') {
        const pData = PUZZLES.find(p => p.size === size) || PUZZLES[0];
        currentPuzzle = { size: pData.size, regions: pData.regions };
    }
    
    render();
    startTimer();
}

// 2. De render functie die de kleuren en cellen tekent
function render() {
    const board = document.getElementById('board');
    if (!board || !currentPuzzle) return;
    
    board.style.gridTemplateColumns = `repeat(${currentPuzzle.size}, 1fr)`;
    board.innerHTML = "";

    for (let r = 0; r < currentPuzzle.size; r++) {
        for (let c = 0; c < currentPuzzle.size; c++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            // Gebruik de regio-ID voor een unieke kleur
            const regionId = currentPuzzle.regions[r][c];
            cell.style.backgroundColor = `hsl(${regionId * 36}, 60%, 85%)`;
            
            cell.onclick = () => handleMove(r, c);
            board.appendChild(cell);
        }
    }
}

// 3. Spelregels en interactie
function handleMove(r, c) {
    const key = `${r},${c}`;
    if (queens.has(key)) {
        queens.delete(key);
        marks.add(key);
    } else if (marks.has(key)) {
        marks.delete(key);
    } else {
        queens.add(key);
    }
    updateUI();
    checkWin();
}

function updateUI() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, i) => {
        const r = Math.floor(i / currentPuzzle.size);
        const c = i % currentPuzzle.size;
        const key = `${r},${c}`;
        cell.classList.remove("has-queen", "has-mark", "conflict");
        if (queens.has(key)) cell.classList.add("has-queen");
        if (marks.has(key)) cell.classList.add("has-mark");
    });
}

// 4. Timer functies
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const diff = Math.floor((Date.now() - startTime) / 1000);
        const timerEl = document.getElementById('timer');
        if (timerEl) timerEl.textContent = formatTime(diff);
    }, 1000);
}

function formatTime(s) {
    return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
}

// Start het spel zodra de pagina geladen is
document.addEventListener('DOMContentLoaded', initGame);
