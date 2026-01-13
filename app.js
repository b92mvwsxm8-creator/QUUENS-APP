let currentPuzzle, queens = new Set(), marks = new Set(), timerInterval, startTime;

// De generator die echt naar het niveau kijkt
function generatePuzzle(size) {
    const level = document.getElementById("difficulty")?.value || 'medium';
    const regions = Array.from({ length: size }, () => Array(size).fill(null));
    let used = new Set();

    // 1. Gebruik shapes vaker op Hard niveau
    const vShapes = SHAPES.filter(s => s.size === size);
    let shapeChance = (level === 'hard') ? 0.8 : (level === 'easy' ? 0.1 : 0.4);

    if (vShapes.length > 0 && Math.random() < shapeChance) {
        const shape = vShapes[Math.floor(Math.random() * vShapes.length)];
        shape.cells.forEach(([r, c]) => {
            if (r < size && c < size) { regions[r][c] = 'A'; used.add(`${r},${c}`); }
        });
    }

    // 2. Fragmentatie bepaalt moeilijkheid (NIET de grootte)
    let numSeeds = size;
    if (level === 'hard') numSeeds = size + 2; // Veel kleine gebieden = Expert
    if (level === 'easy') numSeeds = Math.max(3, Math.floor(size / 1.5)); // Grote gebieden = Beginner

    for (let i = (used.size > 0 ? 1 : 0); i < numSeeds; i++) {
        let r, c;
        do { r = Math.floor(Math.random() * size); c = Math.floor(Math.random() * size); } while (used.has(`${r},${c}`));
        regions[r][c] = String.fromCharCode(65 + (i % 26));
        used.add(`${r},${c}`);
    }

    // 3. Gebieden laten groeien
    let unassigned = [];
    for (let r=0; r<size; r++) for (let c=0; c<size; c++) if (!regions[r][c]) unassigned.push({r, c});
    while (unassigned.length > 0) {
        unassigned.sort(() => Math.random() - 0.5);
        for (let i = unassigned.length - 1; i >= 0; i--) {
            const {r, c} = unassigned[i], n = [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].filter(([nr,nc])=>nr>=0&&nr<size&&nc>=0&&nc<size&&regions[nr][nc]);
            if (n.length > 0) { const [nr,nc] = n[Math.floor(Math.random()*n.length)]; regions[r][c] = regions[nr][nc]; unassigned.splice(i, 1); }
        }
    }
    return { size, regions };
}

function initGame() {
    const sizeSelect = document.getElementById("size-select");
    if (!sizeSelect) return;
    const size = parseInt(sizeSelect.value);
    currentPuzzle = generatePuzzle(size);
    queens.clear(); marks.clear();
    const best = localStorage.getItem(`best_queens_${size}`);
    const bestEl = document.getElementById("best-time");
    if (bestEl) bestEl.textContent = best ? formatTime(parseInt(best)) : "--:--";
    render(); 
    startTimer();
}

function render() {
    const board = document.getElementById("board");
    if (!board) return;
    board.style.gridTemplateColumns = `repeat(${currentPuzzle.size}, 1fr)`;
    board.innerHTML = "";
    for (let r = 0; r < currentPuzzle.size; r++) {
        for (let c = 0; c < currentPuzzle.size; c++) {
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

function updateUI() {
    const qArr = Array.from(queens).map(k => k.split(',').map(Number));
    let err = false;
    document.querySelectorAll(".cell").forEach((cell, i) => {
        const r = Math.floor(i/currentPuzzle.size), c = i%currentPuzzle.size, k = `${r},${c}`;
        cell.classList.remove("has-queen", "has-mark", "bad");
        if (queens.has(k)) {
            cell.classList.add("has-queen");
            const conflict = qArr.some(([qr, qc]) => (qr===r && qc===c) ? false : (qr===r || qc===c || currentPuzzle.regions[qr][qc]===currentPuzzle.regions[r][c] || (Math.abs(qr-r)<=1 && Math.abs(qc-c)<=1)));
            if (conflict) { cell.classList.add("bad"); err = true; }
        } else if (marks.has(k)) cell.classList.add("has-mark");
    });
    if (queens.size === currentPuzzle.size && !err) {
        clearInterval(timerInterval);
        const time = Math.floor((Date.now() - startTime) / 1000);
        const best = localStorage.getItem(`best_queens_${currentPuzzle.size}`);
        if (!best || time < parseInt(best)) localStorage.setItem(`best_queens_${currentPuzzle.size}`, time);
        setTimeout(() => { alert("Gefeliciteerd!"); initGame(); }, 100);
    }
}

function startTimer() {
    startTime = Date.now();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const diff = Math.floor((Date.now() - startTime) / 1000);
        const timerEl = document.getElementById("timer");
        if (timerEl) timerEl.textContent = formatTime(diff);
    }, 1000);
}

function formatTime(s) { return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`; }

document.addEventListener("DOMContentLoaded", initGame);