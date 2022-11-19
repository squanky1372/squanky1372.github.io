// A place for utility functions, if you need any
import { hexToHSL} from "./utilities.js";

import trains from "./data/train.json" assert {type:"json"};
import redlinedata from "./data/redline.json" assert {type:"json"};
import purplelinedata from "./data/purpleline.json" assert {type:"json"};
import bluelinedata from "./data/blueline.json" assert {type:"json"};
import orangelinedata from "./data/orangeline.json" assert {type:"json"};
import yellowlinedata from "./data/yellowline.json" assert {type:"json"};
import greenlinedata from "./data/greenline.json" assert {type:"json"};
import pinklinedata from "./data/pinkline.json" assert {type:"json"};
import brownlinedata from "./data/brownline.json" assert {type:"json"};

import stationsdata from "./data/stations.json" assert {type:"json"};

console.log("....Loading data");

class Station{
  constructor({id,dir,name,lat,lon}){
    this.id = id
    this.dir = dir
    this.name = name
    this.lat = lat
    this.lon = lon
  }
}
let stationslist = stationsdata.response.row[0].row.map((c)=>new Station({id:c.stop_id, dir:c.direction_id, name:c.station_name, lat:c.location._latitude, lon:c.location._longitude}))
console.log(stationslist)

class TrainLine{
  constructor({name, color, trains, index, id}){
    this.name = name;
    this.color = color;
    this.trains = trains;
    this.index = index;
    this.id = id;
  }
}
class LineTrain{
  constructor({runnum, dest, next, prdt, arrT, lat, lon, heading}){
    this.runnum = runnum;
    this.dest = dest;
    this.next = next;
    this.prdt = prdt;
    this.arrT = arrT;
    this.lat = lat;
    this.lon = lon;
    this.heading = heading;
  }
}

var reloadTrains = async function(id, index){
  let url = `https://lapi.transitchicago.com/api/1.0/ttpositions.aspx?key=26c8b70b58a740168f700535f8fd7046&rt=${id}&outputType=JSON`;
  return await fetch(url).then(out => out.json()).then((out) => {
    let newtrains = out.ctatt.route[0].train.map((c) => new LineTrain({runnum:c.rn, dest:c.destNm, next:c.nextStaNm, prdt:c.prdt, arrT:c.arrT, lat:c.lat, lon:c.lon, heading:c.heading}))
    lines[index].trains = newtrains
  });
}

let lines = [null, null, null, null, null, null, null, null]

var lineNames = ["Red Line", "Orange Line", "Yellow Line", "Green Line", "Blue Line", "Purple Line", "Pink Line", "Brown Line"]
var colors = ["#FF0000", "#FF8800", "#FFFF00", "#00FF00", "#0000FF", "#9900FF", "#FF0099", "#555500"]
var linedata = [redlinedata, orangelinedata, yellowlinedata, greenlinedata, bluelinedata, purplelinedata, pinklinedata, brownlinedata]
var indices = [0,1,2,3,4,5,6,7]
var ids = ["red", "org", "y", "g", "blue", "p", "pink", "brn"]

for(var i = 0; i < 8; i++){
  lines[i] = new TrainLine({
    name:lineNames[i],
    color:hexToHSL(colors[i]),
    trains:linedata[i].ctatt.route[0].train.map((c) => new LineTrain({runnum:c.rn, dest:c.destNm, next:c.nextStaNm, prdt:c.prdt, arrT:c.arrT, lat:c.lat, lon:c.lon, heading:c.heading})),
    index:indices[i],
    id:ids[i]
  })
}

let data = {
  lines:lines,
  stationslist:stationslist
};

export { data, TrainLine, LineTrain, reloadTrains };