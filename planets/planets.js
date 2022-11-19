// for WebGL usage:--------------------
var gl;													// WebGL rendering context -- the 'webGL' object
																// in JavaScript with all its member fcns & data
var g_canvasID;									// HTML-5 'canvas' element ID#

// For multiple VBOs & Shaders:-----------------
worldBox = new VBObox0();		  // Holds VBO & shaders for 3D 'world' ground-plane grid, etc;
gouraudBox = new VBObox1();		  // "  "  for first set of custom-shaded 3D parts
phongBox = new VBObox2();     // "  "  for second set of custom-shaded 3D parts
noneBox = new VBObox3();
gouraudBPBox = new VBObox4();
phongBPBox = new VBObox5();

ambientColor = new Vector3();
diffuseColor = new Vector3();
specularColor = new Vector3();
lightPos = new Vector3();

ambientToggle = true;
diffuseToggle = true;
specularToggle = true;

planetsToggle = true;
treesToggle = false;
fingersToggle = false;

// For animation:---------------------
var g_lastMS = Date.now();			// Timestamp (in milliseconds) for our 
                                // most-recently-drawn WebGL screen contents.  
                                // Set & used by moveAll() fcn to update all
                                // time-varying params for our webGL drawings.
  // All time-dependent params (you can add more!)
var g_angleNow0  =  0.0; 			  // Current rotation angle, in degrees.
var g_angleRate0 = 45.0;				// Rotation angle rate, in degrees/second.
                                //---------------
var g_angleNow1  = 100.0;       // current angle, in degrees
var g_angleRate1 =  95.0;        // rotation angle rate, degrees/sec
var g_angleMax1  = 150.0;       // max, min allowed angle, in degrees
var g_angleMin1  =  60.0;
                                //---------------
var g_angleNow2  =  0.0; 			  // Current rotation angle, in degrees.
var g_angleRate2 = -62.0;				// Rotation angle rate, in degrees/second.

                                //---------------
var g_posNow0 =  0.0;           // current position
var g_posRate0 = 0.6;           // position change rate, in distance/second.
var g_posMax0 =  0.5;           // max, min allowed for g_posNow;
var g_posMin0 = -0.5;           
                                // ------------------
var g_posNow1 =  0.0;           // current position
var g_posRate1 = 0.5;           // position change rate, in distance/second.
var g_posMax1 =  1.0;           // max, min allowed positions
var g_posMin1 = -1.0;
                                //---------------

// For mouse/keyboard:------------------------
var g_show0 = 0;								// 0==Show, 1==Hide VBO0 contents on-screen.
var g_show1 = 1;								// 	"					"			VBO1		"				"				" 
var g_show2 = 1;                //  "         "     VBO2    "       "       "
var g_show3 = 1;                //  "         "     VBO2    "       "       "
var g_show4 = 1;                //  "         "     VBO2    "       "       "

var g_show_num = 1;

// GLOBAL CAMERA CONTROL:					// 
g_worldMat = new Matrix4();				// Changes CVV drawing axes to 'world' axes.
g_mvpMat = new Matrix4();
// (equivalently: transforms 'world' coord. numbers (x,y,z,w) to CVV coord. numbers)
// WHY?
// Lets mouse/keyboard functions set just one global matrix for 'view' and 
// 'projection' transforms; then VBObox objects use it in their 'adjust()'
// member functions to ensure every VBObox draws its 3D parts and assemblies
// using the same 3D camera at the same 3D position in the same 3D world).

var posX = 4;
var posY = 4;
var posZ = 2.3;
var angleH = 15.5*Math.PI/12;
var angleV = 7*Math.PI/12;

