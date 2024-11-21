const canvasSize = 500;
var pixelSize = 10

var grid = [...Array(canvasSize/pixelSize)].map(e => Array(canvasSize/pixelSize).fill(false));

function setup() {
    createCanvas(canvasSize, canvasSize);
    socket = new WebSocket("ws://squanky.net:4013");
    // Receive updates from the server
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      grid = data.grid;
    };
}

function draw() {
    background(220);
  
    // Draw all cubes with their unique colors
    grid.forEach((row, r) => {
        row.forEach((col, c) => {
            fill(grid[r][c]*255)
            rect(r*pixelSize, c*pixelSize, pixelSize, pixelSize)
        })
    })

    fill(255,0,0)
    rect(Math.floor(mouseX/pixelSize) * pixelSize, Math.floor(mouseY/pixelSize) * pixelSize, pixelSize, pixelSize)
}

function mouseClicked() {
    console.log([Math.floor(mouseX/pixelSize), Math.floor(mouseY/pixelSize)])
    socket.send(JSON.stringify({ type: "coordinate", coordinate:[Math.floor(mouseX/pixelSize), Math.floor(mouseY/pixelSize)] }));
}