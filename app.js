let currentPuzzle = null;
let queens = new Set();
let marks = new Set();
let timerInterval;
let startTime;

function initGame() {
    queens.clear();
    marks.clear();
    if (timerInterval) clearInterval(timerInterval);
    // Check of SHAPES bestaat (uit puzzles.js regel 1)
    if (typeof SHAPES !== 'undefined' && SHAPES.length > 0) {
        currentPuzzle = { size: 10, regions: SHAPES[0].regions };
    }
    render();
    startTimer();
}

function render() {
    const board = document.getElementById('board');
    if (!board || !currentPuzzle) return;
    board.style.gridTemplateColumns = `repeat(${currentPuzzle.size}, 1fr)`;
    board.innerHTML = "";
    for (let r = 0; r < currentPuzzle.size; r++) {
        for (let c = 0; c < currentPuzzle.size; c++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            const regionId = currentPuzzle.regions[r][c];
            // LinkedIn kleuren logica
            cell.style.backgroundColor = `hsl(${regionId * 36}, 60%, 80%)`;
            cell.onclick = () => handleMove(r, c);
            board.appendChild(cell);
        }
    }
}

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
}

function updateUI() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, i) => {
        const r = Math.floor(i / currentPuzzle.size);
        const c = i % currentPuzzle.size;
        const key = `${r},${c}`;
        cell.textContent = ""; 
        if (queens.has(key)) {
            cell.textContent = "Q"; // GEEN gouden kroon
        } else if (marks.has(key)) {
            cell.textContent = "X"; 
        }
    });
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const diff = Math.floor((Date.now() - startTime) / 1000);
        const timerEl = document.getElementById('timer');
        if (timerEl) {
            const mins = Math.floor(diff / 60).toString().padStart(2, '0');
            const secs = (diff % 60).toString().padStart(2, '0');
            timerEl.textContent = `${mins}:${secs}`;
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', initGame);
