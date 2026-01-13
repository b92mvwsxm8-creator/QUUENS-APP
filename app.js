// ====== STATE ======
let currentPuzzle = null;
let queens = new Set();
let marks = new Set();

// ====== HELPERS ======
function key(r, c) {
  return `${r},${c}`;
}

function getCell(r, c) {
  return document.querySelector(
    `.cell[data-row="${r}"][data-col="${c}"]`
  );
}

// ====== RENDER ======
function render() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${currentPuzzle.size}, 1fr)`;

  for (let r = 0; r < currentPuzzle.size; r++) {
    for (let c = 0; c < currentPuzzle.size; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.dataset.region = currentPuzzle.regions[r][c];

      cell.addEventListener("click", () => toggleCell(r, c));
      board.appendChild(cell);
    }
  }

  paint();
}

// ====== INTERACTIE ======
function toggleCell(r, c) {
  const k = key(r, c);

  if (marks.has(k)) {
    // kruisje → queen
    marks.delete(k);
    queens.add(k);
  } else if (queens.has(k)) {
    // queen → leeg
    queens.delete(k);
  } else {
    // leeg → kruisje
    marks.add(k);
  }

  paint();
  validate();
}

// ====== TEKENEN ======
function paint() {
  for (let r = 0; r < currentPuzzle.size; r++) {
    for (let c = 0; c < currentPuzzle.size; c++) {
      const cell = getCell(r, c);
      const k = key(r, c);

      cell.classList.remove(
        "has-queen",
        "has-mark",
        "bad",
        "ok"
      );
      cell.textContent = "";

      if (marks.has(k)) {
        cell.classList.add("has-mark");
        cell.textContent = "×";
      } else if (queens.has(k)) {
        cell.classList.add("has-queen");
        cell.textContent = "♛";
      }
    }
  }
}

// ====== VALIDATIE ======
function validate() {
  const n = currentPuzzle.size;

  // reset
  document.querySelectorAll(".cell").forEach(c =>
    c.classList.remove("bad", "ok")
  );

  let conflicts = new Set();

  const q = [...queens].map(k =>
    k.split(",").map(Number)
  );

  for (let i = 0; i < q.length; i++) {
    for (let j = i + 1; j < q.length; j++) {
      const [r1, c1] = q[i];
      const [r2, c2] = q[j];

      if (
        r1 === r2 ||
        c1 === c2 ||
        Math.abs(r1 - r2) === Math.abs(c1 - c2)
      ) {
        conflicts.add(key(r1, c1));
        conflicts.add(key(r2, c2));
      }
    }
  }

  // regio-conflict
  const regions = {};
  q.forEach(([r, c]) => {
    const reg = currentPuzzle.regions[r][c];
    regions[reg] = regions[reg] || [];
    regions[reg].push([r, c]);
  });

  Object.values(regions).forEach(list => {
    if (list.length > 1) {
      list.forEach(([r, c]) =>
        conflicts.add(key(r, c))
      );
    }
  });

  conflicts.forEach(k => {
    const [r, c] = k.split(",").map(Number);
    getCell(r, c).classList.add("bad");
  });

  if (queens.size === n && conflicts.size === 0) {
    queens.forEach(k => {
      const [r, c] = k.split(",").map(Number);
      getCell(r, c).classList.add("ok");
    });
  }
}

// ====== LOAD / RESET ======
function loadPuzzle(index) {
  currentPuzzle = PUZZLES[index];
  queens = new Set();
  marks = new Set();
  render();
  validate();
}

// ====== INIT ======
document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("puzzleSelect");
  PUZZLES.forEach((p, i) => {
    const o = document.createElement("option");
    o.value = i;
    o.textContent = p.label;
    select.appendChild(o);
  });

  select.addEventListener("change", e =>
    loadPuzzle(e.target.value)
  );

  document.getElementById("resetBtn")
    .addEventListener("click", () =>
      loadPuzzle(select.value)
    );

  loadPuzzle(0);
});