function inputs(controllernum){
    this.controllerNum = controllernum;

    this.joysticks = [0,0,0,0];
    this.dpad = [0,0,0,0];
    this.abxyss = [0,0,0,0,0,0];
    this.shoulders = [0,0,0,0];

    this.up = function(){return this.joysticks[0] < -0.5 || this.dpad[0]}
    this.down = function(){return this.joysticks[0] > 0.5 || this.dpad[1]}
    this.left = function(){return this.joysticks[1] < -0.5 || this.dpad[2]}
    this.right = function(){return this.joysticks[1] > 0.5 || this.dpad[3]}
}

function keyPressed(){
    console.log(keyCode);
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
    console.log(keyIsDown('w'.charCodeAt(0) -32))
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
    if(gamepad != null){	
        if(gamepad.id == 'Xbox 360 Controller (XInput STANDARD GAMEPAD)')	{
            console.log("mini")
            //dpad (up down left right)
            myinputs.dpad[0] = (gamepad.axes[1] <-0.5)
            myinputs.dpad[1] = (gamepad.axes[1] > 0.5)
            myinputs.dpad[2] = (gamepad.axes[0] <-0.5)
            myinputs.dpad[3] = (gamepad.axes[0] > 0.5)
            myinputs.joysticks = [gamepad.axes[1], gamepad.axes[0], 0, 0]
            //buttons (abxy)
            myinputs.abxyss[0] = gamepad.buttons[1].pressed
            myinputs.abxyss[1] = gamepad.buttons[0].pressed
            myinputs.abxyss[2] = gamepad.buttons[3].pressed
            myinputs.abxyss[3] = gamepad.buttons[2].pressed
            myinputs.abxyss[4] = gamepad.buttons[8].pressed
            myinputs.abxyss[5] = gamepad.buttons[9].pressed
            //shoulders (lr l2r2)
            myinputs.shoulders = [gamepad.buttons[4].pressed, gamepad.buttons[5].pressed, 0, 0]
        }
        // console.log(myinputs)
        // console.log(gamepad)
    }
    else{}
    
    return myinputs
}