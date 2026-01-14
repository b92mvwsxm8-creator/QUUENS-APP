let currentLevelIndex = 0;
let boardState = []; // 0=leeg, 1=kruisje, 2=koningin

function startGame() {
    const level = QUEENS_LEVELS[currentLevelIndex];
    boardState = Array.from({ length: 7 }, () => Array(7).fill(0));
    renderBoard(level);
}

function renderBoard(level) {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    
    level.colorRegions.forEach((row, r) => {
        row.forEach((region, c) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${r}-${c}`;
            cell.style.backgroundColor = level.regionColors[region];
            
            // IPHONE KLIK: Roteer status
            cell.onclick = () => {
                boardState[r][c] = (boardState[r][c] + 1) % 3;
                updateVisuals();
                validateBoard();
            };
            
            grid.appendChild(cell);
        });
    });
    updateVisuals();
}

function updateVisuals() {
    for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            cell.classList.remove('queen', 'mark', 'error');
            if (boardState[r][c] === 1) cell.classList.add('mark');
            if (boardState[r][c] === 2) cell.classList.add('queen');
        }
    }
}

function validateBoard() {
    const level = QUEENS_LEVELS[currentLevelIndex];
    const queens = [];
    for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
            if (boardState[r][c] === 2) queens.push({r, c, region: level.colorRegions[r][c]});
        }
    }

    queens.forEach((q1, i) => {
        queens.forEach((q2, j) => {
            if (i === j) return;
            const conflict = (q1.r === q2.r) || (q1.c === q2.c) || (q1.region === q2.region) ||
                             (Math.abs(q1.r - q2.r) === 1 && Math.abs(q1.c - q2.c) === 1);
            if (conflict) {
                document.getElementById(`cell-${q1.r}-${q1.c}`).classList.add('error');
                document.getElementById(`cell-${q2.r}-${q2.c}`).classList.add('error');
            }
        });
    });
}

function nextLevel() {
    currentLevelIndex = (currentLevelIndex + 1) % QUEENS_LEVELS.length;
    startGame();
}

function resetBoard() {
    boardState = Array.from({ length: 7 }, () => Array(7).fill(0));
    updateVisuals();
}

window.onload = startGame;