function main() {
//=============================================================================
  // Retrieve the HTML-5 <canvas> element where webGL will draw our pictures:
  g_canvasID = document.getElementById('webgl');	
  // Create the the WebGL rendering context: one giant JavaScript object that
  // contains the WebGL state machine adjusted by large sets of WebGL functions,
  // built-in variables & parameters, and member data. Every WebGL function call
  // will follow this format:  gl.WebGLfunctionName(args);

  // Create the the WebGL rendering context: one giant JavaScript object that
  // contains the WebGL state machine, adjusted by big sets of WebGL functions,
  // built-in variables & parameters, and member data. Every WebGL func. call
  // will follow this format:  gl.WebGLfunctionName(args);
  //SIMPLE VERSION:  gl = getWebGLContext(g_canvasID); 
  // Here's a BETTER version:
  gl = g_canvasID.getContext("webgl", { preserveDrawingBuffer: true});
	// This fancier-looking version disables HTML-5's default screen-clearing, so 
	// that our drawMain() 
	// function will over-write previous on-screen results until we call the 
	// gl.clear(COLOR_BUFFER_BIT); function. )
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.clearColor(0.2, 0.2, 0.2, 1);	  // RGBA color for clearing <canvas>

  gl.enable(gl.DEPTH_TEST);

  window.addEventListener("keydown", myKeyDown, false);

  // Initialize each of our 'vboBox' objects: 
  worldBox.init(gl);		// VBO + shaders + uniforms + attribs for our 3D world,
                        // including ground-plane,                       
  gouraudBox.init(gl);		//  "		"		"  for 1st kind of shading & lighting
	phongBox.init(gl);    //  "   "   "  for 2nd kind of shading & lighting
  noneBox.init(gl);
  gouraudBPBox.init(gl);
  phongBPBox.init(gl);

  ambientColor.x = 0.02;
  ambientColor.y = 0.0;
  ambientColor.z = 0.01;

  diffuseColor.x = 1;
  diffuseColor.y = 1;
  diffuseColor.z = 0.8;

  specularColor.x = 1;
  specularColor.y = 1;
  specularColor.z = 1;

  lightPos.x = 0.0;
  lightPos.y = 0.0;
  lightPos.z = 0.0;
	
  setCamera();				// TEMPORARY: set a global camera used by ALL VBObox objects...
	
  gl.clearColor(0.2, 0.2, 0.2, 1);	  // RGBA color for clearing <canvas>
  drawResize();
  
  // ==============ANIMATION=============
  // Quick tutorials on synchronous, real-time animation in JavaScript/HTML-5: 
  //    https://webglfundamentals.org/webgl/lessons/webgl-animation.html
  //  or
  //  	http://creativejs.com/resources/requestanimationframe/
  //		--------------------------------------------------------
  // Why use 'requestAnimationFrame()' instead of the simpler-to-use
  //	fixed-time setInterval() or setTimeout() functions?  Because:
  //		1) it draws the next animation frame 'at the next opportunity' instead 
  //			of a fixed time interval. It allows your browser and operating system
  //			to manage its own processes, power, & computing loads, and to respond 
  //			to on-screen window placement (to skip battery-draining animation in 
  //			any window that was hidden behind others, or was scrolled off-screen)
  //		2) it helps your program avoid 'stuttering' or 'jittery' animation
  //			due to delayed or 'missed' frames.  Your program can read and respond 
  //			to the ACTUAL time interval between displayed frames instead of fixed
  //		 	fixed-time 'setInterval()' calls that may take longer than expected.
  //------------------------------------
  var tick = function() {		    // locally (within main() only), define our 
                                // self-calling animation function. 
    requestAnimationFrame(tick, g_canvasID); // browser callback request; wait
                                // til browser is ready to re-draw canvas, then
    timerAll();  // Update all time-varying params, and
    drawAll();                // Draw all the VBObox contents
    };
  //------------------------------------
  tick();                       // do it again!
}

function timerAll() {
//=============================================================================
// Find new values for all time-varying parameters used for on-screen drawing
  // use local variables to find the elapsed time.
  var nowMS = Date.now();             // current time (in milliseconds)
  var elapsedMS = nowMS - g_lastMS;   // 
  g_lastMS = nowMS;                   // update for next webGL drawing.
  if(elapsedMS > 1000.0) {            
    // Browsers won't re-draw 'canvas' element that isn't visible on-screen 
    // (user chose a different browser tab, etc.); when users make the browser
    // window visible again our resulting 'elapsedMS' value has gotten HUGE.
    // Instead of allowing a HUGE change in all our time-dependent parameters,
    // let's pretend that only a nominal 1/30th second passed:
    elapsedMS = 1000.0/30.0;
    }
  // Find new time-dependent parameters using the current or elapsed time:
  // Continuous rotation:
  g_angleNow0 = g_angleNow0 + (g_angleRate0 * elapsedMS) / 1000.0;
  g_angleNow1 = g_angleNow1 + (g_angleRate1 * elapsedMS) / 1000.0;
  g_angleNow2 = g_angleNow2 + (g_angleRate2 * elapsedMS) / 1000.0;
  //g_angleNow0 %= 360.0;   // keep angle >=0.0 and <360.0 degrees  
  g_angleNow1 %= 360.0;   
  g_angleNow2 %= 360.0;
  if(g_angleNow1 > g_angleMax1) { // above the max?
    g_angleNow1 = g_angleMax1;    // move back down to the max, and
    g_angleRate1 = -g_angleRate1; // reverse direction of change.
    }
  else if(g_angleNow1 < g_angleMin1) {  // below the min?
    g_angleNow1 = g_angleMin1;    // move back up to the min, and
    g_angleRate1 = -g_angleRate1;
    }
  // Continuous movement:
  g_posNow0 += g_posRate0 * elapsedMS / 1000.0;
  g_posNow1 += g_posRate1 * elapsedMS / 1000.0;
  // apply position limits
  if(g_posNow0 > g_posMax0) {   // above the max?
    g_posNow0 = g_posMax0;      // move back down to the max, and
    g_posRate0 = -g_posRate0;   // reverse direction of change
    }
  else if(g_posNow0 < g_posMin0) {  // or below the min? 
    g_posNow0 = g_posMin0;      // move back up to the min, and
    g_posRate0 = -g_posRate0;   // reverse direction of change.
    }
  if(g_posNow1 > g_posMax1) {   // above the max?
    g_posNow1 = g_posMax1;      // move back down to the max, and
    g_posRate1 = -g_posRate1;   // reverse direction of change
    }
  else if(g_posNow1 < g_posMin1) {  // or below the min? 
    g_posNow1 = g_posMin1;      // move back up to the min, and
    g_posRate1 = -g_posRate1;   // reverse direction of change.
    }

}

