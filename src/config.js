
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
    red: 10,
    red_boss: 35,
    blue: 20,
    blue_boss: 50,
    yellow: 30,
    yellow_boss: 60,
    omega_boss: 120
};

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

    /*
    *  SCHEMA
    *
    *     {
        enemies: [
            { type: "red", rows: 4},
            { type: "blue", rows: 1},
            { type: "yellow", rows: 1}
        ],
        enemySpeed: 1000,
        enemyShootChance: 10
    },
    *
    * */

    // Wave 1

    // Wave 1
    {
        enemies: [
            { type: "red", rows: 2 },
            { type: "red", rows: 2 }
        ],
        enemySpeed: 1000,
        enemyShootChance: 10
    },

    // Wave 2
    {
        enemies: [
            { type: 'blue', rows: 2 },
            { type: 'red', rows: 2 }
        ],
        enemySpeed: 900,
        enemyShootChance: 15
    },

    // Wave 3
    {
        enemies: [
            { type: 'blue', rows: 3 },
            { type: 'red', rows: 2 }
        ],
        enemySpeed: 850,
        enemyShootChance: 18
    },

    // Wave 4
    {
        enemies: [
            { type: 'blue', rows: 3 },
            { type: 'yellow', rows: 3 }
        ],
        enemySpeed: 800,
        enemyShootChance: 22
    },

    // Wave 5 - MINIBOSS
    {
        enemies: [
            { type: 'red_boss', rows: 3 }
        ],
        enemySpeed: 600,
        enemyShootChance: 50
    },

    // Wave 6
    {
        enemies: [
            { type: 'yellow', rows: 3 },
            { type: 'red', rows: 4 }
        ],
        enemySpeed: 700,
        enemyShootChance: 25
    },

    // Wave 7
    {
        enemies: [
            { type: 'blue', rows: 3 },
            { type: 'yellow', rows: 2 },
            { type: 'red', rows: 2 }
        ],
        enemySpeed: 670,
        enemyShootChance: 30
    },

    // Wave 8
    {
        enemies: [
            { type: 'yellow', rows: 4 },
            { type: 'red', rows: 3 }
        ],
        enemySpeed: 650,
        enemyShootChance: 33
    },

    // Wave 9
    {
        enemies: [
            { type: 'blue', rows: 3 },
            { type: 'red', rows: 4 }
        ],
        enemySpeed: 620,
        enemyShootChance: 38
    },

    // Wave 10 - BOSS
    {
        enemies: [
            { type: 'yellow_boss', rows: 4 }
        ],
        enemySpeed: 600,
        enemyShootChance: 60
    },

    // Wave 11
    {
        enemies: [
            { type: 'yellow', rows: 3 },
            { type: 'blue', rows: 2 },
            { type: 'red', rows: 2 }
        ],
        enemySpeed: 580,
        enemyShootChance: 35
    },

    // Wave 12
    {
        enemies: [
            { type: 'blue', rows: 3 },
            { type: 'red', rows: 3 }
        ],
        enemySpeed: 560,
        enemyShootChance: 38
    },

    // Wave 13
    {
        enemies: [
            { type: 'yellow', rows: 4 },
            { type: 'blue', rows: 3 }
        ],
        enemySpeed: 550,
        enemyShootChance: 40
    },

    // Wave 14
    {
        enemies: [
            { type: 'blue', rows: 3 },
            { type: 'yellow', rows: 3 },
            { type: 'red', rows: 1 }
        ],
        enemySpeed: 530,
        enemyShootChance: 42
    },

    // Wave 15 - BOSS
    {
        enemies: [
            { type: 'blue_boss', rows: 4 }
        ],
        enemySpeed: 600,
        enemyShootChance: 65
    },

    // Wave 16
    {
        enemies: [
            { type: 'red', rows: 3 },
            { type: 'yellow', rows: 3 },
            { type: 'blue', rows: 1 }
        ],
        enemySpeed: 520,
        enemyShootChance: 45
    },

    // Wave 17
    {
        enemies: [
            { type: 'blue', rows: 4 },
            { type: 'yellow', rows: 3 }
        ],
        enemySpeed: 500,
        enemyShootChance: 48
    },

    // Wave 18
    {
        enemies: [
            { type: 'red', rows: 4 },
            { type: 'blue', rows: 3 }
        ],
        enemySpeed: 480,
        enemyShootChance: 50
    },

    // Wave 19
    {
        enemies: [
            { type: 'yellow', rows: 4 },
            { type: 'red', rows: 3 }
        ],
        enemySpeed: 470,
        enemyShootChance: 52
    },

    // Wave 20 - FINAL BOSS
    {
        enemies: [
            { type: 'omega_boss', rows: 5 }
        ],
        enemySpeed: 600,
        enemyShootChance: 80
    },

    // Wave 21 - Endless final wave
    {
        enemies: [
            { type: 'omega_boss', rows: 3 },
            { type: 'red_boss', rows: 1 },
            { type: 'blue_boss', rows: 2 },
            { type: 'yellow_boss', rows: 1 }
        ],
        enemySpeed: 600,
        enemyShootChance: 75
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
