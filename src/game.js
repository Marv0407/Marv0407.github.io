import {getAllBullets, resetBulletCount, shoot, updateBullet} from "./bullet.js";
import {
    BULLET_UPDATE_INTERVAL,
    COLUMNS,
    DEBUG,
    ENEMY_MOVEMENT,
    ENEMY_SPAWN_MARGIN,
    LOOSE_ROW,
    PLAYER_LIVES,
    WAVES
} from "./config.js";
import {
    enemyShoot,
    getAllEnemies,
    getAllEnemyBullets,
    getLowestEnemyRow,
    moveEnemyDown,
    moveEnemySide,
    updateEnemyBullet
} from "./enemy.js";
import {formatScore, getCell} from "./utils.js";
import {getPlayer, moveLeft, moveRight, spawnPlayer} from "./player.js";
import {clearGrid} from "./grid.js";
import {highscore} from "./scoreHandler.js";

// Game state
let gameover = false
export let curScore = 0
let curLives = PLAYER_LIVES;
export let curWave = 0
let isSpawningWave = false;
let isRespawning = false

// ENemy Movement State
let count = 0
let count2 = -3
let maxCount = ENEMY_MOVEMENT.initialMaxCount
let direction = "initial"
let currentEnemySpeed = 1000
let currentEnemyShootChance = 10


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
    if (DEBUG) {
        console.info("stopGame()")
    }

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
    if (DEBUG) {
        console.info("startNextWave()")
    }


    console.log(`startNextWave abgerufen, isSpawningWave:${isSpawningWave}, curWave:${ curWave }`)
    // bugfix für wavespam bei leerem grid
    if(isSpawningWave) {
        console.log("startNextWave Abgebrochen - bereits am spawnen")
        return
    }
    //console.log("isSpawningWave=", isSpawningWave)
    isSpawningWave = true
    //console.log("isSpawningWave -> ", isSpawningWave)


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
    console.log("waveConfig:", waveConfig)
    if(!waveConfig) {
        console.error("Wellen Konfig nicht gefunden für Welle:", curWave)
       // console.log("isSpawningWave=", isSpawningWave)
        isSpawningWave = false
       // console.log("isSpawningWave -> ", isSpawningWave)
        return
    }

    currentEnemySpeed = waveConfig.enemySpeed
    currentEnemyShootChance = waveConfig.enemyShootChance

    //gegner spawnen

    console.log("spawne gegner für welle:", curWave + 1)
    let isFirstRow = true

    let currentRow = 1
    waveConfig.enemies.forEach(enemyGroup => {
        console.log(`→ Spawne ${enemyGroup.rows} Reihen ${enemyGroup.type}`)
        for(let rowOffset = 0; rowOffset < enemyGroup.rows; rowOffset++) {
            spawnEnemyAtRow(currentRow + rowOffset, enemyGroup.type)
        }

        currentRow += enemyGroup.rows

            // for (let i = 0; i < enemyGroup.rows; i++) {
            //     moveEnemyDown()
            // }
    })

    const enemyCount = getAllEnemies().length;
    console.log(`Welle ${curWave + 1} gestartet mit ${enemyCount} Gegnern`)

    //enemymovement intervall mit neuer geschwindigkeit starten

    startEnemyMovement()

    //console.log("isSpawningWave=", isSpawningWave)
    isSpawningWave = false
    //console.log("isSpawningWave -> ", isSpawningWave)
}

function spawnEnemyAtRow(row, type) {
    for (let col = 1; col <= COLUMNS; col++) {
        if(col > ENEMY_SPAWN_MARGIN.left && col < COLUMNS - ENEMY_SPAWN_MARGIN.right) {
            const cell = getCell(row, col)
                if(cell) {
                    const newEnemy = document.createElement("div")
                    newEnemy.id = "enemy"
                    newEnemy.className = `enemy_${type}`
                    newEnemy.setAttribute("type", type)
                    cell.appendChild(newEnemy)
                }
        }
    }
}


function startBulletUpdates() {
    if (DEBUG) {
        console.info("startBulletUpdates()")
    }

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
    if (DEBUG) {
        console.info("startEnemyMovement()")
    }

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
    if (DEBUG) {
        console.info("startEnemyShooting()")
    }

    let forceShootCur = 0
    let maxForceShoot = 10


    enemyShootInterval = setInterval(function () {
        const enemies = getAllEnemies()
        if(enemies.length === 0) return

        // jeder gegner hat eine chance zu schießen

        let shootCheck = Math.floor(Math.random() * 100)
        if (shootCheck < currentEnemyShootChance) {
            enemyShoot()
            forceShootCur = 0
        } else if (forceShootCur >= maxForceShoot) {
            enemyShoot()
            forceShootCur = 0
        } else {
            forceShootCur++
        }
    }, 500)
}

function checkWaveComplete() {
    if (DEBUG) {
        console.info("checkWaveComplete()")
    }

    if(isSpawningWave || gameover || isRespawning) return

    const enemies = getAllEnemies()
    if (enemies.length === 0) {
        console.log("Welle abgeschlossen")

        curWave++
        //console.log("isSpawningWave=", isSpawningWave)
        //isSpawningWave = true
       // console.log("isSpawningWave -> ", isSpawningWave)

/*
        setTimeout(() => {
            if (DEBUG) {
                console.info("setTimeout: 2000")
            }

            startNextWave()
        }, 1000)

 */

        startNextWave()
    }
}

