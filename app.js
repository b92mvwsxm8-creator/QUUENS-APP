let currentLevelIndex = 0;
let boardState = [];
let startTime;
let timerInterval;

function init() {
    loadLevel(0);
}

function loadLevel(index) {
    currentLevelIndex = index;
    const level = QUEENS_LEVELS[currentLevelIndex];
    const size = level.colorRegions.length;
    boardState = Array.from({ length: size }, () => Array(size).fill(0));
    
    document.getElementById('level-indicator').innerText = `Level: ${level.id}`;
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${r}-${c}`;
            cell.style.backgroundColor = level.regionColors[level.colorRegions[r][c]];
            cell.onclick = () => handleCellClick(r, c, size);
            grid.appendChild(cell);
        }
    }
    updateBestTimeDisplay(level.id);
    startTimer();
    renderCells(size);
}

function handleCellClick(r, c, size) {
    boardState[r][c] = (boardState[r][c] + 1) % 3;
    renderCells(size);
    checkWin(size);
}

function renderCells(size) {
    const level = QUEENS_LEVELS[currentLevelIndex];
    const conflicts = findConflicts(size, level);

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            cell.innerHTML = '';
            cell.classList.remove('error');
            if (boardState[r][c] === 1) cell.innerHTML = '<span class="cross">✕</span>';
            if (boardState[r][c] === 2) {
                cell.innerHTML = '<span class="queen">♛</span>';
                if (conflicts.has(`${r}-${c}`)) cell.classList.add('error');
            }
        }
    }
}

function findConflicts(size, level) {
    const queens = [];
    const conflicts = new Set();
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (boardState[r][c] === 2) queens.push({r, c, reg: level.colorRegions[r][c]});
        }
    }
    queens.forEach((q1, i) => {
        queens.forEach((q2, j) => {
            if (i === j) return;
            const sameRow = q1.r === q2.r;
            const sameCol = q1.c === q2.c;
            const sameReg = q1.reg === q2.reg;
            const adj = Math.abs(q1.r - q2.r) <= 1 && Math.abs(q1.c - q2.c) <= 1;
            if (sameRow || sameCol || sameReg || adj) {
                conflicts.add(`${q1.r}-${q1.c}`);
                conflicts.add(`${q2.r}-${q2.c}`);
            }
        });
    });
    return conflicts;
}

function checkWin(size) {
    const level = QUEENS_LEVELS[currentLevelIndex];
    let queenCount = 0;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) if (boardState[r][c] === 2) queenCount++;
    }

    if (queenCount === size && findConflicts(size, level).size === 0) {
        clearInterval(timerInterval);
        const timeStr = document.getElementById('timer').innerText;
        const currentTime = timeToSeconds(timeStr);
        const bestTime = getBestTime(level.id);
        
        let msg = `Gefeliciteerd! Level ${level.id} voltooid in ${timeStr}.`;
        if (!bestTime || currentTime < bestTime) {
            msg += "\nNieuw record verbroken!";
            saveBestTime(level.id, currentTime);
        }
        alert(msg);
        updateBestTimeDisplay(level.id);
    }
}

function timeToSeconds(str) {
    const p = str.split(':');
    return parseInt(p[0]) * 60 + parseInt(p[1]);
}

function getBestTime(id) {
    const scores = JSON.parse(localStorage.getItem('queens_best_times') || '{}');
    return scores[id];
}

function saveBestTime(id, secs) {
    const scores = JSON.parse(localStorage.getItem('queens_best_times') || '{}');
    scores[id] = secs;
    localStorage.setItem('queens_best_times', JSON.stringify(scores));
}

function updateBestTimeDisplay(id) {
    const best = getBestTime(id);
    const display = document.getElementById('best-time');
    if (best) {
        const m = String(Math.floor(best / 60)).padStart(2, '0');
        const s = String(best % 60).padStart(2, '0');
        display.innerText = `Record: ${m}:${s}`;
    } else {
        display.innerText = `Record: --:--`;
    }
}

function startTimer() {
    startTime = Date.now();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const s = String(elapsed % 60).padStart(2, '0');
        document.getElementById('timer').innerText = `${m}:${s}`;
    }, 1000);
}

function nextLevel() { loadLevel((currentLevelIndex + 1) % QUEENS_LEVELS.length); }
function resetLevel() { loadLevel(currentLevelIndex); }
window.onload = init;