
var dims = [0,0]
var iconset = ["snow", "rain", "fog", "wind", "cloudy", "partly-cloudy-day", "partly-cloudy-night", "clear-day", "clear-night"]
var picset = ["❄️", "💦", "🌫️", "🌀", "☁️", "🌤️", "🌤️", "☀️", "🌙"]
var mydata = null;
var button;
var myday = 0;
var location_param;
var location_full_name;
var params;
function loadWeather(){	
    params = new URLSearchParams(window.location.search);
    myday = ((params.get("date") == null) || params.get("date") >= 15) ? 0 : params.get("date");
    location_param = (params.get("place") == null) ? "evanston" : params.get("place");
    console.log(location_param)
    console.log("day")
    console.log(myday)

    fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + 
    location_param +
    "?unitGroup=us&elements=datetime%2CdatetimeEpoch%2Cname%2Clatitude%2Clongitude%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslikemax%2Cfeelslikemin%2Cfeelslike%2Cprecip%2Cprecipprob%2Cprecipcover%2Cpreciptype%2Csnow%2Csnowdepth%2Cwindgust%2Cwindspeed%2Csunrise%2Csunset%2Cmoonphase%2Cconditions%2Cdescription%2Cicon&include=days%2Chours&key=2WKEX8NVUHXNVV7SYHEX3EQBL&contentType=json", {
    "method": "GET",
    "headers": {}})
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
        mydata = data;
        console.log(data.resolvedAddress)
        location_full_name = data.resolvedAddress;
    });
}
function setup() {
    createCanvas(windowWidth, windowHeight);
    background(220);
    colorMode(HSB, 100);
    dims = [width, height]
    mindim = (width < height) ? width : height
    
    loadWeather();
    button = new cycleButton(mindim * 2/5,mindim * 1.2,0,15, mindim/5,mindim/5, myday)
}
function draw() {
    if(mydata == null){
        console.log("waiting")
        return;
    }
    drawData(mydata)
    drawLocationName();
    parseTouches();
    handleButtons();
}
function drawData(data){
    push()
    translate(mindim/2, mindim/2)
    fill(70,10,50).rect(-mindim/2,-mindim/2,mindim,mindim/2)
    fill(55,10,100).rect(-mindim/2,0, mindim, mindim/2)
    fill(0)
    drawHourLine()
    for(var i = 0; i < 24; i++){
        var hour = data.days[myday].hours[i]
        var iconint = iconset.findIndex(element => element == hour.icon)
        push()
        push()
        translate(0,-mindim/2.5)
        circle(0,0,5)
        textSize(mindim/10).text(picset[iconint], -mindim/20,0)
        textSize(mindim/20).text(Math.floor(hour.feelslike),0, mindim/20 )
        pop()
        drawSliver(hour.temp)
        drawSliver(hour.feelslike)
        fill(0)
        circle(0,0,mindim / 10)
        stroke(0)
        pop()
        rotate(Math.PI / 12)
        line(0,0,0,-mindim/2.5)
    }
    pop()
}
function drawSliver(value){
    noStroke()
    fill(100 * (1-((value + 40) / 150)), 100, 100)
    beginShape()
    vertex(0,0)
    vertex(0,-mindim/2.5 * ((value + 40) / 150))
    vertex(-mindim/2.5 * ((value + 40) / 150) * sin(-Math.PI/12),
    -mindim/2.5 * ((value + 40) / 150) * cos(-Math.PI/12))
    endShape()
}
function drawLocationName(){
    push()
    translate(mindim/2, mindim * 1.1)
    textSize(mindim/15)
    textAlign(CENTER);
    text(location_full_name, 0,0)
    translate(0,mindim*0.075)
    text("Days from now:",0,0)
    pop()
}
function datetime(){
    var today = new Date();
    return [today.getFullYear(),today.getMonth()+1,today.getDate(),today.getHours(),today.getMinutes(),today.getSeconds()]
}
function drawHourLine(){
    push()
    var dt = datetime()
    //console.log((dt[3] + dt[4]/60))
    rotate((dt[3] + dt[4]/60)*Math.PI*2/24)
    strokeWeight(10)
    line(0,0,0,-mindim/2.5)
    pop()
}
var touchEnabled = true;
var posTouched = [0,0,true];
function parseTouches(){
    if(!touches[0]){
        touchEnabled = true;
        posTouched[2] = false;
    }
    else if(touches[0] && touchEnabled){
        touchEnabled = false;
        posTouched = [touches[0].x, touches[0].y, true]
    }
    else if(touches[0]){
        posTouched[2] = false;
    }
}
function handleButtons(){
    button.draw();
    button.press();
    myday = button.value
}
function overlapsRect(x,y,w,h,x1,y1){
    console.log(x,y)
    if(x1 > x && x1 < x+w && y1 > y && y1 < y+h) return true; return false
}
function cycleButton(x, y, min, max, w, h, val){
    this.x = x;
    this.y = y;
    this.min = min;
    this.max = max;
    this.value = val;
    this.w = w;
    this.h = h;
    this.press = function(){
        if(posTouched[2] && overlapsRect(this.x, this.y, this.w/2,this.h,posTouched[0], posTouched[1])){
            this.value = (this.value-1) % this.max;
            if(this.value < this.min) this.value = this.max-1
        }
        if(posTouched[2] && overlapsRect(this.x + this.w/2, this.y, this.w/2,this.h,posTouched[0], posTouched[1])){
            this.value = (this.value+1) % this.max;
        }
    }
    this.draw = function(){
        push()
        textAlign(CENTER, CENTER);
        textSize(mindim/8)
        translate(x, y)
        stroke(0)
        strokeWeight(mindim/100)
        rect(0,0,this.w,this.h, this.w/10)
        text(this.value, this.w/2, this.h/2)
        pop()
    }
}