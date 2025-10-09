import {getAllBullets, resetBulletCount, shoot, updateBullet} from "./bullet.js";
import {BULLET_UPDATE_INTERVAL, ENEMY_MOVEMENT, LOOSE_ROW, PLAYER_LIVES, WAVES} from "./config.js";
import {
    enemyShoot,
    getAllEnemies,
    getAllEnemyBullets,
    getLowestEnemyRow,
    moveEnemyDown,
    moveEnemySide,
    spawnEnemy,
    updateEnemyBullet
} from "./enemy.js";
import {formatScore} from "./utils.js";
import {getPlayer, moveLeft, moveRight, spawnPlayer} from "./player.js";
import {clearGrid} from "./grid.js";

// Game state
let gameover = false
let curScore = 0
let curLives = PLAYER_LIVES;
let curWave = 0
let isSpawningWave = false;

// ENemy Movement State
let count = 0
let count2 = -3
let maxCount = ENEMY_MOVEMENT.initialMaxCount
let direction = "initial"
let currentEnemySpeed = 1000
let currentEnemyShootChance = 0.001

// Interval IDs
let updateBulletInterval = null
let enemyMoveInterval = null
let enemyShootInterval = null

export function startGame() {
    gameover = false
    curScore = 0
    curLives = PLAYER_LIVES;
    curWave = 0

    updateLivesDisplay()
    startNextWave()
    startBulletUpdates()
   // startEnemyMovement()
    startEnemyShooting()

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

    if(enemyShootInterval) {
        clearInterval(enemyShootInterval)
        enemyShootInterval = null
    }

    console.log("Spiel gestoppt!")
}
function startNextWave() {
    // bugfix für wavespam bei leerem grid
    if(isSpawningWave) return
    isSpawningWave = true


    // stoppt die aktuelle welle
    if (enemyMoveInterval) {
        clearInterval(enemyMoveInterval)
    }

    // enemeMovement reset
    count = 0
    count2 = -3
    maxCount = ENEMY_MOVEMENT.initialMaxCount
    direction = "initial"

    // wellen konfig holen
    const waveConfig = WAVES[Math.min(curWave, WAVES.length - 1)]
    if(!waveConfig) {
        console.error("Wellen Konfig nicht gefunden für Welle:", curWave)
        isSpawningWave = false
        return
    }

    currentEnemySpeed = waveConfig.enemySpeed
    currentEnemyShootChance = waveConfig.enemyShootChance

    //gegner spawnen

    waveConfig.enemies.forEach(enemyGroup => {
        spawnEnemy(enemyGroup.rows, enemyGroup.type)
        for (let i = 0; i < enemyGroup.rows; i++) {
            moveEnemyDown()
        }
    })

    console.log(`Welle ${curWave + 1} gestartet`)

    //enemymovement intervall mit neuer geschwindigkeit starten

    startEnemyMovement()


    isSpawningWave = false
}


function startBulletUpdates() {
    updateBulletInterval = setInterval(function () {

        //spieler bullets
        const bullets = getAllBullets()

        for (let bullet of bullets) {
            const points = updateBullet(bullet)
            if (points > 0) {
                addScore(points)
            }
        }

        //gegner bullets
        const enemyBullets = getAllEnemyBullets()
        for (let bullet of enemyBullets) {
            const hitPlayer = updateEnemyBullet(bullet)
            if (hitPlayer) {
                loseLife()
            }
        }


        updateScoreDisplay()
        checkWaveComplete()
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
    }, currentEnemySpeed)
}

function startEnemyShooting() {
    enemyShootInterval = setInterval(function () {
        const enemies = getAllEnemies()
        if(enemies.length === 0) return

        // jeder gegner hat eine chance zu schießen
        if (Math.random() < currentEnemyShootChance + enemies.length) {
            enemyShoot()
        }
    }, 500)
}

function checkWaveComplete() {
    if(isSpawningWave || gameover) return

    const enemies = getAllEnemies()
    if (enemies.length === 0) {
        curWave++
        isSpawningWave = true
        console.log("Welle abgeschlossen")
        setTimeout(() => {
            startNextWave()
        }, 2000)
    }
}

function checkForLoose() {
    const lowestRow = getLowestEnemyRow()

    if (lowestRow && lowestRow >= LOOSE_ROW) {
        console.log("Gegner haben die Erde erreicht")
        endGame()
    }
}

function loseLife() {
    curLives--
    updateLivesDisplay()

    console.log(`leben Verloren, verbleibende Leben:${curLives}`)

    if(curLives <= 0) {
        endGame()
    } else {
        isSpawningWave = true
        // Stoppe alle Intervals während Respawn
        if (updateBulletInterval) {
            clearInterval(updateBulletInterval)
            updateBulletInterval = null
        }
        if (enemyMoveInterval) {
            clearInterval(enemyMoveInterval)
            enemyMoveInterval = null
        }
        if (enemyShootInterval) {
            clearInterval(enemyShootInterval)
            enemyShootInterval = null
        }

        // Grid clearen und Spieler respawnen
        clearGrid()
        spawnPlayer()

        // Welle zurücksetzen (nicht decrementieren wenn Wave 0)
        if (curWave > 0) {
            curWave--
        }

        // Neustart mit kleiner Verzögerung
        setTimeout(() => {
            startBulletUpdates()
            startEnemyShooting()
            startNextWave()
        }, 1000)
    }
}

