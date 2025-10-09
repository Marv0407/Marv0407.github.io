/**
 * Gibt die Zelle (DOM-Element) an der angegebenen Position zurück
 *
 * @param {number} row - Die Zeile (1-basiert)
 * @param {number} col - Die Spalte (1-basiert)
 * @returns {HTMLElement|null} Das Zell-Element oder null wenn nicht gefunden
 *
 * @example
 * const cell = getCell(5, 8);
 * cell.appendChild(someElement);
 */
export function getCell(row, col) {
    return document.getElementById(row + "_" + col)
}

/**
 * Extrahiert Row und Col aus einer Cell-ID
 *
 * @param {string} cellId - Die Cell-ID im Format "row_col"
 * @returns {{row: number, col: number}} Objekt mit row und col
 *
 * @example
 * const {row, col} = parseCellId("5_8");
 * // row = 5, col = 8
 */
export function parseCellId(cellId) {
    const parts = cellId.split("_");
    return {
        row: parseInt(parts[0]),
        col: parseInt(parts[1])
    };
}

/**
 * Formatiert den Score mit führenden Nullen
 *
 * @param {number} score - Der aktuelle Score
 * @param {number} length - Gewünschte Länge (Standard: 5)
 * @returns {string} Formatierter Score
 *
 * @example
 * formatScore(42); // "00042"
 * formatScore(1337); // "01337"
 */
export function formatScore(score, length = 5) {
    return String(score).padStart(length, "0");
}