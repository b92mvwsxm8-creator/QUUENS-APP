let currentPuzzle = null;
let queens = new Set();
let marks = new Set();

function initGame() {
    const size = parseInt(document.getElementById('gridSize').value);
    const difficulty = document.getElementById('difficulty').value;
    
    queens.clear();
    marks.clear();

    if (difficulty === 'expert' && size === 10) {
        // Kies een willekeurige shape uit de SHAPES lijst in puzzles.js
        const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        currentPuzzle = { size: 10, regions: generateExpertGrid(shape) };
    } else {
        // Zoek de juiste puzzel in de PUZZLES lijst
        const pData = PUZZLES.find(p => p.size === size) || PUZZLES[0];
        currentPuzzle = { size: pData.size, regions: pData.regions };
    }
    
    render();
}

function generateExpertGrid(shape) {
    // Maak een leeg 10x10 grid (vlak 0)
    let grid = Array(10).fill().map(() => Array(10).fill("A"));
    
    // Kleur de specifieke cellen van de shape (vlak 1)
    shape.cells.forEach(([r, c]) => {
        if (r < 10 && c < 10) grid[r][c] = "B";
    });
    
    return grid;
}

function render() {
    const board = document.getElementById('board');
    if (!board) return;
    board.style.gridTemplateColumns = `repeat(${currentPuzzle.size}, 1fr)`;
    board.innerHTML = "";

    for (let r = 0; r < currentPuzzle.size; r++) {
        for (let c = 0; c < currentPuzzle.size; c++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            // Kleur bepalen op basis van de letter (A of B)
            cell.style.backgroundColor = currentPuzzle.regions[r][c] === "B" ? "#FFD1DC" : "#B2E2F2";
            
            cell.onclick = () => {
                const key = `${r},${c}`;
                if (queens.has(key)) { queens.delete(key); marks.add(key); }
                else if (marks.has(key)) { marks.delete(key); }
                else { queens.add(key); }
                updateUI();
            };
            board.appendChild(cell);
        }
    }
}

function updateUI() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, i) => {
        const r = Math.floor(i / currentPuzzle.size);
        const c = i % currentPuzzle.size;
        const key = `${r},${c}`;
        cell.classList.remove("has-queen", "has-mark");
        if (queens.has(key)) cell.classList.add("has-queen");
        if (marks.has(key)) cell.classList.add("has-mark");
    });
}

document.addEventListener('DOMContentLoaded', initGame);