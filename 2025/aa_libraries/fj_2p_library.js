//================================================================================
//===============================For 2P Menu======================================
//================================================================================

var initial_game_states = {
    Gobblet: {
        name: "Gobblet",
        state: 1,
        external: [[4, 4, 4], [4, 4, 4]],
        board: Array(4).fill().map(() => Array(4).fill().map(() => [0, 0, 0, 0]))
    },
    Blokus: {
        name: "Blokus",
        state:1,
        used_pieces:[Array(21).fill(false), Array(21).fill(false)],
        scores:[0, 0],
        board:(() => { let b = Array.from({ length: 22 }, (_, y) => Array.from({ length: 22 }, (_, x) => (x < 4 || x > 17 || y < 4 || y > 17 ? -1 : 0))); b[8][8] = b[13][13] = -2; return b; })(),
    }
}

const challengeOptions = Object.values(initial_game_states).map(game => game.name);


async function issueChallenge(player, game_name="Gobblet") {
    console.log("Challenging", player.username, "with hash", player.hash);

    var game = initial_game_states[game_name]

    var gameid = generateUniqueHash();
    console.log("Generated new gameid", gameid);

    try {
        await submitGameUpdate(game, hash, player.hash, gameid, game_name);
        window.location.href = `${game_name.toLowerCase()}_2p.html?hash=${hash}&gameid=${gameid}`;
    } catch (error) {
        console.error("Failed to submit game update:", error);
        alert("An error occurred while starting the game. Please try again.");
    }
}

//Add to libraries

function generateUniqueHash() {
    const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const startTime = new Date('2000-10-13T00:00:00Z').getTime();
    const now = Date.now();
    const seconds = Math.floor((now - startTime) / 1000);
    let base64Seconds = btoa(String.fromCharCode(
        (seconds >> 24) & 0xFF,
        (seconds >> 16) & 0xFF,
        (seconds >> 8) & 0xFF,
        seconds & 0xFF
    ));
    const random1 = base64Chars[Math.floor(Math.random() * 64)];
    const random2 = base64Chars[Math.floor(Math.random() * 64)];
    let result = base64Seconds + random1 + random2;
    return result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+/g, '~');
}

function submitGameUpdate(game, p1, p2, gameid, name) {
    return fetch('https://squanky.net/scores/updateBoard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game, p1, p2, gameid, name })
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }
        return response;
    });
}

//================================================================================
//===============================For 2P Games=====================================
//================================================================================

//Retrieves the game state using the URL's gameid and hash.
//Sets the value of "game" to be data.latest_game_state.game
//Sets the player number and opponent to 1 and 2 based on the provided hash
//Sets the value of player_order to be [p1, p2]
function fetchGameState(){
    const response = fetch(`https://squanky.net/scores/get2pGame?gameid=${gameid}&hash=${hash}`, {
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
        .then(data => {
            console.log(data)
            pulled_data = data.latest_game_state
            game = pulled_data.game
            if(pulled_data.p1 == hash) {
                my_player_num = 1
                opponent = pulled_data.p2
            }
            else if(pulled_data.p2 == hash) {
                my_player_num = 2
                opponent = pulled_data.p1
            }
            else my_player_num = 3
            player_order = [pulled_data.p1,pulled_data.p2]
        })
}

function submitGameUpdate(game, p1, p2, gameid) {
    const response = fetch('https://squanky.net/scores/updateBoard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ game, p1, p2, gameid })
    });
}

function uploadNewGameState() {
    console.log(game, player_order[0], player_order[1], gameid)
    submitGameUpdate(game, player_order[0], player_order[1], gameid)
}