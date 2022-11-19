import { data, TrainLine, LineTrain, reloadTrains} from "./data.js";

console.log("Loaded data", data);

window.addEventListener("load", function () {
  // VUE!!!
  // Create a new vue interface

  new Vue({
    template: 
      `<div id="app">
	    <div ref="canvasHolder"></div>		
      </div>`,

    mounted() {
      // Create P5 when we mount this element
      const s = (p0) => {
        p = p0;

        (p.preload = () => {
          // Any preloading
        }),
          (p.setup = () => {
            p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
            p.colorMode(p.HSL, 360, 100, 100);
            p.ellipseMode(p.RADIUS);
            p.background(360, 10, 360, 1)
          });

        var indexer = 0;
        
        //var lines = [ data.redline, data.orangeline, data.yellowline, data.greenline, data.blueline, data.purpleline, data.pinkline, data.brownline]
        var lines = data.lines
        var selectedTrain = null;
        
        p.draw = (t) => {
          //console.log(indexer);
          indexer++;
          p.background(360, 10, 360, 0.02)
          if(indexer % 200 == 99){
            //p.fill(360, 1)
            lines.forEach((c,index) =>{
              reloadTrains(c.id, c.index)
            })
          }
          function mapToScreen(lat, lon){
            let scale = 500
              let offset = [500,550]
              let ptmax = [42.07390350278101, -87.69105236140167]
              let ptmin = [41.72189250243234, -87.62442318028674]
              let y = -(lat - ptmin[0]) / (ptmax[0]-ptmin[0]) * scale + offset[1]
              let x = (lon - ptmin[1]) / (ptmax[0]-ptmin[0]) * scale + offset[0]
              return [x,y]
          }
          function drawLine(line){
            //console.log(line.name)
            line.trains.forEach((c, index) =>{
              let trainSize = 4
              let x = mapToScreen(c.lat, c.lon)[0]
              let y = mapToScreen(c.lat, c.lon)[1]
              let theta = (c.heading-90) * 3.14 / 180
              p.fill(...line.color)
              p.circle(x,y,trainSize)
              p.circle(x + (trainSize - 1)*Math.cos(theta), y + (trainSize - 1)*Math.sin(theta), (trainSize - 1))
              
              let d = p.dist(p.mouseX, p.mouseY, x,y)
              if(d<(trainSize)){
                selectedTrain = [c,line.name,line.color,line.index, line.id];
              }
            })
          }
          function drawStations(){
            data.stationslist.forEach((c,index)=>{
              let x = mapToScreen(c.lat, c.lon)[0]
              let y = mapToScreen(c.lat, c.lon)[1]
              p.fill(0)
              p.circle(x,y,1)
            })
          }
          function parseTime(time){
            let newtime = time.substring(11,19)
            let hour = parseInt(newtime.substring(0,2))
            let minute = parseInt(newtime.substring(3,5))
            let second = parseInt(newtime.substring(6,8))
            //console.log(hour,minute,second)
            return[hour,minute,second]
          }
          function writeTime(time){
            if(time[0] > 12) time[0] = time[0] - 12
            let minute2 = time[1] + ""
            if(time[1] < 10) minute2 = "0" + time[1]
            return time[0]+":"+minute2
          }
          function deltaTime(time1, time2){
            console.log("subtracting "+ time2 + " from " + time1)
            let dminutes = time1[0]*60 + time1[1] - time2[0]*60 - time2[1]
            let minutes = dminutes % 60
            let hours = Math.floor(dminutes / 60)
            return[hours, minutes, 0]
          }
          function drawTrainData(){
            if(selectedTrain == null){
              p.fill(0,100,100)
              p.noStroke()
              p.rect(0,0,400,70)
              p.rect(0,0,1600,30)
              p.stroke(0, 0, 0)
              return;
            }
            p.fill(0,100,100)
            p.noStroke()
            p.rect(0,0,500,30)
            p.rect(0,0,400,70)
            p.textSize(20);
            p.stroke(0, 0, 0)
            p.fill(...selectedTrain[2]);
            p.text(selectedTrain[1] + " train number " + selectedTrain[0].runnum + " to " + selectedTrain[0].dest, 10,20);
            p.text("Approaching " + selectedTrain[0].next, 10,40);
            p.text("Arrives at " + writeTime(parseTime(selectedTrain[0].arrT)) + " (" + deltaTime(parseTime(selectedTrain[0].arrT), parseTime(selectedTrain[0].prdt))[1] + " minute(s))", 10,60);
            //p.noStroke()
          }
          
          drawStations();
          
          selectedTrain = null;
          for(var i = 0; i < 8; i++){
            drawLine(lines[i])
          }
          drawTrainData();
          
          
        };

        p.mouseClicked = () => {
          // Mouse interaction
        };
      };

      let p = undefined;
      const CANVAS_WIDTH = 800;
      const CANVAS_HEIGHT = 800;
      // Create P5
      const CANVAS_EL = this.$refs.canvasHolder;
      CANVAS_EL.style.width = CANVAS_WIDTH + "px";
      CANVAS_EL.style.height = CANVAS_HEIGHT + "px";
      new p5(s, CANVAS_EL);
    },

    // We will use your data object as the data for Vue
    data() {
      data.colorName = "purple"
      return data;
    },
    el: "#app",
  });
});
