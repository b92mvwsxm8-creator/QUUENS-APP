// Kleuren exact zoals in jouw Word-document 'queenscodes7x7.docx'
const lightWisteria = "#BBA3E2";
const chardonnay = "#FFC992";
const anakiwa = "#96BEFF";
const celadon = "#B3DFA0";
const altoMain = "#DFDFDF";
const bittersweet = "#FF7B60";
const saharaSand = "#E6F388";
const lightOrchid = "#DFA0BF";
const macNCheese = "#FFBD88";
const coldPurple = "#ABAAD4";
const halfBaked = "#95CBCF";
const malibu = "#7EC8FF";
const nomad = "#B9B29E";
const manz = "#E6F388";
const lavenderRose = "#FE93F1";
const turquoiseBlue = "#55EBE2";
const tallow = "#A8A011";

const QUEENS_LEVELS = [
    { id: 101, colorRegions: [["E","E","E","E","E","E","F"],["D","D","D","D","D","E","F"],["D","D","D","D","D","E","F"],["E","E","E","E","G","G","F"],["C","C","C","C","G","G","F"],["A","B","B","C","G","G","F"],["A","A","B","C","G","G","F"]], regionColors: { A: lightWisteria, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 102, colorRegions: [["A","A","A","A","A","B","B"],["A","C","A","A","A","B","B"],["A","C","C","C","C","C","C"],["A","C","E","E","D","D","D"],["A","C","E","G","D","F","F"],["A","A","E","G","D","G","F"],["A","A","E","G","G","G","F"]], regionColors: { A: lightOrchid, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 119, colorRegions: [["E","E","B","D","D","D","D"],["B","B","B","D","F","G","G"],["B","B","B","D","F","G","G"],["B","B","B","D","F","G","G"],["C","F","F","F","F","F","G"],["A","A","A","A","A","F","F"],["F","F","F","F","F","F","F"]], regionColors: { A: lightWisteria, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 148, colorRegions: [["F","F","F","F","F","D","D"],["F","F","E","F","D","D","D"],["F","F","E","E","D","G","G"],["B","B","B","E","D","G","G"],["B","A","B","E","G","G","G"],["C","A","E","E","G","G","G"],["C","A","A","A","G","G","G"]], regionColors: { A: lightWisteria, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 150, colorRegions: [["A","A","C","C","A","A","F"],["A","D","D","C","A","F","F"],["A","D","C","C","A","A","F"],["G","A","C","A","A","A","A"],["G","A","C","E","E","B","B"],["G","A","A","A","E","A","B"],["G","G","G","A","A","A","A"]], regionColors: { A: macNCheese, B: saharaSand, C: coldPurple, D: halfBaked, E: malibu, F: celadon, G: bittersweet } },
    { id: 151, colorRegions: [["D","E","E","E","F","F","A"],["D","D","D","E","E","F","A"],["D","D","G","G","G","F","F"],["C","D","D","D","G","B","F"],["C","C","D","D","G","B","F"],["C","D","D","B","B","B","B"],["C","D","B","B","B","B","B"]], regionColors: { A: lightWisteria, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 158, colorRegions: [["E","D","C","G","A","F","B"],["C","F","E","B","D","G","A"],["D","G","A","E","C","B","E"],["C","B","C","D","F","A","G"],["G","A","F","E","B","C","D"],["B","C","D","A","F","E","F"],["A","E","B","F","G","D","C"]], regionColors: { A: nomad, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 160, colorRegions: [["D","D","D","D","D","D","D"],["E","E","F","D","D","D","D"],["E","F","F","C","C","C","D"],["E","F","F","C","C","C","C"],["E","F","A","A","A","C","C"],["G","F","A","A","B","A","C"],["G","B","B","B","B","A","C"]], regionColors: { A: lightWisteria, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 166, colorRegions: [["E","C","C","B","B","B","B"],["A","A","C","C","B","D","B"],["A","A","A","C","C","D","B"],["F","A","A","A","C","D","B"],["F","F","A","A","D","D","B"],["F","D","D","D","D","G","G"],["F","F","F","F","F","G","G"]], regionColors: { A: lightWisteria, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 169, colorRegions: [["D","D","D","D","D","D","G"],["A","A","D","C","G","G","G"],["G","B","B","C","C","G","G"],["G","G","G","C","C","G","G"],["E","E","G","F","F","G","G"],["E","E","F","F","F","G","G"],["G","G","G","G","G","G","G"]], regionColors: { A: lightWisteria, B: chardonnay, C: anakiwa, D: celadon, E: lavenderRose, F: bittersweet, G: manz } },
    { id: 175, colorRegions: [["A","C","C","C","C","C","C"],["A","A","D","D","G","G","G"],["A","A","A","D","G","G","G"],["A","A","A","D","E","G","G"],["A","A","A","D","F","F","F"],["A","A","D","D","F","B","F"],["A","B","B","B","B","B","B"]], regionColors: { A: lightWisteria, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 177, colorRegions: [["A","A","B","B","F","F","G"],["A","A","A","B","F","F","E"],["C","B","B","B","F","E","E"],["C","C","C","C","F","E","D"],["C","D","D","C","F","E","D"],["C","D","D","C","F","E","D"],["D","D","D","D","D","D","D"]], regionColors: { A: lightWisteria, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 179, colorRegions: [["A","C","C","F","D","D","A"],["B","B","C","F","D","B","B"],["B","B","F","F","F","B","B"],["F","F","F","A","F","F","F"],["E","E","F","F","F","G","G"],["E","E","E","G","G","G","G"],["A","E","E","G","G","G","G"]], regionColors: { A: lightWisteria, B: turquoiseBlue, C: lightOrchid, D: tallow, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 183, colorRegions: [["D","D","C","G","G","B","B"],["D","D","C","C","G","B","B"],["A","E","E","C","G","G","B"],["A","E","E","C","C","G","B"],["A","A","F","F","C","G","B"],["A","C","F","F","C","G","B"],["A","C","C","C","C","B","B"]], regionColors: { A: lightWisteria, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 186, colorRegions: [["F","F","F","F","F","F","F"],["G","G","G","G","G","G","F"],["G","G","G","G","C","G","F"],["A","A","A","A","C","G","F"],["B","B","B","A","C","D","D"],["B","C","C","C","C","D","E"],["B","B","B","B","C","D","E"]], regionColors: { A: lightWisteria, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 196, colorRegions: [["A","A","B","B","B","C","C"],["A","A","A","B","B","C","C"],["D","D","A","D","D","E","C"],["D","D","D","D","D","E","E"],["F","D","D","D","G","G","E"],["F","D","D","D","D","G","E"],["F","F","F","D","D","G","G"]], regionColors: { A: lightWisteria, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } },
    { id: 211, colorRegions: [["A","D","D","D","D","D","E"],["A","G","G","G","G","E","E"],["A","G","C","C","G","E","E"],["A","C","C","F","F","E","E"],["A","B","B","B","F","E","E"],["A","B","F","F","F","E","E"],["A","A","A","A","A","A","A"]], regionColors: { A: lightWisteria, B: chardonnay, C: anakiwa, D: celadon, E: altoMain, F: bittersweet, G: saharaSand } }
];