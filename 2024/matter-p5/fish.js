var sc = 5;
var t = 0;
var amp = 2;
var maxSpeed = 1;

var fishList = [];

var nursery = []

var bufferCnv;
var selected = [0,0];

var tanks = []
var tankIndex = 0


function setup() {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(1);

    bufferCnv = createGraphics(width, height);
    bufferCnv.pixelDensity(1);
    bufferCnv.textAlign(LEFT, TOP);
    
    tanks = [
        new Tank([0,width,0, height]),
        new Tank([0,width,0, height]),
        new Tank([0,width,0, height]),
        new Tank([0,width,0, height]),
    ]

    for (var i = 0; i < 20; i++) {
        tanks[1].fishList[i] = new Fish(
            [int(random(tanks[1].bounds[0], tanks[1].bounds[1])), int(random(tanks[1].bounds[2], tanks[1].bounds[3]))],
            [int(random(0, 3)), int(random(0, 3)), int(random(0, 3))],
            [int(random(0, 3)), int(random(0, 3)), int(random(0, 3))],
            int(random(2, 10)),
            int(random(0, 10)),
            [int(random(1,5)),int(random(1,5)),int(random(1,5)),int(random(1,5)),int(random(1,5)),int(random(1,5)),int(random(1,5)),int(random(1,5)),int(random(1,5)),int(random(1,5)),],
            tanks[1]
        );
    }
    selected[0] = 0
    selected[1] = 0

    console.log(tanks)
    createMatter(tanks[1])

}

function draw() {
    t++;
    bufferCnv.background(120, 220, 255);

    var tank = tanks[1]

    bufferCnv.stroke(0).fill(100, 200, 255)
    bufferCnv.rect(tank.area[0], tank.area[2], tank.area[1]-tank.area[0], tank.area[3]-tank.area[2])
    bufferCnv.fill(120, 220, 255)
    bufferCnv.rect(tank.bounds[0], tank.bounds[2], tank.bounds[1]-tank.bounds[0], tank.bounds[3]-tank.bounds[2])
    // if(i == tankIndex) bufferCnv.noFill().stroke(255,0,0).strokeWeight(5).rect(tank.area[0], tank.area[2], tank.area[1]-tank.area[0], tank.area[3]-tank.area[2]).strokeWeight(1).stroke(0).fill(0)    
        
    tank.fishList.forEach((fish) => {
        fish.drawFish();
    });
    tank.moveFish();

    bufferCnv.fill(255)
    //Draw fish 1 and its stats
    bufferCnv.rect(0,0,100,100)
    bufferCnv.rect(100,0,100,100)
    if(selected[0]){
        selected[0].drawFishAt(50,50)
        selected[0].drawFishStats(100,0)
    }

    //Draw fish 2 and its stats
    bufferCnv.rect(0,100,100,100)
    bufferCnv.rect(100,100,100,100)
    if(selected[1]){
        selected[1].drawFishAt(50,150)
        selected[1].drawFishStats(100,100)
    }

    //Draw breed combination stats
    bufferCnv.rect(0,200,100,100)
    bufferCnv.rect(100,200,100,100)
    if(selected[0] && selected[1]){
        push()
        bufferCnv.textAlign(CENTER, CENTER).textSize(100).textStyle(BOLD)
        bufferCnv.text("?",50,260)
        selected[0].drawFishStatsBreed(100,200, selected[1])
        pop()
    }

    //apply filter over tanks (WIP)
    
    // tanks.forEach(tank => {
    //     bufferCnv.fill(100, 200, 255, 128)
    //     bufferCnv.rect(tank.area[0], tank.area[2], tank.area[1]-tank.area[0], tank.area[3]-tank.area[2])
    //     bufferCnv.fill(120, 220, 255, 20)
    //     bufferCnv.rect(tank.bounds[0], tank.bounds[2], tank.bounds[1]-tank.bounds[0], tank.bounds[3]-tank.bounds[2])
    // })

    image(bufferCnv, 0, 0);
}

function mouseClicked(){
    console.log(mouseX, mouseY)
    var closest
    var dist = 999999
    tanks.forEach((tank, j) => {
        tank.fishList.forEach((fish, i) => {
        var currentDist = Math.sqrt((fish.loc[0] - mouseX)*(fish.loc[0] - mouseX) + (fish.loc[1] - mouseY)*(fish.loc[1] - mouseY))
        if(currentDist < dist){
            dist = currentDist
            closest = fish
        } 
    })})
    selected[1] = selected[0]
    selected[0] = closest
    console.log(closest)
}

