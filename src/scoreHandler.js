
export let highscore = null;

export async function ladeHighscoreVomServer() {
    try {
        const res = await fetch('/highscore/spaceinvaders')
        const data = await res.json()
        if(Array.isArray(data.spaceinvaders)) {
            highscore = data.spaceinvaders
        } else {
            highscore = []
            console.warn("Fetch error: No Highscores")
        }
    } catch (e) {
        console.error("Fehler beim Laden des Highscores: ", e)
        highscore = []
    }
}

export function speicherScore (name, wave, score) {
    highscore.push({name, wave, score})
    highscore.sort((a, b) => b.score - a.score)
    highscore = highscore.slice(0, 10) //die besten 10 aus array
    exportHighscore()
}

export function zeigeHighscore() {
    const container = document.getElementById('hs_content')
    container.innerHTML = '';
    if (!Array.isArray(highscore)) {
        console.error('zeigeHighscore(): No Highscores')
        highscore = []
    }
    let platz = 1
    for (let eintrag of highscore) {
        const zeile = document.createElement('p')
        zeile.textContent = `${platz}. ${eintrag.name} - Welle: ${eintrag.wave} - ${eintrag.score} Pkt.`
        container.appendChild(zeile)
        platz++
    }
}
export function exportHighscore() {
    fetch("/highscore/spaceinvaders", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({spaceinvaders: highscore})
    })
        .then(async res => {
            if (!res.ok) {
                const errorBody = await res.text(); // Get the response body
                throw new Error(`Fehler beim Speichern: ${res.status} - ${errorBody}`); // Include status and body
            }
        })
        .catch(err => {
            console.error("Fehler beim Speichern des Highscores: ", err);
        })
}