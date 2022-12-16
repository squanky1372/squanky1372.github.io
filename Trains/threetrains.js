import { data, TrainLine, LineTrain, reloadTrains} from "./data.js";

//Set up scene with camera
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.setSize(window.innerWidth, window.innerHeight);
document .body.appendChild(renderer.domElement);
//Set camera position
camera.position.z = 5;
camera.position.y = 5;
camera.rotation.x = -1;

//Ground plane creation
var geometry = new THREE.BoxGeometry(10,10,0.1);
var material = new THREE.MeshStandardMaterial({
    color:0x119911, 
    wireframe:false,

});
var ground = new THREE.Mesh(geometry, material);
scene.add(ground);
ground.rotation.x -= (Math.PI/2);
ground.position.y -= 0.2

// //Light creation
var light = new THREE.PointLight( 0xFFFFFF, 2, 100 );
light.position.set( 0, 50, 0 );
light.castShadow = true;
scene.add( light );

//orbit controls
// const controls = new OrbitControls(camera, renderer.domElement);


//make one train
var makeTrain = function(x, y, heading, color=0x00FFFF){
    var scale = 0.05
    var traingeo = new THREE.BoxGeometry(scale, scale, scale*5);
    var trainmat = new THREE.MeshPhongMaterial({
        color:color, 
        wireframe:false
    });
    var train = new THREE.Mesh(traingeo, trainmat);
    scene.add(train);
    train.position.x = x;
    train.position.z = y;
    train.rotation.y = heading;

    //color, intensity, distance, angle, penumbra, decay
    // var light = new THREE.SpotLight(0xFFFFFF, 0.2, 4);
    var light = new THREE.PointLight( 0xFFFFFF, 2, 0.3 );
    train.add( light );
    light.position.z += scale*2.5;
    // light.castShadow = true;

    return train;
}

var makeStation = function(x, y){
    var stationgeo = new THREE.BoxGeometry(0.05,0.005,0.05);
    var stationmat = new THREE.MeshPhongMaterial({
        color:0xFF0000, 
        wireframe:false
    });
    var station = new THREE.Mesh(stationgeo, stationmat);
    scene.add(station);
    station.position.x = x;
    station.position.z = y;
    return station;
}

function mapToScreen(lat, lon){
    let scale = 9
    let offset = [3.5,4.7]
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
        let theta = (c.heading) * 3.14 / 180
        makeTrain(x, y, -theta, line.color_hex)
    })
    console.log(line.color_hex)
}

data.lines.forEach((c,index)=>{
    drawLine(c);
})

data.stationslist.forEach((c,index)=>{
    let x = mapToScreen(c.lat, c.lon)[0]
    let y = mapToScreen(c.lat, c.lon)[1]
    makeStation(x,y)
})

var update = function(){

};
var render = function(){
    renderer.render(scene, camera);
}

var GameLoop = function(){
    requestAnimationFrame(GameLoop);
    update();
    render();
}
GameLoop();