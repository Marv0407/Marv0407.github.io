
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

export const ENEMY_SPAWN_MARGIN = {
    left: 3,
    right: 2
}

// Game Over Bedingung
export const LOOSE_ROW = 13;

// Timing (in Millisekunden)
export const BULLET_UPDATE_INTERVAL = 100;
export const ENEMY_MOVE_INTERVAL = 1000;

// Gegner-Bewegung
export const ENEMY_MOVEMENT = {
    initialMaxCount: 0,
    leftRightMaxCount: 6,
    startCount: 3
}