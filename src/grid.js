import { ROWS, COLUMNS, GRID_SIZE} from "./config.js"


/**
 * Initialisiert das Spielfeld-Grid
 * Erstellt alle Zellen und konfiguriert das CSS-Grid
 *
 * @param {string} containerSelector - CSS-Selektor für den Grid-Container
 * @returns {HTMLElement} Der Grid-Container
 *
 * @example
 * initGrid('.grid-container');
 */
export function initGrid(containerSelector = ".grid-container") {
    const gridContainer = document.querySelector(containerSelector)

    if (!gridContainer) {
        console.error(`Grid-Container mit Selektor ${containerSelector} nicht gefunden!`)
        return null
    }

    gridContainer.style.display = "grid"
    gridContainer.style.gridTemplateColumns = `repeat(${COLUMNS}, ${GRID_SIZE}px)`
    gridContainer.style.gridTemplateRows = `repeat(${ROWS}, ${GRID_SIZE}px)`
    gridContainer.style.justifyItems = "center"
    gridContainer.style.alignItems = "center"

    // Zellen erstellen
    createCells(gridContainer)

    return gridContainer
}

/**
 * Erstellt alle Grid-Zellen und fügt sie dem Container hinzu
 *
 * @param {HTMLElement} gridContainer - Der Grid-Container
 */
function createCells(gridContainer) {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
            const cell = createCell(row + 1, col + 1)
            gridContainer.appendChild(cell)
        }
    }
}

/**
 * Erstellt eine einzelne Grid-Zelle
 *
 * @param {number} row - Zeilen-Nummer
 * @param {number} col - Spalten-Nummer
 * @returns {HTMLElement} Die erstellte Zelle
 */
function createCell(row, col) {
    const cell = document.createElement("div")
    cell.className = "cell"
    cell.id = `${row}_${col}`

    cell.style.display = "flex"
    cell.style.justifyContent = "center"
    cell.style.alignItems = "center"

    return cell
}

export function clearGrid() {
    for (let row = 0; row <= ROWS; row++) {
        for (let col = 0; col <= COLUMNS; col++) {
            const cell = document.getElementById(`${row}_${col}`)
            if (cell) {
                cell.innerHTML = ""
            }
        }
    }
}
