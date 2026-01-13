let currentPuzzle = null;
let queens = new Set();
let marks = new Set();
let startTime;
let timerInterval;

function key(r, c) { return `${r},${c}`; }

function startTimer() {
  clearInterval(timerInterval);
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const secs = String(elapsed % 60).padStart(2, '0');
    document.getElementById("timer").textContent = `${mins}:${secs}`;
  }, 1000);
}

function loadPuzzle(index) {
  currentPuzzle = PUZZLES[index];
  queens = new Set();
  marks = new Set();
  document.getElementById("status").textContent = "";
  render();
  startTimer();
}

function render() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${currentPuzzle.size}, 1fr)`;

  for (let r = 0; r < currentPuzzle.size; r++) {
    for (let c = 0; c < currentPuzzle.size; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.region = currentPuzzle.regions[r][c];
      cell.onclick = () => {
        const k = key(r, c);
        if (marks.has(k)) { marks.delete(k); queens.add(k); }
        else if (queens.has(k)) { queens.delete(k); }
        else { marks.add(k); }
        update();
      };
      board.appendChild(cell);
    }
  }
}

function update() {
  const cells = document.querySelectorAll(".cell");
  const conflicts = new Set();
  const qArr = Array.from(queens).map(k => k.split(',').map(Number));

  qArr.forEach(([r1, c1], i) => {
    qArr.forEach(([r2, c2], j) => {
      if (i === j) return;
      const sameRegion = currentPuzzle.regions[r1][c1] === currentPuzzle.regions[r2][c2];
      const touching = Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1;
      if (r1 === r2 || c1 === c2 || sameRegion || touching) conflicts.add(key(r1, c1));
    });
  });

  let idx = 0;
  for (let r = 0; r < currentPuzzle.size; r++) {
    for (let c = 0; c < currentPuzzle.size; c++) {
      const cell = cells[idx++];
      const k = key(r, c);
      cell.classList.remove("has-queen", "has-mark", "bad");
      if (queens.has(k)) {
        cell.classList.add("has-queen");
        if (conflicts.has(k)) cell.classList.add("bad");
      } else if (marks.has(k)) {
        cell.classList.add("has-mark");
      }
    }
  }

  if (queens.size === currentPuzzle.size && conflicts.size === 0) {
    clearInterval(timerInterval);
    document.getElementById("status").textContent = "Opgelost!";
    document.getElementById("status").classList.add("won");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("puzzleSelect");
  PUZZLES.forEach((p, i) => {
    const o = document.createElement("option");
    o.value = i;
    o.textContent = p.name || p.label;
    select.appendChild(o);
  });
  select.onchange = (e) => loadPuzzle(e.target.value);
  document.getElementById("resetBtn").onclick = () => loadPuzzle(select.value);
  loadPuzzle(0);
});