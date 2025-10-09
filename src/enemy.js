import { getCell, parseCellId } from './utils.js';
import {COLUMNS, ENEMY_POINTS, ENEMY_SPAWN_MARGIN} from './config.js';

export function spawnEnemy(rows, type) {
    if(!ENEMY_POINTS[type]) {
        console.error(`Unbekannter Gegnertyp: ${type}`)
        return
    }

    for (let i = 1; i < rows + 1; i++) {
        for (let j = 1; j < COLUMNS + 1; j++) {
            if (j > ENEMY_SPAWN_MARGIN.left && j < COLUMNS - ENEMY_SPAWN_MARGIN.right) {
                createEnemy(i, j, type)
            }
        }
    }

}

function createEnemy(row, col, type) {
    const newEnemy = document.createElement("div")
    newEnemy.id = "enemy"
    newEnemy.className = "enemy_" + type
    newEnemy.setAttribute("type", type)

    const cell = getCell(row, col)
    if (cell) {
        cell.appendChild(newEnemy)
    }
}

export function moveEnemyDown() {
    const enemies = document.querySelectorAll("#enemy")


    const movements = []


    for (let enemy of enemies) {
        const {row, col} = parseCellId(enemy.parentElement.id)
        const targetCell = getCell(row + 1, col)

        if (targetCell) {
            movements.push({enemy, targetCell})
        }
    }
    movements.forEach(({enemy, targetCell}) => {
        targetCell.appendChild(enemy)
    })

}

let direction = "initial"

export function moveEnemySide(direction) {
    const enemies = document.querySelectorAll("#enemy")
    const movements = []

    for (let enemy of enemies) {
        const {row , col} = parseCellId(enemy.parentElement.id)

        let targetCell
        if (direction === "left") {
            targetCell = getCell(row, col -1)
        } else if ( direction === "right" ) {
            targetCell = getCell(row, col + 1)
        }

        if (targetCell) {
            movements.push({enemy, targetCell})
        }

    }

    movements.forEach(({enemy, targetCell}) => {
        targetCell.appendChild(enemy)
    })
    /*
    switch (direction) {

        case "left":
            for (let enemy of enemies) {
                let enemyParId = enemy.parentElement.id
                let row = parseInt(enemyParId.split("_")[0])
                let col = parseInt(enemyParId.split("_")[1])

                const targetCell = getCell(row, col - 1)

                if (targetCell) {
                    targetCell.appendChild(enemy)
                }
            }
            break

        case "right":
            for (let enemy of enemies) {
                let enemyParId = enemy.parentElement.id
                let row = parseInt(enemyParId.split("_")[0])
                let col = parseInt(enemyParId.split("_")[1])

                const targetCell = getCell(row, col + 1)

                if (targetCell) {
                    targetCell.appendChild(enemy)
                }
            }
            break
    }

     */
}

export function getAllEnemies() {
    return document.querySelectorAll("#enemy")
}

export function removeEnemy(enemy) {
    if (enemy && enemy.parentNode) {
        enemy.parentNode.removeChild(enemy)
    }
}

export function getLowestEnemyRow() {
    const enemies = getAllEnemies()
    let lowestRow = 0

    for (let enemy of enemies) {
        const { row } = parseCellId(enemy.parentElement.id)
        if (row > lowestRow) {
            lowestRow = row
        }
    }

    return lowestRow > 0 ? lowestRow : null
}

export function getEnemyPoints(type) {
    return ENEMY_POINTS[type] || 0;
}