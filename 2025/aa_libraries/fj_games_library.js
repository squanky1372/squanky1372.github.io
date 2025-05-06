var playerDatafunction

var playerDataFetched = false

async function submitScoreWrapper(game, data){
    // Get the full URL or just the query string
    const urlParams = new URLSearchParams(window.location.search);
    // Get specific parameters
    const hash = urlParams.get('hash');
    return await submitScore(game, hash, data)
}

async function submitScore(game, hash, data) {
    const response = await fetch('https://squanky.net/scores/addscore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ game, hash, data })
    });
}

function makePattern(size) {
    console.log(playerData)
    patternCnv = createGraphics(size, size);
    patternCnv.pixelDensity(1);

    patternCnv.translate(size / 2, size / 2)
    // Draw a pattern
    patternCnv.background(220).textSize(size * 0.75).textAlign(CENTER, CENTER).noStroke()
    patternCnv.rect(-size / 2, -size / 2, size, size)
    patternCnv.fill(playerData.visuals.colors[0][0] * 128, playerData.visuals.colors[0][1] * 128, playerData.visuals.colors[0][2] * 128)
    patternCnv.rect(-size / 2, -size / 2, size, size / 3)
    patternCnv.fill(playerData.visuals.colors[1][0] * 128, playerData.visuals.colors[1][1] * 128, playerData.visuals.colors[1][2] * 128)
    patternCnv.rect(-size / 2, -size / 2 + size / 3, size, size / 3)
    patternCnv.fill(playerData.visuals.colors[2][0] * 128, playerData.visuals.colors[2][1] * 128, playerData.visuals.colors[2][2] * 128)
    patternCnv.rect(-size / 2, -size / 2 + 2 * size / 3, size, size / 3)

    patternCnv.fill(0)
    patternCnv.text(playerData.visuals.emoji, 0, 0);

    // Uses canvas method createPattern on the buffer canvas, 
    // using the pattern canvas to create the pattern
    pattern = setupPattern(patternCnv, bufferCnv);

}
function setupPattern(p, b) {
    return b.drawingContext.createPattern(p.canvas, 'repeat');
}

function setFill(p, b) {
    b.fill(0);
    b._renderer._setFill(p);
}

function checkDataFetchSuccess(){
    
    if(playerDataFetched == 1) {
        console.log("done waiting")
        //setup buffer canvas
        let size = min(windowWidth, windowHeight) * 0.95;
        bufferCnv = createGraphics(size, size);
        bufferCnv.pixelDensity(1);

        //setup pattern
        makePattern(ball.circleRadius*2)

        playerDataFetched = 2
        
    }
}

var hash

function verifyHash() {

    // Get the full URL or just the query string
    const urlParams = new URLSearchParams(window.location.search);

    // Get specific parameters
    hash = urlParams.get('hash');

    if (hash) console.log(hash);
    else window.location.href = "https://squanky1372.github.io/2025/games/login.html"

    const response = fetch(`https://squanky.net/scores/getPlayer?hash=${hash}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json()
        }) // Parse the response body as JSON
        .then(data => verifyFields(data.foundRow)) 
        .catch(error => {
            console.error(error)
            // window.location.href = "https://squanky1372.github.io/2025/games/login.html"
        }); // Handle errors
}

var newPlayerFlag = false
function verifyFields(incomingPlayerData) {
    if (!incomingPlayerData.username) newPlayerFlag = true
    else if (incomingPlayerData.visuals) {
      console.log("visuals!")
      if (!incomingPlayerData.visuals.colors)  newPlayerFlag = true
      else if (!incomingPlayerData.visuals.emoji)  newPlayerFlag = true
    }
    else newPlayerFlag = true

    playerData = incomingPlayerData
    console.log("Finished obtaining all player data.")
    playerDataFetched = true
}