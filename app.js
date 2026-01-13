let currentPuzzle, queens = new Set(), marks = new Set(), timerInterval, startTime, currentDiff;

// Studie-gebaseerde patronen (Siktar patterns)
const PATTERNS = [
    { name: "Snake", cells: [[1,1],[1,2],[2,2],[2,3],[3,3],[3,4]] },
    { name: "Diamond", cells: [[2,3],[3,2],[3,4],[4,3],[3,3]] },
    { name: "Tromino", cells: [[0,0],[0,1],[1,0]] },
    { name: "Corridor", cells: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5]] }
];

function generate7x7(diff) {
    currentDiff = diff;
    const size = 7;
    let regions = Array.from({length:size}, () => Array(size).fill(null));
    
    // Bij Expert dwingen we een Siktar-patroon af
    if(diff === 'hard' || diff === 'medium') {
        const p = PATTERNS[Math.floor(Math.random()*PATTERNS.length)];
        p.cells.forEach(([r,c]) => regions[r][c] = 'A');
    }

    // Plaats zaden voor overige kleuren
    for(let i=0; i<7; i++) {
        let r, c;
        let char = String.fromCharCode(65+i);
        if (regions.flat().includes(char)) continue; 
        do { r=Math.floor(Math.random()*7); c=Math.floor(Math.random()*7); } while(regions[r][c]);
        regions[r][c] = char;
    }

    // Groei-logica (bias 0.1 voor Simpel = kleine hokjes, 0.8 voor Expert = grote Siktar vormen)
    const bias = diff === 'easy' ? 0.1 : 0.75;
    while(regions.flat().includes(null)) {
        for(let r=0; r<7; r++) {
            for(let c=0; c<7; c++) {
                if(!regions[r][c]) {
                    const nb = [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].filter(([y,x]) => y>=0 && y<7 && x>=0 && x<7 && regions[y][x]);
                    if(nb.length > 0 && Math.random() < bias) {
                        const [nr,nc] = nb[Math.floor(Math.random()*nb.length)];
                        regions[r][c] = regions[nr][nc];
                    }
                }
            }
        }
    }
    return {regions};
}

function updateUI() {
    const q = Array.from(queens).map(k => k.split(',').map(Number));
    let errors = false;
    document.querySelectorAll(".cell").forEach((cell, i) => {
        const r=Math.floor(i/7), c=i%7, k=`${r},${c}`;
        cell.classList.remove("has-queen","has-mark","bad");
        if(queens.has(k)) {
            cell.classList.add("has-queen");
            const conflict = q.some(([qr,qc]) => (qr===r && qc===c) ? false : (qr===r || qc===c || currentPuzzle.regions[qr][qc]===currentPuzzle.regions[r][c] || (Math.abs(qr-r)<=1 && Math.abs(qc-c)<=1)));
            if(conflict) { cell.classList.add("bad"); errors = true; }
        } else if(marks.has(k)) cell.classList.add("has-mark");
    });
    if(queens.size === 7 && !errors) { clearInterval(timerInterval); setTimeout(()=>alert("Opgelost!"), 100); }
}

function render() {
    const b = document.getElementById("board"); b.innerHTML = "";
    for(let r=0; r<7; r++) for(let c=0; c<7; c++) {
        const cl = document.createElement("div"); cl.className = "cell"; 
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

function initGame(s, d) { currentPuzzle = generate7x7(d); queens.clear(); marks.clear(); render(); startTimer(); displayBest(); }
function startTimer() { if(timerInterval) clearInterval(timerInterval); startTime=Date.now(); timerInterval=setInterval(()=> { document.getElementById("timer").textContent=new Date(Date.now()-startTime).toISOString().substr(14,5); },1000); }
function displayBest() { const b=localStorage.getItem(`best_${currentDiff}`); document.getElementById("best-time").textContent=b?new Date(b*1000).toISOString().substr(14,5):"--:--"; }
function shuffle(a) { for(let i=a.length-1; i>0; i--) { const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } }
document.addEventListener("DOMContentLoaded", () => initGame(7, 'hard'));
