let currentPuzzle = null;
let queens = new Set();
let marks = new Set();
let timerInterval;
let startTime;
let currentDifficulty = 'easy';

// De Generator met jouw specifieke instellingen
function generate7x7(difficulty) {
    currentDifficulty = difficulty;
    const size = 7;
    const regions = Array.from({ length: size }, () => Array(size).fill(null));
    
    // 1. Plaats de koninginnen als basis (Oplossing garanderen)
    let cols = Array.from({ length: size }, (_, i) => i);
    shuffle(cols);
    for (let r = 0; r < size; r++) {
        regions[r][cols[r]] = String.fromCharCode(65 + r);
    }

    // 2. Expert Logica: Versmelt regio's voor grote blokken
    if (difficulty === 'hard') {
        for(let i=0; i<3; i++) { 
            let r1 = Math.floor(Math.random()*size), r2 = (r1+1)%size;
            let c1 = regions[r1].find(x => x), c2 = regions[r2].find(x => x);
            for(let y=0; y<size; y++) for(let x=0; x<size; x++) if(regions[y][x] === c2) regions[y][x] = c1;
        }
    }

    // 3. Groei-logica met de biases: 0.2 (Easy), 0.5 (Medium), 0.8 (Hard)
    let unassigned = [];
    for (let r=0; r<size; r++) for (let c=0; c<size; c++) if (!regions[r][c]) unassigned.push({r, c});
    const bias = difficulty === 'easy' ? 0.2 : (difficulty === 'medium' ? 0.5 : 0.8);

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

    // Gaatjes vullen voor de zekerheid
    unassigned.forEach(p => {
        const n = [[p.r-1,p.c], [p.r+1,p.c], [p.r,p.c-1], [p.r,p.c+1]].find(([y, x]) => 
            y >= 0 && y < size && x >= 0 && x < size && regions[y][x]);
        if(n) regions[p.r][p.c] = regions[n[0]][n[1]];
    });

    return { size, regions };
}

// Win-Check & Score opslaan
function handleWin() {
    clearInterval(timerInterval);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const bestTime = localStorage.getItem(`best_${currentDifficulty}`);
    const timeStr = formatTime(timeSpent);
    
    let msg = `Gefeliciteerd! Je tijd: ${timeStr}`;
    
    if (!bestTime || timeSpent < parseInt(bestTime)) {
        localStorage.setItem(`best_${currentDifficulty}`, timeSpent);
        msg += "\n\nNIEUW PERSOONLIJK RECORD! 🎉";
    }
    
    setTimeout(() => {
        alert(msg);
        displayBestTime();
    }, 100);
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

    // Win check bij 7 koninginnen zonder fouten
    if (queens.size === 7 && !hasError) {
        handleWin();
    }
}

// Hulpfuncties
function initGame(size, difficulty = 'hard') {
    currentPuzzle = generate7x7(difficulty);
    queens.clear(); marks.clear();
    displayBestTime();
    render();
    startTimer();
}

function displayBestTime() {
    const best = localStorage.getItem(`best_${currentDifficulty}`);
    const el = document.getElementById("best-time");
    if (el) el.textContent = best ? formatTime(parseInt(best)) : "--:--";
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const d = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById("timer").textContent = formatTime(d);
    }, 1000);
}

function render() {
    const board = document.getElementById("board");
    if (!board) return;
    board.innerHTML = "";
    board.style.gridTemplateColumns = `repeat(7, 1fr)`;
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

function shuffle(a) { for (let i=a.length-1; i>0; i--) { const j=Math.floor(Math.random()*(i+1)); [a[i], a[j]] = [a[j], a[i]]; } }

document.addEventListener("DOMContentLoaded", () => initGame(7, 'hard'));