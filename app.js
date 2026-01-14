let currentLevelIndex = 0;
let boardState = [];

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
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${r}-${c}`;
            cell.style.backgroundColor = level.regionColors[level.colorRegions[r][c]];
            cell.onclick = () => {
                boardState[r][c] = (boardState[r][c] + 1) % 3;
                renderCells(size);
            };
            grid.appendChild(cell);
        }
    }
    renderCells(size);
}

function renderCells(size) {
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            cell.innerHTML = ''; 
            if (boardState[r][c] === 1) cell.innerHTML = '✕';
            if (boardState[r][c] === 2) cell.innerHTML = '♛';
        }
    }
}

function nextLevel() {
    currentLevelIndex = (currentLevelIndex + 1) % QUEENS_LEVELS.length;
    loadLevel(currentLevelIndex);
}

function resetLevel() {
    loadLevel(currentLevelIndex);
}

window.onload = init;