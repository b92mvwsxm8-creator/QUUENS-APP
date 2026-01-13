let currentPuzzle = null;
let queens = new Set();
let marks = new Set();
let timerInterval;
let startTime;
let currentDifficulty = 'hard';

// De volledige lijst met expert-patronen
const SHAPES = [
    { name: "Blossom", cells: [[3,3],[2,3],[4,3],[3,2],[3,4]] },
    { name: "Diamond", cells: [[1,3],[2,2],[2,4],[3,1],[3,5],[4,2],[4,4],[5,3]] },
    { name: "Snake", cells: [[1,1],[1,2],[2,2],[2,3],[3,3],[3,4],[4,4]] },
    { name: "Corridor", cells: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5]] },
    { name: "Plan 9", cells: [[1,1],[2,1],[3,1],[3,2],[3,3],[2,3],[1,3]] },
    { name: "Happy 2026", cells: [[0,0],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6]] }
];

function generate7x7(difficulty) {
    currentDifficulty = difficulty;
    const size = 7;
    const regions = Array.from({ length: size }, () => Array(size).fill(null));
    
    let cols = Array.from({ length: size }, (_, i) => i);
    shuffle(cols);
    for (let r = 0; r < size; r++) {
        regions[r][cols[r]] = String.fromCharCode(65 + r);
    }

    if (difficulty === 'hard') {
        if (Math.random() > 0.5) {
            const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
            shape.cells.forEach(([r, c]) => { regions[r][c] = 'A'; });
        }

        for(let i=0; i<3; i++) { 
            let r1 = Math.floor(Math.random()*size);
            let targetChar = regions[r1].find(x => x);
            let mergeWith = regions[(r1+1)%size].find(x => x);
            for(let y=0; y<size; y++) for(let x=0; x<size; x++) 
                if(regions[y][x] === mergeWith) regions[y][x] = targetChar;
        }
    }

    let unassigned = [];
    for (let r=0; r<size; r++) for (let c=0; c<size; c++) if (!regions[r][c]) unassigned.push({r, c});
    
    const bias = difficulty === 'easy' ? 0.1 : (difficulty === 'medium' ? 0.5 : 0.85);

    while (unassigned.length > 0) {
        shuffle(unassigned);
        for (let i = unassigned.length - 1; i >= 0; i--) {
            const {r, c} = unassigned[i];
            const neighbors = [[r-1,c], [r+1,c], [r,c-1], [r,c+1]].filter(([nr, nc]) => 
                nr >= 0 && nr < size && nc >= 0 && nc < size && regions[nr][nc]);
            if (neighbors.length > 0 && Math.random() < bias) {
                const [nr, nc] = neighbors[Math.floor(Math.random() * neighbors.length)];
                regions[r][c] = regions[nr][nc];
                unassigned.splice(i, 1);
            }
        }
    }
    
    unassigned.forEach(p => {
        const n = [[p.r-1,p.c], [p.r+1,p.c], [p.r,p.c-1], [p.r,p.c+1]].find(([y, x]) => 
            y >= 0 && y < size && x >= 0 && x < size && regions[y][x]);
        if(n) regions[p.r][p.c] = regions[n[0]][n[1]];
    });

    return { size, regions };
}

function initGame(size, difficulty = 'hard') {
    currentPuzzle = generate7x7(difficulty);
    queens.clear(); marks.clear();
    displayBestTime();
    render();
    startTimer();
}

function handleWin() {
    clearInterval(timerInterval);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const bestKey = `best_7x7_${currentDifficulty}`;
    const bestTime = localStorage.getItem(bestKey);
    
    let msg = `Gefeliciteerd! Tijd: ${formatTime(timeSpent)}`;
    if (!bestTime || timeSpent < parseInt(bestTime)) {
        localStorage.setItem(bestKey, timeSpent);
        msg += "\n\nNIEUW RECORD! 🎉";
    }
    setTimeout(() => { alert(msg); displayBestTime(); }, 100);
}

function updateUI() {
    const qArr = Array.from(queens).map(k => k.split(',').map(Number));
    let hasError = false;
    document.querySelectorAll(".cell").forEach((cell, i) => {
        const r = Math.floor(i/7), c = i%7, k = `${r},${c}`;
        cell.classList.remove("has-queen", "has-mark", "bad");
        if (queens.has(k)) {
            cell.classList.add("has-queen");
            const conflict = qArr.some(([qr, qc]) => (qr===r && qc===c) ? false : 
                (qr===r || qc===c || currentPuzzle.regions[qr][qc]===currentPuzzle.regions[r][c] || (Math.abs(qr-r)<=1 && Math.abs(qc-c)<=1)));
            if (conflict) { cell.classList.add("bad"); hasError = true; }
        } else if (marks.has(k)) cell.classList.add("has-mark");
    });
    if (queens.size === 7 && !hasError) handleWin();
}

function render() {
    const board = document.getElementById("board");
    board.innerHTML = "";
    for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.region = currentPuzzle.regions[r][c];
            const k = `${r},${c}`;
            cell.onclick = () => {
                if (!marks.has(k) && !queens.has(k)) marks.add(k);
                else if (marks.has(k)) { marks.delete(k); queens.add(k); }
                else queens.delete(k);
                updateUI();
            };
            board.appendChild(cell);
        }
    }
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const d = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById("timer").textContent = formatTime(d);
    }, 1000);
}

function displayBestTime() {
    const best = localStorage.getItem(`best_7x7_${currentDifficulty}`);
    document.getElementById("best-time").textContent = best ? formatTime(parseInt(best)) : "--:--";
}

function formatTime(s) { return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`; }
function shuffle(a) { for (let i=a.length-1; i>0; i--) { const j=Math.floor(Math.random()*(i+1)); [a[i], a[j]] = [a[j], a[i]]; } }

document.addEventListener("DOMContentLoaded", () => initGame(7, 'hard'));