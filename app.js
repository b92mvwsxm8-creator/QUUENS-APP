let currentLevelIndex = 0;
let boardState = []; 
let startTime, timerInterval;

function init() {
    if (typeof QUEENS_LEVELS !== 'undefined' && QUEENS_LEVELS.length > 0) {
        loadLevel(0);
    }
}

function loadLevel(index) {
    currentLevelIndex = index;
    const level = QUEENS_LEVELS[currentLevelIndex];
    boardState = Array.from({ length: 7 }, () => Array(7).fill(0));
    
    document.getElementById('level-indicator').innerText = `Level: ${level.id}`;
    
    const scores = JSON.parse(localStorage.getItem('q_best_7x7') || '{}');
    const best = scores[level.id];
    document.getElementById('best-time').innerText = best ? `Record: ${formatTime(best)}` : "Record: --:--";

    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${r}-${c}`;
            cell.style.backgroundColor = level.regionColors[level.colorRegions[r][c]];
            cell.onclick = () => {
                boardState[r][c] = (boardState[r][c] + 1) % 3;
                render();
            };
            grid.appendChild(cell);
        }
    }
    startTimer();
    render();
}

function render() {
    const level = QUEENS_LEVELS[currentLevelIndex];
    const queens = [];
    for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
            if (boardState[r][c] === 2) queens.push({r, c, reg: level.colorRegions[r][c]});
        }
    }

    const conflicts = new Set();
    queens.forEach(q1 => {
        queens.forEach(q2 => {
            if (q1 === q2) return;
            if (q1.r === q2.r || q1.c === q2.c || q1.reg === q2.reg || (Math.abs(q1.r-q2.r)<=1 && Math.abs(q1.c-q2.c)<=1)) {
                conflicts.add(`${q1.r}-${q1.c}`);
            }
        });
    });

    for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            cell.innerHTML = '';
            if (boardState[r][c] === 1) {
                cell.innerHTML = '<span class="cross">✕</span>';
            } else if (boardState[r][c] === 2) {
                cell.innerHTML = '<span class="queen">♛</span>';
            }
            cell.classList.toggle('error', boardState[r][c] === 2 && conflicts.has(`${r}-${c}`));
        }
    }

    if (queens.length === 7 && conflicts.size === 0) {
        clearInterval(timerInterval);
        setTimeout(() => { 
            alert(`Gefeliciteerd! Tijd: ${document.getElementById('timer').innerText}`); 
            nextLevel(); 
        }, 100);
    }
}

function startTimer() {
    startTime = Date.now();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('timer').innerText = formatTime(elapsed);
    }, 1000);
}

function formatTime(s) {
    return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
}

function nextLevel() {
    currentLevelIndex = (currentLevelIndex + 1) % QUEENS_LEVELS.length;
    loadLevel(currentLevelIndex);
}

function resetLevel() { loadLevel(currentLevelIndex); }

window.onload = init;