function keyPressed() {
    if (key === 'b') {
        if(tanks[0].fishList.length < tanks[0].maxFish) selected[0].breed(selected[1])
    }
    if (key === 's') {
        selected[0].delete()
        selected[0] = selected[1]
        selected[1] = 0
    }
    if (key === 'S') {
        tanks[tankIndex].fishList.forEach(fish => {
            fish.delete()
        })
        selected[0] = 0
        selected[1] = 0
    }
    if (key === "m") {
        var temp = selected[0]
        selected[0].delete()
        
        tanks[tankIndex].fishList.push(temp)
        selected[0] = temp
        selected[0].tank = tanks[tankIndex]
        temp.tank = tanks[tankIndex]
    }
    if (key === 'p') tankIndex = 0
    if (key === ';') tankIndex = 1
    if (key === '[') tankIndex = 2
    if (key === '\'') tankIndex = 3
    console.log(tankIndex)
  
    if (keyCode === ENTER) {
      // Code to run.
    }
}

function Fish(location = [0, 0], color1 = [255, 100, 100], color2 = [100, 255, 100], fishSize = 8, pattern=0, vs, tank) {
    this.fishSize = fishSize;
    this.vs = vs;
    this.colors = [color1, color2];

    this.loc = location;
    this.dir = [random(6) - 3, random(6) - 3];
    this.rs = [];

    this.tankdims = [250, width/2-50, 50, height-50]
    this.tank = tank

    var colorNames = [[["Black", "Maroon", "Red"],["Navy","Grape","Violet"],["Blue","Purple","Magenta"]],
                       [["Forest", "Olive", "Orange"],["Teal","Gray","Salmon"],["Cerulean","Lavender","Pink"]],
                       [["Green", "Lime", "Yellow"],["Emerald","Mint","Lemon"],["Cyan","Sky","White"]]]

    var patternNames = ["Spotted", "Checkered", "Striped", "Halved", "Solid"]

    for (var i = 0; i < this.fishSize; i++) {
        this.rs[i] = random() * 0.1;
    }
    this.patterner = new Pattern([color1[0] * 128, color1[1]*128, color1[2]*128], [color2[0] * 128, color2[1]*128, color2[2]*128]);
    this.patternNum = pattern
    this.pattern;


    //pattern ideas: stars, splatter, scales, graph paper (plaid) or checkerboard, 
    //also add to the stats display- pattern name
    if (pattern == 0) this.pattern = this.patterner.spotted();
    else if (pattern == 1) this.pattern = this.patterner.spotted();
    else if (pattern == 2) this.pattern = this.patterner.checker();
    else if (pattern == 3) this.pattern = this.patterner.checker();
    else if (pattern == 4) this.pattern = this.patterner.striped();
    else if (pattern == 5) this.pattern = this.patterner.striped();
    else if (pattern == 6) this.pattern = this.patterner.half();
    else if (pattern == 7) this.pattern = this.patterner.half();
    else this.pattern = this.patterner.solid();

    this.drawFish = function () {
        this.drawFishAt(this.loc[0], this.loc[1])
    }    

    this.drawFishAt = function(x, y){
        bufferCnv.push();
        bufferCnv.translate(x, y + sin(t * 0.05));
        // console.log(this.ball.velocity.x)
        if (this.ball.velocity.x > 0) bufferCnv.scale(-1,1);
        bufferCnv.translate(-sc * this.rs.length/2, 0)

        bufferCnv.scale(2)
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

        bufferCnv.fill(128,128,128)
        bufferCnv.ellipse(sc/2, (-this.vs[0] * sc) / 2, 5, 5);
        bufferCnv.line(0, 0, sc, 0);
        bufferCnv.pop();
    };

    this.drawFishStats = function(x, y){
        bufferCnv.push(); bufferCnv.translate(x, y);                                                        //align
        bufferCnv.fill(this.colors[0][0]*128,this.colors[0][1]*128,this.colors[0][2]*128).rect(0,0,50,25)   //color 1
        bufferCnv.fill(this.colors[1][0]*128,this.colors[1][1]*128,this.colors[1][2]*128).rect(50,0,50,25)  //color 2        
        // bufferCnv.fill(255,255,255).rect(10,0,30,25).rect(60,0,30,25)                                       //white space for color values
        bufferCnv.textAlign(CENTER, CENTER).textSize(11).textStyle(BOLD).noStroke()                                    //setup text for color names
        bufferCnv.fill(256-this.colors[0][0]*128,256-this.colors[0][1]*128,256-this.colors[0][2]*128)
        // bufferCnv.text(this.colors[0],25,12.5)
        bufferCnv.text(colorNames[this.colors[0][1]][this.colors[0][2]][this.colors[0][0]],25,12.5)
        bufferCnv.fill(256-this.colors[1][0]*128,256-this.colors[1][1]*128,256-this.colors[1][2]*128)
        // bufferCnv.text(this.colors[1],75,12.5)                                 
        bufferCnv.text(colorNames[this.colors[1][1]][this.colors[1][2]][this.colors[1][0]],75,12.5)    

        bufferCnv.noFill().stroke(0).rect(0,25,100,25)
        bufferCnv.fill(0).noStroke()
        bufferCnv.text(patternNames[(int)(this.patternNum/2)], 50, 25+12.5)

        bufferCnv.fill(0).stroke(0)
        bufferCnv.line(fishSize * 10, 100, fishSize * 10, 50)                                               //draw vertical line for fishSize
        for(var i = 0; i < 5; i++){bufferCnv.line(0, 100-(i*10), 100, 100-(i*10))}                          //draw horizontal lines
        for(var i = 0; i < this.vs.length; i++){                                                            //draw dots for vs
            if(i >= this.fishSize) bufferCnv.fill(200)
            bufferCnv.circle(i*10 + 5, 100 - vs[i]*10, 5)
        }
        bufferCnv.pop();
    };

    this.drawFishStatsBreed = function(x, y, ftwo){
        bufferCnv.push(); bufferCnv.translate(x, y);                                                            //align
        bufferCnv.fill(this.colors[0][0]*128,this.colors[0][1]*128,this.colors[0][2]*128).rect(0,0,50,12.5)     //color 1
        bufferCnv.fill(this.colors[1][0]*128,this.colors[1][1]*128,this.colors[1][2]*128).rect(50,0,50,12.5)    //color 2   
        bufferCnv.fill(ftwo.colors[0][0]*128,ftwo.colors[0][1]*128,ftwo.colors[0][2]*128).rect(0,12.5,50,12.5)  //color 1 (ftwo)
        bufferCnv.fill(ftwo.colors[1][0]*128,ftwo.colors[1][1]*128,ftwo.colors[1][2]*128).rect(50,12.5,50,12.5) //color 2 (ftwo)       
        bufferCnv.fill(255,255,255).rect(10,0,30,25).rect(60,0,30,25)                                           //white space for color values
        bufferCnv.textAlign(CENTER, CENTER).fill(0).textSize(11).textStyle(BOLD)                                //setup text for color values
        bufferCnv.text(this.colors[0],25,12.5/2).text(this.colors[1],75,12.5/2)                                 //write color values to screen
        bufferCnv.text(ftwo.colors[0],25,12.5*3/2).text(ftwo.colors[1],75,12.5*3/2)                             //write color values to screen

        bufferCnv.line(this.fishSize * 10, 100, this.fishSize * 10, 50)                                               //draw vertical line for fishSize
        bufferCnv.line(ftwo.fishSize * 10, 100, ftwo.fishSize * 10, 50)                                               //draw vertical line for fishSize
        for(var i = 0; i < 5; i++){bufferCnv.line(0, 100-(i*10), 100, 100-(i*10))}                          //draw horizontal lines
        for(var i = 0; i < this.vs.length; i++){                                                            //draw dots for vs
            // if(i >= this.fishSize) bufferCnv.fill(200)
            if(this.vs[i] > ftwo.vs[i]){
                bufferCnv.fill(0,255,0).circle(i*10 + 5, 100 - this.vs[i]*10, 5)
                bufferCnv.fill(255,0,0).circle(i*10 + 5, 100 - ftwo.vs[i]*10, 5)
            }
            else if(this.vs[i] < ftwo.vs[i]){
                bufferCnv.fill(255,0,0).circle(i*10 + 5, 100 - this.vs[i]*10, 5)
                bufferCnv.fill(0,255,0).circle(i*10 + 5, 100 - ftwo.vs[i]*10, 5)
            }
            else{
                bufferCnv.fill(0,0,255).circle(i*10 + 5, 100 - this.vs[i]*10, 5)
                bufferCnv.fill(0,0,255).circle(i*10 + 5, 100 - ftwo.vs[i]*10, 5)

            }
        }
        bufferCnv.pop();
    };

    this.breed = function (otherfish){
        var newfish = (new Fish(
            [this.loc[0], this.loc[1]],                     //location
            randSel(this.colors[0], otherfish.colors[0]),   //color1
            randSel(this.colors[1], otherfish.colors[1]),   //color2
            randSel(this.fishSize, otherfish.fishSize),     //fishSize
            randSel(this.patternNum, otherfish.patternNum), //pattern
            randSelArray(this.vs, otherfish.vs),            //vs
            tanks[0]
        ))
        tanks[0].fishList.push(newfish)
        newfish.tankdims = [width/2+50, width-50, 50, height-50]
    }

    this.delete = function(){
        this.tank.fishList.splice(this.tank.fishList.indexOf(this), 1)
    }

    var randSel = function(a, b){
        return (Math.random() < 0.5) ? a : b
    }

    var randSelArray = function(a, b){
        var out = []
        for(var i = 0; i < a.length; i++){
            out[i] = randSel(a[i], b[i])
        }
        return out
    }
}

