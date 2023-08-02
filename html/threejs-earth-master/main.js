let targetRotationX = 0.05;
let targetRotationY = 0.02;
let mouseX = 0, mouseXOnMouseDown = 0, mouseY = 0, mouseYOnMouseDown = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;
const slowingFactor = 0.98;
const dragFactor = 0.0002;





function onDocumentMouseDown( event ) {
    event.preventDefault();
    document.addEventListener('mousemove', onDocumentMouseMove, false );
    document.addEventListener('mouseup', onDocumentMouseUp, false );
    mouseXOnMouseDown = event.clientX - windowHalfX;
    mouseYOnMouseDown = event.clientY - windowHalfY;
}

function onDocumentMouseMove( event ) {
    mouseX = event.clientX - windowHalfX;
    targetRotationX = ( mouseX - mouseXOnMouseDown ) * dragFactor;
    mouseY = event.clientY - windowHalfY;
    targetRotationY = ( mouseY - mouseYOnMouseDown ) * dragFactor;
}

function onDocumentMouseUp( event ) {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
}

function main()
{
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#globe')});
    renderer.setSize(window.innerWidth, window.innerHeight);

    // create earthGeometry
    const earthGeometry = new THREE.SphereGeometry(0.5,32,32);
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('texture/earthmap.jpeg'),
        bumpMap: new THREE.TextureLoader().load('texture/earthbump.jpeg'),
        bumpScale: 0.01,
    });
    const earthMesh = new THREE.Mesh(earthGeometry,earthMaterial);
    scene.add(earthMesh);

    // set ambientlight
    const ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientlight);
    // set point light
    const pointerlight =  new THREE.PointLight(0xffffff,0.9);
    // set light position
    pointerlight.position.set(5,3,5);
    scene.add(pointerlight);

    // create cloudGeometry
    const cloudGeometry =  new THREE.SphereGeometry(0.52,32,32);
    const cloudMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('texture/earthCloud.png'),
        transparent: true
    });
    const cloudMesh = new THREE.Mesh(cloudGeometry,cloudMaterial);
    scene.add(cloudMesh);

    // create starGeometry
    const starGeometry =  new THREE.SphereGeometry(5,64,64);
    const starMaterial = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('texture/galaxy.png'),
        side: THREE.BackSide
    });
    const starMesh = new THREE.Mesh(starGeometry,starMaterial);
    scene.add(starMesh);

    // Add the camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1.5;

    // create pinGeometry
    const pinGeometry = new THREE.SphereGeometry(0.5,32,32);
    const pinMaterial = new THREE.MeshPhongMaterial({color:0xFF0000});
    const pinMesh = new THREE.Mesh(pinGeometry,pinMaterial);
    scene.add(pinMesh);
    pinMesh.position.setFromSphericalCoords(0.5, Math.PI/2 * (90 - 25.6689144805785)/90, Math.PI/2 * (90 - 80.38560870000387)/90)
    pinMesh.scale.x = 0.01
    pinMesh.scale.y = 0.01
    pinMesh.scale.z = 0.01

    scene.rotation.x = 0.75

    fetch('./parks.json')
    .then((response) => response.json())
    .then((json) => {
        json.forEach((park) => {
            var material = (park.Status == "Visited") ? new THREE.MeshPhongMaterial({color:0x00FF00}) : new THREE.MeshPhongMaterial({color:0xFF0000});
            var newPin = new THREE.Mesh(pinGeometry,material);
            scene.add(newPin);
            newPin.position.setFromSphericalCoords(0.5, Math.PI/2 * (90 - park.Latitude)/90, Math.PI/2 * (90 + park.Longitude)/90)
            newPin.scale.x = 0.01
            newPin.scale.y = 0.01
            newPin.scale.z = 0.01
        })
        
    });

    var locations = []
    fetch('./locations.json')
    .then((response) => response.json())
    .then((json) => {
        json.forEach((location) => {
            var material = new THREE.MeshPhongMaterial({color:0x00FFFF});
            var newPin = new THREE.Mesh(pinGeometry,material);
            scene.add(newPin);
            newPin.position.setFromSphericalCoords(0.5, Math.PI/2 * (90 - location.Latitude)/90, Math.PI/2 * (90 + location.Longitude)/90)
            newPin.scale.x = 0.01
            newPin.scale.y = 0.01
            newPin.scale.z = 0.01
            locations.push(newPin)
        })
        
    });

    
    var INTERSECTED;
    var theta = 0;
    const pointer = new THREE.Vector2();
    const radius = 100;
    var raycaster = new THREE.Raycaster();
    document.addEventListener( 'mousemove', onPointerMove );

    function onPointerMove( event ) {
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }
    
    function highlightMouseHover(){ //turns the closest object to the mouse red
        camera.updateMatrixWorld();
        raycaster.setFromCamera( pointer, camera );
        // const intersects = raycaster.intersectObjects( scene.children, false );
        const intersects = raycaster.intersectObjects( locations, false );
        if ( intersects.length > 0 ) { //If there is an intersection
            if ( INTERSECTED != intersects[ 0 ].object ) { //If it's a new intersection
                if(INTERSECTED != null) INTERSECTED.material.color.setHex( 0x00FFFF );
                INTERSECTED = intersects[ 0 ].object;
                INTERSECTED.material.color.setHex( 0xFF0000 );
            }
        } else { //If there are no intersections:
            if(INTERSECTED != null)INTERSECTED.material.color.setHex( 0x00FFFF );
            INTERSECTED = null;
        }
    }

    const render = () => {
        // earthMesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), targetRotationX);
        // earthMesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), targetRotationY);
        // cloudMesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), targetRotationX);
        // cloudMesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), targetRotationY);

        scene.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), targetRotationX);
        // scene.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), targetRotationY);
        targetRotationY = targetRotationY * slowingFactor;
        targetRotationX = targetRotationX * slowingFactor;

        

        cloudMesh.rotation.y += 0.001
        renderer.render(scene,camera);
    }
    var update = function(){
        highlightMouseHover()
    }
    const animate = () =>{
        requestAnimationFrame(animate);
        update();
        render();
    }
    animate();
    document.addEventListener('mousedown', onDocumentMouseDown, false );
}
window.onload = main;