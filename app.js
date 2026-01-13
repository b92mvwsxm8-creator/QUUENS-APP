let currentPuzzle, queens = new Set(), marks = new Set(), timerInterval, startTime;

function initGame() {
    const size = parseInt(document.getElementById('gridSize').value);
    const diff = document.getElementById('difficulty').value;
    
    queens.clear();
    marks.clear();

    // Zoek puzzel in SHAPES (puzzles.js)
    if (typeof SHAPES !== 'undefined') {
        const available = SHAPES.filter(s => s.regions.length === size);
        if (available.length > 0) {
            const p = available[Math.floor(Math.random() * available.length)];
            currentPuzzle = { size: size, regions: p.regions };
        }
    }

    // Nood-grid als SHAPES niet geladen is (voorkomt strepen)
    if (!currentPuzzle) {
        currentPuzzle = { size: size, regions: Array.from({length:size}, () => Array(size).fill('A')) };
    }

    render();
    startTimer();
}

function render() {
    const b = document.getElementById("board");
    const size = currentPuzzle.size;
    b.innerHTML = "";
    // Dwing het grid hier af om de strepen te fixen
    b.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    b.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for(let r=0; r<size; r++) {
        for(let c=0; c<size; c++) {
            const cl = document.createElement("div");
            cl.className = "cell"; 
            cl.dataset.region = currentPuzzle.regions[r][c];
            cl.onclick = () => {
                const k=`${r},${c}`;
                if(!marks.has(k) && !queens.has(k)) marks.add(k);
                else if(marks.has(k)) { marks.delete(k); queens.add(k); }
                else queens.delete(k);
                updateUI();
            };
            b.appendChild(cl);
        }
    }
}

function updateUI() {
    const size = currentPuzzle.size;
    const q = Array.from(queens).map(k => k.split(',').map(Number));
    let errors = false;
    document.querySelectorAll(".cell").forEach((cell, i) => {
        const r=Math.floor(i/size), c=i%size, k=`${r},${c}`;
        cell.classList.remove("has-queen","has-mark","bad");
        if(queens.has(k)) {
            cell.classList.add("has-queen");
            const conflict = q.some(([qr,qc]) => (qr===r && qc===c) ? false : (qr===r || qc===c || currentPuzzle.regions[qr][qc]===currentPuzzle.regions[r][c] || (Math.abs(qr-r)<=1 && Math.abs(qc-c)<=1)));
            if(conflict) { cell.classList.add("bad"); errors = true; }
        } else if(marks.has(k)) cell.classList.add("has-mark");
    });
    if(queens.size === size && !errors) { clearInterval(timerInterval); setTimeout(()=>alert("Opgelost!"), 100); }
}

function startTimer() { 
    if(timerInterval) clearInterval(timerInterval); 
    startTime=Date.now(); 
    timerInterval=setInterval(()=> { 
        const elapsed = new Date(Date.now()-startTime);
        document.getElementById("timer").textContent=elapsed.toISOString().substr(14,5); 
    },1000); 
}

document.addEventListener("DOMContentLoaded", initGame);
