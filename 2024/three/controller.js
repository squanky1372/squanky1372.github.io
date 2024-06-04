function inputs(controllernum){
    this.controllerNum = controllernum;

    this.joysticks = [0,0,0,0];
    this.dpad = [0,0,0,0];
    this.abxyss = [0,0,0,0,0,0];
    this.shoulders = [0,0,0,0];

    this.buttons = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

    this.up = function(){return this.joysticks[0] < -0.5 || this.dpad[0]}
    this.down = function(){return this.joysticks[0] > 0.5 || this.dpad[1]}
    this.left = function(){return this.joysticks[1] < -0.5 || this.dpad[2]}
    this.right = function(){return this.joysticks[1] > 0.5 || this.dpad[3]}
}

function keyPressed(){
    // console.log(keyCode);
}

function getKeyboard(controllerNum=-1){
    var sel = -1 + controllerNum * -1;
    var keys = [['w','s','a','d','x','z','c','v','r','f','q','e','1','3']]
    for(var i = 0; i < 1; i++){
        for(var j = 0; j < 14; j++){
            keys[i][j] = keys[i][j].charCodeAt(0) -32
        }
    }
    // console.log(keys[0])
    let myinputs = new inputs(controllerNum)
    // console.log(keyIsDown('w'.charCodeAt(0) -32))
    myinputs.dpad[0] = keyIsDown(keys[sel][0])
    myinputs.dpad[1] = keyIsDown(keys[sel][1])
    myinputs.dpad[2] = keyIsDown(keys[sel][2])
    myinputs.dpad[3] = keyIsDown(keys[sel][3])
    
    myinputs.abxyss[0] = keyIsDown(keys[sel][4])
    myinputs.abxyss[1] = keyIsDown(keys[sel][5])
    myinputs.abxyss[2] = keyIsDown(keys[sel][6])
    myinputs.abxyss[3] = keyIsDown(keys[sel][7])
    myinputs.abxyss[4] = keyIsDown(keys[sel][8])
    myinputs.abxyss[5] = keyIsDown(keys[sel][9])

    myinputs.shoulders[0] = keyIsDown(keys[sel][10])
    myinputs.shoulders[1] = keyIsDown(keys[sel][11])
    return myinputs
}

function getControls(controllerNum=0){
    if(controllerNum >= 0){
        return getController(controllerNum)
    }
    return getKeyboard(controllerNum)
}
function getController(controllerNum=0){
    let gamepad = navigator.getGamepads()[controllerNum]
    let myinputs = new inputs(controllerNum)
    // console.log(gamepad)
    if(gamepad != null){	
        // console.log("controller ID:", gamepad.id)
        gamepad.buttons.forEach((button, i) => {
            myinputs.buttons[i] = button.pressed
        })
        myinputs.joysticks = [gamepad.axes[0], gamepad.axes[1], gamepad.axes[2], gamepad.axes[3]]
    }
    return myinputs
}

function getRaw(controllerNum=0){
    return navigator.getGamepads()[controllerNum]
}

function getNumGamepads(){
    return navigator.getGamepads().length
}