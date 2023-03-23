
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
}
function draw() {
    if(mydata == null){
        console.log("waiting")
        return;
    }
    for(var j = 0; j < 15; j++){
        var day = mydata.days[j]
        for(var i = 0; i < 24; i++){
            var hour = day.hours[i]
            fill(100 * (1-((hour.feelslike + 40) / 150)), 100, 100)
            //rect(j * mindim/15, i * mindim/24, mindim/15, mindim/24)
            noStroke()
            rect(i * mindim/24, j * mindim/15, mindim/24, mindim/15)
        }
    }
    fill(0)
    drawLocationName();
    drawHourLine();
}
function drawLocationName(){
    push()
    translate(mindim/2, mindim * 1.1)
    textSize(mindim/15)
    textAlign(CENTER);
    text(location_full_name, 0,0)
    pop()
}
function datetime(){
    var today = new Date();
    return [today.getFullYear(),today.getMonth()+1,today.getDate(),today.getHours(),today.getMinutes(),today.getSeconds()]
}
function drawHourLine(){
    push()
    var dt = datetime()
    strokeWeight(5).noFill().stroke(0)
    rect((dt[3] + dt[4]/60) * mindim/24, 0 * mindim/15, mindim/24, mindim/15)
    pop()
}