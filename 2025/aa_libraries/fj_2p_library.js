var initial_game_states = {
    Gobblet: {
        name: "Gobblet",
        state: 1,
        external: [[4, 4, 4], [4, 4, 4]],
        board: Array(4).fill().map(() => Array(4).fill().map(() => [0, 0, 0, 0]))
    },
    Blokus: {
        name: "Blokus",
        state: 1,
        external: [[4, 4, 4], [4, 4, 4]],
        board: Array(4).fill().map(() => Array(4).fill().map(() => [0, 0, 0, 0]))
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
        window.location.href = `${game_name}.html?hash=${hash}&gameid=${gameid}`;
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