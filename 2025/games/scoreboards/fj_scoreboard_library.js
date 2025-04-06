function addScore(score) {
    console.log(score)
    var table = document.getElementById("table");

    var row = table.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);

    cell2.innerHTML = score.username;
    cell3.innerHTML = score.data.score;
    cell4.innerHTML = score.timestamp.substring(5, 10) + "-" + score.timestamp.substring(2, 4);
    cell5.innerHTML = score.counter;

    // Create a div and set its ID
    var div = document.createElement("div");
    div.id = "scoreDiv-" + score.username; // Unique ID using the username
    cell1.appendChild(div); // Append div to the new cell


    createCanvasInDiv("scoreDiv-" + score.username, score.visuals);
}


function createCanvasInDiv(divId, visuals) {
    new p5((sketch) => {
        sketch.setup = function () {
            let canvas = sketch.createCanvas(35, 35);
            canvas.parent(divId);

            color1 = visuals.colors[0]
            color2 = visuals.colors[1]
            color3 = visuals.colors[2]
            emoji = visuals.emoji

            var size = sketch.width
            var posx = sketch.width / 2 - size / 2
            var posy = sketch.height / 2 - size / 2

            sketch.background(220);
            sketch.textSize(size * 0.75);
            sketch.rect(posx, posy, size, size)

            sketch.fill(color1[0] * 128, color1[1] * 128, color1[2] * 128)
            sketch.rect(posx, posy, size, size / 3)
            sketch.fill(color2[0] * 128, color2[1] * 128, color2[2] * 128)
            sketch.rect(posx, posy + size / 3, size, size / 3)
            sketch.fill(color3[0] * 128, color3[1] * 128, color3[2] * 128)
            sketch.rect(posx, posy + 2 * size / 3, size, size / 3)

            sketch.textAlign(sketch.CENTER, sketch.CENTER)
            sketch.fill(0)
            sketch.text(emoji, posx + size / 2, posy + size / 2);
        };
    });
}
// Call createCanvasInDiv for each row you have