function checkForLoose() {
    if (DEBUG) {
        console.info("checkForLoose()")
    }


    const lowestRow = getLowestEnemyRow()

    if (lowestRow && lowestRow >= LOOSE_ROW) {
        console.log("Gegner haben die Erde erreicht")
        endGame()
    }
}

function loseLife() {
    if (DEBUG) {
        console.info("loseLife()")
    }


    curLives--
    updateLivesDisplay()

    console.log(`leben Verloren, verbleibende Leben:${curLives}`)

    if(curLives <= 0) {
        endGame()
    } else {
        console.log("Respawn Prozess gestartet")

        isRespawning = true
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

        console.log("Warte 1 sekunde vor respawn, curwave:", curWave)

        // Neustart mit kleiner Verzögerung
        setTimeout(() => {
            console.log("RespawnTimer abgelaufen")
            isRespawning = false
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
    if (DEBUG) {
        console.info("showGameOverPopup()")
    }


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
    if (DEBUG) {
        console.info("addScore()")
    }

    curScore += points
}

function updateScoreDisplay() {
    if (DEBUG) {
        console.info("updateScoreDisplay()")
    }


    const scoreElement = document.getElementById("curScore")
    if (scoreElement) {
        scoreElement.innerHTML = formatScore(curScore)
    }
}

function updateLivesDisplay() {
    if (DEBUG) {
        console.info("updateLivesDisplay()")
    }


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
    if (DEBUG) {
        console.info("resetGame()")
    }


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

    console.log("isSpawningWave=", isSpawningWave)
    isSpawningWave = false
    console.log("isSpawningWave ->", isSpawningWave)
    isRespawning = false

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
/*

export function saveHighscore(username) {
    const highscores = getHighscores()
    highscores.push({ username, score: curScore, date: new Date().toISOString() })
    highscores.sort((a , b) => b.score - a.score)

    localStorage.setItem('spaceInvadersHighscores', JSON.stringify(highscores.slice(0, 10)))
    updateHighscoreDisplay()
}


*/

export function getHighscores() {
    return highscore
}

export function updateHighscoreDisplay() {
    const newHighscore = getHighscores()
    const highscore = (newHighscore.find(obj => "score" in obj) || {}).score

    const hiScoreElement = document.querySelector(".score span:nth-child(2)")

    if(hiScoreElement && highscore !== null) {
        hiScoreElement.innerHTML = formatScore(highscore)
    }
}

let lastShoot = 0
export function handleKeyPress(event) {
    const key = event.key

    switch (key) {
        case "ArrowUp":
        case " ":

            if (!gameover) {
                const now = Date.now()
                if(now - lastShoot > 200) {
                    const player = getPlayer()
                    if (player && !player.classList.contains("shooting")) {
                        player.classList.add("shooting");
                        player.style.backgroundImage = `url("./img/player_shoot.webp")`

                        setTimeout(() => {
                            player.style.backgroundImage = `url("./img/player.webp")`
                            player.classList.remove("shooting")
                        }, 80)
                    }
                    shoot()
                    lastShoot = now
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
            //console.log(`${key} ist nicht belegt`)
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


//DEBUG FUNKTIONEN
export let isDebugMode = false
export function initiateDebugButtons() {
    isDebugMode = true
    updateDebug()

    const debugMenu = document.getElementById("debug_btn")

    const btnSkip = document.getElementById("wave_skip");
    const btnRestart = document.getElementById("restart_wave");
    const btnGameOver = document.getElementById("game_over");

    debugMenu.style.display = "inline-block";

    btnSkip.addEventListener("click", () => {
        console.log("Skip Wave");
        clearGrid()
        spawnPlayer()
        curWave++
        startNextWave()
        updateDebug()

    });

    btnRestart.addEventListener("click", () => {
        console.log("Restart wave");
        clearGrid()
        spawnPlayer()
        startNextWave()
        updateDebug()

    });

    btnGameOver.addEventListener("click", () => {
        console.log("Game over");
        endGame()

    });

}

export function updateDebug() {
    const curWaveElement = document.getElementById("curWaveDisplay")
    const waveInfoElement = document.getElementById("waveInfoDisplay")

    curWaveElement.textContent = curWave + 1


    let waveInfo = WAVES[curWave]
    if (!waveInfo) {
        waveInfo = WAVES[WAVES.length - 1]
    }


// Gegner einzeln auflisten
    let enemyLines = waveInfo.enemies.map(enemy =>
        `type: ${enemy.type} rows: ${enemy.rows}`
    );

// Restliche Daten anhängen
    enemyLines.push(`move interval: ${waveInfo.enemySpeed}ms`);
    enemyLines.push(`shoot chance: ${waveInfo.enemyShootChance}%`);

// Alles zusammen anzeigen
    waveInfoElement.textContent = enemyLines.join('\n');

}