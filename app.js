let currentPuzzle, queens = new Set(), marks = new Set(), timerInterval, startTime;

function initGame() {
    const size = parseInt(document.getElementById('gridSize').value);
    queens.clear(); marks.clear();

    if (typeof SHAPES !== 'undefined') {
        const available = SHAPES.filter(s => s.regions.length === size);
        if (available.length > 0) {
            const p = available[Math.floor(Math.random() * available.length)];
            currentPuzzle = { size: size, regions: p.regions };
            document.getElementById('puzzle-name').textContent = p.name;
        } else {
            document.getElementById('puzzle-name').textContent = "Geen puzzel voor deze maat";
            currentPuzzle = { size: size, regions: Array.from({length:size}, (v, r) => Array(size).fill(String.fromCharCode(65+r))) };
        }
    }
    render();
    startTimer();
}

function render() {
    const b = document.getElementById("board");
    const size = currentPuzzle.size;
    b.innerHTML = "";
    b.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    b.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    for(let r=0; r<size; r++) for(let c=0; c<size; c++) {
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
    if(queens.size === size && !errors) { clearInterval(timerInterval); setTimeout(()=>alert("Gefeliciteerd!"), 100); }
}

function startTimer() { 
    if(timerInterval) clearInterval(timerInterval); 
    startTime=Date.now(); 
    timerInterval=setInterval(()=> { 
        const elapsed = Math.floor((Date.now()-startTime)/1000);
        document.getElementById("timer").textContent = new Date(elapsed * 1000).toISOString().substr(14, 5);
    },1000); 
}

document.addEventListener("DOMContentLoaded", initGame);
