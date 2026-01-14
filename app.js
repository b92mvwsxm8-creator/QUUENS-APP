async function getSolutions(board) {
    const N = board.length;
    const solutions = [];
    const colorBoard = board.map(row => [...row]);

    function isSafe(tempBoard, row, col) {
        // 1 & 2. Check kolom (Python: Place Logica)
        for (let i = 0; i < row; i++) {
            if (tempBoard[i][col] === 1) return false;
        }
        // 3 & 4. Check de 4 diagonale hoeken (Python: Corner rules)
        const toCheck = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        for (let [dx, dy] of toCheck) {
            let x = row + dx, y = col + dy;
            if (x >= 0 && x < N && y >= 0 && y < N && tempBoard[x][y] === 1) return false;
        }
        return true;
    }

    async function backtrack(row, tempBoard) {
        if (row === N) {
            const solution = [];
            for (let i = 0; i < N; i++) {
                for (let j = 0; j < N; j++) {
                    if (tempBoard[i][j] === 1) solution.push([i, j]);
                }
            }
            // Check op unieke kleuren (LinkedIn Expert regel)
            const colorSet = new Set(solution.map(([i, j]) => colorBoard[i][j]));
            if (colorSet.size === N) {
                solutions.push(solution);
            }
            return;
        }

        for (let col = 0; col < N; col++) {
            if (isSafe(tempBoard, row, col)) {
                tempBoard[row][col] = 1;
                await backtrack(row + 1, tempBoard);
                if (solutions.length > 1) return; // Stop direct als puzzel niet uniek is
                tempBoard[row][col] = 0;
            }
        }
    }

    const initialBoard = Array.from({ length: N }, () => Array(N).fill(0));
    await backtrack(0, initialBoard);
    return solutions;
}

// Functie om een nieuwe gegarandeerd unieke puzzel te laden
async function loadNewPuzzle() {
    const puzzle = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const solutions = await getSolutions(puzzle.regions);

    if (solutions.length === 1) {
        console.log("Puzzel gevalideerd: Unieke oplossing gevonden.");
        renderBoard(puzzle);
    } else {
        console.error("Fout: Puzzel is niet uniek of onmogelijk. Probeer een andere.");
        // Hier zou je automatisch een volgende SHAPE kunnen proberen
    }
}

// Initialisatie
document.addEventListener('DOMContentLoaded', loadNewPuzzle);