var sc = 8;
var t = 0;
var amp = 2;
var maxSpeed = 1;

var fishList = [];

var bufferCnv;
var selected = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(1);

    bufferCnv = createGraphics(width, height);
    bufferCnv.pixelDensity(1);

    for (var i = 0; i < 20; i++) {
        fishList[i] = new Fish(
            [int(random(50, 350)), int(random(50, 350))],
            [int(random(50, 255)), int(random(50, 255)), int(random(50, 255))],
            [int(random(50, 255)), int(random(50, 255)), int(random(50, 255))],
            int(random(2, 10)),
            int(random(3, 6)),
            int(random(0, 10))
        );
    }
    selected[0] = fishList[0]
    selected[1] = fishList[1]
}

function draw() {
    t++;
    bufferCnv.background(120, 220, 255);
    fishList.forEach((fish) => {
        fish.moveFish();
        fish.drawFish();
    });
    bufferCnv.rect(0,0,100,100)
    selected[0].drawFishAt(50,50)
    bufferCnv.rect(0,100,100,100)
    selected[1].drawFishAt(50,150)
    image(bufferCnv, 0, 0);
}

function mouseClicked(){
    console.log(mouseX, mouseY)
    var closest
    var dist = 999999
    fishList.forEach((fish, i) => {
        var currentDist = Math.sqrt((fish.loc[0] - mouseX)*(fish.loc[0] - mouseX) + (fish.loc[1] - mouseY)*(fish.loc[1] - mouseY))
        if(currentDist < dist){
            dist = currentDist
            closest = fish
        } 
    })
    selected[1] = selected[0]
    selected[0] = closest
    console.log(closest)
}

function keyPressed() {
    if (key === 'b') {
      selected[0].breed(selected[1])
    }
  
    if (keyCode === ENTER) {
      // Code to run.
    }
  }

function Fish(location = [0, 0], color1 = [255, 100, 100], color2 = [100, 255, 100], fishSize = 8, maxHeight = 5, pattern=0) {
    this.fishSize = fishSize;
    this.maxHeight = maxHeight;
    this.vs = [];
    this.colors = [color1, color2];

    this.loc = location;
    this.dir = [random(6) - 3, random(6) - 3];
    this.rs = [];

    for (var i = 0; i < this.fishSize; i++) {
        this.vs[i] = int(random(1, this.maxHeight));
        this.rs[i] = random() * 0.1;
    }
    this.patterner = new Pattern(color1, color2);
    this.patternNum = pattern
    this.pattern;

    if (pattern == 0) this.pattern = this.patterner.spotted();
    else if (pattern == 1) this.pattern = this.patterner.spotted();
    else if (pattern == 2) this.pattern = this.patterner.spotted();
    else if (pattern == 3) this.pattern = this.patterner.striped();
    else if (pattern == 4) this.pattern = this.patterner.striped();
    else if (pattern == 5) this.pattern = this.patterner.striped();
    else this.pattern = this.patterner.solid();

    this.drawFish = function () {
        this.drawFishAt(this.loc[0], this.loc[1])
    }    

    this.drawFishAt = function(x, y){
        bufferCnv.push();
        bufferCnv.translate(x, y + sin(t * 0.05));
        if (this.dir[0] > 0) bufferCnv.rotate(Math.PI);
        bufferCnv.translate(-sc * this.rs.length/2, 0)
        bufferCnv.fill(color[0], color[1], color[2]);

        this.patterner.setFill(this.pattern, bufferCnv);

        bufferCnv.beginShape();
        bufferCnv.curveVertex(0, 0);
        bufferCnv.curveVertex(0, 0);
        for (var i = 0; i < this.rs.length; i++) {
            bufferCnv.curveVertex(
                i * sc + amp * sin(this.rs[i] * t),
                this.vs[i] * sc + amp * sin(this.rs[i] * t)
            );
        }

        bufferCnv.curveVertex((this.rs.length - 1) * sc, 0);

        for (var i = this.rs.length - 1; i >= 0; i--) {
        bufferCnv.curveVertex(
            i * sc + amp * sin(this.rs[i] * t),
            -this.vs[i] * sc + amp * sin(this.rs[i] * t)
        );
        }
        bufferCnv.curveVertex(0, 0);
        bufferCnv.curveVertex(0, 0);
        bufferCnv.endShape();

        if (this.dir[0] > 0) bufferCnv.ellipse(0, (this.vs[0] * sc) / 2, 5, 5);
        else bufferCnv.ellipse(sc, (-this.vs[0] * sc) / 2, 5, 5);
        bufferCnv.line(0, 0, sc, 0);
        bufferCnv.pop();
    };
    this.moveFish = function () {
        this.loc[0] += this.dir[0];
        this.loc[1] += this.dir[1];

        if (this.loc[0] > width - 50) {
            this.loc[0] = width - 50;
            this.dir = [-random(maxSpeed), random(maxSpeed * 2) - maxSpeed];
        }
        if (this.loc[1] > height - 50) {
            this.loc[1] = height - 50;
            this.dir = [random(maxSpeed * 2) - maxSpeed, -random(maxSpeed)];
        }
        if (this.loc[0] < 50) {
            this.loc[0] = 50;
            this.dir = [random(maxSpeed), random(maxSpeed * 2) - maxSpeed];
        }
        if (this.loc[1] < 50) {
            this.loc[1] = 50;
            this.dir = [random(maxSpeed * 2) - maxSpeed, random(maxSpeed)];
        }
    };

    this.breed = function (otherfish){
        fishList.push(new Fish(
            [this.loc[0], this.loc[1]],
            randSel(this.colors[0], otherfish.colors[0]),
            randSel(this.colors[1], otherfish.colors[1]),
            randSel(this.fishSize, otherfish.fishSize),
            randSel(this.maxHeight, otherfish.maxHeight),
            randSel(this.patternNum, otherfish.patternNum),
        ))
    }

    var randSel = function(a, b){
        return (Math.random() < 0.5) ? a : b
    }
}

var patternCnv;

function Pattern(color1, color2) {
this.spotted = function () {
    var patternCnv = createGraphics(100, 100);
    patternCnv.pixelDensity(1);

    patternCnv.background(color1);
    patternCnv.fill(color2);
    patternCnv.noStroke();
    for (let i = 0; i < 30; i++) {
    let x = random(0, 100);
    let y = random(0, 100);
    patternCnv.ellipse(x, y, 10);
    }
    return setupPattern(patternCnv, bufferCnv);
};

this.striped = function () {
    var patternCnv = createGraphics(100, 100);
    patternCnv.pixelDensity(1);

    patternCnv.background(color1);
    patternCnv.stroke(color2);
    patternCnv.strokeWeight(5);
    for (let i = -15; i < 15; i++) {
    patternCnv.line(i * 20, 0, i * 20 + 1000, 1000);
    }
    return setupPattern(patternCnv, bufferCnv);
};

this.solid = function () {
    var patternCnv = createGraphics(100, 100);  
    patternCnv.pixelDensity(1);

    patternCnv.background(color1);
    return setupPattern(patternCnv, bufferCnv);
};
function setupPattern(p, b) {
    return b.drawingContext.createPattern(p.canvas, "repeat");
}
this.setFill = function (p, b) {
    b.fill(0);
    b._renderer._setFill(p);
};
}