function endGame() {
    console.log("verloren")
    gameover = true
    stopGame()
    showGameOverPopup()
}

function showGameOverPopup() {
    const popup = document.getElementById("popup")
    if (popup) {
        popup.classList.add("show")

        const gameOverText = popup.querySelector("span")
        if (gameOverText) {
            gameOverText.innerHTML = `GAME OVER<br>SCORE: ${formatScore(curScore)}`
        }

        /*
        const input = popup.querySelector("input")
        const buttons = popup.querySelectorAll("button")

        if (input) input.disabled = false
        buttons.forEach(btn => btn.disabled = false)

         */


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

function updateLivesDisplay() {
    const livesElement = document.querySelector(".score span:last-child")
    if (livesElement) {
        livesElement.innerHTML = "♥".repeat(curLives)
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
    clearGrid()
    resetBulletCount()

    curScore = 0
    curLives = PLAYER_LIVES
    curWave = 0
    count = 0
    count2 = -3
    maxCount = ENEMY_MOVEMENT.initialMaxCount
    direction = "initial"
    isSpawningWave = false

    updateScoreDisplay()
    updateLivesDisplay()

    // popup verstecken
    const popup = document.getElementById("popup")
    if (popup) {
        popup.classList.remove("show")
    }

    // respawn
    spawnPlayer()

    startGame()
}

//HIGHSCORE HANDLING

export function saveHighscore(username) {
    const highscores = getHighscores()
    highscores.push({ username, score: curScore, date: new Date().toISOString() })
    highscores.sort((a , b) => b.score - a.score)

    localStorage.setItem('spaceInvadersHighscores', JSON.stringify(highscores.slice(0, 10)))
    updateHighscoreDisplay()
}

export function getHighscores() {
    const stored = localStorage.getItem('spaceInvadersHighscores')
    return stored ? JSON.parse(stored) : []
}

export function updateHighscoreDisplay() {
    const highscores = getHighscores()
    const hiScoreElement = document.querySelector(".score span:nth-child(2)")

    if(hiScoreElement && highscores.length > 0) {
        hiScoreElement.innerHTML = formatScore(highscores[0].score)
    }
}


export function handleKeyPress(event) {
    const key = event.key

    switch (key) {
        case "ArrowUp":
        case " ":
            if (!gameover) {
                shoot()
                const player = getPlayer()
                if (player && !player.classList.contains("shooting")) {
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
        case "a":
        case "A":
            if (!gameover) {
                moveLeft()
            }
            break
        case "ArrowRight":
        case "d":
        case "D":
            if (!gameover) {
                moveRight()
            }
            break
        default:
            console.log(`${key} ist nicht belegt`)
            break
    }
}

let gamepadIndex = null


export function initControls() {
    //tastatur
    document.addEventListener("keydown", handleKeyPress);

    //gamepad detection
    window.addEventListener("gamepadconnected", (e) => {
        console.log("Gamepad verbunden:", e.gamepad.id)
        gamepadIndex = e.gamepad.index
        startGamepadPolling()
    })

    window.addEventListener("gamepaddisconnected", (e) => {
        console.log("Gamepad getrennt")
        gamepadIndex = null
    })

    createTouchControls()
}

function startGamepadPolling() {
    let lastShoot = 0

    function pollGamepad() {
        if (gamepadIndex === null) return

        const gamepad = navigator.getGamepads()[gamepadIndex]
        if(!gamepad) return

        //links rechts, linker stick oder d-pad
        if(gamepad.axes[0] < -0.5 || gamepad.buttons[14]?.pressed) {
            moveLeft()
        } else if (gamepad.axes[0] > 0.5 || gamepad.buttons[15]?.pressed) {
            moveRight()
        }

        // shoot
        const now = Date.now()
        if ((gamepad.buttons[0]?.pressed || gamepad.buttons[7]?.pressed) && now - lastShoot > 200) {
            shoot()
            lastShoot = now
        }

        requestAnimationFrame(pollGamepad)
    }

    pollGamepad()
}

function createTouchControls() {
    if (!("ontouchstart" in window)) return

    const controls = document.createElement('div')
    controls.className = "touch-controls"
    controls.innerHTML = `
        <button id="touch-left" class="touch-btn">◀</button>
        <button id="touch-shoot" class="touch-btn">🔥</button>
        <button id="touch-right" class="touch-btn">▶</button>
    `
    document.body.appendChild(controls)

    document.getElementById("touch-left").addEventListener("touchstart", (e) => {
        e.preventDefault() //weil sonst permanent nichts gedrückt wird
        moveLeft()
    })

    document.getElementById('touch-right').addEventListener('touchstart', (e) => {
        e.preventDefault()
        moveRight()
    })

    document.getElementById('touch-shoot').addEventListener('touchstart', (e) => {
        e.preventDefault()
        shoot()
    })

}

export function removeControls() {
    document.removeEventListener("keydown", handleKeyPress);
}