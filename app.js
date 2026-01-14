let currentLevelIndex = 0;
let boardState = [];

function init() {
    if (typeof QUEENS_LEVELS === 'undefined') {
        console.error("Data niet gevonden");
        return;
    }
    loadLevel(0);
}

function loadLevel(index) {
    currentLevelIndex = index;
    const level = QUEENS_LEVELS[currentLevelIndex];
    boardState = Array.from({ length: level.size }, () => Array(level.size).fill(0));
    
    const indicator = document.getElementById('level-indicator');
    if (indicator) indicator.innerText = `Level: ${level.id}`;
    
    renderBoard();
}

function renderBoard() {
    const grid = document.getElementById('grid');
    if (!grid) return;
    
    const level = QUEENS_LEVELS[currentLevelIndex];
    grid.innerHTML = '';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(${level.size}, 50px)`;

    for (let r = 0; r < level.size; r++) {
        for (let c = 0; c < level.size; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${r}-${c}`;
            cell.style.backgroundColor = level.regionColors[level.colorRegions[r][c]];
            cell.onclick = () => toggleCell(r, c);
            grid.appendChild(cell);
        }
    }
    updateDisplay();
}

function toggleCell(r, c) {
    boardState[r][c] = (boardState[r][c] + 1) % 3;
    updateDisplay();
    validate();
}

function updateDisplay() {
    const level = QUEENS_LEVELS[currentLevelIndex];
    for (let r = 0; r < level.size; r++) {
        for (let c = 0; c < level.size; c++) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            if (!cell) continue;
            cell.classList.remove('queen', 'mark', 'error');
            cell.innerHTML = '';
            if (boardState[r][c] === 1) { cell.innerHTML = '✕'; cell.classList.add('mark'); }
            if (boardState[r][c] === 2) { cell.innerHTML = '👑'; cell.classList.add('queen'); }
        }
    }
}

function validate() {
    const level = QUEENS_LEVELS[currentLevelIndex];
    const queens = [];
    document.querySelectorAll('.cell').forEach(el => el.classList.remove('error'));

    for (let r = 0; r < level.size; r++) {
        for (let c = 0; c < level.size; c++) {
            if (boardState[r][c] === 2) queens.push({r, c, reg: level.colorRegions[r][c]});
        }
    }

    queens.forEach((q1, i) => {
        queens.forEach((q2, j) => {
            if (i === j) return;
            const conflict = q1.r === q2.r || q1.c === q2.c || q1.reg === q2.reg || (Math.abs(q1.r - q2.r) <= 1 && Math.abs(q1.c - q2.c) <= 1);
            if (conflict) {
                document.getElementById(`cell-${q1.r}-${q1.c}`).classList.add('error');
                document.getElementById(`cell-${q2.r}-${q2.c}`).classList.add('error');
            }
        });
    });
}

function nextLevel() {
    currentLevelIndex = (currentLevelIndex + 1) % QUEENS_LEVELS.length;
    loadLevel(currentLevelIndex);
}

function resetLevel() {
    loadLevel(currentLevelIndex);
}

window.onload = init;