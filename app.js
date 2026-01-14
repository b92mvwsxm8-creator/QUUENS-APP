/**
 * Queens Game Logic
 * Gekoppeld aan QUEENS_LEVELS uit levels.js
 */

let currentLevelIndex = 0;
let boardState = []; // 0 = leeg, 1 = markering (X), 2 = koningin

// 1. Initialisatie
function init() {
    console.log("Spel wordt gestart...");
    if (typeof QUEENS_LEVELS === 'undefined' || QUEENS_LEVELS.length === 0) {
        alert("Fout: levels.js is niet geladen of QUEENS_LEVELS ontbreekt.");
        return;
    }
    loadLevel(0);
}

// 2. Level Laden
function loadLevel(index) {
    currentLevelIndex = index;
    const level = QUEENS_LEVELS[currentLevelIndex];
    const size = level.size;

    // Maak een leeg bord (2D array vol nullen)
    boardState = Array.from({ length: size }, () => Array(size).fill(0));
    
    // Update de UI
    const levelIndicator = document.getElementById('level-indicator');
    if (levelIndicator) levelIndicator.innerText = `Level: ${level.id}`;

    renderBoard();
}

// 3. Het grid tekenen
function renderBoard() {
    const grid = document.getElementById('grid');
    if (!grid) return;

    const level = QUEENS_LEVELS[currentLevelIndex];
    const size = level.size;

    grid.innerHTML = '';
    // Stel CSS grid in op basis van level grootte
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(${size}, 50px)`;
    grid.style.width = `${size * 50}px`;

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${r}-${c}`;
            
            // Kleur de cel op basis van de regio
            const regionId = level.colorRegions[r][c];
            const color = level.regionColors[regionId];
            cell.style.backgroundColor = color;

            // Klik-actie: verander staat (leeg -> X -> Koningin -> leeg)
            cell.onclick = (e) => {
                e.preventDefault();
                toggleCell(r, c);
            };

            grid.appendChild(cell);
        }
    }
    updateDisplay();
}

// 4. Cel status wisselen
function toggleCell(r, c) {
    boardState[r][c] = (boardState[r][c] + 1) % 3;
    updateDisplay();
    validate();
}

// 5. Visuele update van iconen
function updateDisplay() {
    const size = QUEENS_LEVELS[currentLevelIndex].size;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            if (!cell) continue;

            // Verwijder oude klassen
            cell.classList.remove('queen', 'mark', 'error');
            cell.innerHTML = ''; // Maak leeg

            if (boardState[r][c] === 1) {
                cell.classList.add('mark');
                cell.innerHTML = '✕';
            } else if (boardState[r][c] === 2) {
                cell.classList.add('queen');
                cell.innerHTML = '👑';
            }
        }
    }
}

// 6. Validatie (Check op regels)
function validate() {
    const level = QUEENS_LEVELS[currentLevelIndex];
    const size = level.size;
    const queens = [];

    // Verzamel alle geplaatste koninginnen
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (boardState[r][c] === 2) {
                queens.push({ r, c, reg: level.colorRegions[r][c] });
            }
        }
    }

    // Check elke koningin tegen de anderen
    queens.forEach((q1, i) => {
        queens.forEach((q2, j) => {
            if (i === j) return;

            const rowConflict = q1.r === q2.r;
            const colConflict = q1.c === q2.c;
            const regConflict = q1.reg === q2.reg;
            const diagConflict = Math.abs(q1.r - q2.r) <= 1 && Math.abs(q1.c - q2.c) <= 1;

            if (rowConflict || colConflict || regConflict || diagConflict) {
                document.getElementById(`cell-${q1.r}-${q1.c}`).classList.add('error');
            }
        });
    });
}

// 7. Navigatie functies
function nextLevel() {
    currentLevelIndex = (currentLevelIndex + 1) % QUEENS_LEVELS.length;
    loadLevel(currentLevelIndex);
}

function resetLevel() {
    loadLevel(currentLevelIndex);
}

// Start het spel als de pagina geladen is
window.onload = init;