function drawAll() {
//=============================================================================
  // Clear on-screen HTML-5 <canvas> object:
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

var b4Draw = Date.now();
var b4Wait = b4Draw - g_lastMS;

OldsetCamera();

gl.viewport(0,						// Viewport lower-left corner
				0, 						// location(in pixels)
				g_canvasID.width, 		// viewport width,
				g_canvasID.height);		// viewport height in pixels.


	if(g_show0 == 1) {	// IF user didn't press HTML button to 'hide' VBO0:
	  worldBox.switchToMe();  // Set WebGL to render from this VBObox.
		worldBox.adjust();		  // Send new values for uniforms to the GPU, and
		worldBox.draw();			  // draw our VBO's contents using our shaders.
  }
  if(g_show_num == 1) { // IF user didn't press HTML button to 'hide' VBO1:
    gouraudBox.switchToMe();  // Set WebGL to render from this VBObox.
  	gouraudBox.adjust();		  // Send new values for uniforms to the GPU, and
  	gouraudBox.draw();			  // draw our VBO's contents using our shaders.
  }
	else if(g_show_num == 2) { // IF user didn't press HTML button to 'hide' VBO2:
	  phongBox.switchToMe();  // Set WebGL to render from this VBObox.
  	phongBox.adjust();		  // Send new values for uniforms to the GPU, and
  	phongBox.draw();			  // draw our VBO's contents using our shaders.
  }
  if(g_show_num == 3) { // IF user didn't press HTML button to 'hide' VBO2:
    noneBox.switchToMe();  // Set WebGL to render from this VBObox.
    noneBox.adjust();		  // Send new values for uniforms to the GPU, and
    noneBox.draw();			  // draw our VBO's contents using our shaders.
  }
  if(g_show_num == 4) { // IF user didn't press HTML button to 'hide' VBO2:
    gouraudBPBox.switchToMe();  // Set WebGL to render from this VBObox.
    gouraudBPBox.adjust();		  // Send new values for uniforms to the GPU, and
    gouraudBPBox.draw();			  // draw our VBO's contents using our shaders.
  }
  if(g_show_num == 5) { // IF user didn't press HTML button to 'hide' VBO2:
    phongBPBox.switchToMe();  // Set WebGL to render from this VBObox.
    phongBPBox.adjust();		  // Send new values for uniforms to the GPU, and
    phongBPBox.draw();			  // draw our VBO's contents using our shaders.
  }

    
}

function VBO0toggle() {
//=============================================================================
// Called when user presses HTML-5 button 'Show/Hide VBO0'.
  if(g_show0 != 1) g_show0 = 1;				// show,
  else g_show0 = 0;										// hide.
  console.log('g_show0: '+g_show0);
}

function VBO1toggle() {
//=============================================================================
// Called when user presses HTML-5 button 'Show/Hide VBO1'.
  if(g_show1 != 1) g_show1 = 1;			// show,
  else g_show1 = 0;									// hide.
  console.log('g_show1: '+g_show1);
  g_show_num = 1;
}

