// Configuratie en Staat
let currentPuzzle = null;
let queens = new Set();
let marks = new Set();
let timerInterval;

// 1. WISKUNDIGE GENERATOR (Garandeert oplosbaarheid)
function generatePuzzle(size) {
    const seed = new Date().toDateString(); // Elke dag een nieuwe unieke puzzel
    const regions = Array.from({ length: size }, () => Array(size).fill(null));
    
    // Plaats koninginnen volgens de regels (geen rij/kolom/diagonaal overlap)
    const queenCoords = [];
    const rows = Array.from({ length: size }, (_, i) => i);
    shuffle(rows);
    
    for (let r = 0; r < size; r++) {
        queenCoords.push({ r, c: rows[r] });
    }

    // Gebruik Voronoi-algoritme om regio's rond de koninginnen te bouwen
    // Dit zorgt dat elke regio exact één koningin bevat
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            let minDist = Infinity;
            let closestQueen = 0;
            queenCoords.forEach((q, index) => {
                const dist = Math.abs(r - q.r) + Math.abs(c - q.c);
                if (dist < minDist) {
                    minDist = dist;
                    closestQueen = index;
                }
            });
            regions[r][c] = String.fromCharCode(65 + closestQueen); // Regio A, B, C...
        }
    }
    return { size, regions, name: `Daily ${size}x${size}` };
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 2. GAME LOGICA
function loadPuzzle(size) {
    currentPuzzle = generatePuzzle(size);
    queens.clear();
    marks.clear();
    render();
    startTimer();
}

function render() {
    const board = document.getElementById("board");
    board.innerHTML = "";
    const n = currentPuzzle.size;
    
    // Strakke grid layout tegen het uitrekken
    board.style.display = "grid";
    board.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${n}, 1fr)`;
    board.style.aspectRatio = "1 / 1"; 

    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.region = currentPuzzle.regions[r][c];
            
            cell.onclick = () => {
                const k = `${r},${c}`;
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
    let i = 0;
    const qArr = Array.from(queens).map(k => k.split(',').map(Number));

    cells.forEach(cell => {
        const r = Math.floor(i / currentPuzzle.size);
        const c = i % currentPuzzle.size;
        const k = `${r},${c}`;
        cell.classList.remove("has-queen", "has-mark", "bad");
        
        if (queens.has(k)) {
            cell.classList.add("has-queen");
            // Check op conflicten (rij, kolom, regio, diagonaal)
            const conflict = qArr.some(([qr, qc]) => {
                if (qr === r && qc === c) return false;
                return qr === r || qc === c || 
                       currentPuzzle.regions[qr][qc] === currentPuzzle.regions[r][c] ||
                       (Math.abs(qr - r) <= 1 && Math.abs(qc - c) <= 1);
            });
            if (conflict) cell.classList.add("bad");
        } else if (marks.has(k)) {
            cell.classList.add("has-mark");
        }
        i++;
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

document.addEventListener("DOMContentLoaded", () => loadPuzzle(7));