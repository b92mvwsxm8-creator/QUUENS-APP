let currentLevelIndex = 0;
let boardState = [];
let startTime;
let timerInterval;

function init() {
    if (typeof QUEENS_LEVELS === 'undefined') return;
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

            if (boardState[r][c] === 1) cell.innerHTML = '✕';
            if (boardState[r][c] === 2) {
                cell.innerHTML = '♛';
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
            if (boardState[r][c] === 2) {
                queens.push({r, c, reg: level.colorRegions[r][c]});
            }
        }
    }

    queens.forEach((q1, i) => {
        queens.forEach((q2, j) => {
            if (i === j) return;
            const sameRow = q1.r === q2.r;
            const sameCol = q1.c === q2.c;
            const sameReg = q1.reg === q2.reg;
            const adjacent = Math.abs(q1.r - q2.r) <= 1 && Math.abs(q1.c - q2.c) <= 1;

            if (sameRow || sameCol || sameReg || adjacent) {
                conflicts.add(`${q1.r}-${q1.c}`);
                conflicts.add(`${q2.r}-${q2.c}`);
            }
        });
    });
    return conflicts;
}

function checkWin(size) {
    const level = QUEENS_LEVELS[currentLevelIndex];
    const queens = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (boardState[r][c] === 2) queens.push(true);
        }
    }

    if (queens.length === size && findConflicts(size, level).size === 0) {
        clearInterval(timerInterval);
        const finalTime = document.getElementById('timer').innerText;
        saveScore(level.id, finalTime);
        setTimeout(() => alert(`Gefeliciteerd! Level ${level.id} voltooid in ${finalTime}`), 100);
    }
}

function saveScore(levelId, time) {
    let scores = JSON.parse(localStorage.getItem('queens_scores') || '{}');
    scores[levelId] = time;
    localStorage.setItem('queens_scores', JSON.stringify(scores));
}

function startTimer() {
    startTime = Date.now();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const secs = String(elapsed % 60).padStart(2, '0');
        document.getElementById('timer').innerText = `${mins}:${secs}`;
    }, 1000);
}

function nextLevel() { loadLevel((currentLevelIndex + 1) % QUEENS_LEVELS.length); }
function resetLevel() { loadLevel(currentLevelIndex); }

window.onload = init;