function VBO2toggle() {
  //=============================================================================
  // Called when user presses HTML-5 button 'Show/Hide VBO2'.
    if(g_show2 != 1) g_show2 = 1;			// show,
    else g_show2 = 0;									// hide.
    console.log('g_show2: '+g_show2);
    g_show_num = 2;
  }

function VBO3toggle() {
  //=============================================================================
  // Called when user presses HTML-5 button 'Show/Hide VBO2'.
    if(g_show2 != 1) g_show2 = 1;			// show,
    else g_show2 = 0;									// hide.
    console.log('g_show3');
    g_show_num = 3;
  }

function VBO4toggle() {
  //=============================================================================
  // Called when user presses HTML-5 button 'Show/Hide VBO2'.
  if(g_show2 != 1) g_show2 = 1;			// show,
  else g_show2 = 0;									// hide.
  console.log('g_show4');
  g_show_num = 4;
}
function VBO5toggle() {
//=============================================================================
// Called when user presses HTML-5 button 'Show/Hide VBO2'.
  if(g_show2 != 1) g_show2 = 1;			// show,
  else g_show2 = 0;									// hide.
  console.log('g_show5');
  g_show_num = 5;
} 

function setCamera(){
  g_mvpMat.setIdentity();
  //g_mvpMat.set(g_worldMat);
	g_mvpMat.perspective(42.0,   // FOVY: top-to-bottom vertical image angle, in degrees
  										1.0,   // Image Aspect Ratio: camera lens width/height
                      1.0,   // camera z-near distance (always positive; frustum begins at z = -znear)
                      200.0);  // camera z-far distance (always positive; frustum ends at z = -zfar)

  var xlook = posX + 10 * Math.cos(angleH);
	var ylook = posY + 10 * Math.sin(angleH);
	var zlook = posZ + 10 * Math.cos(angleV);

	g_mvpMat.lookAt( posX, posY, posZ,	// center of projection
                   xlook, ylook, zlook,	// look-at point 
                   0, 0, 1);	// View UP vector.
  //g_worldMat.set(g_mvpMat);
}

function makeAngle(period, angle, min, max){
	return (max-min)/2*Math.sin(period * Math.PI*angle/180) + (max-min)/2;
}

function OldsetCamera(){
  g_worldMat.setIdentity();
  var vpAspect = g_canvasID.width / g_canvasID.height;
	g_worldMat.perspective(42.0,   // FOVY: top-to-bottom vertical image angle, in degrees
  										vpAspect,   // Image Aspect Ratio: camera lens width/height
                      1.0,   // camera z-near distance (always positive; frustum begins at z = -znear)
                      2000.0);  // camera z-far distance (always positive; frustum ends at z = -zfar)

  var xlook = posX + 10 * Math.cos(angleH);
	var ylook = posY + 10 * Math.sin(angleH);
	var zlook = posZ + 10 * Math.cos(angleV);

	g_worldMat.lookAt( posX, posY, posZ,	// center of projection
						            xlook, ylook, zlook,	// look-at point 
						            0, 0, 1);	// View UP vector.
  g_mvpMat.set(g_worldMat);
}

function drawResize() {
  //==============================================================================
  // Called when user re-sizes their browser window , because our HTML file
  // contains:  <body onload="main()" onresize="drawResize()">
  
    //Report our current browser-window contents:
  
    console.log('g_Canvas width,height=', g_canvasID.width, g_canvasID.height);		
    console.log('Browser window: innerWidth,innerHeight=', innerWidth, innerHeight);	
    
    //Make canvas fill the top 3/4 of our browser window:
    var xtraMargin = 32;    // keep a margin (otherwise, browser adds scroll-bars)
    g_canvasID.width = innerWidth - xtraMargin;
    g_canvasID.height = (innerHeight*3/4) - xtraMargin;
    // IMPORTANT!  Need a fresh drawing in the re-sized viewports.
    drawAll();				// draw in all viewports.
  }

