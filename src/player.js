import {getCell, parseCellId} from "./utils.js";
import {PLAYER_START_ROW, PLAYER_START_COL} from "./config.js"

export function spawnPlayer(row = PLAYER_START_ROW, col = PLAYER_START_COL) {
    const newPlayer = document.createElement("div")
    newPlayer.id = "player"
    const cell = getCell(row, col)
    if (cell) {
        cell.appendChild(newPlayer)
    } else {
        console.error(`Spieler konnte nicht gespawnt werden. Zelle ${row}_${col} nicht gefunden`)
    }
}

/**
 * Sucht die Zelle mit Attribut Type="Player"
 * im gesamten Grid
 *
 * @returns {Element} - Das Spieler Element
 */
export function getPlayer() {
    return document.getElementById("player")
}

/**
 * Holt aktuelles Eltern Element vom Spieler und bewegt den Spieler
 * von der aktuellen Zelle in die in (row, col) angegebene Zelle
 * @param row - Ziel Zeile
 * @param col - Ziel Spalte
 */
export function movePlayer(row, col) {
    const player = getPlayer()
    const targetCell = getCell(row, col)

    if(!player) {
        console.error("Spieler nicht gefunden!")
    }

    if (!targetCell) {
        return false
    }

    targetCell.appendChild(player)
    return true
}

export function moveLeft() {
    const player = getPlayer()
    if (!player) {return false}

    const playerCellId = player.parentElement.id
    const { row, col } = parseCellId(playerCellId)

    //console.log("row:" + row + ", col:" + col)

    try { // Wenn links nicht mehr möglich (grid vorbei) konsolen log :)
        movePlayer(row, col - 1)
    } catch (e) {
        console.log("movePlayer failed")
    }
}

export function moveRight() {
    const player = getPlayer()
    if (!player) {return false}

    const playerCellId = player.parentElement.id
    const {row, col} = parseCellId(playerCellId)

    // console.log("row:" + row + ", col:" + col)

    try { // Wenn rechts nicht mehr möglich (grid vorbei) konsolen log :)
        movePlayer(row, col + 1) // + 1 von der aktuellen position
    } catch (e) {
        console.log("movePlayer failed")
    }
}