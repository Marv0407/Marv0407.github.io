import { getCell, parseCellId } from './utils.js'
import { getPlayer } from './player.js'
import { getEnemyPoints } from './enemy.js'
import {ENEMY_POINTS} from "./config.js";

let bulletCount = 0;

export function shoot() {
    const player = getPlayer()
    if (!player) {
        console.error("Spieler nicht gefunden!")
        return null
    }

    const playerCellId = getPlayer().parentElement.id
    const {row , col} = parseCellId(playerCellId)

    console.log("Pew")

    const newBullet = document.createElement("div")
    newBullet.id = `bullet_${bulletCount}`
    newBullet.className = "bullet"

    const targetCell = getCell(row - 1, col)
    if (targetCell) {
        targetCell.appendChild(newBullet)
        bulletCount ++
        return newBullet
    }
    return null
}

export function updateBullet(bullet) {
    if (!bullet||!bullet.parentElement) {
        return 0
    }

    const bulletCellId = bullet.parentElement.id
    const {row,col} = parseCellId(bulletCellId)

    const targetCell = getCell(row - 1, col)

    if (targetCell) {
        targetCell.appendChild(bullet)


        if (targetCell.children.length > 1) {
            if (targetCell.children[0].id == "enemy") {

                const enemy = targetCell.children[0]
                const enemyType = enemy.getAttribute("type")
                const points = getEnemyPoints(enemyType)

                console.log(`Treffer ${enemyType}`)

                targetCell.innerHTML = "" // löscht alle Kinder in der Cell(Gegner und Bullet)

                return points
            }
        }
    } else {
        // Bullet ist ausserhalb des Grids
        bullet.parentNode.removeChild(bullet)
    }
}

export function getAllBullets() {
    return document.querySelectorAll(".bullet")
}

export function removeBullet(bullet) {
    if (bullet && bullet.parentNode) {
        bullet.parentNode.removeChild(bullet)
    }
}

export function resetBulletCount() {
    bulletCount = 0
}