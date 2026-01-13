let currentPuzzle = null;
let queens = new Set();
let marks = new Set();
let timerInterval;

// Organische Generator voor LinkedIn-stijl regio's (kleiner en grilliger)
function generateOrganicPuzzle(size) {
    const regions = Array.from({ length: size }, () => Array(size).fill(null));
    const queenCoords = [];
    
    // 1. Plaats koninginnen (geen conflict in rij/kolom/diagonaal)
    let rows = Array.from({ length: size }, (_, i) => i);
    shuffle(rows);
    for (let r = 0; r < size; r++) {
        queenCoords.push({ r, c: rows[r] });
        regions[r][rows[r]] = String.fromCharCode(65 + r);
    }

    // 2. Laat regio's organisch groeien (kleinere velden)
    let unassigned = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (regions[r][c] === null) unassigned.push({r, c});
        }
    }

    while (unassigned.length > 0) {
        shuffle(unassigned);
        for (let i = unassigned.length - 1; i >= 0; i--) {
            const {r, c} = unassigned[i];
            const neighbors = [[r-1,c], [r+1,c], [r,c-1], [r,c+1]];
            const validNeighbors = neighbors.filter(([nr, nc]) => 
                nr >= 0 && nr < size && nc >= 0 && nc < size && regions[nr][nc] !== null
            );
            
            if (validNeighbors.length > 0) {
                const [nr, nc] = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
                regions[r][c] = regions[nr][nc];
                unassigned.splice(i, 1);
            }
        }
    }
    return { size, regions };
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initGame(size) {
    currentPuzzle = generateOrganicPuzzle(size);
    queens.clear();
    marks.clear();
    const board = document.getElementById("board");
    if (board) {
        board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        board.style.gridTemplateRows = `repeat(${size}, 1fr)`;
        render();
    }
    startTimer();
}

function render() {
    const board = document.getElementById("board");
    board.innerHTML = "";
    for (let r = 0; r < currentPuzzle.size; r++) {
        for (let c = 0; c < currentPuzzle.size; c++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.region = currentPuzzle.regions[r][c];
            const k = `${r},${c}`;
            cell.onclick = () => {
                if (!marks.has(k) && !queens.has(k)) {
                    marks.add(k);
                } else if (marks.has(k)) {
                    marks.delete(k);
                    queens.add(k);
                } else {
                    queens.delete(k);
                }
                updateUI();
            };
            board.appendChild(cell);
        }
    }
}

function updateUI() {
    const cells = document.querySelectorAll(".cell");
    const qArr = Array.from(queens).map(k => k.split(',').map(Number));
    cells.forEach((cell, i) => {
        const r = Math.floor(i / currentPuzzle.size);
        const c = i % currentPuzzle.size;
        const k = `${r},${c}`;
        cell.classList.remove("has-queen", "has-mark", "bad");
        if (queens.has(k)) {
            cell.classList.add("has-queen");
            const hasConflict = qArr.some(([qr, qc]) => {
                if (qr === r && qc === c) return false;
                return qr === r || qc === c || 
                       currentPuzzle.regions[qr][qc] === currentPuzzle.regions[r][c] ||
                       (Math.abs(qr - r) <= 1 && Math.abs(qc - c) <= 1);
            });
            if (hasConflict) cell.classList.add("bad");
        } else if (marks.has(k)) {
            cell.classList.add("has-mark");
        }
    });
}

function startTimer() {
    clearInterval(timerInterval);
    const start = Date.now();
    timerInterval = setInterval(() => {
        const diff = Math.floor((Date.now() - start) / 1000);
        document.getElementById("timer").textContent = 
            `${String(Math.floor(diff/60)).padStart(2,'0')}:${String(diff%60).padStart(2,'0')}`;
    }, 1000);
}

document.addEventListener("DOMContentLoaded", () => initGame(5)); // Start met 5x5 voor de logica