function Tank(area=[0,0,0,0], maxFish=20){
    this.area = area
    this.bounds = [area[0] + sc*5, area[1] - sc*5, area[2] + sc*5, area[3] - sc*5]
    this.maxFish = maxFish

    this.fishList = []

    this.moveFish = function(){
        this.fishList.forEach(fish => {
            var rand = Math.floor(Math.random() * 100);
            var randforce = (5 - ((Math.random() * 10))) * 0.0005
            var yprob = 1 / (fish.loc[1] / window.innerHeight)
            console.log([randforce, yprob])
            if(rand * yprob < 2 && fish.loc[1] > window.innerHeight/4) Matter.Body.applyForce(fish.ball, fish.ball.position, {x: randforce, y: -0.001})
            else if(fish.loc[1] > 7*window.innerHeight/8) Matter.Body.applyForce(fish.ball, fish.ball.position, {x: randforce, y: -0.01})
            fish.loc[0] = fish.ball.position.x;
            fish.loc[1] = fish.ball.position.y;
        })
    }
}


//pattern ideas: stars, splatter, scales, graph paper (plaid) or checkerboard, 
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
    this.half = function () {
        var patternCnv = createGraphics(100, 100);
        patternCnv.pixelDensity(1);

        patternCnv.background(color1);
        patternCnv.fill(color2);
        patternCnv.noStroke()
        patternCnv.rect(0,0,100,50)
        return setupPattern(patternCnv, bufferCnv);
    };

    this.checker = function () {
        var patternCnv = createGraphics(100, 100);
        patternCnv.pixelDensity(1);

        patternCnv.background(color1);
        patternCnv.fill(color2);
        patternCnv.noStroke()
        
        var checkerSize = 12.5
        // patternCnv.strokeWeight(5);
        for (let i = 0; i < 100/checkerSize; i = i + 2) {
            for (let j = 0; j < 100/checkerSize; j++) {
                console.log([i,j])
                patternCnv.rect(i*checkerSize,j*2*checkerSize,checkerSize,checkerSize)
                patternCnv.rect((i+1)*checkerSize,(j*2+1)*checkerSize,checkerSize,checkerSize)
            }
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

function createMatter(tank){
    // create an engine
    let engine = Matter.Engine.create();
    engine.world.gravity.y = 0.05;
    let size = {x: window.innerWidth, y: window.innerHeight}

    //Add border walls to the screen
    let thickness = 1000
    let ground = Matter.Bodies.rectangle(size.x/2, 0 - thickness/2, size.x*2, thickness, { isStatic: true });
    let ceil = Matter.Bodies.rectangle(size.x/2, size.y + thickness/2, size.x*2, thickness, { isStatic: true });
    let wall1 = Matter.Bodies.rectangle(0-thickness/2, size.y/2, thickness, size.y*2, { isStatic: true });
    let wall2 = Matter.Bodies.rectangle(size.x + thickness/2, size.y/2, thickness, size.y*2, { isStatic: true });

    tank.fishList.forEach((fish, i) => {
        let newball = Matter.Bodies.circle(fish.loc[0], fish.loc[1], 30, {restitution: 0.1, mass: 1});
        fish.ball = newball
        Matter.Composite.add(engine.world, [newball])
    })
    
    // add all of the bodies to the world
    Matter.Composite.add(engine.world, [ground, wall1, wall2, ceil]);

    // create runner
    let runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

}