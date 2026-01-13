let currentPuzzle = null;
let queens = new Set();
let marks = new Set();
let timerInterval;
let startTime;

// De 14 Expert Patronen
const EXPERT_SHAPES = [
    { name: "Blossom", regions: [0,0,1,1,1,2,2,3,3,3, 0,0,1,1,1,2,2,3,3,3, 0,0,4,4,4,5,5,3,3,3, 6,6,4,4,4,5,5,7,7,7, 6,6,4,4,4,5,5,7,7,7, 6,6,8,8,8,9,9,7,7,7, 10,10,8,8,8,9,9,11,11,11, 10,10,12,12,12,13,13,11,11,11, 10,10,12,12,12,13,13,11,11,11, 10,10,12,12,12,13,13,11,11,11] },
    { name: "Snake", regions: [0,0,0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1,1,1, 2,2,2,2,2,2,2,2,2,2, 3,3,3,3,3,3,3,3,3,3, 4,4,4,4,4,4,4,4,4,4, 5,5,5,5,5,5,5,5,5,5, 6,6,6,6,6,6,6,6,6,6, 7,7,7,7,7,7,7,7,7,7, 8,8,8,8,8,8,8,8,8,8, 9,9,9,9,9,9,9,9,9,9] },
    { name: "Gridlock", regions: [0,1,0,1,0,1,0,1,0,1, 2,3,2,3,2,3,2,3,2,3, 0,1,0,1,0,1,0,1,0,1, 2,3,2,3,2,3,2,3,2,3, 4,5,4,5,4,5,4,5,4,5, 6,7,6,7,6,7,6,7,6,7, 4,5,4,5,4,5,4,5,4,5, 8,9,8,9,8,9,8,9,8,9, 10,11,10,11,10,11,10,11,10,11, 8,9,8,9,8,9,8,9,8,9] }
    // Note: Voeg hier de rest van de 14 shapes toe in dit formaat
];

function initGame() {
    const size = parseInt(document.getElementById('gridSize').value);
    const difficulty = document.getElementById('difficulty').value;
    
    queens.clear();
    marks.clear();
    clearInterval(timerInterval);
    document.getElementById('timer').textContent = "00:00";

    if (difficulty === 'expert' && size === 10) {
        const shape = EXPERT_SHAPES[Math.floor(Math.random() * EXPERT_SHAPES.length)];
        currentPuzzle = { size: 10, regions: convertTo2D(shape.regions) };
    } else {
        currentPuzzle = generateRandomPuzzle(size);
    }
    
    render();
    startTimer();
}

function convertTo2D(arr) {
    let res = [];
    for(let i=0; i<10; i++) res.push(arr.slice(i*10, (i+1)*10));
    return res;
}

function render() {
    const board = document.getElementById('board');
    board.style.gridTemplateColumns = `repeat(${currentPuzzle.size}, 1fr)`;
    board.innerHTML = "";

    for (let r = 0; r < currentPuzzle.size; r++) {
        for (let c = 0; c < currentPuzzle.size; c++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.style.backgroundColor = `hsl(${currentPuzzle.regions[r][c] * 25}, 60%, 80%)`;
            cell.onclick = () => handleMove(r, c);
            board.appendChild(cell);
        }
    }
}

function handleMove(r, c) {
    const key = `${r},${c}`;
    if (queens.has(key)) { queens.delete(key); marks.add(key); }
    else if (marks.has(key)) { marks.delete(key); }
    else { queens.add(key); }
    updateUI();
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

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const diff = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('timer').textContent = formatTime(diff);
    }, 1000);
}

function formatTime(s) {
    return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
}

// Dummy generator voor niet-expert niveaus
function generateRandomPuzzle(size) {
    let regions = Array(size).fill().map(() => Array(size).fill(0));
    for(let i=0; i<size; i++) for(let j=0; j<size; j++) regions[i][j] = Math.floor(Math.random()*size);
    return { size, regions };
}

document.addEventListener('DOMContentLoaded', initGame);
