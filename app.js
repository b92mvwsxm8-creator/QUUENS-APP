let currentPuzzle = null;
let queens = new Set();
let marks = new Set();
let timerInterval;

function generate7x7(difficulty) {
    const size = 7;
    const regions = Array.from({ length: size }, () => Array(size).fill(null));
    const queenCoords = [];
    
    // 1. Plaats koninginnen volgens schaakregels
    let cols = Array.from({ length: size }, (_, i) => i);
    shuffle(cols);
    for (let r = 0; r < size; r++) {
        queenCoords.push({ r, c: cols[r] });
        regions[r][cols[r]] = String.fromCharCode(65 + r);
    }

    // 2. Expert Logica: Maak grote blokken of ringen
    if (difficulty === 'hard') {
        applyHardPatterns(regions, size);
    }

    // 3. Vul de rest organisch op
    let unassigned = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (regions[r][c] === null) unassigned.push({r, c});
        }
    }

    const growthBias = difficulty === 'easy' ? 0.2 : 0.7;
    while (unassigned.length > 0) {
        shuffle(unassigned);
        for (let i = unassigned.length - 1; i >= 0; i--) {
            const {r, c} = unassigned[i];
            const neighbors = [[r-1,c], [r+1,c], [r,c-1], [r,c+1]].filter(([nr, nc]) => 
                nr >= 0 && nr < size && nc >= 0 && nc < size && regions[nr][nc] !== null
            );
            if (neighbors.length > 0 && Math.random() < growthBias) {
                const [nr, nc] = neighbors[Math.floor(Math.random() * neighbors.length)];
                regions[r][c] = regions[nr][nc];
                unassigned.splice(i, 1);
            }
        }
    }
    
    // Noodvul voor lege vakjes
    unassigned.forEach(({r, c}) => {
        const n = [[r-1,c], [r+1,c], [r,c-1], [r,c+1]].find(([nr, nc]) => 
            nr >= 0 && nr < size && nc >= 0 && nc < size && regions[nr][nc] !== null);
        if (n) regions[r][c] = regions[n[0]][n[1]];
    });

    return { size, regions };
}

function applyHardPatterns(regions, size) {
    // Simuleer 'ringen' door grote gebieden aan elkaar te koppelen
    for(let i=0; i<3; i++) {
        const r1 = Math.floor(Math.random()*size);
        const r2 = (r1 + 1) % size;
        const char1 = regions[r1].find(x => x !== null);
        const char2 = regions[r2].find(x => x !== null);
        // Versmelt regio's voor grotere 'chunks'
        for(let r=0; r<size; r++) {
            for(let c=0; c<size; c++) {
                if(regions[r][c] === char2) regions[r][c] = char1;
            }
        }
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initGame(size, difficulty = 'hard') {
    currentPuzzle = generate7x7(difficulty);
    queens.clear();
    marks.clear();
    const board = document.getElementById("board");
    if (board) {
        board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
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
                if (!marks.has(k) && !queens.has(k)) { marks.add(k); }
                else if (marks.has(k)) { marks.delete(k); queens.add(k); }
                else { queens.delete(k); }
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
        const r = Math.floor(i / currentPuzzle.size), c = i % currentPuzzle.size, k = `${r},${c}`;
        cell.classList.remove("has-queen", "has-mark", "bad");
        if (queens.has(k)) {
            cell.classList.add("has-queen");
            const conflict = qArr.some(([qr, qc]) => (qr === r && qc === c) ? false : (qr === r || qc === c || currentPuzzle.regions[qr][qc] === currentPuzzle.regions[r][c] || (Math.abs(qr - r) <= 1 && Math.abs(qc - c) <= 1)));
            if (conflict) cell.classList.add("bad");
        } else if (marks.has(k)) { cell.classList.add("has-mark"); }
    });
}

function startTimer() {
    clearInterval(timerInterval);
    const start = Date.now();
    timerInterval = setInterval(() => {
        const d = Math.floor((Date.now() - start) / 1000);
        document.getElementById("timer").textContent = `${String(Math.floor(d/60)).padStart(2,'0')}:${String(d%60).padStart(2,'0')}`;
    }, 1000);
}

document.addEventListener("DOMContentLoaded", () => initGame(7, 'hard'));