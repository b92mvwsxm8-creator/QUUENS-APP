/* Kleuren gebaseerd op jouw 7x7 Expert screenshots */
.cell[data-region="0"] { background-color: #ffff99; } /* Geel */
.cell[data-region="1"] { background-color: #c299ff; } /* Paars */
.cell[data-region="2"] { background-color: #ffb366; } /* Oranje */
.cell[data-region="3"] { background-color: #99ff99; } /* Groen */
.cell[data-region="4"] { background-color: #99ccff; } /* Lichtblauw */
.cell[data-region="5"] { background-color: #e0e0e0; } /* Lichtgrijs */
.cell[data-region="6"] { background-color: #ffcce6; } /* Roze */

/* Queen en Markeringen */
.has-queen::after {
    content: '♛';
    font-size: 2rem;
}

.has-mark::after {
    content: '✕';
    font-size: 1.5rem;
    color: rgba(0,0,0,0.3);
}

.bad {
    background-color: #ff4d4d !important; /* Foutmelding kleur bij conflict */
}