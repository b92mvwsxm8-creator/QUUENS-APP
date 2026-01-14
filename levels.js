const lightWisteria = "#BBA3E2";
const chardonnay = "#FFC992";
const anakiwa = "#96BEFF";
const celadon = "#B3DFA0";
const altoMain = "#DFDFDF";
const bittersweet = "#FF7B60";
const saharaSand = "#E6F388";
const lightOrchid = "#DFA0BF";
const nomad = "#B9B29E";
const lavenderRose = "#FE93F1";
const turquoiseBlue = "#55EBE2";
const tallow = "#A8A011";

const QUEENS_LEVELS = [
    { id: 102, colorRegions: [["A","A","A","A","A","B","B"],["A","C","A","A","A","B","B"],["A","C","C","C","C","C","C"],["A","C","E","E","D","D","D"],["A","C","E","G","D","F","F"],["A","A","E","G","D","G","F"],["A","A","E","G","G","G","F"]], regionColors: { A: lightOrchid, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 119, colorRegions: [["E","E","B","D","D","D","D"],["B","B","B","D","F","G","G"],["B","B","B","D","F","G","G"],["B","B","B","D","F","G","G"],["C","F","F","F","F","F","G"],["A","A","A","A","A","F","F"],["F","F","F","F","F","F","F"]], regionColors: { A: lightWisteria, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 148, colorRegions: [["F","F","F","F","F","D","D"],["F","F","E","F","D","D","D"],["F","F","E","E","D","G","G"],["B","B","B","E","D","G","G"],["B","A","B","E","G","G","G"],["C","A","E","E","G","G","G"],["C","A","A","A","G","G","G"]], regionColors: { A: lightWisteria, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 160, colorRegions: [["D","D","D","D","D","D","D"],["E","E","F","D","D","D","D"],["E","F","F","C","C","C","D"],["E","F","F","C","C","C","C"],["E","F","A","A","A","C","C"],["G","F","A","A","B","A","C"],["G","B","B","B","B","A","C"]], regionColors: { A: lightWisteria, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 166, colorRegions: [["E","C","C","B","B","B","B"],["A","A","C","C","B","D","B"],["A","A","A","C","C","D","B"],["F","A","A","A","C","D","B"],["F","F","A","A","D","D","B"],["F","D","D","D","D","G","G"],["F","F","F","F","F","G","G"]], regionColors: { A: lightWisteria, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 175, colorRegions: [["A","C","C","C","C","C","C"],["A","A","D","D","G","G","G"],["A","A","A","D","G","G","G"],["A","A","A","D","E","G","G"],["A","A","A","D","F","F","F"],["A","A","D","D","F","B","F"],["A","B","B","B","B","B","B"]], regionColors: { A: lightWisteria, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 177, colorRegions: [["A","A","B","B","F","F","G"],["A","A","A","B","F","F","E"],["C","B","B","B","F","E","E"],["C","C","C","C","F","E","D"],["C","D","D","C","F","E","D"],["C","D","D","C","F","E","D"],["D","D","D","D","D","D","D"]], regionColors: { A: lightWisteria, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 183, colorRegions: [["D","D","C","G","G","B","B"],["D","D","C","C","G","B","B"],["A","E","E","C","G","G","B"],["A","E","E","C","C","G","B"],["A","A","F","F","C","G","B"],["A","C","F","F","C","G","B"],["A","C","C","C","C","B","B"]], regionColors: { A: lightWisteria, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 186, colorRegions: [["F","F","F","F","F","F","F"],["G","G","G","G","G","G","F"],["G","G","G","G","C","G","F"],["A","A","A","A","C","G","F"],["B","B","B","A","C","D","D"],["B","C","C","C","C","D","E"],["B","B","B","B","C","D","E"]], regionColors: { A: lightWisteria, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 196, colorRegions: [["A","A","B","B","B","C","C"],["A","A","A","B","B","C","C"],["D","D","A","D","D","E","C"],["D","D","D","D","D","E","E"],["F","D","D","D","G","G","E"],["F","D","D","D","D","G","E"],["F","F","F","D","D","G","G"]], regionColors: { A: lightWisteria, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 211, colorRegions: [["A","G","G","G","G","G","E"],["A","B","B","B","B","E","E"],["A","B","C","C","B","E","E"],["A","C","C","F","F","E","E"],["A","D","D","D","F","E","E"],["A","D","F","F","F","E","E"],["A","A","A","A","A","A","A"]], regionColors: { A: lightWisteria, B: saharaSand, C: anakiwa, D: chardonnay, E: altoMain, F: bittersweet, G: celadon } }
];