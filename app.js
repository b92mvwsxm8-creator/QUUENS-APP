let currentLevelIndex = 0;
let boardState = []; 
let startTime;
let timerInterval;

function init() {
    if (typeof QUEENS_LEVELS === 'undefined') {
        alert("Fout: levels.js niet gevonden.");
        return;
    }
    loadLevel(0);
}

function startTimer() {
    startTime = Date.now();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const secs = String(elapsed % 60).padStart(2, '0');
        const t = document.getElementById('timer');
        if (t) t.innerText = `${mins}:${secs}`;
    }, 1000);
}

function loadLevel(index) {
    currentLevelIndex = index;
    const level = QUEENS_LEVELS[currentLevelIndex];
    // Gebruikt de 'size' uit de data (7 voor 7x7, 8 voor 8x8)
    boardState = Array.from({ length: level.size }, () => Array(level.size).fill(0));
    document.getElementById('level-indicator').innerText = `Level: ${level.id}`;
    renderBoard();
    startTimer();
}

function renderBoard() {
    const grid = document.getElementById('grid');
    const level = QUEENS_LEVELS[currentLevelIndex];
    grid.innerHTML = '';
    // Past het aantal kolommen aan aan de grootte van de puzzel
    grid.style.gridTemplateColumns = `repeat(${level.size}, 1fr)`;

    for (let r = 0; r < level.size; r++) {
        for (let c = 0; c < level.size; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${r}-${c}`;
            cell.style.backgroundColor = level.regionColors[level.colorRegions[r][c]];
            cell.onclick = () => {
                boardState[r][c] = (boardState[r][c] + 1) % 3;
                updateDisplay();
                validate();
            };
            grid.appendChild(cell);
        }
    }
    updateDisplay();
}

function updateDisplay() {
    const level = QUEENS_LEVELS[currentLevelIndex];
    for (let r = 0; r < level.size; r++) {
        for (let c = 0; c < level.size; c++) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            cell.innerText = ''; // Maakt cel ECHT leeg voor we iets nieuws plaatsen
            cell.classList.remove('queen', 'mark', 'error');
            
            if (boardState[r][c] === 1) {
                cell.innerText = '✕';
                cell.classList.add('mark');
            } else if (boardState[r][c] === 2) {
                cell.innerText = '♛'; 
                cell.classList.add('queen');
            }
        }
    }
}

function validate() {
    const level = QUEENS_LEVELS[currentLevelIndex];
    const queens = [];
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