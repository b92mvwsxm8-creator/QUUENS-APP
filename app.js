const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const puzzleSelect = document.getElementById("puzzleSelect");
const resetBtn = document.getElementById("resetBtn");

let currentPuzzle = null;
let queens = new Set(); // key = "r,c"

function key(r, c) { return `${r},${c}`; }

function parseKey(k) {
  const [r, c] = k.split(",").map(Number);
  return { r, c };
}

function loadPuzzle(index) {
  currentPuzzle = PUZZLES[index];
  queens = new Set();
  render();
  validateAndPaint();
}

function render() {
  const n = currentPuzzle.size;
  boardEl.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
  boardEl.style.gridTemplateRows = `repeat(${n}, 1fr)`;
  boardEl.innerHTML = "";

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cell";
      if ((r + c) % 2 === 1) cell.classList.add("alt");

      cell.dataset.r = String(r);
      cell.dataset.c = String(c);
      cell.dataset.region = currentPuzzle.regions[r][c];

      cell.addEventListener("click", () => toggleQueen(r, c));
      boardEl.appendChild(cell);
    }
  }
  paintQueens();
}

function getCell(r, c) {
  return boardEl.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
}

function paintQueens() {
  const n = currentPuzzle.size;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const cell = getCell(r, c);
      cell.textContent = queens.has(key(r, c)) ? "♛" : "";
      cell.classList.remove("bad", "ok");
    }
  }
}

function toggleQueen(r, c) {
  const k = key(r, c);
  if (queens.has(k)) queens.delete(k);
  else queens.add(k);
  paintQueens();
  validateAndPaint();
}

function validateAndPaint() {
  const n = currentPuzzle.size;

  const conflicts = new Set();
  const byRow = new Map();
  const byCol = new Map();
  const byRegion = new Map();

  for (const q of queens) {
    const { r, c } = parseKey(q);
    const region = currentPuzzle.regions[r][c];

    if (!byRow.has(r)) byRow.set(r, []);
    if (!byCol.has(c)) byCol.set(c, []);
    if (!byRegion.has(region)) byRegion.set(region, []);

    byRow.get(r).push(q);
    byCol.get(c).push(q);
    byRegion.get(region).push(q);
  }

  function markDuplicates(map) {
    for (const arr of map.values()) {
      if (arr.length > 1) arr.forEach(q => conflicts.add(q));
    }
  }

  markDuplicates(byRow);
  markDuplicates(byCol);
  markDuplicates(byRegion);

  const qArr = Array.from(queens).map(parseKey);
  for (let i = 0; i < qArr.length; i++) {
    for (let j = i + 1; j < qArr.length; j++) {
      const a = qArr[i], b = qArr[j];
      const dr = Math.abs(a.r - b.r);
      const dc = Math.abs(a.c - b.c);
      if (dr <= 1 && dc <= 1) {
        conflicts.add(key(a.r, a.c));
        conflicts.add(key(b.r, b.c));
      }
    }
  }

  for (const q of queens) {
    const { r, c } = parseKey(q);
    const cell = getCell(r, c);
    if (conflicts.has(q)) cell.classList.add("bad");
    else cell.classList.add("ok");
  }

  const placed = queens.size;
  const need = n;

  if (conflicts.size > 0) {
    statusEl.textContent = `Er zijn conflicten. Geplaatst: ${placed}/${need}.`;
    return;
  }
  if (placed < need) {
    statusEl.textContent = `Geen conflicten. Geplaatst: ${placed}/${need}.`;
    return;
  }
  if (placed > need) {
    statusEl.textContent = `Te veel koninginnen. Geplaatst: ${placed}/${need}.`;
    return;
  }

  const rowsOk = Array.from(byRow.values()).every(arr => arr.length === 1) && byRow.size === n;
  const colsOk = Array.from(byCol.values()).every(arr => arr.length === 1) && byCol.size === n;

  const regionsSet = new Set();
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) regionsSet.add(currentPuzzle.regions[r][c]);
  const regionCount = regionsSet.size;

  const regionsOk = Array.from(byRegion.values()).every(arr => arr.length === 1) && byRegion.size === regionCount;

  statusEl.textContent = (rowsOk && colsOk && regionsOk) ? "Opgelost." : "Nog niet goed: rij, kolom of regio klopt niet.";
}

function initSelect() {
  puzzleSelect.innerHTML = "";
  PUZZLES.forEach((p, i) => {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = p.name;
    puzzleSelect.appendChild(opt);
  });
  puzzleSelect.addEventListener("change", () => loadPuzzle(Number(puzzleSelect.value)));
}

resetBtn.addEventListener("click", () => loadPuzzle(Number(puzzleSelect.value)));

initSelect();
loadPuzzle(0);

if ("serviceWorker" in navigator && window.isSecureContext) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
