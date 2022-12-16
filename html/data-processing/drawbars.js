function setup() {
    createCanvas(1000, 600);
    colorMode(HSB, 100);
}

function draw() {
    gtext.then(drawAlphabetBars())
}

function drawAlphabetBars(){
    var runningcounts = Array(6).fill(0);
        alphabetData.forEach((element, i) => {
            fill(10*(i%10),100,100).rect(10+i/26 * 980, 80*6 + 10, 1/26*980, 70)
            fill(0).text(element.letter, 10+i/26 * 980 + 980/52 - 4,  80*6 + 10 + 35 +3)
            runningcounts.forEach((value, j) => {
                fill(10*(i%10),100,100).rect(10 + runningcounts[j], 80*j + 10, element.percents[j]*980, 70)
                fill(0).text(element.letter, 10 + runningcounts[j] + element.percents[j]*980 / 2 - 5,  80*j + 10 + 70 / 2)
                runningcounts[j] = runningcounts[j] + element.percents[j]*980
            })
        })
}