function myKeyDown(kev) {

  // Report EVERYTHING in console:
    console.log(  "--kev.code:",    kev.code,   "\t\t--kev.key:",     kev.key, 
                "\n--kev.ctrlKey:", kev.ctrlKey,  "\t--kev.shiftKey:",kev.shiftKey,
                "\n--kev.altKey:",  kev.altKey,   "\t--kev.metaKey:", kev.metaKey);
    
    switch(kev.code) {
  
      //3-axis movement (WASD+QZ)
      
      case "KeyW":
        posY = posY + Math.sin(angleH)*Math.sin(angleV);
        posX = posX + Math.cos(angleH)*Math.sin(angleV);
        posZ = posZ + Math.cos(angleV);
        break;
      case "KeyA":
        posY = posY + Math.sin(angleH + Math.PI/2);
        posX = posX + Math.cos(angleH + Math.PI/2);
        break;
      case "KeyS":
        posY = posY - Math.sin(angleH)*Math.sin(angleV);
        posX = posX - Math.cos(angleH)*Math.sin(angleV);
        posZ = posZ - Math.cos(angleV);
        break;
      case "KeyD":
        posY = posY - Math.sin(angleH + Math.PI/2);
        posX = posX - Math.cos(angleH + Math.PI/2);
        break;
      case "KeyQ":
        posZ++;
        break;
      case "KeyZ":
        posZ--;
        break;
  
/*       //------------------5 up and down keys-----------------
  
      case "KeyE":
        keyVal3 = keyVal3 - speedVal3;
        break;
      case "KeyR":
        keyVal4 = keyVal4 - speedVal4;
        break;
      case "KeyT":
        keyVal5 = keyVal5 - speedVal5;
        break;
      case "KeyY":
        keyVal6 = keyVal6 - speedVal6;
        break;
      case "KeyU":
        keyVal7 = keyVal7 - speedVal7;
        break;
  
  
      case "Digit3":
        keyVal3 = keyVal3 + speedVal3;
        break;
      case "Digit4":
        keyVal4 = keyVal4 + speedVal4;
        break;
      case "Digit5":
        keyVal5 = keyVal5 + speedVal5;
        break;
      case "Digit6":
        keyVal6 = keyVal6 + speedVal6;
        break;
      case "Digit7":
        keyVal7 = keyVal7 + speedVal7;
        break; */
  
      //Arrow keys
  
      case "ArrowUp":
        angleV = angleV - 0.1;
        break;
      case "ArrowDown":
        angleV = angleV + 0.1;
        break;
      case "ArrowLeft":
        angleH = angleH + 0.1;
        break;
      case "ArrowRight":
        angleH = angleH - 0.1;
        break;
      
    default:
      console.log("UNUSED!");
      break;
    }
    console.log(angleH, angleV, posX, posY, posZ);
  }

  function setAmbient() {
    var val1 = parseFloat(document.getElementById('input1').value);	
    var val2 = parseFloat(document.getElementById('input2').value);	
    var val3 = parseFloat(document.getElementById('input3').value);
    console.log('New ambient RGB: ', val1, ' ', val2, ' ', val3); // print in console, and
    ambientColor.x = val1;
    ambientColor.y = val2;
    ambientColor.z = val3;
    console.log('New ambient RGB: ', ambientColor); // print in console, and
  };
  function setDiffuse() {
    var val1 = parseFloat(document.getElementById('input1').value);	
    var val2 = parseFloat(document.getElementById('input2').value);	
    var val3 = parseFloat(document.getElementById('input3').value);
    console.log('New diffuse RGB: ', val1, ' ', val2, ' ', val3); // print in console, and
    diffuseColor.x = val1;
    diffuseColor.y = val2;
    diffuseColor.z = val3;
    console.log('New diffuse RGB: ', diffuseColor); // print in console, and
  };
  function setSpecular() {
    var val1 = parseFloat(document.getElementById('input1').value);	
    var val2 = parseFloat(document.getElementById('input2').value);	
    var val3 = parseFloat(document.getElementById('input3').value);
    console.log('New specular RGB: ', val1, ' ', val2, ' ', val3); // print in console, and
    specularColor.x = val1;
    specularColor.y = val2;
    specularColor.z = val3;
    console.log('New specular RGB: ', specularColor); // print in console, and
  };
  function setLightPos() {
    var val1 = parseFloat(document.getElementById('input1').value);	
    var val2 = parseFloat(document.getElementById('input2').value);	
    var val3 = parseFloat(document.getElementById('input3').value);
    console.log('New specular RGB: ', val1, ' ', val2, ' ', val3); // print in console, and
    lightPos.x = val1;
    lightPos.y = val2;
    lightPos.z = val3;
    console.log('New specular RGB: ', lightPos); // print in console, and
  };

  function toggleAmbient(){
    ambientToggle = !ambientToggle;
  }
  function toggleDiffuse(){
    diffuseToggle = !diffuseToggle;
  }
  function toggleSpecular(){
    specularToggle = !specularToggle;
  }
  function TreesToggle(){
    treesToggle = !treesToggle;
  }
  function PlanetsToggle(){
    planetsToggle = !planetsToggle;
  }
  function FingersToggle(){
    fingersToggle = !fingersToggle;
  }

  