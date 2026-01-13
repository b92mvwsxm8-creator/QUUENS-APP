let currentPuzzle = null;
let queens = new Set();
let marks = new Set();
let timerInterval;
let startTime;
let currentDifficulty = 'medium';

const SHAPES = [
    { name: "Blossom", cells: [[1,3],[2,3],[2,4],[3,2],[3,3],[3,4]] },
    { name: "Diamond", cells: [[1,3],[2,2],[2,4],[3,1],[3,3],[3,5],[4,2],[4,4],[5,3]] },
    { name: "Snake", cells: [[1,1],[1,2],[2,2],[2,3],[3,3],[3,4],[4,4]] },
    { name: "Corridor", cells: [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3]] },
    { name: "Plan 9", cells: [[1,1],[1,2],[1,3],[2,3],[3,3],[3,2],[3,1],[2,1]] },
    { name: "Happy 2026", cells: [[0,0],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6]] }
    // Hier kunnen de overige shapes worden toegevoegd
];

function initGame() {
    const sizeSelect = document.getElementById('gridSize');
    const diffSelect = document.getElementById('difficulty');
    
    const size = sizeSelect ? parseInt(sizeSelect.value) : 7;
    currentDifficulty = diffSelect ? diffSelect.value : 'medium';

    queens.clear();
    marks.clear();
    
    if (currentDifficulty === 'expert' && size === 10) {
        // Logica voor expert 10x10
        const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        currentPuzzle = { size: 10, regions: generateExpertRegions(randomShape) };
    } else {
        currentPuzzle = generateRandomPuzzle(size);
    }
    
    render();
    startTimer();
}

function render() {
    const board = document.getElementById('board');
    if (!board || !currentPuzzle) return;
    
    board.style.gridTemplateColumns = `repeat(${currentPuzzle.size}, 1fr)`;
    board.innerHTML = "";

    for (let r = 0; r < currentPuzzle.size; r++) {
        for (let c = 0; c < currentPuzzle.size; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = r;
            cell.dataset.col = c;
            // Kleur de regio's op basis van de puzzel data
            cell.style.backgroundColor = getRegionColor(currentPuzzle.regions[r][c]);
            
            cell.onclick = () => handleCellClick(r, c);
            board.appendChild(cell);
        }
    }
}

function handleCellClick(r, c) {
    const key = `${r},${c}`;
    if (queens.has(key)) {
        queens.delete(key);
        marks.add(key);
    } else if (marks.has(key)) {
        marks.delete(key);
    } else {
        queens.add(key);
    }
    updateUI();
}

function updateUI() {
    document.querySelectorAll(".cell").forEach(cell => {
        const r = cell.dataset.row;
        const c = cell.dataset.col;
        const key = `${r},${c}`;
        cell.classList.remove("has-queen", "has-mark");
        if (queens.has(key)) cell.classList.add("has-queen");
        if (marks.has(key)) cell.classList.add("has-mark");
    });
}

function start
