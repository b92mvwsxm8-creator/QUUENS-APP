// Volledige kleurlijst zoals door jou aangeleverd
const PALETTE = {
    altoMain: "#DFDFDF", anakiwa: "#96BEFF", atomicTangerine: "#FAA889",
    bittersweet: "#FF7B60", celadon: "#B3DFA0", chardonnay: "#FFC992",
    emerald: "#5BBA6F", halfBaked: "#95CBCF", lavenderRose: "#FE93F1",
    lightGreen: "#91F5AD", lightOrchid: "#DFA0BF", lightWisteria: "#BBA3E2",
    nomad: "#B9B29E", periwinkle: "#C9C9EE", saharaSand: "#E6F388",
    turquoiseBlue: "#55EBE2", white: "#FFFFFF"
};

let currentLevelIndex = 0;
let boardState = []; 

function init() {
    if (typeof QUEENS_LEVELS === 'undefined') return;
    loadLevel(0);
}

function loadLevel(index) {
    currentLevelIndex = index;
    const level = QUEENS_LEVELS[index];
    boardState = Array.from({ length: level.size }, () => Array(level.size).fill(0));
    renderBoard();
}

function renderBoard() {
    const grid = document.getElementById('grid');
    const level = QUEENS_LEVELS[currentLevelIndex];
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${level.size}, 1fr)`;

    for (let r = 0; r < level.size; r++) {
        for (let c = 0; c < level.size; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${r}-${c}`;
            
            // Gebruik kleur uit level of fallback naar palette
            const region = level.colorRegions[r][c];
            cell.style.backgroundColor = level.regionColors[region] || PALETTE.altoMain;
            
            // De herstelde 3-staps klik voor iPhone
            cell.onclick = (e) => {
                e.preventDefault();
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
    for (let r = 0; r < boardState.length; r++) {
        for (let c = 0; c < boardState[r].length; c++) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            cell.classList.remove('queen', 'mark', 'error');
            if (boardState[r][c] === 1) cell.innerHTML = '✕'; 
            else if (boardState[r][c] === 2) cell.innerHTML = '♛';
            else cell.innerHTML = '';
        }
    }
}

function validate() {
    const level = QUEENS_LEVELS[currentLevelIndex];
    const queens = [];
    // Reset alle errors eerst
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('error'));

    for (let r = 0; r < level.size; r++) {
        for (let c = 0; c < level.size; c++) {
            if (boardState[r][c] === 2) queens.push({ r, c, reg: level.colorRegions[r][c] });
        }
    }

    queens.forEach((q1, i) => {
        queens.forEach((q2, j) => {
            if (i === j) return;
            const conflict = (q1.r === q2.r) || (q1.c === q2.c) || (q1.reg === q2.reg) ||
                             (Math.abs(q1.r - q2.r) === 1 && Math.abs(q1.c - q2.c) === 1);
            if (conflict) {
                document.getElementById(`cell-${q1.r}-${q1.c}`).classList.add('error');
                document.getElementById(`cell-${q2.r}-${q2.c}`).classList.add('error');
            }
        });
    });
}

window.addEventListener('DOMContentLoaded', init);