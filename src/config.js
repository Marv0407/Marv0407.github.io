
export const DEBUG = false

// Grid Konfiguration
export const ROWS = 15
export const COLUMNS = 15
export const GRID_SIZE = 40

// Spieler Start-Position
export const PLAYER_START_ROW = 15
export const PLAYER_START_COL = 8

// Gegner Kofiguration
export const ENEMY_POINTS = {
    red: {points: 10},
    blue: {points: 20},
    yellow: {points: 30},
    ufo: {points: 100}
}

// Gegner-Bewegung
export const ENEMY_MOVEMENT = {
    initialMaxCount: 0,
    leftRightMaxCount: 6,
    startCount: 3
}

//SPieler leben
export const PLAYER_LIVES = 3

// gegner schuss wahrscheinlichkeit
export const ENEMY_SHOOT_CHANCE = 0.001

// Wellen konfiguration
export const WAVES = [
    // Wave 1
    {
        enemies: [
            { type: "red", rows: 4},
            { type: "blue", rows: 1},
            { type: "yellow", rows: 1}
        ],
        enemySpeed: 1000,
        enemyShootChance: 0.0001
    },
    // Wave 2
    {
        enemies: [
            { type: 'yellow', rows: 2 },
            { type: 'blue', rows: 2 },
            { type: 'red', rows: 2 }
        ],
        enemySpeed: 900,
        enemyShootChance: 0.0015
    },
    // Wave 3
    {
        enemies: [
            { type: 'blue', rows: 3 },
            { type: 'yellow', rows: 2 },
            { type: 'red', rows: 1 }
        ],
        enemySpeed: 800,
        enemyShootChance: 0.002
    },
    // Wave 4+
    {
        enemies: [
            { type: 'yellow', rows: 3 },
            { type: 'blue', rows: 3 }
        ],
        enemySpeed: 700,
        enemyShootChance: 0.003
    }
]

// Game Over Bedingung
export const LOOSE_ROW = 13;

// Timing (in Millisekunden)
export const BULLET_UPDATE_INTERVAL = 100;
export const ENEMY_MOVE_INTERVAL = 1000;

export const ENEMY_SPAWN_MARGIN = {
    left: 3,
    right: 2
}
