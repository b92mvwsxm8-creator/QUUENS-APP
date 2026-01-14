let currentPuzzle, queens = new Set(), marks = new Set(), timerInterval, startTime;

function initGame() {
    try {
        const sizeSelect = document.getElementById('gridSize');
        const size = parseInt(sizeSelect.value);
        
        // Filter alle beschikbare puzzels van deze maat
        const availablePuzzles = SHAPES.filter(s => s.size === size);
        
        if (availablePuzzles.length > 0) {
            // Kies een willekeurige variatie uit de lijst
            currentPuzzle = availablePuzzles[Math.floor(Math.random() * availablePuzzles.length)];
        } else {
            console.error("Geen puzzels gevonden voor maat:", size);
            return;
        }

        queens.clear();
        marks.clear();
        render();
        startTimer();
    } catch (e) {
        console.error("Fout bij opstarten:", e);
    }
}

function render() {
    const b = document.getElementById("board");
    const size = currentPuzzle.size;
    b.innerHTML = "";
    b.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    b.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    
    for(let r=0; r<size; r++) {
        for(let c=0; c<size; c++) {
            const cl = document.createElement("div");
            cl.className = "cell"; 
            cl.dataset.region = currentPuzzle.regions[r][c];
            cl.dataset.row = r;
            cl.dataset.col = c;
            cl.onclick = () => handleCellClick(r, c);
            b.appendChild(cl);
        }
    }
}

function handleCellClick(r, c) {
    const k = `${r},${c}`;
    if(!marks.has(k) && !queens.has(k)) { 
        marks.add(k); 
    } else if(marks.has(k)) { 
        marks.delete(k); 
        queens.add(k); 
    } else { 
        queens.delete(k); 
    }
    updateUI();
}

function updateUI() {
    const size = currentPuzzle.size;
    const qArr = Array.from(queens).map(k => k.split(',').map(Number));
    let errors = false;
    
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
        const r = parseInt(cell.dataset.row);
        const c = parseInt(cell.dataset.col);
        const k = `${r},${c}`;
        
        cell.classList.remove("has-queen","has-mark","bad");
        
        if(queens.has(k)) {
            cell.classList.add("has-queen");
            const conflict = qArr.some(([qr,qc]) => {
                if(qr===r && qc===c) return false;
                return (qr===r || qc===c || 
                        currentPuzzle.regions[qr][qc] === currentPuzzle.regions[r][c] || 
                        (Math.abs(qr-r)<=1 && Math.abs(qc-c)<=1));
            });
            if(conflict) { cell.classList.add("bad"); errors = true; }
        } else if(marks.has(k)) {
            cell.classList.add("has-mark");
        }
    });
    
    if(queens.size === size && !errors) {
        clearInterval(timerInterval);
        setTimeout(() => alert("Gefeliciteerd! Je hebt deze variatie opgelost."), 100);
    }
}

function startTimer() { 
    if(timerInterval) clearInterval(timerInterval); 
    startTime = Date.now(); 
    timerInterval = setInterval(() => { 
        const elapsed = Math.floor((Date.now()-startTime)/1000);
        const min = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const sec = (elapsed % 60).toString().padStart(2, '0');
        document.getElementById("timer").textContent = `${min}:${sec}`;
    }, 1000); 
}

document.addEventListener("DOMContentLoaded", initGame);