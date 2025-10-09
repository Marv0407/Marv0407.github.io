// Game state
import {getAllBullets, shoot, updateBullet} from "./bullet.js";
import {BULLET_UPDATE_INTERVAL, ENEMY_MOVE_INTERVAL, ENEMY_MOVEMENT, LOOSE_ROW} from "./config.js";
import {getLowestEnemyRow, moveEnemyDown, moveEnemySide} from "./enemy.js";
import {formatScore} from "./utils.js";
import {getPlayer, moveLeft, moveRight} from "./player.js";

let gameover = false
let curScore = 0

// ENemy Movement State
let count = 0
let count2 = -3
let maxCount = ENEMY_MOVEMENT.initialMaxCount
let direction = "initial"

// Interval IDs
let updateBulletInterval = null
let enemyMoveInterval = null

export function startGame() {
    gameover = false
    curScore = 0

    startBulletUpdates()
    startEnemyMovement()

}

export function stopGame() {
    gameover = true

    if (updateBulletInterval) {
        clearInterval(updateBulletInterval)
        updateBulletInterval = null
    }

    if (enemyMoveInterval) {
        clearInterval(enemyMoveInterval)
        enemyMoveInterval = null
    }

    console.log("Spiel gestoppt!")
}

function startBulletUpdates() {
    updateBulletInterval = setInterval(function () {
        const bullets = getAllBullets()

        for (let bullet of bullets) {
            const points = updateBullet(bullet)
            if (points > 0) {
                addScore(points)
            }
        }
        updateScoreDisplay()
    }, BULLET_UPDATE_INTERVAL)
}

function startEnemyMovement() {
    enemyMoveInterval = setInterval(function () {
        count++;

        if (count >= maxCount) {
            if (direction === "initial") {
                direction = "left"
                maxCount = ENEMY_MOVEMENT.leftRightMaxCount
                count = ENEMY_MOVEMENT.startCount
            } else if (direction === "left") {
                direction = "right"
                count = 0
            } else if (direction === "right") {
                direction = "left"
                count = 0
            }
        }

        moveEnemySide(direction)
        count2++

        if (count2 >= maxCount) {
            moveEnemyDown()
            checkForLoose()
            count2 = 0
        }
    }, ENEMY_MOVE_INTERVAL)
}

function checkForLoose() {
    const lowestRow = getLowestEnemyRow()

    if (lowestRow && lowestRow >= LOOSE_ROW) {
        console.log("Verloren")
        gameover = true
        stopGame()
        showGameOverPopup()
    }
}

function showGameOverPopup() {
    const popup = document.getElementById("popup")
    if (popup) {
        popup.classList.add("show")
    }
}

function addScore(points) {
    curScore += points
}

function updateScoreDisplay() {
    const scoreElement = document.getElementById("curScore")
    if (scoreElement) {
        scoreElement.innerHTML = formatScore(curScore)
    }
}

export function getScore() {
    return curScore;
}

export function isGameOver() {
    return gameover
}

export function resetGame() {
    stopGame()
    curScore = 0
    count = 0
    count2 = -3
    maxCount = ENEMY_MOVEMENT.initialMaxCount
    direction = "initial"
    updateScoreDisplay()
}

export function handleKeyPress(event) {
    const key = event.key

    switch (key) {
        case "ArrowUp":
            if (!gameover) {
                shoot()
                const player = getPlayer()
                if (!player.classList.contains("shooting") && !gameover) {
                    player.classList.add("shooting");
                    player.style.backgroundImage = `url("./img/player_shoot.png")`

                    setTimeout(() => {
                        player.style.backgroundImage = `url("./img/player.png")`
                        player.classList.remove("shooting")
                    }, 80)
                }
            }
            break
        case "ArrowLeft":
            if (!gameover) {
                moveLeft()
            }
            break
        case "ArrowRight":
            if (!gameover) {
                moveRight()
            }
            break
        default:
            console.log(`${key} ist nicht belegt`)
            break
    }
}

export function initControls() {
    document.addEventListener("keydown", handleKeyPress);
}

export function removeControls() {
    document.removeEventListener("keydown", handleKeyPress);
}