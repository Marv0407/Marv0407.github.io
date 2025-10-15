/**
 * Space Invaders - Main Entry Point
 */
import {
    curScore,
    curWave,
    initControls,
    initiateDebugButtons,
    resetGame,
    startGame,
    updateHighscoreDisplay,
} from "./game.js";
import {spawnPlayer} from "./player.js";
import {initGrid} from "./grid.js";
import {ladeHighscoreVomServer, speicherScore, zeigeHighscore} from "./scoreHandler.js";


//Initialisierung des kompletten spiels

function init() {
    console.log("Space Invaders wird Initialisiert...")

    // Grid erstellen
    initGrid(".grid-container")
    console.log("✓ Grid Erstellt")


    //spieler spawnen
    spawnPlayer()
    console.log("✓ spieler gespawnt")

    //Keyboard steuerung initialisieren
    initControls()
    console.log("✓ steuerung initialisiert")

    //highscore laden
    updateHighscoreDisplay()
    console.log("✓ highscore geladen")

    //game control setup
    setupGameControls()
    console.log("✓ buttons initialisiert")

    zeigeHighscore()
    console.log("✓ Highscore geladen")

    //initiateDebugButtons()
    //console.log("✓ Debugmenü initialisiert")
    console.log("× Debugmenü deaktiviert")

    //spiel starten
    startGame()
    console.log("✓ Spiel gestartet")
}

function setupGameControls() {
    const submitBtn = document.querySelector("#popup button:first-of-type")
    const newGameBtn = document.querySelector("#popup button:last-child")
    const input = document.querySelector("#popup input")

    if (submitBtn && input) {
        submitBtn.addEventListener("click", () => {
            const username = input.value.trim()
            if (username && username !== "...") {
                speicherScore(username, curWave + 1, curScore)
                submitBtn.disabled = true
                alert(`Highscore gespeichert für ${username}!`)
            }
        })
    }

    if (newGameBtn) {
        newGameBtn.addEventListener("click", () => {
            console.log("New Game gestartet")
            resetGame()
        })
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    window.onload = async () => {
        await ladeHighscoreVomServer()

        init()

    }

}