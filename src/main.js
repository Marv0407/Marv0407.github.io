/**
 * Space Invaders - Main Entry Point
 */
import {initControls, startGame} from "./game.js";
import {spawnPlayer} from "./player.js";
import {moveEnemyDown, spawnEnemy} from "./enemy.js";
import {initGrid} from "./grid.js";


//Initialisierung des kompletten spiels

function init() {
    console.log("Space Invaders wird Initialisiert...")

    // Grid erstellen
    initGrid(".grid-container")
    console.log("✓ Grid Erstellt")

    //gegner spawnen
    spawnEnemy(4, "red");
    moveEnemyDown();
    spawnEnemy(1, "blue");
    moveEnemyDown();
    spawnEnemy(1, "yellow");
    console.log("✓ Gegner gespawnt");

    //spieler spawnen
    spawnPlayer()
    console.log("✓ spieler gespawnt")

    //Keyboard steuerung initialisieren
    initControls()
    console.log("✓ steuerung initialisiert")

    //spiel starten
    startGame()
    console.log("✓ Spiel gestartet")
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init()
}