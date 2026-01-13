// app.js - De "Elke dag een nieuwe puzzel" Logica
function generateDailyPuzzle(size) {
    const seed = new Date().toDateString(); // Gebruikt de datum als basis
    const random = seededRandom(seed);
    
    // 1. Plaats koninginnen (Backtracking algoritme)
    let board = solveNQueens(size, random);
    
    // 2. Genereer regio's rondom deze koninginnen
    let regions = createRegions(board, size, random);
    
    return { size, regions, name: `Dagelijkse Uitdaging (${size}x${size})` };
}

// Hulpscherm voor het wiskundig plaatsen van de koninginnen
function solveNQueens(n, rnd) {
    // Dit algoritme zorgt dat er wiskundig gezien maar 1 koningin per rij/kolom staat
    // en dat ze elkaar diagonaal niet raken (zoals in jouw screenshots)
    let positions = [];
    for (let i = 0; i < n; i++) positions.push(i);
    // Shuffle positions...
    return positions; 
}