//3456789_123456789_123456789_123456789_123456789_123456789_123456789_123456789_
// (JT: why the numbers? counts columns, helps me keep 80-char-wide listings)

// Tabs set to 2

/*=====================
  VBObox-Lib.js library: 
  ===================== 
Note that you don't really need 'VBObox' objects for any simple, 
    beginner-level WebGL/OpenGL programs: if all vertices contain exactly 
		the same attributes (e.g. position, color, surface normal), and use 
		the same shader program (e.g. same Vertex Shader and Fragment Shader), 
		then our textbook's simple 'example code' will suffice.
		  
***BUT*** that's rare -- most genuinely useful WebGL/OpenGL programs need 
		different sets of vertices with  different sets of attributes rendered 
		by different shader programs.  THUS a customized VBObox object for each 
		VBO/shader-program pair will help you remember and correctly implement ALL 
		the WebGL/GLSL steps required for a working multi-shader, multi-VBO program.
		
One 'VBObox' object contains all we need for WebGL/OpenGL to render on-screen a 
		set of shapes made from vertices stored in one Vertex Buffer Object (VBO), 
		as drawn by calls to one 'shader program' that runs on your computer's 
		Graphical Processing Unit(GPU), along with changes to values of that shader 
		program's one set of 'uniform' varibles.  
The 'shader program' consists of a Vertex Shader and a Fragment Shader written 
		in GLSL, compiled and linked and ready to execute as a Single-Instruction, 
		Multiple-Data (SIMD) parallel program executed simultaneously by multiple 
		'shader units' on the GPU.  The GPU runs one 'instance' of the Vertex 
		Shader for each vertex in every shape, and one 'instance' of the Fragment 
		Shader for every on-screen pixel covered by any part of any drawing 
		primitive defined by those vertices.
The 'VBO' consists of a 'buffer object' (a memory block reserved in the GPU),
		accessed by the shader program through its 'attribute' variables. Shader's
		'uniform' variable values also get retrieved from GPU memory, but their 
		values can't be changed while the shader program runs.  
		Each VBObox object stores its own 'uniform' values as vars in JavaScript; 
		its 'adjust()'	function computes newly-updated values for these uniform 
		vars and then transfers them to the GPU memory for use by shader program.
EVENTUALLY you should replace 'cuon-matrix-quat03.js' with the free, open-source
   'glmatrix.js' library for vectors, matrices & quaternions: Google it!
		This vector/matrix library is more complete, more widely-used, and runs
		faster than our textbook's 'cuon-matrix-quat03.js' library.  
		--------------------------------------------------------------
		I recommend you use glMatrix.js instead of cuon-matrix-quat03.js
		--------------------------------------------------------------
		for all future WebGL programs. 
You can CONVERT existing cuon-matrix-based programs to glmatrix.js in a very 
    gradual, sensible, testable way:
		--add the glmatrix.js library to an existing cuon-matrix-based program;
			(but don't call any of its functions yet).
		--comment out the glmatrix.js parts (if any) that cause conflicts or in	
			any way disrupt the operation of your program.
		--make just one small local change in your program; find a small, simple,
			easy-to-test portion of your program where you can replace a 
			cuon-matrix object or function call with a glmatrix function call.
			Test; make sure it works. Don't make too large a change: it's hard to fix!
		--Save a copy of this new program as your latest numbered version. Repeat
			the previous step: go on to the next small local change in your program
			and make another replacement of cuon-matrix use with glmatrix use. 
			Test it; make sure it works; save this as your next numbered version.
		--Continue this process until your program no longer uses any cuon-matrix
			library features at all, and no part of glmatrix is commented out.
			Remove cuon-matrix from your library, and now use only glmatrix.

	------------------------------------------------------------------
	VBObox -- A MESSY SET OF CUSTOMIZED OBJECTS--NOT REALLY A 'CLASS'
	------------------------------------------------------------------
As each 'VBObox' object can contain:
  -- a DIFFERENT GLSL shader program, 
  -- a DIFFERENT set of attributes that define a vertex for that shader program, 
  -- a DIFFERENT number of vertices to used to fill the VBOs in GPU memory, and 
  -- a DIFFERENT set of uniforms transferred to GPU memory for shader use.  
  THUS:
		I don't see any easy way to use the exact same object constructors and 
		prototypes for all VBObox objects.  Every additional VBObox objects may vary 
		substantially, so I recommend that you copy and re-name an existing VBObox 
		prototype object, and modify as needed, as shown here. 
		(e.g. to make the VBObox3 object, copy the VBObox2 constructor and 
		all its prototype functions, then modify their contents for VBObox3 
		activities.)

// Written for EECS 351-2,	Intermediate Computer Graphics,
//							Northwestern Univ. EECS Dept., Jack Tumblin
// 2016.05.26 J. Tumblin-- Created; tested on 'TwoVBOs.html' starter code.
// 2017.02.20 J. Tumblin-- updated for EECS 351-1 use for Project C.
// 2018.04.11 J. Tumblin-- minor corrections/renaming for particle systems.
//    --11e: global 'gl' replaced redundant 'myGL' fcn args; 
//    --12: added 'SwitchToMe()' fcn to simplify 'init()' function and to fix 
//      weird subtle errors that sometimes appear when we alternate 'adjust()'
//      and 'draw()' functions of different VBObox objects. CAUSE: found that
//      only the 'draw()' function (and not the 'adjust()' function) made a full
//      changeover from one VBObox to another; thus calls to 'adjust()' for one
//      VBObox could corrupt GPU contents for another.
//      --Created vboStride, vboOffset members to centralize VBO layout in the 
//      constructor function.
//    -- 13 (abandoned) tried to make a 'core' or 'resuable' VBObox object to
//      which we would add on new properties for shaders, uniforms, etc., but
//      I decided there was too little 'common' code that wasn't customized.
//=============================================================================

*/

//=============================================================================
//                            GROUND
//=============================================================================
function VBObox0() {
//=============================================================================
//=============================================================================
// CONSTRUCTOR for one re-usable 'VBObox0' object that holds all data and fcns
// needed to render vertices from one Vertex Buffer Object (VBO) using one 
// separate shader program (a vertex-shader & fragment-shader pair) and one
// set of 'uniform' variables.

// Constructor goal: 
// Create and set member vars that will ELIMINATE ALL LITERALS (numerical values 
// written into code) in all other VBObox functions. Keeping all these (initial)
// values here, in this one construtor function, ensures we can change them 
// easily WITHOUT disrupting any other code, ever!
  
	this.VERT_SRC =	//--------------------- VERTEX SHADER source code 
  'precision highp float;\n' +				// req'd in OpenGL ES if we use 'float'
  //
  'uniform mat4 u_ModelMat0;\n' +
  'attribute vec4 a_Pos0;\n' +
  'attribute vec3 a_Colr0;\n'+
  'varying vec3 v_Colr0;\n' +
  //
  'void main() {\n' +
  '  gl_Position = u_ModelMat0 * a_Pos0;\n' +
  '	 v_Colr0 = a_Colr0;\n' +
  ' }\n';

	this.FRAG_SRC = //---------------------- FRAGMENT SHADER source code 
  'precision mediump float;\n' +
  'varying vec3 v_Colr0;\n' +
  'void main() {\n' +
  '  gl_FragColor = vec4(v_Colr0, 1.0);\n' + 
  '}\n';
  var numLines = 1000;
  var offsetX = -700;
  var offsetY = -100;//-20.2;
  var tempArray = new Float32Array (numLines*7*2*2);
  for(i = 0; i < numLines*7*2; i = i + 14){
    tempArray[i] = -100;
    tempArray[i+1] = offsetY + i/28.0;
    tempArray[i+2] = 0.0;
    tempArray[i+3] = 1.0;
    tempArray[i+4] = 0.0;
    tempArray[i+5] = 1.0;
    tempArray[i+6] = 0.0;

    tempArray[i+7] = 100;
    tempArray[i+8] = offsetY + i/28.0;
    tempArray[i+9] = 0.0;
    tempArray[i+10] = 1.0;
    tempArray[i+11] = 1.0;
    tempArray[i+12] = 0.0;
    tempArray[i+13] = 0.0;      
  }
  for(j = numLines*14; j < numLines*28; j = j + 14){
    tempArray[j+1] = -100;
    tempArray[j] = offsetX + j/28.0;
    tempArray[j+2] = 0.0;
    tempArray[j+3] = 1.0;
    tempArray[j+4] = 0.0;
    tempArray[j+5] = 1.0;
    tempArray[j+6] = 1.0;

    tempArray[j+8] = 100;
    tempArray[j+7] = offsetX + j/28.0;
    tempArray[j+9] = 0.0;
    tempArray[j+10] = 1.0;
    tempArray[j+11] = 1.0;
    tempArray[j+12] = 0.0;
    tempArray[j+13] = 1.0;
  }

  this.vboContents = tempArray;
  this.vboVerts = numLines*2*2;						// # of vertices held in 'vboContents' array
	
  this.FSIZE = this.vboContents.BYTES_PER_ELEMENT;
	                              // bytes req'd by 1 vboContents array element;
																// (why? used to compute stride and offset 
																// in bytes for vertexAttribPointer() calls)
  this.vboBytes = this.vboContents.length * this.FSIZE;               
                                // total number of bytes stored in vboContents
                                // (#  of floats in vboContents array) * 
                                // (# of bytes/float).
	this.vboStride = this.vboBytes / this.vboVerts; 
	                              // (== # of bytes to store one complete vertex).
	                              // From any attrib in a given vertex in the VBO, 
	                              // move forward by 'vboStride' bytes to arrive 
	                              // at the same attrib for the next vertex. 

	            //----------------------Attribute sizes
  this.vboFcount_a_Pos0 =  4;    // # of floats in the VBO needed to store the
                                // attribute named a_Pos0. (4: x,y,z,w values)
  this.vboFcount_a_Colr0 = 3;   // # of floats for this attrib (r,g,b values) 
  console.assert((this.vboFcount_a_Pos0 +     // check the size of each and
                  this.vboFcount_a_Colr0) *   // every attribute in our VBO
                  this.FSIZE == this.vboStride, // for agreeement with'stride'
                  "Uh oh! VBObox0.vboStride disagrees with attribute-size values!");

              //----------------------Attribute offsets  
	this.vboOffset_a_Pos0 = 0;    // # of bytes from START of vbo to the START
	                              // of 1st a_Pos0 attrib value in vboContents[]
  this.vboOffset_a_Colr0 = this.vboFcount_a_Pos0 * this.FSIZE;    
                                // (4 floats * bytes/float) 
                                // # of bytes from START of vbo to the START
                                // of 1st a_Colr0 attrib value in vboContents[]
	            //-----------------------GPU memory locations:
	this.vboLoc;									// GPU Location for Vertex Buffer Object, 
	                              // returned by gl.createBuffer() function call
	this.shaderLoc;								// GPU Location for compiled Shader-program  
	                            	// set by compile/link of VERT_SRC and FRAG_SRC.
								          //------Attribute locations in our shaders:
	this.a_PosLoc;								// GPU location for 'a_Pos0' attribute
	this.a_ColrLoc;								// GPU location for 'a_Colr0' attribute

	            //---------------------- Uniform locations &values in our shaders
	this.ModelMat = new Matrix4();	// Transforms CVV axes to model axes.
	this.u_ModelMatLoc;							// GPU location for u_ModelMat uniform
}

VBObox0.prototype.init = function() {
//=============================================================================
// Prepare the GPU to use all vertices, GLSL shaders, attributes, & uniforms 
// kept in this VBObox. (This function usually called only once, within main()).
// Specifically:
// a) Create, compile, link our GLSL vertex- and fragment-shaders to form an 
//  executable 'program' stored and ready to use inside the GPU.  
// b) create a new VBO object in GPU memory and fill it by transferring in all
//  the vertex data held in our Float32array member 'VBOcontents'. 
// c) Find & save the GPU location of all our shaders' attribute-variables and 
//  uniform-variables (needed by switchToMe(), adjust(), draw(), reload(), etc.)
// -------------------
// CAREFUL!  before you can draw pictures using this VBObox contents, 
//  you must call this VBObox object's switchToMe() function too!
//--------------------
// a) Compile,link,upload shaders-----------------------------------------------
	this.shaderLoc = createProgram(gl, this.VERT_SRC, this.FRAG_SRC);
	if (!this.shaderLoc) {
    console.log(this.constructor.name + 
    						'.init() failed to create executable Shaders on the GPU. Bye!');
    return;
  }
// CUTE TRICK: let's print the NAME of this VBObox object: tells us which one!
//  else{console.log('You called: '+ this.constructor.name + '.init() fcn!');}

	gl.program = this.shaderLoc;		// (to match cuon-utils.js -- initShaders())

// b) Create VBO on GPU, fill it------------------------------------------------
	this.vboLoc = gl.createBuffer();	
  if (!this.vboLoc) {
    console.log(this.constructor.name + 
    						'.init() failed to create VBO in GPU. Bye!'); 
    return;
  }
  // Specify the purpose of our newly-created VBO on the GPU.  Your choices are:
  //	== "gl.ARRAY_BUFFER" : the VBO holds vertices, each made of attributes 
  // (positions, colors, normals, etc), or 
  //	== "gl.ELEMENT_ARRAY_BUFFER" : the VBO holds indices only; integer values 
  // that each select one vertex from a vertex array stored in another VBO.
  gl.bindBuffer(gl.ARRAY_BUFFER,	      // GLenum 'target' for this GPU buffer 
  								this.vboLoc);				  // the ID# the GPU uses for this buffer.

  // Fill the GPU's newly-created VBO object with the vertex data we stored in
  //  our 'vboContents' member (JavaScript Float32Array object).
  //  (Recall gl.bufferData() will evoke GPU's memory allocation & management: 
  //    use gl.bufferSubData() to modify VBO contents without changing VBO size)
  gl.bufferData(gl.ARRAY_BUFFER, 			  // GLenum target(same as 'bindBuffer()')
 					 				this.vboContents, 		// JavaScript Float32Array
  							 	gl.STATIC_DRAW);			// Usage hint.
  //	The 'hint' helps GPU allocate its shared memory for best speed & efficiency
  //	(see OpenGL ES specification for more info).  Your choices are:
  //		--STATIC_DRAW is for vertex buffers rendered many times, but whose 
  //				contents rarely or never change.
  //		--DYNAMIC_DRAW is for vertex buffers rendered many times, but whose 
  //				contents may change often as our program runs.
  //		--STREAM_DRAW is for vertex buffers that are rendered a small number of 
  // 			times and then discarded; for rapidly supplied & consumed VBOs.

  // c1) Find All Attributes:---------------------------------------------------
  //  Find & save the GPU location of all our shaders' attribute-variables and 
  //  uniform-variables (for switchToMe(), adjust(), draw(), reload(),etc.)
  this.a_PosLoc = gl.getAttribLocation(this.shaderLoc, 'a_Pos0');
  if(this.a_PosLoc < 0) {
    console.log(this.constructor.name + 
    						'.init() Failed to get GPU location of attribute a_Pos0');
    return -1;	// error exit.
  }
 	this.a_ColrLoc = gl.getAttribLocation(this.shaderLoc, 'a_Colr0');
  if(this.a_ColrLoc < 0) {
    console.log(this.constructor.name + 
    						'.init() failed to get the GPU location of attribute a_Colr0');
    return -1;	// error exit.
  }
  
  // c2) Find All Uniforms:-----------------------------------------------------
  //Get GPU storage location for each uniform var used in our shader programs: 
	this.u_ModelMatLoc = gl.getUniformLocation(this.shaderLoc, 'u_ModelMat0');
  if (!this.u_ModelMatLoc) { 
    console.log(this.constructor.name + 
    						'.init() failed to get GPU location for u_ModelMat1 uniform');
    return;
  }  
}

VBObox0.prototype.switchToMe = function() {
//==============================================================================
// Set GPU to use this VBObox's contents (VBO, shader, attributes, uniforms...)
//
// We only do this AFTER we called the init() function, which does the one-time-
// only setup tasks to put our VBObox contents into GPU memory.  !SURPRISE!
// even then, you are STILL not ready to draw our VBObox's contents onscreen!
// We must also first complete these steps:
//  a) tell the GPU to use our VBObox's shader program (already in GPU memory),
//  b) tell the GPU to use our VBObox's VBO  (already in GPU memory),
//  c) tell the GPU to connect the shader program's attributes to that VBO.

// a) select our shader program:
  gl.useProgram(this.shaderLoc);	
//		Each call to useProgram() selects a shader program from the GPU memory,
// but that's all -- it does nothing else!  Any previously used shader program's 
// connections to attributes and uniforms are now invalid, and thus we must now
// establish new connections between our shader program's attributes and the VBO
// we wish to use.  
  
// b) call bindBuffer to disconnect the GPU from its currently-bound VBO and
//  instead connect to our own already-created-&-filled VBO.  This new VBO can 
//    supply values to use as attributes in our newly-selected shader program:
	gl.bindBuffer(gl.ARRAY_BUFFER,	        // GLenum 'target' for this GPU buffer 
										this.vboLoc);			    // the ID# the GPU uses for our VBO.

// c) connect our newly-bound VBO to supply attribute variable values for each
// vertex to our SIMD shader program, using 'vertexAttribPointer()' function.
// this sets up data paths from VBO to our shader units:
  // 	Here's how to use the almost-identical OpenGL version of this function:
	//		http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttribPointer.xml )
  gl.vertexAttribPointer(
		this.a_PosLoc,//index == ID# for the attribute var in your GLSL shader pgm;
		this.vboFcount_a_Pos0,// # of floats used by this attribute: 1,2,3 or 4?
		gl.FLOAT,			// type == what data type did we use for those numbers?
		false,				// isNormalized == are these fixed-point values that we need
									//									normalize before use? true or false
		this.vboStride,// Stride == #bytes we must skip in the VBO to move from the
		              // stored attrib for this vertex to the same stored attrib
		              //  for the next vertex in our VBO.  This is usually the 
									// number of bytes used to store one complete vertex.  If set 
									// to zero, the GPU gets attribute values sequentially from 
									// VBO, starting at 'Offset'.	
									// (Our vertex size in bytes: 4 floats for pos + 3 for color)
		this.vboOffset_a_Pos0);						
		              // Offset == how many bytes from START of buffer to the first
  								// value we will actually use?  (We start with position).
  gl.vertexAttribPointer(this.a_ColrLoc, this.vboFcount_a_Colr0, 
                        gl.FLOAT, false, 
                        this.vboStride, this.vboOffset_a_Colr0);
  							
// --Enable this assignment of each of these attributes to its' VBO source:
  gl.enableVertexAttribArray(this.a_PosLoc);
  gl.enableVertexAttribArray(this.a_ColrLoc);
}

VBObox0.prototype.isReady = function() {
//==============================================================================
// Returns 'true' if our WebGL rendering context ('gl') is ready to render using
// this objects VBO and shader program; else return false.
// see: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter

var isOK = true;

  if(gl.getParameter(gl.CURRENT_PROGRAM) != this.shaderLoc)  {
    console.log(this.constructor.name + 
    						'.isReady() false: shader program at this.shaderLoc not in use!');
    isOK = false;
  }
  if(gl.getParameter(gl.ARRAY_BUFFER_BINDING) != this.vboLoc) {
      console.log(this.constructor.name + 
  						'.isReady() false: vbo at this.vboLoc not in use!');
    isOK = false;
  }
  return isOK;
}

VBObox0.prototype.adjust = function() {
//==============================================================================
// Update the GPU to newer, current values we now store for 'uniform' vars on 
// the GPU; and (if needed) update each attribute's stride and offset in VBO.

  // check: was WebGL context set to use our VBO & shader program?
  if(this.isReady()==false) {
        console.log('ERROR! before' + this.constructor.name + 
  						'.adjust() call you needed to call this.switchToMe()!!');
  }  
	// Adjust values for our uniforms,

		this.ModelMat.setIdentity();
// THIS DOESN'T WORK!!  this.ModelMatrix = g_worldMat;
  this.ModelMat.set(g_worldMat);	// use our global, shared camera.
// READY to draw in 'world' coord axes.
	
//  this.ModelMat.rotate(g_angleNow0, 0, 0, 1);	  // rotate drawing axes,
//  this.ModelMat.translate(0.35, 0, 0);							// then translate them.
  //  Transfer new uniforms' values to the GPU:-------------
  // Send  new 'ModelMat' values to the GPU's 'u_ModelMat1' uniform: 
  gl.uniformMatrix4fv(this.u_ModelMatLoc,	// GPU location of the uniform
  										false, 				// use matrix transpose instead?
  										this.ModelMat.elements);	// send data from Javascript.
  // Adjust the attributes' stride and offset (if necessary)
  // (use gl.vertexAttribPointer() calls and gl.enableVertexAttribArray() calls)
}

VBObox0.prototype.draw = function() {
//=============================================================================
// Render current VBObox contents.

  // check: was WebGL context set to use our VBO & shader program?
  if(this.isReady()==false) {
        console.log('ERROR! before' + this.constructor.name + 
  						'.draw() call you needed to call this.switchToMe()!!');
  }  
  // ----------------------------Draw the contents of the currently-bound VBO:
  gl.drawArrays(gl.LINES, 	    // select the drawing primitive to draw,
                  // choices: gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, 
                  //          gl.TRIANGLES, gl.TRIANGLE_STRIP, ...
  								0, 								// location of 1st vertex to draw;
  								this.vboVerts);		// number of vertices to draw on-screen.
}

VBObox0.prototype.reload = function() {
//=============================================================================
// Over-write current values in the GPU inside our already-created VBO: use 
// gl.bufferSubData() call to re-transfer some or all of our Float32Array 
// contents to our VBO without changing any GPU memory allocations.

 gl.bufferSubData(gl.ARRAY_BUFFER, 	// GLenum target(same as 'bindBuffer()')
                  0,                  // byte offset to where data replacement
                                      // begins in the VBO.
 					 				this.vboContents);   // the JS source-data array used to fill VBO

}

//=============================================================================Gouraud Blinn-Phong
//=============================================================================
function VBObox1() {
//=============================================================================
//=============================================================================
// CONSTRUCTOR for one re-usable 'VBObox1' object that holds all data and fcns
// needed to render vertices from one Vertex Buffer Object (VBO) using one 
// separate shader program (a vertex-shader & fragment-shader pair) and one
// set of 'uniform' variables.

// Constructor goal: 
// Create and set member vars that will ELIMINATE ALL LITERALS (numerical values 
// written into code) in all other VBObox functions. Keeping all these (initial)
// values here, in this one coonstrutor function, ensures we can change them 
// easily WITHOUT disrupting any other code, ever!
  
this.VERT_SRC = 
  `uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix;
  uniform mat4 u_MvpMatrix;
  uniform vec3 u_EyePos;

  //Light Variables
  uniform vec3 u_LightColor;
  uniform vec3 u_LightPosition;
  uniform vec3 u_AmbientLight;
  uniform vec3 u_SpecularLight;

  //Material Variables
  uniform vec3 u_emit;
  uniform vec3 u_ambi;
  uniform vec3 u_diff;
  uniform vec3 u_spec;
  uniform float u_shiny;

  attribute vec4 a_Position;
  attribute vec3 a_Color;
  attribute vec3 a_Normal;
  varying vec4 v_Color;
  void main() {
     vec4 transVec = u_NormalMatrix * vec4(a_Normal, 0.0);
     vec3 normal = normalize(transVec.xyz);
     gl_Position = u_ModelMatrix * a_Position;

     a_Color;
     vec4 vertexPosition = u_MvpMatrix * a_Position;
     vec3 lightDirection = normalize(u_LightPosition - vec3(vertexPosition));
     float nDotL = max(dot(lightDirection, normal), 0.0);

     //blinn-phong
     vec4 vertexPos = u_ModelMatrix * a_Position;
     vec3 eyeDirection = normalize(u_EyePos - vertexPosition.xyz);
     vec3 lightDir = normalize(u_LightPosition - vec3(vertexPosition));
     vec3 H = normalize(lightDir + eyeDirection);
     float nDotH = max(dot(H, normal),0.0);
     float e64 = pow(nDotH, float(u_shiny));
     vec3 specular = u_SpecularLight * u_spec * e64;

     //float e64 = pow(nDotH, float(u_MatlSet[0].shiny));
     vec3 emissive = u_emit;
     vec3 diffuse = u_LightColor * u_diff * nDotL;
     vec3 ambient = u_AmbientLight * u_ambi;
     //vec3 specular = u_SpecularLight * u_spec * e64;
     v_Color = vec4(diffuse + ambient + emissive + specular, 1.0);
  }`;

// Fragment shader program----------------------------------
this.FRAG_SRC = 
  `precision mediump float;
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }`;

var c30 = Math.sqrt(0.75);					// == cos(30deg) == sqrt(3) / 2
var sq2	= Math.sqrt(2.0);						 
// for surface normals:
var sq23 = Math.sqrt(2.0/3.0)
var sq29 = Math.sqrt(2.0/9.0)
var sq89 = Math.sqrt(8.0/9.0)
var thrd = 1.0/3.0;

var sphere = new Float32Array([0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.1875938387542828,-0.577343625690456,-0.7946589768800393,
  0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.1875938387542828,-0.577343625690456,-0.7946589768800393,
  -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,0.1875938387542828,-0.577343625690456,-0.7946589768800393,
  0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.6070569201887998,0.0,-0.7946583515265471,
  0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.6070569201887998,0.0,-0.7946583515265471,
  0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.6070569201887998,0.0,-0.7946583515265471,
  -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.4911213143210803,-0.3568183375876395,-0.7946574913638756,
  -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.4911213143210803,-0.3568183375876395,-0.7946574913638756,
  -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.4911213143210803,-0.3568183375876395,-0.7946574913638756,
  -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.4911212952319224,0.356818323720363,-0.7946575093882327,
  -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.4911212952319224,0.356818323720363,-0.7946575093882327,
  -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.4911212952319224,0.356818323720363,-0.7946575093882327,
  0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.18759383875292585,0.5773436256885401,-0.7946589768817515,
  -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,0.18759383875292585,0.5773436256885401,-0.7946589768817515,
  0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.18759383875292585,0.5773436256885401,-0.7946589768817515,
  0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.9822470326522897,0.0,-0.18759202234042818,
  0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9822470326522897,0.0,-0.18759202234042818,
  0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.9822470326522897,0.0,-0.18759202234042818,
  0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.30353357597519004,-0.934171212988684,-0.18759401130890158,
  0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.30353357597519004,-0.934171212988684,-0.18759401130890158,
  0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.30353357597519004,-0.934171212988684,-0.18759401130890158,
  -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.7946554066806886,-0.5773485124543632,-0.18759392260913862,
  -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.7946554066806886,-0.5773485124543632,-0.18759392260913862,
  -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.7946554066806886,-0.5773485124543632,-0.18759392260913862,
  -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.794655462880779,0.5773484504343182,-0.18759387541928604,
  -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.794655462880779,0.5773484504343182,-0.18759387541928604,
  -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.794655462880779,0.5773484504343182,-0.18759387541928604,
  0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.3035335759751898,0.9341712129886843,-0.18759401130890102,
  0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.3035335759751898,0.9341712129886843,-0.18759401130890102,
  0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.3035335759751898,0.9341712129886843,-0.18759401130890102,
  0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.7946554066806881,-0.5773485124543637,0.18759392260913862,
  0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.7946554066806881,-0.5773485124543637,0.18759392260913862,
  0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.7946554066806881,-0.5773485124543637,0.18759392260913862,
  -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.30353357597519004,-0.934171212988684,0.1875940113089015,
  -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.30353357597519004,-0.934171212988684,0.1875940113089015,
  -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.30353357597519004,-0.934171212988684,0.1875940113089015,
  -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9822470326522897,0.0,0.1875920223404278,
  -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.9822470326522897,0.0,0.1875920223404278,
  -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.9822470326522897,0.0,0.1875920223404278,
  -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.30353357597518976,0.9341712129886842,0.18759401130890094,
  -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.30353357597518976,0.9341712129886842,0.18759401130890094,
  -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.30353357597518976,0.9341712129886842,0.18759401130890094,
  0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.7946554628807785,0.5773484504343186,0.18759387541928607,
  0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.7946554628807785,0.5773484504343186,0.18759387541928607,
  0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.7946554628807785,0.5773484504343186,0.18759387541928607,
  0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.49112131432107986,-0.3568183375876391,0.794657491363876,
  0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.49112131432107986,-0.3568183375876391,0.794657491363876,
  0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.49112131432107986,-0.3568183375876391,0.794657491363876,
  -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,-0.1875938387542832,-0.5773436256904565,0.7946589768800388,
  -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.1875938387542832,-0.5773436256904565,0.7946589768800388,
  -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.1875938387542832,-0.5773436256904565,0.7946589768800388,
  -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.6070569201888002,0.0,0.7946583515265467,
  -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.6070569201888002,0.0,0.7946583515265467,
  -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.6070569201888002,0.0,0.7946583515265467,
  -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.18759383875292623,0.5773436256885406,0.794658976881751,
  -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.18759383875292623,0.5773436256885406,0.794658976881751,
  -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,-0.18759383875292623,0.5773436256885406,0.794658976881751,
  0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.49112129523192194,0.3568183237203626,0.794657509388233,
  0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.49112129523192194,0.3568183237203626,0.794657509388233,
  0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.49112129523192194,0.3568183237203626,0.794657509388233,
  0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.39277083954784114,0.6647053901731114,0.6355295523228608,
  0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.39277083954784114,0.6647053901731114,0.6355295523228608,
  0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.39277083954784114,0.6647053901731114,0.6355295523228608,
  0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.23142914359315586,0.16814384664118306,0.9582109362413084,
  0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.23142914359315586,0.16814384664118306,0.9582109362413084,
  -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,0.23142914359315586,0.16814384664118306,0.9582109362413084,
  0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.753547360433901,0.16814471954107602,0.6355263400312792,
  0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.753547360433901,0.16814471954107602,0.6355263400312792,
  0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.753547360433901,0.16814471954107602,0.6355263400312792,
  -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.5108013377780002,0.5789515093717558,0.635529026182417,
  -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.5108013377780002,0.5789515093717558,0.635529026182417,
  -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.5108013377780002,0.5789515093717558,0.635529026182417,
  -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,-0.08839935760178926,0.2720608540734848,0.958211065087644,
  -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.08839935760178926,0.2720608540734848,0.958211065087644,
  -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.08839935760178926,0.2720608540734848,0.958211065087644,
  -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,0.07293921197231296,0.7686236608447644,0.6355293379116738,
  -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,0.07293921197231296,0.7686236608447644,0.6355293379116738,
  0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.07293921197231296,0.7686236608447644,0.6355293379116738,
  -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.7084658042311468,-0.3068886946778563,0.6355277596722553,
  -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.7084658042311468,-0.3068886946778563,0.6355277596722553,
  -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.7084658042311468,-0.3068886946778563,0.6355277596722553,
  -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.28606474884708283,0.0,0.958210289793976,
  -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.28606474884708283,0.0,0.958210289793976,
  -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.28606474884708283,0.0,0.958210289793976,
  -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.708465804230484,0.3068886946789983,0.6355277596724428,
  -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.708465804230484,0.3068886946789983,0.6355277596724428,
  -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.708465804230484,0.3068886946789983,0.6355277596724428,
  0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.07293907981253693,-0.7686236864389787,0.6355293221253091,
  -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,0.07293907981253693,-0.7686236864389787,0.6355293221253091,
  -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,0.07293907981253693,-0.7686236864389787,0.6355293221253091,
  -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.08839938045579887,-0.2720608602432967,0.9582110612274878,
  -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.08839938045579887,-0.2720608602432967,0.9582110612274878,
  -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,-0.08839938045579887,-0.2720608602432967,0.9582110612274878,
  -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.5108013129423995,-0.5789514469236773,0.6355291030325059,
  -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.5108013129423995,-0.5789514469236773,0.6355291030325059,
  -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.5108013129423995,-0.5789514469236773,0.6355291030325059,
  0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.7535473604341476,-0.1681447195414963,0.6355263400308759,
  0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.7535473604341476,-0.1681447195414963,0.6355263400308759,
  0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.7535473604341476,-0.1681447195414963,0.6355263400308759,
  -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,0.23142914432949518,-0.16814383202830113,0.9582109386276887,
  0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.23142914432949518,-0.16814383202830113,0.9582109386276887,
  0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.23142914432949518,-0.16814383202830113,0.9582109386276887,
  0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.39277100439986257,-0.6647053901773582,0.6355294504363187,
  0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.39277100439986257,-0.6647053901773582,0.6355294504363187,
  0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.39277100439986257,-0.6647053901773582,0.6355294504363187,
  0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.7968690849665907,0.5789540848799208,-0.17266102346899806,
  0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.7968690849665907,0.5789540848799208,-0.17266102346899806,
  0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.7968690849665907,0.5789540848799208,-0.17266102346899806,
  0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.8965821692443947,0.2720605719210893,0.3494616702858627,
  0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.8965821692443947,0.2720605719210893,0.3494616702858627,
  0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.8965821692443947,0.2720605719210893,0.3494616702858627,
  0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.535806440050527,0.7686269265317828,0.34946259686937375,
  0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.535806440050527,0.7686269265317828,0.34946259686937375,
  0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.535806440050527,0.7686269265317828,0.34946259686937375,
  -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.30437401847623374,0.9367735492298488,-0.17266086510828546,
  -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.30437401847623374,0.9367735492298488,-0.17266086510828546,
  -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.30437401847623374,0.9367735492298488,-0.17266086510828546,
  -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,0.018308870240782232,0.9367708785687859,0.34946402724167636,
  0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.018308870240782232,0.9367708785687859,0.34946402724167636,
  -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,0.018308870240782232,0.9367708785687859,0.34946402724167636,
  -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.5654358177612575,0.7470993573185782,0.3494637124034841,
  -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.5654358177612575,0.7470993573185782,0.3494637124034841,
  -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.5654358177612575,0.7470993573185782,0.3494637124034841,
  -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9849818442352473,-0.0,-0.17265794660811634,
  -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.9849818442352473,-0.0,-0.17265794660811634,
  -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9849818442352473,-0.0,-0.17265794660811634,
  -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.8852651476838903,0.3068895341634237,0.3494630625934256,
  -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.8852651476838903,0.3068895341634237,0.3494630625934256,
  -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.8852651476838903,0.3068895341634237,0.3494630625934256,
  -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.8852651543182758,-0.3068895218351865,0.34946305661344207,
  -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.8852651543182758,-0.3068895218351865,0.34946305661344207,
  -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.8852651543182758,-0.3068895218351865,0.34946305661344207,
  -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.3043740184762341,-0.9367735492298489,-0.17266086510828474,
  -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.3043740184762341,-0.9367735492298489,-0.17266086510828474,
  -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.3043740184762341,-0.9367735492298489,-0.17266086510828474,
  -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.5654359322761605,-0.7470993573184301,0.34946352711746276,
  -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.5654359322761605,-0.7470993573184301,0.34946352711746276,
  -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.5654359322761605,-0.7470993573184301,0.34946352711746276,
  0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.01830887024078118,-0.9367708785687856,0.3494640272416773,
  -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,0.01830887024078118,-0.9367708785687856,0.3494640272416773,
  -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,0.01830887024078118,-0.9367708785687856,0.3494640272416773,
  0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.7968690273363406,-0.5789541473282623,-0.17266108004828137,
  0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.7968690273363406,-0.5789541473282623,-0.17266108004828137,
  0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.7968690273363406,-0.5789541473282623,-0.17266108004828137,
  0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.5358065214403914,-0.7686268400790313,0.34946266222884337,
  0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.5358065214403914,-0.7686268400790313,0.34946266222884337,
  0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.5358065214403914,-0.7686268400790313,0.34946266222884337,
  0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.896582164193717,-0.27206058113615955,0.3494616760698745,
  0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.896582164193717,-0.27206058113615955,0.3494616760698745,
  0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.896582164193717,-0.27206058113615955,0.3494616760698745,
  -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.018308870240782205,0.9367708785687859,-0.34946402724167613,
  0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,-0.018308870240782205,0.9367708785687859,-0.34946402724167613,
  -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,-0.018308870240782205,0.9367708785687859,-0.34946402724167613,
  0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.30437401847623347,0.9367735492298487,0.17266086510828524,
  0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.30437401847623347,0.9367735492298487,0.17266086510828524,
  0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.30437401847623347,0.9367735492298487,0.17266086510828524,
  0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.5654358177612576,0.7470993573185785,-0.3494637124034841,
  0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.5654358177612576,0.7470993573185785,-0.3494637124034841,
  0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.5654358177612576,0.7470993573185785,-0.3494637124034841,
  -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.8965821692443952,0.2720605719210894,-0.34946167028586195,
  -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.8965821692443952,0.2720605719210894,-0.34946167028586195,
  -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.8965821692443952,0.2720605719210894,-0.34946167028586195,
  -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.7968690849665907,0.5789540848799208,0.17266102346899803,
  -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.7968690849665907,0.5789540848799208,0.17266102346899803,
  -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.7968690849665907,0.5789540848799208,0.17266102346899803,
  -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.5358064400505267,0.7686269265317832,-0.34946259686937364,
  -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.5358064400505267,0.7686269265317832,-0.34946259686937364,
  -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.5358064400505267,0.7686269265317832,-0.34946259686937364,
  -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.535806521440391,-0.7686268400790315,-0.34946266222884337,
  -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.535806521440391,-0.7686268400790315,-0.34946266222884337,
  -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.535806521440391,-0.7686268400790315,-0.34946266222884337,
  -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.7968690273363406,-0.5789541473282624,0.17266108004828132,
  -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.7968690273363406,-0.5789541473282624,0.17266108004828132,
  -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.7968690273363406,-0.5789541473282624,0.17266108004828132,
  -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.8965821641937172,-0.27206058113615966,-0.3494616760698737,
  -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.8965821641937172,-0.27206058113615966,-0.3494616760698737,
  -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.8965821641937172,-0.27206058113615966,-0.3494616760698737,
  0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.5654359322761607,-0.7470993573184304,-0.34946352711746276,
  0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.5654359322761607,-0.7470993573184304,-0.34946352711746276,
  0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.5654359322761607,-0.7470993573184304,-0.34946352711746276,
  0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.30437401847623385,-0.9367735492298487,0.17266086510828454,
  0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.30437401847623385,-0.9367735492298487,0.17266086510828454,
  0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.30437401847623385,-0.9367735492298487,0.17266086510828454,
  -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,-0.01830887024078116,-0.9367708785687855,-0.3494640272416772,
  0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,-0.01830887024078116,-0.9367708785687855,-0.3494640272416772,
  -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.01830887024078116,-0.9367708785687855,-0.3494640272416772,
  0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.8852651476838904,0.30688953416342346,-0.3494630625934258,
  0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.8852651476838904,0.30688953416342346,-0.3494630625934258,
  0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.8852651476838904,0.30688953416342346,-0.3494630625934258,
  0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9849818442352474,0.0,0.17265794660811573,
  0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9849818442352474,0.0,0.17265794660811573,
  0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9849818442352474,0.0,0.17265794660811573,
  0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.8852651543182759,-0.30688952183518625,-0.3494630566134423,
  0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.8852651543182759,-0.30688952183518625,-0.3494630566134423,
  0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.8852651543182759,-0.30688952183518625,-0.3494630566134423,
  0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.08839935760178921,0.2720608540734848,-0.958211065087644,
  -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,0.08839935760178921,0.2720608540734848,-0.958211065087644,
  0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.08839935760178921,0.2720608540734848,-0.958211065087644,
  0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.5108013377780005,0.578951509371756,-0.6355290261824166,
  0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.5108013377780005,0.578951509371756,-0.6355290261824166,
  0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.5108013377780005,0.578951509371756,-0.6355290261824166,
  -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.07293921197231347,0.7686236608447645,-0.6355293379116738,
  -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,-0.07293921197231347,0.7686236608447645,-0.6355293379116738,
  -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,-0.07293921197231347,0.7686236608447645,-0.6355293379116738,
  -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,-0.2314291435931551,0.1681438466411829,-0.9582109362413085,
  -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.2314291435931551,0.1681438466411829,-0.9582109362413085,
  -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.2314291435931551,0.1681438466411829,-0.9582109362413085,
  -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.39277083954784103,0.6647053901731109,-0.6355295523228613,
  -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.39277083954784103,0.6647053901731109,-0.6355295523228613,
  -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.39277083954784103,0.6647053901731109,-0.6355295523228613,
  -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.7535473604339004,0.16814471954107618,-0.6355263400312802,
  -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.7535473604339004,0.16814471954107618,-0.6355263400312802,
  -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.7535473604339004,0.16814471954107618,-0.6355263400312802,
  -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.23142914432949452,-0.168143832028301,-0.9582109386276889,
  -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,-0.23142914432949452,-0.168143832028301,-0.9582109386276889,
  -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.23142914432949452,-0.168143832028301,-0.9582109386276889,
  -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.7535473604341468,-0.16814471954149637,-0.6355263400308768,
  -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.7535473604341468,-0.16814471954149637,-0.6355263400308768,
  -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.7535473604341468,-0.16814471954149637,-0.6355263400308768,
  -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.39277100439986257,-0.6647053901773577,-0.6355294504363193,
  -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.39277100439986257,-0.6647053901773577,-0.6355294504363193,
  -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.39277100439986257,-0.6647053901773577,-0.6355294504363193,
  0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.28606474884708194,0.0,-0.9582102897939762,
  0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.28606474884708194,0.0,-0.9582102897939762,
  0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.28606474884708194,0.0,-0.9582102897939762,
  0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.7084658042304844,0.3068886946789989,-0.6355277596724419,
  0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.7084658042304844,0.3068886946789989,-0.6355277596724419,
  0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.7084658042304844,0.3068886946789989,-0.6355277596724419,
  0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.7084658042311474,-0.3068886946778569,-0.6355277596722544,
  0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.7084658042311474,-0.3068886946778569,-0.6355277596722544,
  0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.7084658042311474,-0.3068886946778569,-0.6355277596722544,
  -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,0.08839938045579884,-0.2720608602432967,-0.9582110612274878,
  0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.08839938045579884,-0.2720608602432967,-0.9582110612274878,
  0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.08839938045579884,-0.2720608602432967,-0.9582110612274878,
  -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,-0.07293907981253746,-0.7686236864389787,-0.6355293221253092,
  -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.07293907981253746,-0.7686236864389787,-0.6355293221253092,
  -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,-0.07293907981253746,-0.7686236864389787,-0.6355293221253092,
  0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.5108013129423997,-0.5789514469236775,-0.6355291030325054,
  0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.5108013129423997,-0.5789514469236775,-0.6355291030325054,
  0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.5108013129423997,-0.5789514469236775,-0.6355291030325054,
  0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.4556801884210278,-0.45302720531155727,-0.7662388120737402,
  0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.4556801884210278,-0.45302720531155727,-0.7662388120737402,
  0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.4556801884210278,-0.45302720531155727,-0.7662388120737402,
  0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.3736135165266664,-0.7056100416852756,-0.6021024907285153,
  0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.3736135165266664,-0.7056100416852756,-0.6021024907285153,
  0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.3736135165266664,-0.7056100416852756,-0.6021024907285153,
  0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.6048673099190088,-0.5626946300326399,-0.563480514945967,
  0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.6048673099190088,-0.5626946300326399,-0.563480514945967,
  0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.6048673099190088,-0.5626946300326399,-0.563480514945967,
  0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.11249635206289342,-0.790453586184493,-0.6021027311519319,
  -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,0.11249635206289342,-0.790453586184493,-0.6021027311519319,
  -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,0.11249635206289342,-0.790453586184493,-0.6021027311519319,
  -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.10236296935915444,-0.634348937053083,-0.7662396808855573,
  -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,-0.10236296935915444,-0.634348937053083,-0.7662396808855573,
  -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.10236296935915444,-0.634348937053083,-0.7662396808855573,
  -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.15859766198666153,-0.8107643536568595,-0.5634784329960992,
  -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.15859766198666153,-0.8107643536568595,-0.5634784329960992,
  -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,-0.15859766198666153,-0.8107643536568595,-0.5634784329960992,
  -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.030193516312269564,-0.41222790039055296,-0.9105803148060565,
  -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,-0.030193516312269564,-0.41222790039055296,-0.9105803148060565,
  0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,-0.030193516312269564,-0.41222790039055296,-0.9105803148060565,
  0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.2667315616493873,-0.3157493036139344,-0.9105803925449936,
  0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.2667315616493873,-0.3157493036139344,-0.9105803925449936,
  0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.2667315616493873,-0.3157493036139344,-0.9105803925449936,
  -0.08942674659491123,0.08942674659491123,-1.0,1.0,0.05243045372163609,-0.16136170037511793,-0.9855016231212377,
  0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.05243045372163609,-0.16136170037511793,-0.9855016231212377,
  -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,0.05243045372163609,-0.16136170037511793,-0.9855016231212377,
  0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.5716702792979942,-0.2933787781117714,-0.7662388559196129,
  0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.5716702792979942,-0.2933787781117714,-0.7662388559196129,
  0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.5716702792979942,-0.2933787781117714,-0.7662388559196129,
  0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.7865295373716213,-0.13727635663558188,-0.6021017262480185,
  0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.7865295373716213,-0.13727635663558188,-0.6021017262480185,
  0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.7865295373716213,-0.13727635663558188,-0.6021017262480185,
  0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.7220727651688029,-0.40137334761281973,-0.5634805743125112,
  0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.7220727651688029,-0.40137334761281973,-0.5634805743125112,
  0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.7220727651688029,-0.40137334761281973,-0.5634805743125112,
  0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.7865295373716089,0.1372763566355817,-0.6021017262480348,
  0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.7865295373716089,0.1372763566355817,-0.6021017262480348,
  0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.7865295373716089,0.1372763566355817,-0.6021017262480348,
  0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.5716703002569032,0.29337878079020263,-0.7662388392572099,
  0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.5716703002569032,0.29337878079020263,-0.7662388392572099,
  0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.5716703002569032,0.29337878079020263,-0.7662388392572099,
  0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.7220727651677648,0.40137334761328575,-0.5634805743135096,
  0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.7220727651677648,0.40137334761328575,-0.5634805743135096,
  0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.7220727651677648,0.40137334761328575,-0.5634805743135096,
  0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.38272124069341656,0.15610136154465032,-0.910580483453274,
  0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.38272124069341656,0.15610136154465032,-0.910580483453274,
  0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.38272124069341656,0.15610136154465032,-0.910580483453274,
  0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.3827212475001285,-0.15610137316785758,-0.9105804785998076,
  0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.3827212475001285,-0.15610137316785758,-0.9105804785998076,
  0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.3827212475001285,-0.15610137316785758,-0.9105804785998076,
  -0.08942674659491123,0.08942674659491123,-1.0,1.0,0.16966523322150937,0.0,-0.9855017547604321,
  0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.16966523322150937,0.0,-0.9855017547604321,
  0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.16966523322150937,0.0,-0.9855017547604321,
  -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.2900434909837939,-0.5733687582967675,-0.7662395450165417,
  -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.2900434909837939,-0.5733687582967675,-0.7662395450165417,
  -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.2900434909837939,-0.5733687582967675,-0.7662395450165417,
  -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.5556259833512646,-0.5733698183711547,-0.6021019996694658,
  -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.5556259833512646,-0.5733698183711547,-0.6021019996694658,
  -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.5556259833512646,-0.5733698183711547,-0.6021019996694658,
  -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.3482411474888479,-0.7491463488592234,-0.5634783502376512,
  -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.3482411474888479,-0.7491463488592234,-0.5634783502376512,
  -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.3482411474888479,-0.7491463488592234,-0.5634783502376512,
  -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.7170079792657081,-0.35124827568421596,-0.6020998310065955,
  -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.7170079792657081,-0.35124827568421596,-0.6020998310065955,
  -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.7170079792657081,-0.35124827568421596,-0.6020998310065955,
  -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.6349390266407596,-0.09866770853416246,-0.7662356789794523,
  -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.6349390266407596,-0.09866770853416246,-0.7662356789794523,
  -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.6349390266407596,-0.09866770853416246,-0.7662356789794523,
  -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.8200745038929086,-0.09972382650385823,-0.5635006357513968,
  -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.8200745038929086,-0.09972382650385823,-0.5635006357513968,
  -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.8200745038929086,-0.09972382650385823,-0.5635006357513968,
  -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.40138618486326477,-0.09866777504353715,-0.9105788273229676,
  -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.40138618486326477,-0.09866777504353715,-0.9105788273229676,
  -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.40138618486326477,-0.09866777504353715,-0.9105788273229676,
  -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.21787243246147198,-0.3512482946875778,-0.9105801659669454,
  -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.21787243246147198,-0.3512482946875778,-0.9105801659669454,
  -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,-0.21787243246147198,-0.3512482946875778,-0.9105801659669454,
  -0.08942674659491123,0.08942674659491123,-1.0,1.0,-0.13726376049162442,-0.09972733209314655,-0.9855014557519847,
  -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,-0.13726376049162442,-0.09972733209314655,-0.9855014557519847,
  -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.13726376049162442,-0.09972733209314655,-0.9855014557519847,
  -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.6349390266407687,0.09866770853401646,-0.7662356789794637,
  -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.6349390266407687,0.09866770853401646,-0.7662356789794637,
  -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.6349390266407687,0.09866770853401646,-0.7662356789794637,
  -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.7170079792643385,0.35124827568689115,-0.6020998310066659,
  -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.7170079792643385,0.35124827568689115,-0.6020998310066659,
  -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.7170079792643385,0.35124827568689115,-0.6020998310066659,
  -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.8200745038929456,0.09972382650341055,-0.5635006357514222,
  -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.8200745038929456,0.09972382650341055,-0.5635006357514222,
  -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.8200745038929456,0.09972382650341055,-0.5635006357514222,
  -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.5556260194438505,0.5733697244076056,-0.6021020558424696,
  -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.5556260194438505,0.5733697244076056,-0.6021020558424696,
  -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.5556260194438505,0.5733697244076056,-0.6021020558424696,
  -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.29004345688710037,0.5733688522583721,-0.7662394876126509,
  -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.29004345688710037,0.5733688522583721,-0.7662394876126509,
  -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.29004345688710037,0.5733688522583721,-0.7662394876126509,
  -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.3482409616935952,0.7491463488573392,-0.563478465065381,
  -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.3482409616935952,0.7491463488573392,-0.563478465065381,
  -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.3482409616935952,0.7491463488573392,-0.563478465065381,
  -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.2178724354453621,0.35124826452696245,-0.9105801768871886,
  -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,-0.2178724354453621,0.35124826452696245,-0.9105801768871886,
  -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.2178724354453621,0.35124826452696245,-0.9105801768871886,
  -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.40138618451518493,0.09866778374700656,-0.9105788265333188,
  -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.40138618451518493,0.09866778374700656,-0.9105788265333188,
  -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.40138618451518493,0.09866778374700656,-0.9105788265333188,
  -0.08942674659491123,0.08942674659491123,-1.0,1.0,-0.13726376036863866,0.09972734098810344,-0.9855014548689939,
  -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.13726376036863866,0.09972734098810344,-0.9855014548689939,
  -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,-0.13726376036863866,0.09972734098810344,-0.9855014548689939,
  -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.1023630609837684,0.6343489989811777,-0.7662396173767128,
  -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.1023630609837684,0.6343489989811777,-0.7662396173767128,
  -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,-0.1023630609837684,0.6343489989811777,-0.7662396173767128,
  0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.1124963520628935,0.7904535861844924,-0.602102731151933,
  -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,0.1124963520628935,0.7904535861844924,-0.602102731151933,
  -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,0.1124963520628935,0.7904535861844924,-0.602102731151933,
  -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.15859768341130098,0.810764268801057,-0.5634785490611477,
  -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,-0.15859768341130098,0.810764268801057,-0.5634785490611477,
  -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.15859768341130098,0.810764268801057,-0.5634785490611477,
  0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.37361364022533977,0.7056100351752889,-0.602102421600759,
  0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.37361364022533977,0.7056100351752889,-0.602102421600759,
  0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.37361364022533977,0.7056100351752889,-0.602102421600759,
  0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.4556802023562997,0.4530272348130372,-0.7662387863441624,
  0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.4556802023562997,0.4530272348130372,-0.7662387863441624,
  0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.4556802023562997,0.4530272348130372,-0.7662387863441624,
  0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.6048672442080645,0.5626947063712658,-0.5634805092511155,
  0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.6048672442080645,0.5626947063712658,-0.5634805092511155,
  0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.6048672442080645,0.5626947063712658,-0.5634805092511155,
  0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.2667315350342877,0.315749297785993,-0.9105804023620896,
  0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.2667315350342877,0.315749297785993,-0.9105804023620896,
  0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.2667315350342877,0.315749297785993,-0.9105804023620896,
  -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.030193527704173675,0.41222786395924527,-0.9105803309210974,
  0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,-0.030193527704173675,0.41222786395924527,-0.9105803309210974,
  -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,-0.030193527704173675,0.41222786395924527,-0.9105803309210974,
  -0.08942674659491123,0.08942674659491123,-1.0,1.0,0.052430445101050945,0.16136171190180873,-0.9855016216925385,
  -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,0.052430445101050945,0.16136171190180873,-0.9855016216925385,
  0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.052430445101050945,0.16136171190180873,-0.9855016216925385,
  0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.8902790375102705,-0.13727627232073927,-0.43423318669524646,
  0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.8902790375102705,-0.13727627232073927,-0.43423318669524646,
  0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.8902790375102705,-0.13727627232073927,-0.43423318669524646,
  0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.9410026579935737,-0.2933790714736124,-0.16864969039494385,
  0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.9410026579935737,-0.2933790714736124,-0.16864969039494385,
  0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.9410026579935737,-0.2933790714736124,-0.16864969039494385,
  0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.8269096225934555,-0.4013733060946441,-0.3938526948200357,
  0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.8269096225934555,-0.4013733060946441,-0.3938526948200357,
  0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.8269096225934555,-0.4013733060946441,-0.3938526948200357,
  0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.9856061035044801,-0.15610228082891986,0.0649052128470842,
  0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9856061035044801,-0.15610228082891986,0.0649052128470842,
  0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9856061035044801,-0.15610228082891986,0.0649052128470842,
  0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.9856061030015378,0.1561022807492629,0.0649052206760001,
  0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9856061030015378,0.1561022807492629,0.0649052206760001,
  0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9856061030015378,0.1561022807492629,0.0649052206760001,
  0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.9573342053980672,-0.0,0.28898307766174003,
  0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9573342053980672,-0.0,0.28898307766174003,
  0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9573342053980672,-0.0,0.28898307766174003,
  0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.9410026557723999,0.29337908242205546,-0.16864968374261155,
  0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.9410026557723999,0.29337908242205546,-0.16864968374261155,
  0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.9410026557723999,0.29337908242205546,-0.16864968374261155,
  0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.8902790348330735,0.13727627240355514,-0.4342331921579418,
  0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.8902790348330735,0.13727627240355514,-0.4342331921579418,
  0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.8902790348330735,0.13727627240355514,-0.4342331921579418,
  0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.8269096225925395,0.4013733060952317,-0.3938526948213602,
  0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.8269096225925395,0.4013733060952317,-0.3938526948213602,
  0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.8269096225925395,0.4013733060952317,-0.3938526948213602,
  0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.1445571334445321,-0.8891249105991275,-0.4342351074272938,
  0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.1445571334445321,-0.8891249105991275,-0.4342351074272938,
  -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,0.1445571334445321,-0.8891249105991275,-0.4342351074272938,
  -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,0.011764727228162504,-0.9856057285447228,-0.16865034554685346,
  -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,0.011764727228162504,-0.9856057285447228,-0.16865034554685346,
  0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.011764727228162504,-0.9856057285447228,-0.16865034554685346,
  -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.1262013834435303,-0.9104677303474127,-0.3938549514897206,
  -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,-0.1262013834435303,-0.9104677303474127,-0.3938549514897206,
  -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.1262013834435303,-0.9104677303474127,-0.3938549514897206,
  -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,0.1561046864437102,-0.985605751969338,0.06490476527395082,
  0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.1561046864437102,-0.985605751969338,0.06490476527395082,
  0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.1561046864437102,-0.985605751969338,0.06490476527395082,
  0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.4530336513178341,-0.8891275915425783,0.0649048282589597,
  0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.4530336513178341,-0.8891275915425783,0.0649048282589597,
  0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.4530336513178341,-0.8891275915425783,0.0649048282589597,
  0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.295826750452272,-0.9104677767205127,0.2890241534378325,
  0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.295826750452272,-0.9104677767205127,0.2890241534378325,
  0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.295826750452272,-0.9104677767205127,0.2890241534378325,
  0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.5698107195795923,-0.8042839992138734,-0.1686505038851809,
  0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.5698107195795923,-0.8042839992138734,-0.1686505038851809,
  0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.5698107195795923,-0.8042839992138734,-0.1686505038851809,
  0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.40567420298669166,-0.8042813632252391,-0.43423487860795257,
  0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.40567420298669166,-0.8042813632252391,-0.43423487860795257,
  0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.40567420298669166,-0.8042813632252391,-0.43423487860795257,
  0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.6372639607508351,-0.6623999850829347,-0.39385391211753373,
  0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.6372639607508351,-0.6623999850829347,-0.39385391211753373,
  0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.6372639607508351,-0.6623999850829347,-0.39385391211753373,
  -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.8009411223662419,-0.41223065105961343,-0.434234048445849,
  -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.8009411223662419,-0.41223065105961343,-0.434234048445849,
  -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.8009411223662419,-0.41223065105961343,-0.434234048445849,
  -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.9337331376183107,-0.31575244801226804,-0.16864999047650403,
  -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.9337331376183107,-0.31575244801226804,-0.16864999047650403,
  -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.9337331376183107,-0.31575244801226804,-0.16864999047650403,
  -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.9049059478911285,-0.1613589781678624,-0.3938381718877458,
  -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.9049059478911285,-0.1613589781678624,-0.3938381718877458,
  -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.9049059478911285,-0.1613589781678624,-0.3938381718877458,
  -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.8891293781902415,-0.453030240817418,0.0649041581406515,
  -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.8891293781902415,-0.453030240817418,0.0649041581406515,
  -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.8891293781902415,-0.453030240817418,0.0649041581406515,
  -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.7056169875642115,-0.7056147471288743,0.0649037402239831,
  -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.7056169875642115,-0.7056147471288743,0.0649037402239831,
  -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.7056169875642115,-0.7056147471288743,0.0649037402239831,
  -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.7744929412069025,-0.5626970574800776,0.2890202510620039,
  -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.7744929412069025,-0.5626970574800776,0.2890202510620039,
  -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.7744929412069025,-0.5626970574800776,0.2890202510620039,
  -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.5888393715456425,-0.7904587170290158,-0.16865115235472017,
  -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.5888393715456425,-0.7904587170290158,-0.16865115235472017,
  -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.5888393715456425,-0.7904587170290158,-0.16865115235472017,
  -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.6395598605847257,-0.6343526933842694,-0.43423478110921676,
  -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.6395598605847257,-0.6343526933842694,-0.43423478110921676,
  -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.6395598605847257,-0.6343526933842694,-0.43423478110921676,
  -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.43305286287212297,-0.8107669263659469,-0.39385556879314715,
  -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.43305286287212297,-0.8107669263659469,-0.39385556879314715,
  -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.43305286287212297,-0.8107669263659469,-0.39385556879314715,
  -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.6395599174302818,0.6343526036081132,-0.43423482853426115,
  -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.6395599174302818,0.6343526036081132,-0.43423482853426115,
  -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.6395599174302818,0.6343526036081132,-0.43423482853426115,
  -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.5888392828155132,0.790458798422897,-0.1686510806640205,
  -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.5888392828155132,0.790458798422897,-0.1686510806640205,
  -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.5888392828155132,0.790458798422897,-0.1686510806640205,
  -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.43305276864121595,0.8107670112207223,-0.39385549772523787,
  -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.43305276864121595,0.8107670112207223,-0.39385549772523787,
  -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.43305276864121595,0.8107670112207223,-0.39385549772523787,
  -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.7056169940736836,0.7056147536395789,0.06490359867199426,
  -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.7056169940736836,0.7056147536395789,0.06490359867199426,
  -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.7056169940736836,0.7056147536395789,0.06490359867199426,
  -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.8891293781905673,0.45303024081694554,0.06490415813948672,
  -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.8891293781905673,0.45303024081694554,0.06490415813948672,
  -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.8891293781905673,0.45303024081694554,0.06490415813948672,
  -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.7744929756870417,0.5626969811415766,0.28902030728927613,
  -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.7744929756870417,0.5626969811415766,0.28902030728927613,
  -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.7744929756870417,0.5626969811415766,0.28902030728927613,
  -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.9337331410506727,0.31575243415701776,-0.16864999741346762,
  -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.9337331410506727,0.31575243415701776,-0.16864999741346762,
  -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9337331410506727,0.31575243415701776,-0.16864999741346762,
  -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.8009411223638105,0.4122306510621237,-0.4342340484479505,
  -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.8009411223638105,0.4122306510621237,-0.4342340484479505,
  -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.8009411223638105,0.4122306510621237,-0.4342340484479505,
  -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.9049059503270416,0.1613589802965544,-0.39383816541870337,
  -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9049059503270416,0.1613589802965544,-0.39383816541870337,
  -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.9049059503270416,0.1613589802965544,-0.39383816541870337,
  0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.40567431596737213,0.8042812695824455,-0.4342349465016079,
  0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.40567431596737213,0.8042812695824455,-0.4342349465016079,
  0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.40567431596737213,0.8042812695824455,-0.4342349465016079,
  0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.5698106083247312,0.8042840928568619,-0.16865043319841977,
  0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.5698106083247312,0.8042840928568619,-0.16865043319841977,
  0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.5698106083247312,0.8042840928568619,-0.16865043319841977,
  0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.6372638592193767,0.6623999850826678,-0.3938540763979827,
  0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.6372638592193767,0.6623999850826678,-0.3938540763979827,
  0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.6372638592193767,0.6623999850826678,-0.3938540763979827,
  0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.4530336513178344,0.8891275915425781,0.06490482825895993,
  0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.4530336513178344,0.8891275915425781,0.06490482825895993,
  0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.4530336513178344,0.8891275915425781,0.06490482825895993,
  -0.08942674659491123,1.0,-0.08942674659491123,1.0,0.15610468644371014,0.9856057519693379,0.06490476527395184,
  0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.15610468644371014,0.9856057519693379,0.06490476527395184,
  0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.15610468644371014,0.9856057519693379,0.06490476527395184,
  0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.29582675045227164,0.9104677767205127,0.2890241534378327,
  0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.29582675045227164,0.9104677767205127,0.2890241534378327,
  0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.29582675045227164,0.9104677767205127,0.2890241534378327,
  -0.08942674659491123,1.0,-0.08942674659491123,1.0,0.011764727228161192,0.9856057285447228,-0.16865034554685368,
  0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.011764727228161192,0.9856057285447228,-0.16865034554685368,
  -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,0.011764727228161192,0.9856057285447228,-0.16865034554685368,
  0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.14455713344453255,0.8891249105991275,-0.43423510742729354,
  -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,0.14455713344453255,0.8891249105991275,-0.43423510742729354,
  0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.14455713344453255,0.8891249105991275,-0.43423510742729354,
  -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.12620138344353177,0.9104677303474128,-0.3938549514897198,
  -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.12620138344353177,0.9104677303474128,-0.3938549514897198,
  -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,-0.12620138344353177,0.9104677303474128,-0.3938549514897198,
  0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.9337331376183107,-0.3157524480122681,0.16864999047650445,
  0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9337331376183107,-0.3157524480122681,0.16864999047650445,
  0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.9337331376183107,-0.3157524480122681,0.16864999047650445,
  0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.8009411223662424,-0.4122306510596123,0.43423404844584906,
  0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.8009411223662424,-0.4122306510596123,0.43423404844584906,
  0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.8009411223662424,-0.4122306510596123,0.43423404844584906,
  0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.9049059478911281,-0.16135897816786288,0.3938381718877464,
  0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.9049059478911281,-0.16135897816786288,0.3938381718877464,
  0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9049059478911281,-0.16135897816786288,0.3938381718877464,
  0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.6395598605847254,-0.63435269338427,0.43423478110921626,
  0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.6395598605847254,-0.63435269338427,0.43423478110921626,
  0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.6395598605847254,-0.63435269338427,0.43423478110921626,
  0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.5888393715456428,-0.7904587170290155,0.16865115235472064,
  0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.5888393715456428,-0.7904587170290155,0.16865115235472064,
  0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.5888393715456428,-0.7904587170290155,0.16865115235472064,
  0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.43305286287212336,-0.8107669263659466,0.39385556879314715,
  0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.43305286287212336,-0.8107669263659466,0.39385556879314715,
  0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.43305286287212336,-0.8107669263659466,0.39385556879314715,
  0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.7056169875642118,-0.7056147471288738,-0.06490374022398354,
  0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.7056169875642118,-0.7056147471288738,-0.06490374022398354,
  0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.7056169875642118,-0.7056147471288738,-0.06490374022398354,
  0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.8891293781902413,-0.45303024081741866,-0.06490415814065198,
  0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.8891293781902413,-0.45303024081741866,-0.06490415814065198,
  0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.8891293781902413,-0.45303024081741866,-0.06490415814065198,
  0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.774492941206902,-0.5626970574800776,-0.28902025106200485,
  0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.774492941206902,-0.5626970574800776,-0.28902025106200485,
  0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.774492941206902,-0.5626970574800776,-0.28902025106200485,
  -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,-0.011764727228162521,-0.9856057285447228,0.1686503455468534,
  0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,-0.011764727228162521,-0.9856057285447228,0.1686503455468534,
  -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.011764727228162521,-0.9856057285447228,0.1686503455468534,
  -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.144557133444532,-0.8891249105991275,0.4342351074272939,
  -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.144557133444532,-0.8891249105991275,0.4342351074272939,
  -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,-0.144557133444532,-0.8891249105991275,0.4342351074272939,
  0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.12620138344352988,-0.9104677303474127,0.3938549514897206,
  -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,0.12620138344352988,-0.9104677303474127,0.3938549514897206,
  0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.12620138344352988,-0.9104677303474127,0.3938549514897206,
  -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.4056742029866914,-0.8042813632252392,0.4342348786079527,
  -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.4056742029866914,-0.8042813632252392,0.4342348786079527,
  -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.4056742029866914,-0.8042813632252392,0.4342348786079527,
  -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.5698107195795922,-0.8042839992138735,0.16865050388518024,
  -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.5698107195795922,-0.8042839992138735,0.16865050388518024,
  -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.5698107195795922,-0.8042839992138735,0.16865050388518024,
  -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.6372639607508346,-0.6623999850829355,0.3938539121175335,
  -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.6372639607508346,-0.6623999850829355,0.3938539121175335,
  -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.6372639607508346,-0.6623999850829355,0.3938539121175335,
  -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.45303365131783446,-0.8891275915425783,-0.06490482825895973,
  -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.45303365131783446,-0.8891275915425783,-0.06490482825895973,
  -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.45303365131783446,-0.8891275915425783,-0.06490482825895973,
  -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,-0.1561046864437102,-0.9856057519693381,-0.06490476527395087,
  -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.1561046864437102,-0.9856057519693381,-0.06490476527395087,
  -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.1561046864437102,-0.9856057519693381,-0.06490476527395087,
  -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.29582675045227214,-0.9104677767205126,-0.2890241534378327,
  -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.29582675045227214,-0.9104677767205126,-0.2890241534378327,
  -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.29582675045227214,-0.9104677767205126,-0.2890241534378327,
  -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.9410026579935737,-0.29337907147361264,0.1686496903949428,
  -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.9410026579935737,-0.29337907147361264,0.1686496903949428,
  -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.9410026579935737,-0.29337907147361264,0.1686496903949428,
  -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.8902790375102706,-0.13727627232073963,0.43423318669524613,
  -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.8902790375102706,-0.13727627232073963,0.43423318669524613,
  -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.8902790375102706,-0.13727627232073963,0.43423318669524613,
  -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.8269096225934561,-0.40137330609464344,0.3938526948200351,
  -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.8269096225934561,-0.40137330609464344,0.3938526948200351,
  -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.8269096225934561,-0.40137330609464344,0.3938526948200351,
  -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.8902790348330736,0.13727627240355553,0.43423319215794154,
  -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.8902790348330736,0.13727627240355553,0.43423319215794154,
  -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.8902790348330736,0.13727627240355553,0.43423319215794154,
  -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.9410026557724,0.2933790824220556,0.1686496837426105,
  -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.9410026557724,0.2933790824220556,0.1686496837426105,
  -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.9410026557724,0.2933790824220556,0.1686496837426105,
  -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.8269096225925401,0.40137330609523086,0.3938526948213595,
  -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.8269096225925401,0.40137330609523086,0.3938526948213595,
  -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.8269096225925401,0.40137330609523086,0.3938526948213595,
  -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.9856061030015377,0.1561022807492637,-0.06490522067600012,
  -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9856061030015377,0.1561022807492637,-0.06490522067600012,
  -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9856061030015377,0.1561022807492637,-0.06490522067600012,
  -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.98560610350448,-0.1561022808289206,-0.06490521284708418,
  -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.98560610350448,-0.1561022808289206,-0.06490521284708418,
  -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.98560610350448,-0.1561022808289206,-0.06490521284708418,
  -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.9573342053980672,0.0,-0.28898307766173964,
  -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.9573342053980672,0.0,-0.28898307766173964,
  -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9573342053980672,0.0,-0.28898307766173964,
  -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.5698106083247311,0.804284092856862,0.16865043319841913,
  -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.5698106083247311,0.804284092856862,0.16865043319841913,
  -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.5698106083247311,0.804284092856862,0.16865043319841913,
  -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.40567431596737197,0.8042812695824456,0.43423494650160793,
  -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.40567431596737197,0.8042812695824456,0.43423494650160793,
  -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.40567431596737197,0.8042812695824456,0.43423494650160793,
  -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.637263859219376,0.6623999850826685,0.3938540763979824,
  -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.637263859219376,0.6623999850826685,0.3938540763979824,
  -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.637263859219376,0.6623999850826685,0.3938540763979824,
  -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.1445571334445324,0.8891249105991275,0.4342351074272937,
  -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,-0.1445571334445324,0.8891249105991275,0.4342351074272937,
  -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.1445571334445324,0.8891249105991275,0.4342351074272937,
  -0.08942674659491123,1.0,-0.08942674659491123,1.0,-0.011764727228161208,0.9856057285447228,0.16865034554685363,
  -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.011764727228161208,0.9856057285447228,0.16865034554685363,
  0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,-0.011764727228161208,0.9856057285447228,0.16865034554685363,
  0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.12620138344353132,0.9104677303474129,0.39385495148971983,
  0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.12620138344353132,0.9104677303474129,0.39385495148971983,
  -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,0.12620138344353132,0.9104677303474129,0.39385495148971983,
  -0.08942674659491123,1.0,-0.08942674659491123,1.0,-0.15610468644371017,0.985605751969338,-0.06490476527395188,
  -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.15610468644371017,0.985605751969338,-0.06490476527395188,
  -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.15610468644371017,0.985605751969338,-0.06490476527395188,
  -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.4530336513178348,0.889127591542578,-0.06490482825895996,
  -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.4530336513178348,0.889127591542578,-0.06490482825895996,
  -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.4530336513178348,0.889127591542578,-0.06490482825895996,
  -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.29582675045227175,0.9104677767205126,-0.289024153437833,
  -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.29582675045227175,0.9104677767205126,-0.289024153437833,
  -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.29582675045227175,0.9104677767205126,-0.289024153437833,
  0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.5888392828155135,0.7904587984228967,0.16865108066402096,
  0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.5888392828155135,0.7904587984228967,0.16865108066402096,
  0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.5888392828155135,0.7904587984228967,0.16865108066402096,
  0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.6395599174302816,0.6343526036081139,0.43423482853426054,
  0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.6395599174302816,0.6343526036081139,0.43423482853426054,
  0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.6395599174302816,0.6343526036081139,0.43423482853426054,
  0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.43305276864121645,0.8107670112207219,0.393855497725238,
  0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.43305276864121645,0.8107670112207219,0.393855497725238,
  0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.43305276864121645,0.8107670112207219,0.393855497725238,
  0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.8009411223638112,0.4122306510621225,0.4342340484479506,
  0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.8009411223638112,0.4122306510621225,0.4342340484479506,
  0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.8009411223638112,0.4122306510621225,0.4342340484479506,
  0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.9337331410506727,0.3157524341570177,0.16864999741346798,
  0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.9337331410506727,0.3157524341570177,0.16864999741346798,
  0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9337331410506727,0.3157524341570177,0.16864999741346798,
  0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.9049059503270411,0.161358980296555,0.3938381654187039,
  0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9049059503270411,0.161358980296555,0.3938381654187039,
  0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.9049059503270411,0.161358980296555,0.3938381654187039,
  0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.8891293781905669,0.45303024081694615,-0.06490415813948722,
  0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.8891293781905669,0.45303024081694615,-0.06490415813948722,
  0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.8891293781905669,0.45303024081694615,-0.06490415813948722,
  0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.7056169940736841,0.7056147536395786,-0.06490359867199468,
  0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.7056169940736841,0.7056147536395786,-0.06490359867199468,
  0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.7056169940736841,0.7056147536395786,-0.06490359867199468,
  0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.7744929756870413,0.5626969811415766,-0.2890203072892772,
  0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.7744929756870413,0.5626969811415766,-0.2890203072892772,
  0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.7744929756870413,0.5626969811415766,-0.2890203072892772,
  0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.5556259833512643,-0.5733698183711554,0.6021019996694653,
  0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.5556259833512643,-0.5733698183711554,0.6021019996694653,
  0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.5556259833512643,-0.5733698183711554,0.6021019996694653,
  0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.29004349098379356,-0.5733687582967675,0.7662395450165418,
  0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.29004349098379356,-0.5733687582967675,0.7662395450165418,
  0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.29004349098379356,-0.5733687582967675,0.7662395450165418,
  0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.3482411474888483,-0.7491463488592232,0.5634783502376516,
  0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.3482411474888483,-0.7491463488592232,0.5634783502376516,
  0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.3482411474888483,-0.7491463488592232,0.5634783502376516,
  0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.21787243246147264,-0.35124829468757784,0.9105801659669451,
  0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.21787243246147264,-0.35124829468757784,0.9105801659669451,
  -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,0.21787243246147264,-0.35124829468757784,0.9105801659669451,
  0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.40138618486326494,-0.0986677750435375,0.9105788273229676,
  0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.40138618486326494,-0.0986677750435375,0.9105788273229676,
  0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.40138618486326494,-0.0986677750435375,0.9105788273229676,
  -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,0.13726376049162398,-0.0997273320931458,0.985501455751985,
  -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,0.13726376049162398,-0.0997273320931458,0.985501455751985,
  0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.13726376049162398,-0.0997273320931458,0.985501455751985,
  0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.6349390266407596,-0.0986677085341618,0.7662356789794524,
  0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.6349390266407596,-0.0986677085341618,0.7662356789794524,
  0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.6349390266407596,-0.0986677085341618,0.7662356789794524,
  0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.717007979265709,-0.3512482756842151,0.6020998310065948,
  0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.717007979265709,-0.3512482756842151,0.6020998310065948,
  0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.717007979265709,-0.3512482756842151,0.6020998310065948,
  0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.8200745038929085,-0.09972382650385908,0.5635006357513968,
  0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.8200745038929085,-0.09972382650385908,0.5635006357513968,
  0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.8200745038929085,-0.09972382650385908,0.5635006357513968,
  -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.373613516526666,-0.7056100416852755,0.6021024907285157,
  -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.373613516526666,-0.7056100416852755,0.6021024907285157,
  -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.373613516526666,-0.7056100416852755,0.6021024907285157,
  -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.45568018842102764,-0.45302720531155777,0.7662388120737401,
  -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.45568018842102764,-0.45302720531155777,0.7662388120737401,
  -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.45568018842102764,-0.45302720531155777,0.7662388120737401,
  -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.6048673099190082,-0.56269463003264,0.5634805149459678,
  -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.6048673099190082,-0.56269463003264,0.5634805149459678,
  -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.6048673099190082,-0.56269463003264,0.5634805149459678,
  -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.2667315616493877,-0.3157493036139345,0.9105803925449935,
  -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.2667315616493877,-0.3157493036139345,0.9105803925449935,
  -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.2667315616493877,-0.3157493036139345,0.9105803925449935,
  0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.030193516312269852,-0.4122279003905533,0.9105803148060564,
  -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,0.030193516312269852,-0.4122279003905533,0.9105803148060564,
  -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,0.030193516312269852,-0.4122279003905533,0.9105803148060564,
  -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,-0.05243045372163579,-0.161361700375117,0.9855016231212379,
  -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.05243045372163579,-0.161361700375117,0.9855016231212379,
  -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,-0.05243045372163579,-0.161361700375117,0.9855016231212379,
  0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.10236296935915389,-0.634348937053083,0.7662396808855574,
  -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,0.10236296935915389,-0.634348937053083,0.7662396808855574,
  0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.10236296935915389,-0.634348937053083,0.7662396808855574,
  -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.11249635206289318,-0.7904535861844931,0.602102731151932,
  -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,-0.11249635206289318,-0.7904535861844931,0.602102731151932,
  -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,-0.11249635206289318,-0.7904535861844931,0.602102731151932,
  0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.158597661986661,-0.8107643536568595,0.5634784329960995,
  0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.158597661986661,-0.8107643536568595,0.5634784329960995,
  -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,0.158597661986661,-0.8107643536568595,0.5634784329960995,
  -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.786529537371608,0.13727635663558196,0.6021017262480359,
  -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.786529537371608,0.13727635663558196,0.6021017262480359,
  -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.786529537371608,0.13727635663558196,0.6021017262480359,
  -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.5716703002569036,0.29337878079020213,0.7662388392572097,
  -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.5716703002569036,0.29337878079020213,0.7662388392572097,
  -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.5716703002569036,0.29337878079020213,0.7662388392572097,
  -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.7220727651677643,0.4013733476132851,0.5634805743135106,
  -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.7220727651677643,0.4013733476132851,0.5634805743135106,
  -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.7220727651677643,0.4013733476132851,0.5634805743135106,
  -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.3827212406934171,0.15610136154465007,0.9105804834532737,
  -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.3827212406934171,0.15610136154465007,0.9105804834532737,
  -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.3827212406934171,0.15610136154465007,0.9105804834532737,
  -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.38272124750012904,-0.15610137316785738,0.9105804785998074,
  -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.38272124750012904,-0.15610137316785738,0.9105804785998074,
  -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.38272124750012904,-0.15610137316785738,0.9105804785998074,
  -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,-0.16966523322150842,0.0,0.9855017547604323,
  -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.16966523322150842,0.0,0.9855017547604323,
  -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.16966523322150842,0.0,0.9855017547604323,
  -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.5716702792979945,-0.29337877811177093,0.7662388559196127,
  -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.5716702792979945,-0.29337877811177093,0.7662388559196127,
  -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.5716702792979945,-0.29337877811177093,0.7662388559196127,
  -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.7865295373716205,-0.1372763566355822,0.6021017262480196,
  -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.7865295373716205,-0.1372763566355822,0.6021017262480196,
  -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.7865295373716205,-0.1372763566355822,0.6021017262480196,
  -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.7220727651688026,-0.40137334761281906,0.563480574312512,
  -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.7220727651688026,-0.40137334761281906,0.563480574312512,
  -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.7220727651688026,-0.40137334761281906,0.563480574312512,
  -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.11249635206289327,0.7904535861844922,0.6021027311519331,
  -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,-0.11249635206289327,0.7904535861844922,0.6021027311519331,
  -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,-0.11249635206289327,0.7904535861844922,0.6021027311519331,
  0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.10236306098376788,0.6343489989811777,0.7662396173767129,
  0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.10236306098376788,0.6343489989811777,0.7662396173767129,
  -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,0.10236306098376788,0.6343489989811777,0.7662396173767129,
  0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.1585976834113004,0.810764268801057,0.5634785490611477,
  -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,0.1585976834113004,0.810764268801057,0.5634785490611477,
  0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.1585976834113004,0.810764268801057,0.5634785490611477,
  0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.03019352770417396,0.41222786395924554,0.9105803309210972,
  -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,0.03019352770417396,0.41222786395924554,0.9105803309210972,
  -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,0.03019352770417396,0.41222786395924554,0.9105803309210972,
  -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.26673153503428815,0.31574929778599303,0.9105804023620895,
  -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.26673153503428815,0.31574929778599303,0.9105804023620895,
  -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.26673153503428815,0.31574929778599303,0.9105804023620895,
  -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,-0.05243044510105064,0.16136171190180773,0.9855016216925386,
  -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,-0.05243044510105064,0.16136171190180773,0.9855016216925386,
  -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.05243044510105064,0.16136171190180773,0.9855016216925386,
  -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.4556802023562995,0.4530272348130376,0.7662387863441623,
  -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.4556802023562995,0.4530272348130376,0.7662387863441623,
  -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.4556802023562995,0.4530272348130376,0.7662387863441623,
  -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.3736136402253394,0.7056100351752885,0.6021024216007594,
  -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.3736136402253394,0.7056100351752885,0.6021024216007594,
  -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.3736136402253394,0.7056100351752885,0.6021024216007594,
  -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.6048672442080638,0.562694706371266,0.5634805092511163,
  -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.6048672442080638,0.562694706371266,0.5634805092511163,
  -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.6048672442080638,0.562694706371266,0.5634805092511163,
  0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.7170079792643393,0.3512482756868904,0.6020998310066653,
  0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.7170079792643393,0.3512482756868904,0.6020998310066653,
  0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.7170079792643393,0.3512482756868904,0.6020998310066653,
  0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.6349390266407688,0.09866770853401576,0.7662356789794635,
  0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.6349390266407688,0.09866770853401576,0.7662356789794635,
  0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.6349390266407688,0.09866770853401576,0.7662356789794635,
  0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.8200745038929455,0.0997238265034114,0.5635006357514222,
  0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.8200745038929455,0.0997238265034114,0.5635006357514222,
  0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.8200745038929455,0.0997238265034114,0.5635006357514222,
  0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.4013861845151851,0.09866778374700691,0.9105788265333187,
  0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.4013861845151851,0.09866778374700691,0.9105788265333187,
  0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.4013861845151851,0.09866778374700691,0.9105788265333187,
  0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.21787243544536275,0.35124826452696245,0.9105801768871884,
  -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,0.21787243544536275,0.35124826452696245,0.9105801768871884,
  0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.21787243544536275,0.35124826452696245,0.9105801768871884,
  -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,0.13726376036863816,0.09972734098810271,0.9855014548689939,
  0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.13726376036863816,0.09972734098810271,0.9855014548689939,
  -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,0.13726376036863816,0.09972734098810271,0.9855014548689939,
  0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.2900434568871001,0.5733688522583722,0.7662394876126509,
  0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.2900434568871001,0.5733688522583722,0.7662394876126509,
  0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.2900434568871001,0.5733688522583722,0.7662394876126509,
  0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.5556260194438501,0.5733697244076063,0.6021020558424691,
  0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.5556260194438501,0.5733697244076063,0.6021020558424691,
  0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.5556260194438501,0.5733697244076063,0.6021020558424691,
  0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.3482409616935957,0.7491463488573389,0.5634784650653812,
  0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.3482409616935957,0.7491463488573389,0.5634784650653812,
  0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.3482409616935957,0.7491463488573389,0.5634784650653812,
  0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.3337976901239209,0.4349849838050999,0.8362817503282085,
  0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.3337976901239209,0.4349849838050999,0.8362817503282085,
  0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.3337976901239209,0.4349849838050999,0.8362817503282085,
  0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.5168458529709208,0.18304579180754743,0.8362802176114829,
  0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.5168458529709208,0.18304579180754743,0.8362802176114829,
  0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.5168458529709208,0.18304579180754743,0.8362802176114829,
  0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.5987063332641229,0.43498543079189117,0.6725610764147907,
  0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.5987063332641229,0.43498543079189117,0.6725610764147907,
  0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.5987063332641229,0.43498543079189117,0.6725610764147907,
  -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.3105465803904405,0.45187809786617095,0.836281654753143,
  -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.3105465803904405,0.45187809786617095,0.836281654753143,
  -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.3105465803904405,0.45187809786617095,0.836281654753143,
  0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,-0.014375025187359633,0.54811137916339,0.836281815348432,
  -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,-0.014375025187359633,0.54811137916339,0.836281815348432,
  -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.014375025187359633,0.54811137916339,0.836281815348432,
  -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.22868908812893668,0.7038198371342455,0.6725614751285416,
  -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.22868908812893668,0.7038198371342455,0.6725614751285416,
  -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,-0.22868908812893668,0.7038198371342455,0.6725614751285416,
  -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.5257288496935327,-0.15570515706632634,0.8362805035769193,
  -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.5257288496935327,-0.15570515706632634,0.8362805035769193,
  -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.5257288496935327,-0.15570515706632634,0.8362805035769193,
  -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.5257288565113238,0.15570514544984565,0.8362805014537518,
  -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.5257288565113238,0.15570514544984565,0.8362805014537518,
  -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.5257288565113238,0.15570514544984565,0.8362805014537518,
  -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.7400431604567386,0.0,0.6725593807696104,
  -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.7400431604567386,0.0,0.6725593807696104,
  -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.7400431604567386,0.0,0.6725593807696104,
  0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,-0.014375025183341017,-0.5481113791642288,0.8362818153479515,
  -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.014375025183341017,-0.5481113791642288,0.8362818153479515,
  -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,-0.014375025183341017,-0.5481113791642288,0.8362818153479515,
  -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.31054660634034525,-0.45187806863117713,0.8362816609137449,
  -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.31054660634034525,-0.45187806863117713,0.8362816609137449,
  -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.31054660634034525,-0.45187806863117713,0.8362816609137449,
  -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.22868908812963912,-0.7038198371336519,0.6725614751289236,
  -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,-0.22868908812963912,-0.7038198371336519,0.6725614751289236,
  -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.22868908812963912,-0.7038198371336519,0.6725614751289236,
  0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.5168458649633569,-0.18304578392835724,0.8362802119244079,
  0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.5168458649633569,-0.18304578392835724,0.8362802119244079,
  0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.5168458649633569,-0.18304578392835724,0.8362802119244079,
  0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.33379768111941355,-0.4349850166946444,0.8362817368150892,
  0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.33379768111941355,-0.4349850166946444,0.8362817368150892,
  0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.33379768111941355,-0.4349850166946444,0.8362817368150892,
  0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.598706333264664,-0.4349854307896837,0.6725610764157365,
  0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.598706333264664,-0.4349854307896837,0.6725610764157365,
  0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.598706333264664,-0.4349854307896837,0.6725610764157365,
  0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.8868726411103974,0.45188038550008525,0.09623427482016117,
  0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.8868726411103974,0.45188038550008525,0.09623427482016117,
  0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.8868726411103974,0.45188038550008525,0.09623427482016117,
  0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.7544176076440144,0.5481140659055463,0.36114407655833464,
  0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.7544176076440144,0.5481140659055463,0.36114407655833464,
  0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.7544176076440144,0.5481140659055463,0.36114407655833464,
  0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.703826009734567,0.7038237749870908,0.09623430668965156,
  0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.703826009734567,0.7038237749870908,0.09623430668965156,
  0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.703826009734567,0.7038237749870908,0.09623430668965156,
  -0.08942674659491123,1.0,-0.08942674659491123,1.0,-0.1557084584099035,0.9831040677591577,0.09623548168429935,
  -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.1557084584099035,0.9831040677591577,0.09623548168429935,
  -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.1557084584099035,0.9831040677591577,0.09623548168429935,
  -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.28816388988226643,0.8868681304880176,0.3611460808213343,
  -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.28816388988226643,0.8868681304880176,0.3611460808213343,
  -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.28816388988226643,0.8868681304880176,0.3611460808213343,
  -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.45188374182885493,0.8868707696675265,0.09623576144075277,
  -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.45188374182885493,0.8868707696675265,0.09623576144075277,
  -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.45188374182885493,0.8868707696675265,0.09623576144075277,
  -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.9831043836297442,0.1557060533937894,0.09623614614328184,
  -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9831043836297442,0.1557060533937894,0.09623614614328184,
  -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.9831043836297442,0.1557060533937894,0.09623614614328184,
  -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.9325093417933523,0.0,0.361145853455538,
  -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.9325093417933523,0.0,0.361145853455538,
  -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.9325093417933523,0.0,0.361145853455538,
  -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.9831043830057655,-0.15570605329496234,0.0962361526774606,
  -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.9831043830057655,-0.15570605329496234,0.0962361526774606,
  -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9831043830057655,-0.15570605329496234,0.0962361526774606,
  -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.45188374182885466,-0.8868707696675268,0.09623576144075378,
  -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.45188374182885466,-0.8868707696675268,0.09623576144075378,
  -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.45188374182885466,-0.8868707696675268,0.09623576144075378,
  -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.2881638898822667,-0.8868681304880176,0.3611460808213341,
  -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.2881638898822667,-0.8868681304880176,0.3611460808213341,
  -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.2881638898822667,-0.8868681304880176,0.3611460808213341,
  -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,-0.1557084584099035,-0.9831040677591577,0.0962354816842998,
  -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.1557084584099035,-0.9831040677591577,0.0962354816842998,
  -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.1557084584099035,-0.9831040677591577,0.0962354816842998,
  0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.7038260016581754,-0.7038237669094751,0.09623442483448079,
  0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.7038260016581754,-0.7038237669094751,0.09623442483448079,
  0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.7038260016581754,-0.7038237669094751,0.09623442483448079,
  0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.7544175752367749,-0.5481141400040827,0.36114403179541826,
  0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.7544175752367749,-0.5481141400040827,0.36114403179541826,
  0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.7544175752367749,-0.5481141400040827,0.36114403179541826,
  0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.886872641109946,-0.45188038550049187,0.09623427482241326,
  0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.886872641109946,-0.45188038550049187,0.09623427482241326,
  0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.886872641109946,-0.45188038550049187,0.09623427482241326,
  -0.08942674659491123,1.0,-0.08942674659491123,1.0,0.15570845840990344,0.9831040677591575,-0.09623548168429938,
  0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.15570845840990344,0.9831040677591575,-0.09623548168429938,
  0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.15570845840990344,0.9831040677591575,-0.09623548168429938,
  0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.45188374182885466,0.8868707696675268,-0.09623576144075305,
  0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.45188374182885466,0.8868707696675268,-0.09623576144075305,
  0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.45188374182885466,0.8868707696675268,-0.09623576144075305,
  0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.28816388988226643,0.8868681304880176,-0.36114608082133426,
  0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.28816388988226643,0.8868681304880176,-0.36114608082133426,
  0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.28816388988226643,0.8868681304880176,-0.36114608082133426,
  -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.8868726411103979,0.45188038550008464,-0.09623427482016111,
  -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.8868726411103979,0.45188038550008464,-0.09623427482016111,
  -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.8868726411103979,0.45188038550008464,-0.09623427482016111,
  -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.7038260097345667,0.7038237749870914,-0.09623430668965094,
  -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.7038260097345667,0.7038237749870914,-0.09623430668965094,
  -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.7038260097345667,0.7038237749870914,-0.09623430668965094,
  -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.7544176076440146,0.5481140659055457,-0.3611440765583354,
  -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.7544176076440146,0.5481140659055457,-0.3611440765583354,
  -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.7544176076440146,0.5481140659055457,-0.3611440765583354,
  -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.703826001658175,-0.7038237669094755,-0.09623442483448011,
  -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.703826001658175,-0.7038237669094755,-0.09623442483448011,
  -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.703826001658175,-0.7038237669094755,-0.09623442483448011,
  -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.8868726411099463,-0.45188038550049126,-0.09623427482241323,
  -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.8868726411099463,-0.45188038550049126,-0.09623427482241323,
  -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.8868726411099463,-0.45188038550049126,-0.09623427482241323,
  -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.754417575236775,-0.548114140004082,-0.36114403179541904,
  -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.754417575236775,-0.548114140004082,-0.36114403179541904,
  -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.754417575236775,-0.548114140004082,-0.36114403179541904,
  0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.45188374182885427,-0.8868707696675268,-0.09623576144075405,
  0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.45188374182885427,-0.8868707696675268,-0.09623576144075405,
  0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.45188374182885427,-0.8868707696675268,-0.09623576144075405,
  -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,0.1557084584099035,-0.9831040677591575,-0.09623548168429982,
  0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.1557084584099035,-0.9831040677591575,-0.09623548168429982,
  0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.1557084584099035,-0.9831040677591575,-0.09623548168429982,
  0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.2881638898822667,-0.8868681304880176,-0.361146080821334,
  0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.2881638898822667,-0.8868681304880176,-0.361146080821334,
  0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.2881638898822667,-0.8868681304880176,-0.361146080821334,
  0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.9831043836297443,0.15570605339378868,-0.09623614614328271,
  0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9831043836297443,0.15570605339378868,-0.09623614614328271,
  0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.9831043836297443,0.15570605339378868,-0.09623614614328271,
  0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.9831043830057655,-0.1557060532949616,-0.09623615267746147,
  0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.9831043830057655,-0.1557060532949616,-0.09623615267746147,
  0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9831043830057655,-0.1557060532949616,-0.09623615267746147,
  0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.932509341793352,0.0,-0.3611458534555385,
  0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.932509341793352,0.0,-0.3611458534555385,
  0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.932509341793352,0.0,-0.3611458534555385,
  0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.31054658039044,0.4518780978661704,-0.8362816547531434,
  0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.31054658039044,0.4518780978661704,-0.8362816547531434,
  0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.31054658039044,0.4518780978661704,-0.8362816547531434,
  0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.22868908812893654,0.7038198371342458,-0.6725614751285413,
  0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.22868908812893654,0.7038198371342458,-0.6725614751285413,
  -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,0.22868908812893654,0.7038198371342458,-0.6725614751285413,
  -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,0.014375025187359785,0.5481113791633897,-0.8362818153484325,
  -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,0.014375025187359785,0.5481113791633897,-0.8362818153484325,
  0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.014375025187359785,0.5481113791633897,-0.8362818153484325,
  -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.33379769012392096,0.4349849838051005,-0.8362817503282082,
  -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.33379769012392096,0.4349849838051005,-0.8362817503282082,
  -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.33379769012392096,0.4349849838051005,-0.8362817503282082,
  -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.5987063332641228,0.43498543079189106,-0.6725610764147907,
  -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.5987063332641228,0.43498543079189106,-0.6725610764147907,
  -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.5987063332641228,0.43498543079189106,-0.6725610764147907,
  -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.5168458529709213,0.1830457918075477,-0.8362802176114825,
  -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.5168458529709213,0.1830457918075477,-0.8362802176114825,
  -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.5168458529709213,0.1830457918075477,-0.8362802176114825,
  -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.5168458649633575,-0.18304578392835744,-0.8362802119244075,
  -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.5168458649633575,-0.18304578392835744,-0.8362802119244075,
  -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.5168458649633575,-0.18304578392835744,-0.8362802119244075,
  -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.598706333264664,-0.43498543078968377,-0.6725610764157365,
  -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.598706333264664,-0.43498543078968377,-0.6725610764157365,
  -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.598706333264664,-0.43498543078968377,-0.6725610764157365,
  -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.3337976811194137,-0.4349850166946449,-0.8362817368150889,
  -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.3337976811194137,-0.4349850166946449,-0.8362817368150889,
  -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.3337976811194137,-0.4349850166946449,-0.8362817368150889,
  0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.5257288565113233,0.15570514544984582,-0.836280501453752,
  0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.5257288565113233,0.15570514544984582,-0.836280501453752,
  0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.5257288565113233,0.15570514544984582,-0.836280501453752,
  0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.7400431604567397,0.0,-0.6725593807696092,
  0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.7400431604567397,0.0,-0.6725593807696092,
  0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.7400431604567397,0.0,-0.6725593807696092,
  0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.5257288496935323,-0.15570515706632646,-0.8362805035769194,
  0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.5257288496935323,-0.15570515706632646,-0.8362805035769194,
  0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.5257288496935323,-0.15570515706632646,-0.8362805035769194,
  -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,0.014375025183341193,-0.5481113791642283,-0.8362818153479519,
  0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.014375025183341193,-0.5481113791642283,-0.8362818153479519,
  -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,0.014375025183341193,-0.5481113791642283,-0.8362818153479519,
  0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.22868908812963903,-0.7038198371336523,-0.6725614751289233,
  -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,0.22868908812963903,-0.7038198371336523,-0.6725614751289233,
  0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.22868908812963903,-0.7038198371336523,-0.6725614751289233,
  0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.3105466063403448,-0.45187806863117663,-0.8362816609137453,
  0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.3105466063403448,-0.45187806863117663,-0.8362816609137453,
  0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.3105466063403448,-0.45187806863117663,-0.8362816609137453
]);

var tenSphere = new Float32Array(960*10);

for (let i = 0; i < 960; i++) {
  tenSphere[10*i+0] = sphere[7*i+0];
  tenSphere[10*i+1] = sphere[7*i+1];
  tenSphere[10*i+2] = sphere[7*i+2];
  tenSphere[10*i+3] = sphere[7*i+3];
  tenSphere[10*i+4] = 0.0;//sphere[7*i+4];
  tenSphere[10*i+5] = 1.0;//sphere[7*i+5];
  tenSphere[10*i+6] = 1.0;//sphere[7*i+6];
  tenSphere[10*i+7] = sphere[7*i+0];
  tenSphere[10*i+8] = sphere[7*i+1];
  tenSphere[10*i+9] = sphere[7*i+2];
}



var tetra_rect =  new Float32Array ([
    // Face 0: (right side).  Unit Normal Vector: N0 = (sq23, sq29, thrd)
    0.0,	 0.0, sq2, 1.0,			0.0, 	0.0,	1.0,		 sq23,	sq29, thrd,
    c30, -0.5, 0.0, 1.0, 			1.0,  0.0,  0.0, 		sq23,	sq29, thrd,
    0.0,  1.0, 0.0, 1.0,  		0.0,  1.0,  0.0,		sq23,	sq29, thrd, 
    // Face 1: (left side).		Unit Normal Vector: N1 = (-sq23, sq29, thrd)
    0.0,	 0.0, sq2, 1.0,			0.0, 	0.0,	1.0,	 -sq23,	sq29, thrd,
    0.0,  1.0, 0.0, 1.0,  		0.0,  1.0,  0.0,	 -sq23,	sq29, thrd,
    -c30, -0.5, 0.0, 1.0, 		1.0,  1.0,  1.0, 	 -sq23,	sq29,	thrd,
    // Face 2: (lower side) 	Unit Normal Vector: N2 = (0.0, -sq89, thrd)
    0.0,	 0.0, sq2, 1.0,			0.0, 	0.0,	1.0,		0.0, -sq89,	thrd,
    -c30, -0.5, 0.0, 1.0, 		1.0,  1.0,  1.0, 		0.0, -sq89,	thrd,          																							//0.0, 0.0, 0.0, // Normals debug
    c30, -0.5, 0.0, 1.0, 			1.0,  0.0,  0.0, 		0.0, -sq89,	thrd,
    // Face 3: (base side)  Unit Normal Vector: N2 = (0.0, 0.0, -1.0)
    -c30, -0.5, 0.0, 1.0, 		1.0,  1.0,  1.0, 		0.0, 	0.0, -1.0,
    0.0,  1.0, 0.0, 1.0,  		0.0,  1.0,  0.0,		0.0, 	0.0, -1.0,
    c30, -0.5, 0.0, 1.0, 			1.0,  0.0,  0.0, 		0.0, 	0.0, -1.0,

    
//Side 1 for rectangle (000,101,001)(000,101,100) -> (0,-1,0) (RED)
0.00, 0.00, 0.00, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
0.20, 0.00, 0.20, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
0.00, 0.00, 0.20, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,

0.00, 0.00, 0.00, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
0.20, 0.00, 0.20, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
0.20, 0.00, 0.00, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,

//Side 2 of rectangle, (000,110,100)(000,110,010) -> (0,0,-1) (GREEN)
0.00, 0.00, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
0.20, 0.50, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
0.20, 0.00, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 

0.00, 0.00, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
0.20, 0.50, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
0.00, 0.50, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 

//Side 3 of rectangle, (000,011,010)(000,011,001) -> (-1,0,0) (BLUE)
0.00, 0.00, 0.00, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
0.00, 0.50, 0.20, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
0.00, 0.50, 0.00, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 

0.00, 0.00, 0.00, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
0.00, 0.50, 0.20, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
0.00, 0.00, 0.20, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 

//Side 4 of rectangle, (111,001,011)(111,001,101) -> (001) (YELLOW)
0.20, 0.50, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
0.00, 0.00, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
0.00, 0.50, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 

0.20, 0.50, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
0.00, 0.00, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
0.20, 0.00, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 

//Side 5 of rectangle, (111,010,011)(111,010,110) -> (010) (CYAN)
0.20, 0.50, 0.20, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
0.00, 0.50, 0.00, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
0.00, 0.50, 0.20, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 

0.20, 0.50, 0.20, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
0.00, 0.50, 0.00, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
0.20, 0.50, 0.00, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 

//Side 6 of rectangle, (111,100,101)(111,100,110) -> (100) (MAGENTA)
0.20, 0.50, 0.20, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
0.20, 0.00, 0.00, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
0.20, 0.00, 0.20, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 

0.20, 0.50, 0.20, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
0.20, 0.00, 0.00, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
0.20, 0.50, 0.00, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
]);
  
for (let i = 0; i < 12+36; i++) {
  tetra_rect[10*i+7] = tetra_rect[10*i+7] * 1;
  tetra_rect[10*i+8] = tetra_rect[10*i+8] * 1;
  tetra_rect[10*i+9] = tetra_rect[10*i+9] * 1;
}

for (let i = 0; i < 12+36; i++) {
  tetra_rect[10*i+4] = 1.0;
  tetra_rect[10*i+5] = 1.0;
  tetra_rect[10*i+6] = 0.0;
}

  this.vboContents = new Float32Array((960+36+12)*10);
  this.vboContents.set(tenSphere, offset=0);
  this.vboContents.set(tetra_rect, offset=9600);
    
	this.vboVerts = 960+36+12;							// # of vertices held in 'vboContents' array;
	this.FSIZE = this.vboContents.BYTES_PER_ELEMENT;  
	                              // bytes req'd by 1 vboContents array element;
																// (why? used to compute stride and offset 
																// in bytes for vertexAttribPointer() calls)
  this.vboBytes = this.vboContents.length * this.FSIZE;               
                                // (#  of floats in vboContents array) * 
                                // (# of bytes/float).
	this.vboStride = this.vboBytes / this.vboVerts;     
	                              // (== # of bytes to store one complete vertex).
	                              // From any attrib in a given vertex in the VBO, 
	                              // move forward by 'vboStride' bytes to arrive 
	                              // at the same attrib for the next vertex.
	                               
	            //----------------------Attribute sizes
  this.vboFcount_a_Pos1 =  4;    // # of floats in the VBO needed to store the
                                // attribute named a_Pos1. (4: x,y,z,w values)
  this.vboFcount_a_Colr1 = 3;   // # of floats for this attrib (r,g,b values)
  this.vboFcount_a_Normal = 3;  // # of floats for this attrib (just one!)   
  console.assert((this.vboFcount_a_Pos1 +     // check the size of each and
                  this.vboFcount_a_Colr1 +
                  this.vboFcount_a_Normal) *   // every attribute in our VBO
                  this.FSIZE == this.vboStride, // for agreeement with'stride'
                  "Uh oh! VBObox1.vboStride disagrees with attribute-size values!");
                  
              //----------------------Attribute offsets
	this.vboOffset_a_Pos1 = 0;    //# of bytes from START of vbo to the START
	                              // of 1st a_Pos1 attrib value in vboContents[]
  this.vboOffset_a_Colr1 = (this.vboFcount_a_Pos1) * this.FSIZE;  
                                // == 4 floats * bytes/float
                                //# of bytes from START of vbo to the START
                                // of 1st a_Colr1 attrib value in vboContents[]
  this.vboOffset_a_Normal =(this.vboFcount_a_Pos1 +
                            this.vboFcount_a_Colr1) * this.FSIZE; 
                                // == 7 floats * bytes/float
                                // # of bytes from START of vbo to the START
                                // of 1st a_PtSize attrib value in vboContents[]

	            //-----------------------GPU memory locations:                                
	this.vboLoc;									// GPU Location for Vertex Buffer Object, 
	                              // returned by gl.createBuffer() function call
	this.shaderLoc;								// GPU Location for compiled Shader-program  
	                            	// set by compile/link of VERT_SRC and FRAG_SRC.
								          //------Attribute locations in our shaders:
	this.a_Pos1Loc;							  // GPU location: shader 'a_Pos1' attribute
	this.a_Colr1Loc;							// GPU location: shader 'a_Colr1' attribute
	this.a_NormalLoc;							// GPU location: shader 'a_PtSiz1' attribute
	
	            //---------------------- Uniform locations &values in our shaders
	this.ModelMatrix = new Matrix4();	// Transforms CVV axes to model axes.
	this.u_ModelMatrixLoc;						// GPU location for u_ModelMat uniform

  //Felipe's addition: make a Normal Matrix too
  this.NormalMatrix = new Matrix4();
  this.u_NormalMatrixLoc;
  this.MvpMatrix = new Matrix4();
  this.u_MvpMatrixLoc;

  this.EyePos = new Vector3();
  this.u_EyePosLoc;

  this.LightColor = new Vector3();
  this.LightPosition = new Vector3();
  this.AmbientLight = new Vector3();
  this.SpecularLight = new Vector3();

  this.u_LightColorLoc;
  this.u_LightPositionLoc;
  this.u_AmbientLightLoc;
  this.u_SpecularLightLoc;

  this.emit = new Vector3();
  this.ambi = new Vector3();
  this.diff = new Vector3();
  this.spec = new Vector3();
  this.shiny = 0;

  this.u_emitLoc;
  this.u_ambiLoc;
  this.u_diffLoc;
  this.u_specLoc;
  this.u_shinyLoc;
};

//USE
VBObox1.prototype.init = function() {
//--------------------
// a) Compile,link,upload shaders-----------------------------------------------
	this.shaderLoc = createProgram(gl, this.VERT_SRC, this.FRAG_SRC);
	if (!this.shaderLoc) {
    console.log(this.constructor.name + 
    						'.init() failed to create executable Shaders on the GPU. Bye!');
    return;
  }
// CUTE TRICK: let's print the NAME of this VBObox object: tells us which one!
//  else{console.log('You called: '+ this.constructor.name + '.init() fcn!');}

	gl.program = this.shaderLoc;		// (to match cuon-utils.js -- initShaders())

// b) Create VBO on GPU, fill it------------------------------------------------
	this.vboLoc = gl.createBuffer();	
  if (!this.vboLoc) {
    console.log(this.constructor.name + 
    						'.init() failed to create VBO in GPU. Bye!'); 
    return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER,	      // GLenum 'target' for this GPU buffer 
  								this.vboLoc);	
  gl.bufferData(gl.ARRAY_BUFFER, 			  // GLenum target(same as 'bindBuffer()')
 					 				this.vboContents, 		// JavaScript Float32Array
  							 	gl.STATIC_DRAW);

// c1) Find All Attributes:-----------------------------------------------------
//  Find & save the GPU location of all our shaders' attribute-variables and 
//  uniform-variables (for switchToMe(), adjust(), draw(), reload(), etc.)
  this.a_Pos1Loc = gl.getAttribLocation(this.shaderLoc, 'a_Position');
  if(this.a_Pos1Loc < 0) {
    console.log(this.constructor.name + 
    						'.init() Failed to get GPU location of attribute a_Pos1');
    return -1;	// error exit.
  }
 	this.a_Colr1Loc = gl.getAttribLocation(this.shaderLoc, 'a_Color');
  if(this.a_Colr1Loc < 0) {
    console.log(this.constructor.name + 
    						'.init() failed to get the GPU location of attribute a_Colr1');
    return -1;	// error exit.
  }
  this.a_NormalLoc = gl.getAttribLocation(this.shaderLoc, 'a_Normal');
  if(this.a_NormalLoc < 0) {
    console.log(this.constructor.name + 
	    					'.init() failed to get the GPU location of attribute a_PtSiz1');
	  return -1;	// error exit.
  }
  // c2) Find All Uniforms:-----------------------------------------------------
  //Get GPU storage location for each uniform var used in our shader programs: 
  this.u_ModelMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_ModelMatrix');
  if (!this.u_ModelMatrixLoc) { 
    console.log(this.constructor.name + 
    						'.init() failed to get GPU location for u_ModelMatrix uniform');
    return;
  }

  //Felipe's addition: find the uniform for Normal matrix
  this.u_NormalMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_NormalMatrix');
  if (!this.u_NormalMatrixLoc) { 
    console.log(this.constructor.name + 
    						'.init() failed to get GPU location for u_NormalMatrix uniform');
    //return;
  }
  this.u_MvpMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_MvpMatrix');
  if (!this.u_MvpMatrixLoc) { 
    console.log(this.constructor.name + 
    						'.init() failed to get GPU location for u_MvpMatrix uniform');
    //return;
  }
  this.u_EyePosLoc = gl.getUniformLocation(this.shaderLoc, 'u_EyePos');
  if (!this.u_EyePosLoc) { 
    console.log(this.constructor.name + 
    						'.init() failed to get GPU location for u_EyePos uniform');
    //return;
  }

  this.u_LightColorLoc = gl.getUniformLocation(this.shaderLoc, 'u_LightColor');
  if (!this.u_LightColorLoc) { 
    console.log(this.constructor.name +  '.init() failed to get GPU location for u_LightColor uniform');
    return;
  }
  this.u_LightPositionLoc = gl.getUniformLocation(this.shaderLoc, 'u_LightPosition');
  if (!this.u_LightPositionLoc) { 
    console.log(this.constructor.name +  '.init() failed to get GPU location for u_LightPosition uniform');
    //return;
  }
  this.u_AmbientLightLoc = gl.getUniformLocation(this.shaderLoc, 'u_AmbientLight');
  if (!this.u_AmbientLightLoc) { 
    console.log(this.constructor.name +  '.init() failed to get GPU location for u_AmbientLight uniform');
    return;
  }
  this.u_SpecularLightLoc = gl.getUniformLocation(this.shaderLoc, 'u_SpecularLight');
  if (!this.u_SpecularLightLoc) console.log(this.constructor.name +  ' u_SpecularLight failed');

  this.u_emitLoc = gl.getUniformLocation(this.shaderLoc, 'u_emit');
  if (!this.u_emitLoc) console.log(this.constructor.name +  ' u_emit failed');
  this.u_ambiLoc = gl.getUniformLocation(this.shaderLoc, 'u_ambi');
  if (!this.u_ambiLoc) console.log(this.constructor.name +  ' u_ambi failed');
  this.u_diffLoc = gl.getUniformLocation(this.shaderLoc, 'u_diff');
  if (!this.u_diffLoc) console.log(this.constructor.name +  ' u_diff failed');
  this.u_specLoc = gl.getUniformLocation(this.shaderLoc, 'u_spec');
  if (!this.u_specLoc) console.log(this.constructor.name +  ' u_spec failed');
  this.u_shinyLoc = gl.getUniformLocation(this.shaderLoc, 'u_shiny');
  if (!this.u_shinyLoc) console.log(this.constructor.name +  ' u_shiny failed');
}

VBObox1.prototype.switchToMe = function () {
//==============================================================================
// Set GPU to use this VBObox's contents (VBO, shader, attributes, uniforms...)
//
// We only do this AFTER we called the init() function, which does the one-time-
// only setup tasks to put our VBObox contents into GPU memory.  !SURPRISE!
// even then, you are STILL not ready to draw our VBObox's contents onscreen!
// We must also first complete these steps:
//  a) tell the GPU to use our VBObox's shader program (already in GPU memory),
//  b) tell the GPU to use our VBObox's VBO  (already in GPU memory),
//  c) tell the GPU to connect the shader program's attributes to that VBO.

// a) select our shader program:
  gl.useProgram(this.shaderLoc);	
//		Each call to useProgram() selects a shader program from the GPU memory,
// but that's all -- it does nothing else!  Any previously used shader program's 
// connections to attributes and uniforms are now invalid, and thus we must now
// establish new connections between our shader program's attributes and the VBO
// we wish to use.  
  
// b) call bindBuffer to disconnect the GPU from its currently-bound VBO and
//  instead connect to our own already-created-&-filled VBO.  This new VBO can 
//    supply values to use as attributes in our newly-selected shader program:
	gl.bindBuffer(gl.ARRAY_BUFFER,	    // GLenum 'target' for this GPU buffer 
										this.vboLoc);			// the ID# the GPU uses for our VBO.

// c) connect our newly-bound VBO to supply attribute variable values for each
// vertex to our SIMD shader program, using 'vertexAttribPointer()' function.
// this sets up data paths from VBO to our shader units:
  // 	Here's how to use the almost-identical OpenGL version of this function:
	//		http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttribPointer.xml )
  gl.vertexAttribPointer(
		this.a_Pos1Loc,//index == ID# for the attribute var in GLSL shader pgm;
		this.vboFcount_a_Pos1, // # of floats used by this attribute: 1,2,3 or 4?
		gl.FLOAT,		  // type == what data type did we use for those numbers?
		false,				// isNormalized == are these fixed-point values that we need
									//									normalize before use? true or false
		this.vboStride,// Stride == #bytes we must skip in the VBO to move from the
		              // stored attrib for this vertex to the same stored attrib
		              //  for the next vertex in our VBO.  This is usually the 
									// number of bytes used to store one complete vertex.  If set 
									// to zero, the GPU gets attribute values sequentially from 
									// VBO, starting at 'Offset'.	
									// (Our vertex size in bytes: 4 floats for pos + 3 for color)
		this.vboOffset_a_Pos1);						
		              // Offset == how many bytes from START of buffer to the first
  								// value we will actually use?  (we start with position).
  gl.vertexAttribPointer(this.a_Colr1Loc, this.vboFcount_a_Colr1,
                         gl.FLOAT, false, 
  						           this.vboStride,  this.vboOffset_a_Colr1);
  gl.vertexAttribPointer(this.a_NormalLoc,this.vboFcount_a_Normal, 
                         gl.FLOAT, false, 
							           this.vboStride,	this.vboOffset_a_Normal);	
  //-- Enable this assignment of the attribute to its' VBO source:
  gl.enableVertexAttribArray(this.a_Pos1Loc);
  gl.enableVertexAttribArray(this.a_Colr1Loc);
  gl.enableVertexAttribArray(this.a_NormalLoc);
}

VBObox1.prototype.isReady = function() {
//==============================================================================
// Returns 'true' if our WebGL rendering context ('gl') is ready to render using
// this objects VBO and shader program; else return false.
// see: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter

var isOK = true;

  if(gl.getParameter(gl.CURRENT_PROGRAM) != this.shaderLoc)  {
    console.log(this.constructor.name + 
    						'.isReady() false: shader program at this.shaderLoc not in use!');
    isOK = false;
  }
  if(gl.getParameter(gl.ARRAY_BUFFER_BINDING) != this.vboLoc) {
      console.log(this.constructor.name + 
  						'.isReady() false: vbo at this.vboLoc not in use!');
    isOK = false;
  }
  return isOK;
}

VBObox1.prototype.adjust = function() {
//==============================================================================
// Update the GPU to newer, current values we now store for 'uniform' vars on 
// the GPU; and (if needed) update each attribute's stride and offset in VBO.

  // check: was WebGL context set to use our VBO & shader program?
  if(this.isReady()==false) {
        console.log('ERROR! before' + this.constructor.name + 
  						'.adjust() call you needed to call this.switchToMe()!!');
  }
	// Adjust values for our uniforms,
	this.ModelMatrix.setIdentity();
  //this.ModelMatrix.set(g_worldMat);
	this.MvpMatrix.setIdentity();
  this.MvpMatrix.set(g_mvpMat);

  //this.ModelMatrix.translate(1.0, -2.0, 0);						// then translate them.
  //this.ModelMatrix.rotate(g_angleNow2, 0, 0, 1);	// -spin drawing axes,

}

VBObox1.prototype.draw = function() {
  //=============================================================================
  // Send commands to GPU to select and render current VBObox contents.
  
    // check: was WebGL context set to use our VBO & shader program?
    if(this.isReady()==false) {
          console.log('ERROR! before' + this.constructor.name + 
                '.draw() call you needed to call this.switchToMe()!!');
    }
    this.reMatrix = function() {
      actualMvp = new Matrix4();
      actualMvp.set(this.MvpMatrix);
      actualMvp.multiply(this.ModelMatrix);
      this.NormalMatrix.setInverseOf(this.ModelMatrix);
      this.NormalMatrix.transpose();
      gl.uniformMatrix4fv(this.u_ModelMatrixLoc, false, actualMvp.elements);	// send data from Javascript.
      gl.uniformMatrix4fv(this.u_NormalMatrixLoc, false, this.NormalMatrix.elements);	// send data from Javascript.
      gl.uniformMatrix4fv(this.u_MvpMatrixLoc, false, this.ModelMatrix.elements);	// send data from Javascript.
      
      gl.uniform3f(this.u_EyePos, posX, posY, posZ);
      
      this.LightColor = diffuseColor;
      this.LightPosition = lightPos;
      if(!ambientToggle){ this.AmbientLight = ambientColor; }
      else{ 
        this.AmbientLight = new Vector3(); 
        this.AmbientLight.x = 0.05;
        this.AmbientLight.y = 0.05;
        this.AmbientLight.z = 0.05;
      }
      if(diffuseToggle){ this.LightColor = diffuseColor; }
      else{ 
        this.LightColor = new Vector3(); 
        this.LightColor.x = 0.01;
        this.LightColor.y = 0.01;
        this.LightColor.z = 0.01;
      }
      if(specularToggle){ this.SpecularLight = specularColor; }
      else{ 
        this.SpecularLight = new Vector3(); 
        this.SpecularLight.x = 0.01;
        this.SpecularLight.y = 0.01;
        this.SpecularLight.z = 0.01;
      }
  
      //Light source
      gl.uniform3f(this.u_LightColorLoc, this.LightColor.x,this.LightColor.y,this.LightColor.z);
      gl.uniform3f(this.u_LightPositionLoc, this.LightPosition.x, this.LightPosition.y, this.LightPosition.z);
      gl.uniform3f(this.u_AmbientLightLoc, this.AmbientLight.x, this.AmbientLight.y, this.AmbientLight.z);
      gl.uniform3f(this.u_SpecularLightLoc, this.SpecularLight.x, this.SpecularLight.y, this.SpecularLight.z);
    
      //eye source
    }
  
    this.reMaterial = function(emissive, ambient, diffuse, specular, shiny){
  
      gl.uniform3fv(this.u_emitLoc, emissive);
      gl.uniform3fv(this.u_ambiLoc, ambient);
      gl.uniform3fv(this.u_diffLoc, diffuse);
      gl.uniform3fv(this.u_specLoc, specular);
      gl.uniform1f(this.u_shinyLoc, shiny);
    }
  
    this.drawBox = function() {
      this.reMatrix();
      gl.drawArrays(gl.TRIANGLES, 960+12, 36);		// number of vertices to draw on-screen.
    }
    this.drawSphere = function() {
      this.reMatrix();
      gl.drawArrays(gl.TRIANGLES, 0, 960);		// number of vertices to draw on-screen.
    }
    this.drawJointTree = function(count, pivotAngle, curlAngle){
      pushMatrix(this.ModelMatrix);
      this.ModelMatrix.rotate(-pivotAngle, 0, 0, 1);
      this.ModelMatrix.translate(-0.2, 0 , 0);
      this.drawBox();
      for(i = 0; i < count-1; i++){
        this.ModelMatrix.translate(0.2, 0.5, 0.0);
        this.ModelMatrix.scale(0.8,0.8,0.8);
        this.ModelMatrix.rotate(-curlAngle, 0,0,1);
        this.ModelMatrix.translate(-0.2, 0, 0);
        this.drawBox();
      }
      this.ModelMatrix = popMatrix();
    }
    this.drawSquid = function(pivotAngle, curlAngle, arms, joints){
      pushMatrix(this.ModelMatrix);
      for(k = 0; k<arms; k++){
        this.drawBox();
        this.ModelMatrix.translate(0,0.5,0);
        pushMatrix(this.ModelMatrix);
        this.drawJointTree(joints, pivotAngle, curlAngle);
        this.ModelMatrix = popMatrix();
        this.ModelMatrix.translate(0, -0.5, 0);
        this.ModelMatrix.rotate(360/arms, 1, 0, 0);
      }
      this.ModelMatrix = popMatrix();
    }
    this.drawTree = function(leanAngle, branchAngle, arms, joints){
      pushMatrix(this.ModelMatrix);
      this.ModelMatrix.rotate(90, 1, 0, 0);
      this.reMaterial([0,0,0],[0,0,0],[89/255,57/255,0],[0,0,0],0.0);
      this.drawJointTree(4, 0, 0);
      this.ModelMatrix.rotate(90, 1, 0, 0);
      this.ModelMatrix.rotate(90, 0, 1, 0);
      this.ModelMatrix.translate(1.5,0,0);
      this.ModelMatrix.scale(0.5,0.5,0.5);
      this.reMaterial([0,0,0],[0.05,0.05,0.05],[0,0.6,0],[0.2,0.2,0.2],60.0);
      this.drawSquid(leanAngle,branchAngle, arms, joints);
      this.ModelMatrix = popMatrix();
    }
    this.drawForest = function(xs, ys, zs, count){
      for(j = 0; j < count; j++){
        pushMatrix(this.ModelMatrix);
        this.ModelMatrix.translate(xs[j], ys[j], zs[j]);
        leanAngle = makeAngle(5,g_angleNow0 + j,-10,-15);
        this.drawTree(leanAngle, leanAngle, 5, 5);
        this.ModelMatrix = popMatrix();
      }
    }
    simulationSpeed = 1000;
    this.drawPlanet = function(radius, size, speed, offset, offsetSpeed){
      xpos = radius * Math.sin(g_angleNow0*speed / simulationSpeed);
      ypos = radius * Math.cos(g_angleNow0*speed / simulationSpeed);
      zpos = offset * Math.sin(g_angleNow0*offsetSpeed / simulationSpeed);
      this.ModelMatrix.translate(xpos, ypos, zpos);
      this.ModelMatrix.scale(size, size, size);
      this.drawSphere();
    }
    this.drawMoon = function(radius, size, speed, offset, offsetSpeed){
      this.reMaterial([0,0,0],[0.1,0.1,0.1],[221/256,221/256,221/256],[0.5,0.5,0.5],1000.0);
      pushMatrix(this.ModelMatrix);
      xpos = radius * Math.sin(g_angleNow0*speed / simulationSpeed);
      ypos = radius * Math.cos(g_angleNow0*speed / simulationSpeed);
      zpos = offset * Math.sin(g_angleNow0*offsetSpeed / simulationSpeed);
      this.ModelMatrix.translate(xpos, ypos, zpos);
      this.ModelMatrix.scale(size, size, size);
      this.drawSphere();
      this.ModelMatrix = popMatrix();
    }

    this.drawPlanets = function(){
      pushMatrix(this.ModelMatrix);
      this.reMaterial([0,0,0],[0.1,0.1,0.1],[0,0,0.6],[0.6,0.6,0.6],100.0);
      pushMatrix(this.ModelMatrix);
      pushMatrix(this.ModelMatrix);
      pushMatrix(this.ModelMatrix);
      pushMatrix(this.ModelMatrix);
      pushMatrix(this.ModelMatrix);
      pushMatrix(this.ModelMatrix);
      pushMatrix(this.ModelMatrix);
      pushMatrix(this.ModelMatrix);
      pushMatrix(this.ModelMatrix);
      eS = 0.5;
      eD = 8;
      //Mercury
      this.reMaterial([0,0,0],[0.1,0.1,0.1],[.5,.5,.5],[0.5,0.5,0.5],1000.0);
      this.drawPlanet(0.38*eD,0.38*eS,47.9, 0,0);
      this.ModelMatrix = popMatrix();
      //Venus
      this.reMaterial([0,0,0],[0.1,0.1,0.1],[204/256,194/256,206/256],[0.5,0.5,0.5],1000.0);
      this.drawPlanet(0.72*eD,0.94*eS,35.0,0,0);
      this.ModelMatrix = popMatrix();
      //Earth
      this.reMaterial([0,0,0],[0.1,0.1,0.1],[0/256,105/256,179/256],[0.5,0.5,0.5],100.0);
      this.drawPlanet(1*eD,1*eS,29.8,0,0);
      this.drawMoon(0.1*eD,0.2727,100,0.1,10);
      this.ModelMatrix = popMatrix();
      //Mars
      this.reMaterial([0,0,0],[0.1,0.1,0.1],[122/256,48/256,0/256],[0.5,0.5,0.5],1000.0);
      this.drawPlanet(1.52*eD,0.53*eS,24.1,0,0);
      this.drawMoon(0.2*eD,0.5*0.2727/0.53,100,0.1,10);
      this.drawMoon(0.2*eD,0.5*0.2727/0.53,120,0.5,20);
      this.ModelMatrix = popMatrix();
      //Jupiter
      this.reMaterial([0,0,0],[0.1,0.1,0.1],[250/256,156/256,126/256],[0.5,0.5,0.5],10.0);
      this.drawPlanet(5.2*eD,10.97*eS,13.1,0,0);
      for(i = 0; i < 79; i++){
        this.drawMoon(0.2*eD,0.05*0.2727/0.53*(i%5)/5,100+i,0.1*i/30*(i%5),i/2);
      }
      this.ModelMatrix = popMatrix();
      //Saturn
      this.reMaterial([0,0,0],[0.1,0.1,0.1],[255/256,201/256,137/256],[0.5,0.5,0.5],50.0);
      this.drawPlanet(9.5*eD,9.14*eS,9.7,0,0);
      for(i = 0; i < 82; i++){
        this.drawMoon(0.2*eD,0.1*0.2727/0.53*(i%5)/2,100+i,0.1*i/30,i/2);
      }
      this.ModelMatrix = popMatrix();
      //Uranus
      this.reMaterial([0,0,0],[0.1,0.1,0.1],[145/256,167/256,195/256],[0.5,0.5,0.5],1000.0);
      this.drawPlanet(19.2*eD,3.981*eS,6.8,0,0);
      for(i = 0; i < 27; i++){
        this.drawMoon(0.2*eD,0.1*0.2727/0.53*(i%5)/5,100+i,0.1*i/30*(i%5),i/2);
      }
      this.ModelMatrix = popMatrix();
      //Neptune
      this.reMaterial([0,0,0],[0.1,0.1,0.1],[72/256,155/256,255/256],[0.5,0.5,0.5],1000.0);
      this.drawPlanet(30*eD,3.865*eS,5.4,0,0);
      for(i = 0; i < 14; i++){
        this.drawMoon(0.2*eD,0.1*0.2727/0.53*(i%5)/5,100+i,0.1*i/30*(i%5),i/2);
      }
      this.ModelMatrix = popMatrix();
      //Pluto
      this.reMaterial([0,0,0],[0.1,0.1,0.1],[221/256,221/256,221/256],[0.5,0.5,0.5],1000.0);
      this.drawPlanet(39.5*eD,0.187*eS,4.67,0,0);
      this.ModelMatrix = popMatrix();
  
      this.reMaterial([0,0,0],[0.24725,0.1995,0.0745],[0.75164,0.60648,0.22648],[0.628281,0.555802,0.366065],51.2);
      this.reMaterial([0,0,0],[0.135,0.222,0.158],[0.54,0.89,0.63],[0.316,0.316,0.316],12.8);
      this.reMaterial([0.5,0,0],[0,0,0],[0,0,0],[0,0,0],0.0);
  
      this.ModelMatrix = popMatrix();
    }
    //Sun
    this.ModelMatrix.rotate(g_angleNow0, 0, 0,1);
    this.reMaterial([1,0.8,0],[0.1,0.1,0.1],[.5,.5,.5],[0.5,0.5,0.5],1000.0);
    this.drawSphere();
    if(planetsToggle) this.drawPlanets();
    if(treesToggle){
      this.ModelMatrix.setIdentity();
      this.ModelMatrix.translate(15.0, 0.0, 0);
      this.drawForest(
        [0,2,4,6,8,1,3,5,7,9,0,2,4,6,8,1,3,5,7,9,0,2,4,6,8],
        [0,0,0,0,0,2,2,2,2,2,4,4,4,4,4,6,6,6,6,6,8,8,8,8,8],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        25
      );
    }
    if(fingersToggle){
      this.ModelMatrix.setIdentity();
      this.ModelMatrix.rotate(g_angleNow0, 0, 0,1);
      this.reMaterial([0,0,0],[0.1,0.1,0.1],[0.6,0.6,0.6],[0.6,0.6,0.6],100.0);
      this.ModelMatrix.translate(-2.3, -3.0, 0);
      this.ModelMatrix.scale(10,10,10);
      this.drawJointTree(5, 0,makeAngle(1,g_angleNow0, 0,90));

      
      this.ModelMatrix.setIdentity();
      this.ModelMatrix.rotate(g_angleNow0, 0, 0,1);
      this.ModelMatrix.translate(-2.3, -3.0, 2);
      this.ModelMatrix.rotate(90, 1, 0,0);
      this.ModelMatrix.scale(1,1,1);
      for(k = 0; k < 10; k++){
        this.ModelMatrix.translate(0, 0, -0.5);
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[k/10,0,1-k/10],[0.6,0.6,0.6],100.0);
        this.drawJointTree(5, 0,makeAngle(1,g_angleNow0*(k+1), 0,90));
      }

    }
    
  
  }

VBObox1.prototype.reload = function() {
//=============================================================================
// Over-write current values in the GPU for our already-created VBO: use 
// gl.bufferSubData() call to re-transfer some or all of our Float32Array 
// contents to our VBO without changing any GPU memory allocations.

 gl.bufferSubData(gl.ARRAY_BUFFER, 	// GLenum target(same as 'bindBuffer()')
                  0,                  // byte offset to where data replacement
                                      // begins in the VBO.
 					 				this.vboContents);   // the JS source-data array used to fill VBO
}

//=============================================================================Phong Blinn-Phong
//=============================================================================
function VBObox2() {
  //=============================================================================
  //=============================================================================
  // CONSTRUCTOR for one re-usable 'VBObox1' object that holds all data and fcns
  // needed to render vertices from one Vertex Buffer Object (VBO) using one 
  // separate shader program (a vertex-shader & fragment-shader pair) and one
  // set of 'uniform' variables.
  
  // Constructor goal: 
  // Create and set member vars that will ELIMINATE ALL LITERALS (numerical values 
  // written into code) in all other VBObox functions. Keeping all these (initial)
  // values here, in this one coonstrutor function, ensures we can change them 
  // easily WITHOUT disrupting any other code, ever!
    
  this.VERT_SRC = 
    `uniform mat4 u_ModelMatrix;
    uniform mat4 u_NormalMatrix;
    uniform mat4 u_MvpMatrix;
    
    
    attribute vec4 a_Position;
    attribute vec3 a_Color;
    attribute vec3 a_Normal;
    
    varying vec4 v_Color;
    varying vec4 v_Position;
    varying vec3 v_Normal;

    void main() {
      a_Color;
       vec4 transVec = u_NormalMatrix * vec4(a_Normal, 0.0);
       vec3 normal = normalize(transVec.xyz);
       gl_Position = u_ModelMatrix * a_Position;
       v_Position = u_MvpMatrix * a_Position;
       v_Normal = normal;
  
      
    }`;
  
  // Fragment shader program----------------------------------
  this.FRAG_SRC = 
    `precision mediump float;
    varying vec4 v_Color;
    varying vec4 v_Position;
    varying vec3 v_Normal;

    uniform vec3 u_EyePos;
  
    //Light Variables
    uniform vec3 u_LightColor;
    uniform vec3 u_LightPosition;
    uniform vec3 u_AmbientLight;
    uniform vec3 u_SpecularLight;
  
    //Material Variables
    uniform vec3 u_emit;
    uniform vec3 u_ambi;
    uniform vec3 u_diff;
    uniform vec3 u_spec;
    uniform float u_shiny;

    void main() {
      vec3 normal = normalize(v_Normal);
      vec3 lightDirection = normalize(u_LightPosition - vec3(v_Position));
      float nDotL = max(dot(lightDirection, normal), 0.0);
 
      //blinn-phong
      vec3 eyeDirection = normalize(u_EyePos - v_Position.xyz);
      vec3 lightDir = normalize(u_LightPosition - vec3(v_Position));
      vec3 H = normalize(lightDir + eyeDirection);
      float nDotH = max(dot(H, normal),0.0);
      float e64 = pow(nDotH, float(u_shiny));
      vec3 specular = u_SpecularLight * u_spec * e64;
 
      //float e64 = pow(nDotH, float(u_MatlSet[0].shiny));
      vec3 emissive = u_emit;
      vec3 diffuse = u_LightColor * u_diff * nDotL;
      vec3 ambient = u_AmbientLight * u_ambi;
      //vec3 specular = u_SpecularLight * u_spec * e64;
      gl_FragColor = vec4(diffuse + ambient + emissive + specular, 1.0);
    }`;
  
  var c30 = Math.sqrt(0.75);					// == cos(30deg) == sqrt(3) / 2
  var sq2	= Math.sqrt(2.0);						 
  // for surface normals:
  var sq23 = Math.sqrt(2.0/3.0)
  var sq29 = Math.sqrt(2.0/9.0)
  var sq89 = Math.sqrt(8.0/9.0)
  var thrd = 1.0/3.0;
  
  var sphere = new Float32Array([0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.1875938387542828,-0.577343625690456,-0.7946589768800393,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.1875938387542828,-0.577343625690456,-0.7946589768800393,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,0.1875938387542828,-0.577343625690456,-0.7946589768800393,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.6070569201887998,0.0,-0.7946583515265471,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.6070569201887998,0.0,-0.7946583515265471,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.6070569201887998,0.0,-0.7946583515265471,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.4911213143210803,-0.3568183375876395,-0.7946574913638756,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.4911213143210803,-0.3568183375876395,-0.7946574913638756,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.4911213143210803,-0.3568183375876395,-0.7946574913638756,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.4911212952319224,0.356818323720363,-0.7946575093882327,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.4911212952319224,0.356818323720363,-0.7946575093882327,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.4911212952319224,0.356818323720363,-0.7946575093882327,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.18759383875292585,0.5773436256885401,-0.7946589768817515,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,0.18759383875292585,0.5773436256885401,-0.7946589768817515,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.18759383875292585,0.5773436256885401,-0.7946589768817515,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.9822470326522897,0.0,-0.18759202234042818,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9822470326522897,0.0,-0.18759202234042818,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.9822470326522897,0.0,-0.18759202234042818,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.30353357597519004,-0.934171212988684,-0.18759401130890158,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.30353357597519004,-0.934171212988684,-0.18759401130890158,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.30353357597519004,-0.934171212988684,-0.18759401130890158,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.7946554066806886,-0.5773485124543632,-0.18759392260913862,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.7946554066806886,-0.5773485124543632,-0.18759392260913862,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.7946554066806886,-0.5773485124543632,-0.18759392260913862,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.794655462880779,0.5773484504343182,-0.18759387541928604,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.794655462880779,0.5773484504343182,-0.18759387541928604,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.794655462880779,0.5773484504343182,-0.18759387541928604,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.3035335759751898,0.9341712129886843,-0.18759401130890102,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.3035335759751898,0.9341712129886843,-0.18759401130890102,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.3035335759751898,0.9341712129886843,-0.18759401130890102,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.7946554066806881,-0.5773485124543637,0.18759392260913862,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.7946554066806881,-0.5773485124543637,0.18759392260913862,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.7946554066806881,-0.5773485124543637,0.18759392260913862,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.30353357597519004,-0.934171212988684,0.1875940113089015,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.30353357597519004,-0.934171212988684,0.1875940113089015,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.30353357597519004,-0.934171212988684,0.1875940113089015,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9822470326522897,0.0,0.1875920223404278,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.9822470326522897,0.0,0.1875920223404278,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.9822470326522897,0.0,0.1875920223404278,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.30353357597518976,0.9341712129886842,0.18759401130890094,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.30353357597518976,0.9341712129886842,0.18759401130890094,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.30353357597518976,0.9341712129886842,0.18759401130890094,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.7946554628807785,0.5773484504343186,0.18759387541928607,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.7946554628807785,0.5773484504343186,0.18759387541928607,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.7946554628807785,0.5773484504343186,0.18759387541928607,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.49112131432107986,-0.3568183375876391,0.794657491363876,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.49112131432107986,-0.3568183375876391,0.794657491363876,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.49112131432107986,-0.3568183375876391,0.794657491363876,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,-0.1875938387542832,-0.5773436256904565,0.7946589768800388,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.1875938387542832,-0.5773436256904565,0.7946589768800388,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.1875938387542832,-0.5773436256904565,0.7946589768800388,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.6070569201888002,0.0,0.7946583515265467,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.6070569201888002,0.0,0.7946583515265467,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.6070569201888002,0.0,0.7946583515265467,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.18759383875292623,0.5773436256885406,0.794658976881751,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.18759383875292623,0.5773436256885406,0.794658976881751,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,-0.18759383875292623,0.5773436256885406,0.794658976881751,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.49112129523192194,0.3568183237203626,0.794657509388233,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.49112129523192194,0.3568183237203626,0.794657509388233,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.49112129523192194,0.3568183237203626,0.794657509388233,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.39277083954784114,0.6647053901731114,0.6355295523228608,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.39277083954784114,0.6647053901731114,0.6355295523228608,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.39277083954784114,0.6647053901731114,0.6355295523228608,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.23142914359315586,0.16814384664118306,0.9582109362413084,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.23142914359315586,0.16814384664118306,0.9582109362413084,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,0.23142914359315586,0.16814384664118306,0.9582109362413084,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.753547360433901,0.16814471954107602,0.6355263400312792,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.753547360433901,0.16814471954107602,0.6355263400312792,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.753547360433901,0.16814471954107602,0.6355263400312792,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.5108013377780002,0.5789515093717558,0.635529026182417,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.5108013377780002,0.5789515093717558,0.635529026182417,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.5108013377780002,0.5789515093717558,0.635529026182417,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,-0.08839935760178926,0.2720608540734848,0.958211065087644,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.08839935760178926,0.2720608540734848,0.958211065087644,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.08839935760178926,0.2720608540734848,0.958211065087644,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,0.07293921197231296,0.7686236608447644,0.6355293379116738,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,0.07293921197231296,0.7686236608447644,0.6355293379116738,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.07293921197231296,0.7686236608447644,0.6355293379116738,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.7084658042311468,-0.3068886946778563,0.6355277596722553,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.7084658042311468,-0.3068886946778563,0.6355277596722553,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.7084658042311468,-0.3068886946778563,0.6355277596722553,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.28606474884708283,0.0,0.958210289793976,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.28606474884708283,0.0,0.958210289793976,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.28606474884708283,0.0,0.958210289793976,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.708465804230484,0.3068886946789983,0.6355277596724428,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.708465804230484,0.3068886946789983,0.6355277596724428,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.708465804230484,0.3068886946789983,0.6355277596724428,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.07293907981253693,-0.7686236864389787,0.6355293221253091,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,0.07293907981253693,-0.7686236864389787,0.6355293221253091,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,0.07293907981253693,-0.7686236864389787,0.6355293221253091,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.08839938045579887,-0.2720608602432967,0.9582110612274878,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.08839938045579887,-0.2720608602432967,0.9582110612274878,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,-0.08839938045579887,-0.2720608602432967,0.9582110612274878,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.5108013129423995,-0.5789514469236773,0.6355291030325059,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.5108013129423995,-0.5789514469236773,0.6355291030325059,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.5108013129423995,-0.5789514469236773,0.6355291030325059,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.7535473604341476,-0.1681447195414963,0.6355263400308759,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.7535473604341476,-0.1681447195414963,0.6355263400308759,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.7535473604341476,-0.1681447195414963,0.6355263400308759,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,0.23142914432949518,-0.16814383202830113,0.9582109386276887,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.23142914432949518,-0.16814383202830113,0.9582109386276887,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.23142914432949518,-0.16814383202830113,0.9582109386276887,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.39277100439986257,-0.6647053901773582,0.6355294504363187,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.39277100439986257,-0.6647053901773582,0.6355294504363187,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.39277100439986257,-0.6647053901773582,0.6355294504363187,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.7968690849665907,0.5789540848799208,-0.17266102346899806,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.7968690849665907,0.5789540848799208,-0.17266102346899806,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.7968690849665907,0.5789540848799208,-0.17266102346899806,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.8965821692443947,0.2720605719210893,0.3494616702858627,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.8965821692443947,0.2720605719210893,0.3494616702858627,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.8965821692443947,0.2720605719210893,0.3494616702858627,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.535806440050527,0.7686269265317828,0.34946259686937375,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.535806440050527,0.7686269265317828,0.34946259686937375,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.535806440050527,0.7686269265317828,0.34946259686937375,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.30437401847623374,0.9367735492298488,-0.17266086510828546,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.30437401847623374,0.9367735492298488,-0.17266086510828546,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.30437401847623374,0.9367735492298488,-0.17266086510828546,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,0.018308870240782232,0.9367708785687859,0.34946402724167636,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.018308870240782232,0.9367708785687859,0.34946402724167636,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,0.018308870240782232,0.9367708785687859,0.34946402724167636,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.5654358177612575,0.7470993573185782,0.3494637124034841,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.5654358177612575,0.7470993573185782,0.3494637124034841,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.5654358177612575,0.7470993573185782,0.3494637124034841,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9849818442352473,-0.0,-0.17265794660811634,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.9849818442352473,-0.0,-0.17265794660811634,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9849818442352473,-0.0,-0.17265794660811634,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.8852651476838903,0.3068895341634237,0.3494630625934256,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.8852651476838903,0.3068895341634237,0.3494630625934256,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.8852651476838903,0.3068895341634237,0.3494630625934256,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.8852651543182758,-0.3068895218351865,0.34946305661344207,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.8852651543182758,-0.3068895218351865,0.34946305661344207,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.8852651543182758,-0.3068895218351865,0.34946305661344207,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.3043740184762341,-0.9367735492298489,-0.17266086510828474,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.3043740184762341,-0.9367735492298489,-0.17266086510828474,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.3043740184762341,-0.9367735492298489,-0.17266086510828474,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.5654359322761605,-0.7470993573184301,0.34946352711746276,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.5654359322761605,-0.7470993573184301,0.34946352711746276,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.5654359322761605,-0.7470993573184301,0.34946352711746276,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.01830887024078118,-0.9367708785687856,0.3494640272416773,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,0.01830887024078118,-0.9367708785687856,0.3494640272416773,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,0.01830887024078118,-0.9367708785687856,0.3494640272416773,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.7968690273363406,-0.5789541473282623,-0.17266108004828137,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.7968690273363406,-0.5789541473282623,-0.17266108004828137,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.7968690273363406,-0.5789541473282623,-0.17266108004828137,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.5358065214403914,-0.7686268400790313,0.34946266222884337,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.5358065214403914,-0.7686268400790313,0.34946266222884337,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.5358065214403914,-0.7686268400790313,0.34946266222884337,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.896582164193717,-0.27206058113615955,0.3494616760698745,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.896582164193717,-0.27206058113615955,0.3494616760698745,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.896582164193717,-0.27206058113615955,0.3494616760698745,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.018308870240782205,0.9367708785687859,-0.34946402724167613,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,-0.018308870240782205,0.9367708785687859,-0.34946402724167613,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,-0.018308870240782205,0.9367708785687859,-0.34946402724167613,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.30437401847623347,0.9367735492298487,0.17266086510828524,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.30437401847623347,0.9367735492298487,0.17266086510828524,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.30437401847623347,0.9367735492298487,0.17266086510828524,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.5654358177612576,0.7470993573185785,-0.3494637124034841,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.5654358177612576,0.7470993573185785,-0.3494637124034841,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.5654358177612576,0.7470993573185785,-0.3494637124034841,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.8965821692443952,0.2720605719210894,-0.34946167028586195,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.8965821692443952,0.2720605719210894,-0.34946167028586195,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.8965821692443952,0.2720605719210894,-0.34946167028586195,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.7968690849665907,0.5789540848799208,0.17266102346899803,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.7968690849665907,0.5789540848799208,0.17266102346899803,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.7968690849665907,0.5789540848799208,0.17266102346899803,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.5358064400505267,0.7686269265317832,-0.34946259686937364,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.5358064400505267,0.7686269265317832,-0.34946259686937364,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.5358064400505267,0.7686269265317832,-0.34946259686937364,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.535806521440391,-0.7686268400790315,-0.34946266222884337,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.535806521440391,-0.7686268400790315,-0.34946266222884337,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.535806521440391,-0.7686268400790315,-0.34946266222884337,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.7968690273363406,-0.5789541473282624,0.17266108004828132,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.7968690273363406,-0.5789541473282624,0.17266108004828132,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.7968690273363406,-0.5789541473282624,0.17266108004828132,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.8965821641937172,-0.27206058113615966,-0.3494616760698737,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.8965821641937172,-0.27206058113615966,-0.3494616760698737,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.8965821641937172,-0.27206058113615966,-0.3494616760698737,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.5654359322761607,-0.7470993573184304,-0.34946352711746276,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.5654359322761607,-0.7470993573184304,-0.34946352711746276,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.5654359322761607,-0.7470993573184304,-0.34946352711746276,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.30437401847623385,-0.9367735492298487,0.17266086510828454,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.30437401847623385,-0.9367735492298487,0.17266086510828454,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.30437401847623385,-0.9367735492298487,0.17266086510828454,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,-0.01830887024078116,-0.9367708785687855,-0.3494640272416772,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,-0.01830887024078116,-0.9367708785687855,-0.3494640272416772,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.01830887024078116,-0.9367708785687855,-0.3494640272416772,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.8852651476838904,0.30688953416342346,-0.3494630625934258,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.8852651476838904,0.30688953416342346,-0.3494630625934258,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.8852651476838904,0.30688953416342346,-0.3494630625934258,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9849818442352474,0.0,0.17265794660811573,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9849818442352474,0.0,0.17265794660811573,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9849818442352474,0.0,0.17265794660811573,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.8852651543182759,-0.30688952183518625,-0.3494630566134423,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.8852651543182759,-0.30688952183518625,-0.3494630566134423,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.8852651543182759,-0.30688952183518625,-0.3494630566134423,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.08839935760178921,0.2720608540734848,-0.958211065087644,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,0.08839935760178921,0.2720608540734848,-0.958211065087644,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.08839935760178921,0.2720608540734848,-0.958211065087644,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.5108013377780005,0.578951509371756,-0.6355290261824166,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.5108013377780005,0.578951509371756,-0.6355290261824166,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.5108013377780005,0.578951509371756,-0.6355290261824166,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.07293921197231347,0.7686236608447645,-0.6355293379116738,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,-0.07293921197231347,0.7686236608447645,-0.6355293379116738,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,-0.07293921197231347,0.7686236608447645,-0.6355293379116738,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,-0.2314291435931551,0.1681438466411829,-0.9582109362413085,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.2314291435931551,0.1681438466411829,-0.9582109362413085,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.2314291435931551,0.1681438466411829,-0.9582109362413085,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.39277083954784103,0.6647053901731109,-0.6355295523228613,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.39277083954784103,0.6647053901731109,-0.6355295523228613,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.39277083954784103,0.6647053901731109,-0.6355295523228613,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.7535473604339004,0.16814471954107618,-0.6355263400312802,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.7535473604339004,0.16814471954107618,-0.6355263400312802,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.7535473604339004,0.16814471954107618,-0.6355263400312802,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.23142914432949452,-0.168143832028301,-0.9582109386276889,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,-0.23142914432949452,-0.168143832028301,-0.9582109386276889,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.23142914432949452,-0.168143832028301,-0.9582109386276889,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.7535473604341468,-0.16814471954149637,-0.6355263400308768,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.7535473604341468,-0.16814471954149637,-0.6355263400308768,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.7535473604341468,-0.16814471954149637,-0.6355263400308768,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.39277100439986257,-0.6647053901773577,-0.6355294504363193,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.39277100439986257,-0.6647053901773577,-0.6355294504363193,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.39277100439986257,-0.6647053901773577,-0.6355294504363193,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.28606474884708194,0.0,-0.9582102897939762,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.28606474884708194,0.0,-0.9582102897939762,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.28606474884708194,0.0,-0.9582102897939762,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.7084658042304844,0.3068886946789989,-0.6355277596724419,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.7084658042304844,0.3068886946789989,-0.6355277596724419,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.7084658042304844,0.3068886946789989,-0.6355277596724419,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.7084658042311474,-0.3068886946778569,-0.6355277596722544,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.7084658042311474,-0.3068886946778569,-0.6355277596722544,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.7084658042311474,-0.3068886946778569,-0.6355277596722544,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,0.08839938045579884,-0.2720608602432967,-0.9582110612274878,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.08839938045579884,-0.2720608602432967,-0.9582110612274878,
    0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.08839938045579884,-0.2720608602432967,-0.9582110612274878,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,-0.07293907981253746,-0.7686236864389787,-0.6355293221253092,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.07293907981253746,-0.7686236864389787,-0.6355293221253092,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,-0.07293907981253746,-0.7686236864389787,-0.6355293221253092,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.5108013129423997,-0.5789514469236775,-0.6355291030325054,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.5108013129423997,-0.5789514469236775,-0.6355291030325054,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.5108013129423997,-0.5789514469236775,-0.6355291030325054,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.4556801884210278,-0.45302720531155727,-0.7662388120737402,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.4556801884210278,-0.45302720531155727,-0.7662388120737402,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.4556801884210278,-0.45302720531155727,-0.7662388120737402,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.3736135165266664,-0.7056100416852756,-0.6021024907285153,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.3736135165266664,-0.7056100416852756,-0.6021024907285153,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.3736135165266664,-0.7056100416852756,-0.6021024907285153,
    0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.6048673099190088,-0.5626946300326399,-0.563480514945967,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.6048673099190088,-0.5626946300326399,-0.563480514945967,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.6048673099190088,-0.5626946300326399,-0.563480514945967,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.11249635206289342,-0.790453586184493,-0.6021027311519319,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,0.11249635206289342,-0.790453586184493,-0.6021027311519319,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,0.11249635206289342,-0.790453586184493,-0.6021027311519319,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.10236296935915444,-0.634348937053083,-0.7662396808855573,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,-0.10236296935915444,-0.634348937053083,-0.7662396808855573,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.10236296935915444,-0.634348937053083,-0.7662396808855573,
    -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.15859766198666153,-0.8107643536568595,-0.5634784329960992,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.15859766198666153,-0.8107643536568595,-0.5634784329960992,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,-0.15859766198666153,-0.8107643536568595,-0.5634784329960992,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.030193516312269564,-0.41222790039055296,-0.9105803148060565,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,-0.030193516312269564,-0.41222790039055296,-0.9105803148060565,
    0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,-0.030193516312269564,-0.41222790039055296,-0.9105803148060565,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.2667315616493873,-0.3157493036139344,-0.9105803925449936,
    0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.2667315616493873,-0.3157493036139344,-0.9105803925449936,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.2667315616493873,-0.3157493036139344,-0.9105803925449936,
    -0.08942674659491123,0.08942674659491123,-1.0,1.0,0.05243045372163609,-0.16136170037511793,-0.9855016231212377,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.05243045372163609,-0.16136170037511793,-0.9855016231212377,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,0.05243045372163609,-0.16136170037511793,-0.9855016231212377,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.5716702792979942,-0.2933787781117714,-0.7662388559196129,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.5716702792979942,-0.2933787781117714,-0.7662388559196129,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.5716702792979942,-0.2933787781117714,-0.7662388559196129,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.7865295373716213,-0.13727635663558188,-0.6021017262480185,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.7865295373716213,-0.13727635663558188,-0.6021017262480185,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.7865295373716213,-0.13727635663558188,-0.6021017262480185,
    0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.7220727651688029,-0.40137334761281973,-0.5634805743125112,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.7220727651688029,-0.40137334761281973,-0.5634805743125112,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.7220727651688029,-0.40137334761281973,-0.5634805743125112,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.7865295373716089,0.1372763566355817,-0.6021017262480348,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.7865295373716089,0.1372763566355817,-0.6021017262480348,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.7865295373716089,0.1372763566355817,-0.6021017262480348,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.5716703002569032,0.29337878079020263,-0.7662388392572099,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.5716703002569032,0.29337878079020263,-0.7662388392572099,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.5716703002569032,0.29337878079020263,-0.7662388392572099,
    0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.7220727651677648,0.40137334761328575,-0.5634805743135096,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.7220727651677648,0.40137334761328575,-0.5634805743135096,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.7220727651677648,0.40137334761328575,-0.5634805743135096,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.38272124069341656,0.15610136154465032,-0.910580483453274,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.38272124069341656,0.15610136154465032,-0.910580483453274,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.38272124069341656,0.15610136154465032,-0.910580483453274,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.3827212475001285,-0.15610137316785758,-0.9105804785998076,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.3827212475001285,-0.15610137316785758,-0.9105804785998076,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.3827212475001285,-0.15610137316785758,-0.9105804785998076,
    -0.08942674659491123,0.08942674659491123,-1.0,1.0,0.16966523322150937,0.0,-0.9855017547604321,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.16966523322150937,0.0,-0.9855017547604321,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.16966523322150937,0.0,-0.9855017547604321,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.2900434909837939,-0.5733687582967675,-0.7662395450165417,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.2900434909837939,-0.5733687582967675,-0.7662395450165417,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.2900434909837939,-0.5733687582967675,-0.7662395450165417,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.5556259833512646,-0.5733698183711547,-0.6021019996694658,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.5556259833512646,-0.5733698183711547,-0.6021019996694658,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.5556259833512646,-0.5733698183711547,-0.6021019996694658,
    -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.3482411474888479,-0.7491463488592234,-0.5634783502376512,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.3482411474888479,-0.7491463488592234,-0.5634783502376512,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.3482411474888479,-0.7491463488592234,-0.5634783502376512,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.7170079792657081,-0.35124827568421596,-0.6020998310065955,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.7170079792657081,-0.35124827568421596,-0.6020998310065955,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.7170079792657081,-0.35124827568421596,-0.6020998310065955,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.6349390266407596,-0.09866770853416246,-0.7662356789794523,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.6349390266407596,-0.09866770853416246,-0.7662356789794523,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.6349390266407596,-0.09866770853416246,-0.7662356789794523,
    -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.8200745038929086,-0.09972382650385823,-0.5635006357513968,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.8200745038929086,-0.09972382650385823,-0.5635006357513968,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.8200745038929086,-0.09972382650385823,-0.5635006357513968,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.40138618486326477,-0.09866777504353715,-0.9105788273229676,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.40138618486326477,-0.09866777504353715,-0.9105788273229676,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.40138618486326477,-0.09866777504353715,-0.9105788273229676,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.21787243246147198,-0.3512482946875778,-0.9105801659669454,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.21787243246147198,-0.3512482946875778,-0.9105801659669454,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,-0.21787243246147198,-0.3512482946875778,-0.9105801659669454,
    -0.08942674659491123,0.08942674659491123,-1.0,1.0,-0.13726376049162442,-0.09972733209314655,-0.9855014557519847,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,-0.13726376049162442,-0.09972733209314655,-0.9855014557519847,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.13726376049162442,-0.09972733209314655,-0.9855014557519847,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.6349390266407687,0.09866770853401646,-0.7662356789794637,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.6349390266407687,0.09866770853401646,-0.7662356789794637,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.6349390266407687,0.09866770853401646,-0.7662356789794637,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.7170079792643385,0.35124827568689115,-0.6020998310066659,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.7170079792643385,0.35124827568689115,-0.6020998310066659,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.7170079792643385,0.35124827568689115,-0.6020998310066659,
    -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.8200745038929456,0.09972382650341055,-0.5635006357514222,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.8200745038929456,0.09972382650341055,-0.5635006357514222,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.8200745038929456,0.09972382650341055,-0.5635006357514222,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.5556260194438505,0.5733697244076056,-0.6021020558424696,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.5556260194438505,0.5733697244076056,-0.6021020558424696,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.5556260194438505,0.5733697244076056,-0.6021020558424696,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.29004345688710037,0.5733688522583721,-0.7662394876126509,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.29004345688710037,0.5733688522583721,-0.7662394876126509,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.29004345688710037,0.5733688522583721,-0.7662394876126509,
    -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.3482409616935952,0.7491463488573392,-0.563478465065381,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.3482409616935952,0.7491463488573392,-0.563478465065381,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.3482409616935952,0.7491463488573392,-0.563478465065381,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.2178724354453621,0.35124826452696245,-0.9105801768871886,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,-0.2178724354453621,0.35124826452696245,-0.9105801768871886,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.2178724354453621,0.35124826452696245,-0.9105801768871886,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.40138618451518493,0.09866778374700656,-0.9105788265333188,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.40138618451518493,0.09866778374700656,-0.9105788265333188,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.40138618451518493,0.09866778374700656,-0.9105788265333188,
    -0.08942674659491123,0.08942674659491123,-1.0,1.0,-0.13726376036863866,0.09972734098810344,-0.9855014548689939,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.13726376036863866,0.09972734098810344,-0.9855014548689939,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,-0.13726376036863866,0.09972734098810344,-0.9855014548689939,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.1023630609837684,0.6343489989811777,-0.7662396173767128,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.1023630609837684,0.6343489989811777,-0.7662396173767128,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,-0.1023630609837684,0.6343489989811777,-0.7662396173767128,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.1124963520628935,0.7904535861844924,-0.602102731151933,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,0.1124963520628935,0.7904535861844924,-0.602102731151933,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,0.1124963520628935,0.7904535861844924,-0.602102731151933,
    -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.15859768341130098,0.810764268801057,-0.5634785490611477,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,-0.15859768341130098,0.810764268801057,-0.5634785490611477,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.15859768341130098,0.810764268801057,-0.5634785490611477,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.37361364022533977,0.7056100351752889,-0.602102421600759,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.37361364022533977,0.7056100351752889,-0.602102421600759,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.37361364022533977,0.7056100351752889,-0.602102421600759,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.4556802023562997,0.4530272348130372,-0.7662387863441624,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.4556802023562997,0.4530272348130372,-0.7662387863441624,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.4556802023562997,0.4530272348130372,-0.7662387863441624,
    0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.6048672442080645,0.5626947063712658,-0.5634805092511155,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.6048672442080645,0.5626947063712658,-0.5634805092511155,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.6048672442080645,0.5626947063712658,-0.5634805092511155,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.2667315350342877,0.315749297785993,-0.9105804023620896,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.2667315350342877,0.315749297785993,-0.9105804023620896,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.2667315350342877,0.315749297785993,-0.9105804023620896,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.030193527704173675,0.41222786395924527,-0.9105803309210974,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,-0.030193527704173675,0.41222786395924527,-0.9105803309210974,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,-0.030193527704173675,0.41222786395924527,-0.9105803309210974,
    -0.08942674659491123,0.08942674659491123,-1.0,1.0,0.052430445101050945,0.16136171190180873,-0.9855016216925385,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,0.052430445101050945,0.16136171190180873,-0.9855016216925385,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.052430445101050945,0.16136171190180873,-0.9855016216925385,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.8902790375102705,-0.13727627232073927,-0.43423318669524646,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.8902790375102705,-0.13727627232073927,-0.43423318669524646,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.8902790375102705,-0.13727627232073927,-0.43423318669524646,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.9410026579935737,-0.2933790714736124,-0.16864969039494385,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.9410026579935737,-0.2933790714736124,-0.16864969039494385,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.9410026579935737,-0.2933790714736124,-0.16864969039494385,
    0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.8269096225934555,-0.4013733060946441,-0.3938526948200357,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.8269096225934555,-0.4013733060946441,-0.3938526948200357,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.8269096225934555,-0.4013733060946441,-0.3938526948200357,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.9856061035044801,-0.15610228082891986,0.0649052128470842,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9856061035044801,-0.15610228082891986,0.0649052128470842,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9856061035044801,-0.15610228082891986,0.0649052128470842,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.9856061030015378,0.1561022807492629,0.0649052206760001,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9856061030015378,0.1561022807492629,0.0649052206760001,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9856061030015378,0.1561022807492629,0.0649052206760001,
    0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.9573342053980672,-0.0,0.28898307766174003,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9573342053980672,-0.0,0.28898307766174003,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9573342053980672,-0.0,0.28898307766174003,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.9410026557723999,0.29337908242205546,-0.16864968374261155,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.9410026557723999,0.29337908242205546,-0.16864968374261155,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.9410026557723999,0.29337908242205546,-0.16864968374261155,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.8902790348330735,0.13727627240355514,-0.4342331921579418,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.8902790348330735,0.13727627240355514,-0.4342331921579418,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.8902790348330735,0.13727627240355514,-0.4342331921579418,
    0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.8269096225925395,0.4013733060952317,-0.3938526948213602,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.8269096225925395,0.4013733060952317,-0.3938526948213602,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.8269096225925395,0.4013733060952317,-0.3938526948213602,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.1445571334445321,-0.8891249105991275,-0.4342351074272938,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.1445571334445321,-0.8891249105991275,-0.4342351074272938,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,0.1445571334445321,-0.8891249105991275,-0.4342351074272938,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,0.011764727228162504,-0.9856057285447228,-0.16865034554685346,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,0.011764727228162504,-0.9856057285447228,-0.16865034554685346,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.011764727228162504,-0.9856057285447228,-0.16865034554685346,
    -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.1262013834435303,-0.9104677303474127,-0.3938549514897206,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,-0.1262013834435303,-0.9104677303474127,-0.3938549514897206,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.1262013834435303,-0.9104677303474127,-0.3938549514897206,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,0.1561046864437102,-0.985605751969338,0.06490476527395082,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.1561046864437102,-0.985605751969338,0.06490476527395082,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.1561046864437102,-0.985605751969338,0.06490476527395082,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.4530336513178341,-0.8891275915425783,0.0649048282589597,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.4530336513178341,-0.8891275915425783,0.0649048282589597,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.4530336513178341,-0.8891275915425783,0.0649048282589597,
    0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.295826750452272,-0.9104677767205127,0.2890241534378325,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.295826750452272,-0.9104677767205127,0.2890241534378325,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.295826750452272,-0.9104677767205127,0.2890241534378325,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.5698107195795923,-0.8042839992138734,-0.1686505038851809,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.5698107195795923,-0.8042839992138734,-0.1686505038851809,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.5698107195795923,-0.8042839992138734,-0.1686505038851809,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.40567420298669166,-0.8042813632252391,-0.43423487860795257,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.40567420298669166,-0.8042813632252391,-0.43423487860795257,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.40567420298669166,-0.8042813632252391,-0.43423487860795257,
    0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.6372639607508351,-0.6623999850829347,-0.39385391211753373,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.6372639607508351,-0.6623999850829347,-0.39385391211753373,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.6372639607508351,-0.6623999850829347,-0.39385391211753373,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.8009411223662419,-0.41223065105961343,-0.434234048445849,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.8009411223662419,-0.41223065105961343,-0.434234048445849,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.8009411223662419,-0.41223065105961343,-0.434234048445849,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.9337331376183107,-0.31575244801226804,-0.16864999047650403,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.9337331376183107,-0.31575244801226804,-0.16864999047650403,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.9337331376183107,-0.31575244801226804,-0.16864999047650403,
    -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.9049059478911285,-0.1613589781678624,-0.3938381718877458,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.9049059478911285,-0.1613589781678624,-0.3938381718877458,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.9049059478911285,-0.1613589781678624,-0.3938381718877458,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.8891293781902415,-0.453030240817418,0.0649041581406515,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.8891293781902415,-0.453030240817418,0.0649041581406515,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.8891293781902415,-0.453030240817418,0.0649041581406515,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.7056169875642115,-0.7056147471288743,0.0649037402239831,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.7056169875642115,-0.7056147471288743,0.0649037402239831,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.7056169875642115,-0.7056147471288743,0.0649037402239831,
    -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.7744929412069025,-0.5626970574800776,0.2890202510620039,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.7744929412069025,-0.5626970574800776,0.2890202510620039,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.7744929412069025,-0.5626970574800776,0.2890202510620039,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.5888393715456425,-0.7904587170290158,-0.16865115235472017,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.5888393715456425,-0.7904587170290158,-0.16865115235472017,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.5888393715456425,-0.7904587170290158,-0.16865115235472017,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.6395598605847257,-0.6343526933842694,-0.43423478110921676,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.6395598605847257,-0.6343526933842694,-0.43423478110921676,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.6395598605847257,-0.6343526933842694,-0.43423478110921676,
    -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.43305286287212297,-0.8107669263659469,-0.39385556879314715,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.43305286287212297,-0.8107669263659469,-0.39385556879314715,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.43305286287212297,-0.8107669263659469,-0.39385556879314715,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.6395599174302818,0.6343526036081132,-0.43423482853426115,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.6395599174302818,0.6343526036081132,-0.43423482853426115,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.6395599174302818,0.6343526036081132,-0.43423482853426115,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.5888392828155132,0.790458798422897,-0.1686510806640205,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.5888392828155132,0.790458798422897,-0.1686510806640205,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.5888392828155132,0.790458798422897,-0.1686510806640205,
    -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.43305276864121595,0.8107670112207223,-0.39385549772523787,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.43305276864121595,0.8107670112207223,-0.39385549772523787,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.43305276864121595,0.8107670112207223,-0.39385549772523787,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.7056169940736836,0.7056147536395789,0.06490359867199426,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.7056169940736836,0.7056147536395789,0.06490359867199426,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.7056169940736836,0.7056147536395789,0.06490359867199426,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.8891293781905673,0.45303024081694554,0.06490415813948672,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.8891293781905673,0.45303024081694554,0.06490415813948672,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.8891293781905673,0.45303024081694554,0.06490415813948672,
    -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.7744929756870417,0.5626969811415766,0.28902030728927613,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.7744929756870417,0.5626969811415766,0.28902030728927613,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.7744929756870417,0.5626969811415766,0.28902030728927613,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.9337331410506727,0.31575243415701776,-0.16864999741346762,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.9337331410506727,0.31575243415701776,-0.16864999741346762,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9337331410506727,0.31575243415701776,-0.16864999741346762,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.8009411223638105,0.4122306510621237,-0.4342340484479505,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.8009411223638105,0.4122306510621237,-0.4342340484479505,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.8009411223638105,0.4122306510621237,-0.4342340484479505,
    -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.9049059503270416,0.1613589802965544,-0.39383816541870337,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9049059503270416,0.1613589802965544,-0.39383816541870337,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.9049059503270416,0.1613589802965544,-0.39383816541870337,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.40567431596737213,0.8042812695824455,-0.4342349465016079,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.40567431596737213,0.8042812695824455,-0.4342349465016079,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.40567431596737213,0.8042812695824455,-0.4342349465016079,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.5698106083247312,0.8042840928568619,-0.16865043319841977,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.5698106083247312,0.8042840928568619,-0.16865043319841977,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.5698106083247312,0.8042840928568619,-0.16865043319841977,
    0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.6372638592193767,0.6623999850826678,-0.3938540763979827,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.6372638592193767,0.6623999850826678,-0.3938540763979827,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.6372638592193767,0.6623999850826678,-0.3938540763979827,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.4530336513178344,0.8891275915425781,0.06490482825895993,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.4530336513178344,0.8891275915425781,0.06490482825895993,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.4530336513178344,0.8891275915425781,0.06490482825895993,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,0.15610468644371014,0.9856057519693379,0.06490476527395184,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.15610468644371014,0.9856057519693379,0.06490476527395184,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.15610468644371014,0.9856057519693379,0.06490476527395184,
    0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.29582675045227164,0.9104677767205127,0.2890241534378327,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.29582675045227164,0.9104677767205127,0.2890241534378327,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.29582675045227164,0.9104677767205127,0.2890241534378327,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,0.011764727228161192,0.9856057285447228,-0.16865034554685368,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.011764727228161192,0.9856057285447228,-0.16865034554685368,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,0.011764727228161192,0.9856057285447228,-0.16865034554685368,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.14455713344453255,0.8891249105991275,-0.43423510742729354,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,0.14455713344453255,0.8891249105991275,-0.43423510742729354,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.14455713344453255,0.8891249105991275,-0.43423510742729354,
    -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.12620138344353177,0.9104677303474128,-0.3938549514897198,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.12620138344353177,0.9104677303474128,-0.3938549514897198,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,-0.12620138344353177,0.9104677303474128,-0.3938549514897198,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.9337331376183107,-0.3157524480122681,0.16864999047650445,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9337331376183107,-0.3157524480122681,0.16864999047650445,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.9337331376183107,-0.3157524480122681,0.16864999047650445,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.8009411223662424,-0.4122306510596123,0.43423404844584906,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.8009411223662424,-0.4122306510596123,0.43423404844584906,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.8009411223662424,-0.4122306510596123,0.43423404844584906,
    0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.9049059478911281,-0.16135897816786288,0.3938381718877464,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.9049059478911281,-0.16135897816786288,0.3938381718877464,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9049059478911281,-0.16135897816786288,0.3938381718877464,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.6395598605847254,-0.63435269338427,0.43423478110921626,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.6395598605847254,-0.63435269338427,0.43423478110921626,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.6395598605847254,-0.63435269338427,0.43423478110921626,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.5888393715456428,-0.7904587170290155,0.16865115235472064,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.5888393715456428,-0.7904587170290155,0.16865115235472064,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.5888393715456428,-0.7904587170290155,0.16865115235472064,
    0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.43305286287212336,-0.8107669263659466,0.39385556879314715,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.43305286287212336,-0.8107669263659466,0.39385556879314715,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.43305286287212336,-0.8107669263659466,0.39385556879314715,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.7056169875642118,-0.7056147471288738,-0.06490374022398354,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.7056169875642118,-0.7056147471288738,-0.06490374022398354,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.7056169875642118,-0.7056147471288738,-0.06490374022398354,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.8891293781902413,-0.45303024081741866,-0.06490415814065198,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.8891293781902413,-0.45303024081741866,-0.06490415814065198,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.8891293781902413,-0.45303024081741866,-0.06490415814065198,
    0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.774492941206902,-0.5626970574800776,-0.28902025106200485,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.774492941206902,-0.5626970574800776,-0.28902025106200485,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.774492941206902,-0.5626970574800776,-0.28902025106200485,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,-0.011764727228162521,-0.9856057285447228,0.1686503455468534,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,-0.011764727228162521,-0.9856057285447228,0.1686503455468534,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.011764727228162521,-0.9856057285447228,0.1686503455468534,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.144557133444532,-0.8891249105991275,0.4342351074272939,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.144557133444532,-0.8891249105991275,0.4342351074272939,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,-0.144557133444532,-0.8891249105991275,0.4342351074272939,
    0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.12620138344352988,-0.9104677303474127,0.3938549514897206,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,0.12620138344352988,-0.9104677303474127,0.3938549514897206,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.12620138344352988,-0.9104677303474127,0.3938549514897206,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.4056742029866914,-0.8042813632252392,0.4342348786079527,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.4056742029866914,-0.8042813632252392,0.4342348786079527,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.4056742029866914,-0.8042813632252392,0.4342348786079527,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.5698107195795922,-0.8042839992138735,0.16865050388518024,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.5698107195795922,-0.8042839992138735,0.16865050388518024,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.5698107195795922,-0.8042839992138735,0.16865050388518024,
    -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.6372639607508346,-0.6623999850829355,0.3938539121175335,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.6372639607508346,-0.6623999850829355,0.3938539121175335,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.6372639607508346,-0.6623999850829355,0.3938539121175335,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.45303365131783446,-0.8891275915425783,-0.06490482825895973,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.45303365131783446,-0.8891275915425783,-0.06490482825895973,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.45303365131783446,-0.8891275915425783,-0.06490482825895973,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,-0.1561046864437102,-0.9856057519693381,-0.06490476527395087,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.1561046864437102,-0.9856057519693381,-0.06490476527395087,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.1561046864437102,-0.9856057519693381,-0.06490476527395087,
    -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.29582675045227214,-0.9104677767205126,-0.2890241534378327,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.29582675045227214,-0.9104677767205126,-0.2890241534378327,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.29582675045227214,-0.9104677767205126,-0.2890241534378327,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.9410026579935737,-0.29337907147361264,0.1686496903949428,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.9410026579935737,-0.29337907147361264,0.1686496903949428,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.9410026579935737,-0.29337907147361264,0.1686496903949428,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.8902790375102706,-0.13727627232073963,0.43423318669524613,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.8902790375102706,-0.13727627232073963,0.43423318669524613,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.8902790375102706,-0.13727627232073963,0.43423318669524613,
    -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.8269096225934561,-0.40137330609464344,0.3938526948200351,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.8269096225934561,-0.40137330609464344,0.3938526948200351,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.8269096225934561,-0.40137330609464344,0.3938526948200351,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.8902790348330736,0.13727627240355553,0.43423319215794154,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.8902790348330736,0.13727627240355553,0.43423319215794154,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.8902790348330736,0.13727627240355553,0.43423319215794154,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.9410026557724,0.2933790824220556,0.1686496837426105,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.9410026557724,0.2933790824220556,0.1686496837426105,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.9410026557724,0.2933790824220556,0.1686496837426105,
    -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.8269096225925401,0.40137330609523086,0.3938526948213595,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.8269096225925401,0.40137330609523086,0.3938526948213595,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.8269096225925401,0.40137330609523086,0.3938526948213595,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.9856061030015377,0.1561022807492637,-0.06490522067600012,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9856061030015377,0.1561022807492637,-0.06490522067600012,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9856061030015377,0.1561022807492637,-0.06490522067600012,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.98560610350448,-0.1561022808289206,-0.06490521284708418,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.98560610350448,-0.1561022808289206,-0.06490521284708418,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.98560610350448,-0.1561022808289206,-0.06490521284708418,
    -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.9573342053980672,0.0,-0.28898307766173964,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.9573342053980672,0.0,-0.28898307766173964,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9573342053980672,0.0,-0.28898307766173964,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.5698106083247311,0.804284092856862,0.16865043319841913,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.5698106083247311,0.804284092856862,0.16865043319841913,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.5698106083247311,0.804284092856862,0.16865043319841913,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.40567431596737197,0.8042812695824456,0.43423494650160793,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.40567431596737197,0.8042812695824456,0.43423494650160793,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.40567431596737197,0.8042812695824456,0.43423494650160793,
    -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.637263859219376,0.6623999850826685,0.3938540763979824,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.637263859219376,0.6623999850826685,0.3938540763979824,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.637263859219376,0.6623999850826685,0.3938540763979824,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.1445571334445324,0.8891249105991275,0.4342351074272937,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,-0.1445571334445324,0.8891249105991275,0.4342351074272937,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.1445571334445324,0.8891249105991275,0.4342351074272937,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,-0.011764727228161208,0.9856057285447228,0.16865034554685363,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.011764727228161208,0.9856057285447228,0.16865034554685363,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,-0.011764727228161208,0.9856057285447228,0.16865034554685363,
    0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.12620138344353132,0.9104677303474129,0.39385495148971983,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.12620138344353132,0.9104677303474129,0.39385495148971983,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,0.12620138344353132,0.9104677303474129,0.39385495148971983,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,-0.15610468644371017,0.985605751969338,-0.06490476527395188,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.15610468644371017,0.985605751969338,-0.06490476527395188,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.15610468644371017,0.985605751969338,-0.06490476527395188,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.4530336513178348,0.889127591542578,-0.06490482825895996,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.4530336513178348,0.889127591542578,-0.06490482825895996,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.4530336513178348,0.889127591542578,-0.06490482825895996,
    -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.29582675045227175,0.9104677767205126,-0.289024153437833,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.29582675045227175,0.9104677767205126,-0.289024153437833,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.29582675045227175,0.9104677767205126,-0.289024153437833,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.5888392828155135,0.7904587984228967,0.16865108066402096,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.5888392828155135,0.7904587984228967,0.16865108066402096,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.5888392828155135,0.7904587984228967,0.16865108066402096,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.6395599174302816,0.6343526036081139,0.43423482853426054,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.6395599174302816,0.6343526036081139,0.43423482853426054,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.6395599174302816,0.6343526036081139,0.43423482853426054,
    0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.43305276864121645,0.8107670112207219,0.393855497725238,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.43305276864121645,0.8107670112207219,0.393855497725238,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.43305276864121645,0.8107670112207219,0.393855497725238,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.8009411223638112,0.4122306510621225,0.4342340484479506,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.8009411223638112,0.4122306510621225,0.4342340484479506,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.8009411223638112,0.4122306510621225,0.4342340484479506,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.9337331410506727,0.3157524341570177,0.16864999741346798,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.9337331410506727,0.3157524341570177,0.16864999741346798,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9337331410506727,0.3157524341570177,0.16864999741346798,
    0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.9049059503270411,0.161358980296555,0.3938381654187039,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9049059503270411,0.161358980296555,0.3938381654187039,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.9049059503270411,0.161358980296555,0.3938381654187039,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.8891293781905669,0.45303024081694615,-0.06490415813948722,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.8891293781905669,0.45303024081694615,-0.06490415813948722,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.8891293781905669,0.45303024081694615,-0.06490415813948722,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.7056169940736841,0.7056147536395786,-0.06490359867199468,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.7056169940736841,0.7056147536395786,-0.06490359867199468,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.7056169940736841,0.7056147536395786,-0.06490359867199468,
    0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.7744929756870413,0.5626969811415766,-0.2890203072892772,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.7744929756870413,0.5626969811415766,-0.2890203072892772,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.7744929756870413,0.5626969811415766,-0.2890203072892772,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.5556259833512643,-0.5733698183711554,0.6021019996694653,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.5556259833512643,-0.5733698183711554,0.6021019996694653,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.5556259833512643,-0.5733698183711554,0.6021019996694653,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.29004349098379356,-0.5733687582967675,0.7662395450165418,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.29004349098379356,-0.5733687582967675,0.7662395450165418,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.29004349098379356,-0.5733687582967675,0.7662395450165418,
    0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.3482411474888483,-0.7491463488592232,0.5634783502376516,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.3482411474888483,-0.7491463488592232,0.5634783502376516,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.3482411474888483,-0.7491463488592232,0.5634783502376516,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.21787243246147264,-0.35124829468757784,0.9105801659669451,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.21787243246147264,-0.35124829468757784,0.9105801659669451,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,0.21787243246147264,-0.35124829468757784,0.9105801659669451,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.40138618486326494,-0.0986677750435375,0.9105788273229676,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.40138618486326494,-0.0986677750435375,0.9105788273229676,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.40138618486326494,-0.0986677750435375,0.9105788273229676,
    -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,0.13726376049162398,-0.0997273320931458,0.985501455751985,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,0.13726376049162398,-0.0997273320931458,0.985501455751985,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.13726376049162398,-0.0997273320931458,0.985501455751985,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.6349390266407596,-0.0986677085341618,0.7662356789794524,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.6349390266407596,-0.0986677085341618,0.7662356789794524,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.6349390266407596,-0.0986677085341618,0.7662356789794524,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.717007979265709,-0.3512482756842151,0.6020998310065948,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.717007979265709,-0.3512482756842151,0.6020998310065948,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.717007979265709,-0.3512482756842151,0.6020998310065948,
    0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.8200745038929085,-0.09972382650385908,0.5635006357513968,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.8200745038929085,-0.09972382650385908,0.5635006357513968,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.8200745038929085,-0.09972382650385908,0.5635006357513968,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.373613516526666,-0.7056100416852755,0.6021024907285157,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.373613516526666,-0.7056100416852755,0.6021024907285157,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.373613516526666,-0.7056100416852755,0.6021024907285157,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.45568018842102764,-0.45302720531155777,0.7662388120737401,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.45568018842102764,-0.45302720531155777,0.7662388120737401,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.45568018842102764,-0.45302720531155777,0.7662388120737401,
    -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.6048673099190082,-0.56269463003264,0.5634805149459678,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.6048673099190082,-0.56269463003264,0.5634805149459678,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.6048673099190082,-0.56269463003264,0.5634805149459678,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.2667315616493877,-0.3157493036139345,0.9105803925449935,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.2667315616493877,-0.3157493036139345,0.9105803925449935,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.2667315616493877,-0.3157493036139345,0.9105803925449935,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.030193516312269852,-0.4122279003905533,0.9105803148060564,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,0.030193516312269852,-0.4122279003905533,0.9105803148060564,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,0.030193516312269852,-0.4122279003905533,0.9105803148060564,
    -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,-0.05243045372163579,-0.161361700375117,0.9855016231212379,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.05243045372163579,-0.161361700375117,0.9855016231212379,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,-0.05243045372163579,-0.161361700375117,0.9855016231212379,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.10236296935915389,-0.634348937053083,0.7662396808855574,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,0.10236296935915389,-0.634348937053083,0.7662396808855574,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.10236296935915389,-0.634348937053083,0.7662396808855574,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.11249635206289318,-0.7904535861844931,0.602102731151932,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,-0.11249635206289318,-0.7904535861844931,0.602102731151932,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,-0.11249635206289318,-0.7904535861844931,0.602102731151932,
    0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.158597661986661,-0.8107643536568595,0.5634784329960995,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.158597661986661,-0.8107643536568595,0.5634784329960995,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,0.158597661986661,-0.8107643536568595,0.5634784329960995,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.786529537371608,0.13727635663558196,0.6021017262480359,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.786529537371608,0.13727635663558196,0.6021017262480359,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.786529537371608,0.13727635663558196,0.6021017262480359,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.5716703002569036,0.29337878079020213,0.7662388392572097,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.5716703002569036,0.29337878079020213,0.7662388392572097,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.5716703002569036,0.29337878079020213,0.7662388392572097,
    -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.7220727651677643,0.4013733476132851,0.5634805743135106,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.7220727651677643,0.4013733476132851,0.5634805743135106,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.7220727651677643,0.4013733476132851,0.5634805743135106,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.3827212406934171,0.15610136154465007,0.9105804834532737,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.3827212406934171,0.15610136154465007,0.9105804834532737,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.3827212406934171,0.15610136154465007,0.9105804834532737,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.38272124750012904,-0.15610137316785738,0.9105804785998074,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.38272124750012904,-0.15610137316785738,0.9105804785998074,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.38272124750012904,-0.15610137316785738,0.9105804785998074,
    -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,-0.16966523322150842,0.0,0.9855017547604323,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.16966523322150842,0.0,0.9855017547604323,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.16966523322150842,0.0,0.9855017547604323,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.5716702792979945,-0.29337877811177093,0.7662388559196127,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.5716702792979945,-0.29337877811177093,0.7662388559196127,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.5716702792979945,-0.29337877811177093,0.7662388559196127,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.7865295373716205,-0.1372763566355822,0.6021017262480196,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.7865295373716205,-0.1372763566355822,0.6021017262480196,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.7865295373716205,-0.1372763566355822,0.6021017262480196,
    -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.7220727651688026,-0.40137334761281906,0.563480574312512,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.7220727651688026,-0.40137334761281906,0.563480574312512,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.7220727651688026,-0.40137334761281906,0.563480574312512,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.11249635206289327,0.7904535861844922,0.6021027311519331,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,-0.11249635206289327,0.7904535861844922,0.6021027311519331,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,-0.11249635206289327,0.7904535861844922,0.6021027311519331,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.10236306098376788,0.6343489989811777,0.7662396173767129,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.10236306098376788,0.6343489989811777,0.7662396173767129,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,0.10236306098376788,0.6343489989811777,0.7662396173767129,
    0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.1585976834113004,0.810764268801057,0.5634785490611477,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,0.1585976834113004,0.810764268801057,0.5634785490611477,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.1585976834113004,0.810764268801057,0.5634785490611477,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.03019352770417396,0.41222786395924554,0.9105803309210972,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,0.03019352770417396,0.41222786395924554,0.9105803309210972,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,0.03019352770417396,0.41222786395924554,0.9105803309210972,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.26673153503428815,0.31574929778599303,0.9105804023620895,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.26673153503428815,0.31574929778599303,0.9105804023620895,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.26673153503428815,0.31574929778599303,0.9105804023620895,
    -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,-0.05243044510105064,0.16136171190180773,0.9855016216925386,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,-0.05243044510105064,0.16136171190180773,0.9855016216925386,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.05243044510105064,0.16136171190180773,0.9855016216925386,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.4556802023562995,0.4530272348130376,0.7662387863441623,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.4556802023562995,0.4530272348130376,0.7662387863441623,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.4556802023562995,0.4530272348130376,0.7662387863441623,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.3736136402253394,0.7056100351752885,0.6021024216007594,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.3736136402253394,0.7056100351752885,0.6021024216007594,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.3736136402253394,0.7056100351752885,0.6021024216007594,
    -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.6048672442080638,0.562694706371266,0.5634805092511163,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.6048672442080638,0.562694706371266,0.5634805092511163,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.6048672442080638,0.562694706371266,0.5634805092511163,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.7170079792643393,0.3512482756868904,0.6020998310066653,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.7170079792643393,0.3512482756868904,0.6020998310066653,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.7170079792643393,0.3512482756868904,0.6020998310066653,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.6349390266407688,0.09866770853401576,0.7662356789794635,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.6349390266407688,0.09866770853401576,0.7662356789794635,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.6349390266407688,0.09866770853401576,0.7662356789794635,
    0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.8200745038929455,0.0997238265034114,0.5635006357514222,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.8200745038929455,0.0997238265034114,0.5635006357514222,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.8200745038929455,0.0997238265034114,0.5635006357514222,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.4013861845151851,0.09866778374700691,0.9105788265333187,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.4013861845151851,0.09866778374700691,0.9105788265333187,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.4013861845151851,0.09866778374700691,0.9105788265333187,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.21787243544536275,0.35124826452696245,0.9105801768871884,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,0.21787243544536275,0.35124826452696245,0.9105801768871884,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.21787243544536275,0.35124826452696245,0.9105801768871884,
    -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,0.13726376036863816,0.09972734098810271,0.9855014548689939,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.13726376036863816,0.09972734098810271,0.9855014548689939,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,0.13726376036863816,0.09972734098810271,0.9855014548689939,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.2900434568871001,0.5733688522583722,0.7662394876126509,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.2900434568871001,0.5733688522583722,0.7662394876126509,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.2900434568871001,0.5733688522583722,0.7662394876126509,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.5556260194438501,0.5733697244076063,0.6021020558424691,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.5556260194438501,0.5733697244076063,0.6021020558424691,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.5556260194438501,0.5733697244076063,0.6021020558424691,
    0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.3482409616935957,0.7491463488573389,0.5634784650653812,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.3482409616935957,0.7491463488573389,0.5634784650653812,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.3482409616935957,0.7491463488573389,0.5634784650653812,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.3337976901239209,0.4349849838050999,0.8362817503282085,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.3337976901239209,0.4349849838050999,0.8362817503282085,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.3337976901239209,0.4349849838050999,0.8362817503282085,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.5168458529709208,0.18304579180754743,0.8362802176114829,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.5168458529709208,0.18304579180754743,0.8362802176114829,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.5168458529709208,0.18304579180754743,0.8362802176114829,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.5987063332641229,0.43498543079189117,0.6725610764147907,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.5987063332641229,0.43498543079189117,0.6725610764147907,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.5987063332641229,0.43498543079189117,0.6725610764147907,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.3105465803904405,0.45187809786617095,0.836281654753143,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.3105465803904405,0.45187809786617095,0.836281654753143,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.3105465803904405,0.45187809786617095,0.836281654753143,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,-0.014375025187359633,0.54811137916339,0.836281815348432,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,-0.014375025187359633,0.54811137916339,0.836281815348432,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.014375025187359633,0.54811137916339,0.836281815348432,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.22868908812893668,0.7038198371342455,0.6725614751285416,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.22868908812893668,0.7038198371342455,0.6725614751285416,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,-0.22868908812893668,0.7038198371342455,0.6725614751285416,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.5257288496935327,-0.15570515706632634,0.8362805035769193,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.5257288496935327,-0.15570515706632634,0.8362805035769193,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.5257288496935327,-0.15570515706632634,0.8362805035769193,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.5257288565113238,0.15570514544984565,0.8362805014537518,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.5257288565113238,0.15570514544984565,0.8362805014537518,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.5257288565113238,0.15570514544984565,0.8362805014537518,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.7400431604567386,0.0,0.6725593807696104,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.7400431604567386,0.0,0.6725593807696104,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.7400431604567386,0.0,0.6725593807696104,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,-0.014375025183341017,-0.5481113791642288,0.8362818153479515,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.014375025183341017,-0.5481113791642288,0.8362818153479515,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,-0.014375025183341017,-0.5481113791642288,0.8362818153479515,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.31054660634034525,-0.45187806863117713,0.8362816609137449,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.31054660634034525,-0.45187806863117713,0.8362816609137449,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.31054660634034525,-0.45187806863117713,0.8362816609137449,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.22868908812963912,-0.7038198371336519,0.6725614751289236,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,-0.22868908812963912,-0.7038198371336519,0.6725614751289236,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.22868908812963912,-0.7038198371336519,0.6725614751289236,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.5168458649633569,-0.18304578392835724,0.8362802119244079,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.5168458649633569,-0.18304578392835724,0.8362802119244079,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.5168458649633569,-0.18304578392835724,0.8362802119244079,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.33379768111941355,-0.4349850166946444,0.8362817368150892,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.33379768111941355,-0.4349850166946444,0.8362817368150892,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.33379768111941355,-0.4349850166946444,0.8362817368150892,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.598706333264664,-0.4349854307896837,0.6725610764157365,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.598706333264664,-0.4349854307896837,0.6725610764157365,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.598706333264664,-0.4349854307896837,0.6725610764157365,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.8868726411103974,0.45188038550008525,0.09623427482016117,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.8868726411103974,0.45188038550008525,0.09623427482016117,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.8868726411103974,0.45188038550008525,0.09623427482016117,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.7544176076440144,0.5481140659055463,0.36114407655833464,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.7544176076440144,0.5481140659055463,0.36114407655833464,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.7544176076440144,0.5481140659055463,0.36114407655833464,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.703826009734567,0.7038237749870908,0.09623430668965156,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.703826009734567,0.7038237749870908,0.09623430668965156,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.703826009734567,0.7038237749870908,0.09623430668965156,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,-0.1557084584099035,0.9831040677591577,0.09623548168429935,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.1557084584099035,0.9831040677591577,0.09623548168429935,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.1557084584099035,0.9831040677591577,0.09623548168429935,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.28816388988226643,0.8868681304880176,0.3611460808213343,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.28816388988226643,0.8868681304880176,0.3611460808213343,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.28816388988226643,0.8868681304880176,0.3611460808213343,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.45188374182885493,0.8868707696675265,0.09623576144075277,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.45188374182885493,0.8868707696675265,0.09623576144075277,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.45188374182885493,0.8868707696675265,0.09623576144075277,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.9831043836297442,0.1557060533937894,0.09623614614328184,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9831043836297442,0.1557060533937894,0.09623614614328184,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.9831043836297442,0.1557060533937894,0.09623614614328184,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.9325093417933523,0.0,0.361145853455538,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.9325093417933523,0.0,0.361145853455538,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.9325093417933523,0.0,0.361145853455538,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.9831043830057655,-0.15570605329496234,0.0962361526774606,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.9831043830057655,-0.15570605329496234,0.0962361526774606,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9831043830057655,-0.15570605329496234,0.0962361526774606,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.45188374182885466,-0.8868707696675268,0.09623576144075378,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.45188374182885466,-0.8868707696675268,0.09623576144075378,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.45188374182885466,-0.8868707696675268,0.09623576144075378,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.2881638898822667,-0.8868681304880176,0.3611460808213341,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.2881638898822667,-0.8868681304880176,0.3611460808213341,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.2881638898822667,-0.8868681304880176,0.3611460808213341,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,-0.1557084584099035,-0.9831040677591577,0.0962354816842998,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.1557084584099035,-0.9831040677591577,0.0962354816842998,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.1557084584099035,-0.9831040677591577,0.0962354816842998,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.7038260016581754,-0.7038237669094751,0.09623442483448079,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.7038260016581754,-0.7038237669094751,0.09623442483448079,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.7038260016581754,-0.7038237669094751,0.09623442483448079,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.7544175752367749,-0.5481141400040827,0.36114403179541826,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.7544175752367749,-0.5481141400040827,0.36114403179541826,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.7544175752367749,-0.5481141400040827,0.36114403179541826,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.886872641109946,-0.45188038550049187,0.09623427482241326,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.886872641109946,-0.45188038550049187,0.09623427482241326,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.886872641109946,-0.45188038550049187,0.09623427482241326,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,0.15570845840990344,0.9831040677591575,-0.09623548168429938,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.15570845840990344,0.9831040677591575,-0.09623548168429938,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.15570845840990344,0.9831040677591575,-0.09623548168429938,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.45188374182885466,0.8868707696675268,-0.09623576144075305,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.45188374182885466,0.8868707696675268,-0.09623576144075305,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.45188374182885466,0.8868707696675268,-0.09623576144075305,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.28816388988226643,0.8868681304880176,-0.36114608082133426,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.28816388988226643,0.8868681304880176,-0.36114608082133426,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.28816388988226643,0.8868681304880176,-0.36114608082133426,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.8868726411103979,0.45188038550008464,-0.09623427482016111,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.8868726411103979,0.45188038550008464,-0.09623427482016111,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.8868726411103979,0.45188038550008464,-0.09623427482016111,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.7038260097345667,0.7038237749870914,-0.09623430668965094,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.7038260097345667,0.7038237749870914,-0.09623430668965094,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.7038260097345667,0.7038237749870914,-0.09623430668965094,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.7544176076440146,0.5481140659055457,-0.3611440765583354,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.7544176076440146,0.5481140659055457,-0.3611440765583354,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.7544176076440146,0.5481140659055457,-0.3611440765583354,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.703826001658175,-0.7038237669094755,-0.09623442483448011,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.703826001658175,-0.7038237669094755,-0.09623442483448011,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.703826001658175,-0.7038237669094755,-0.09623442483448011,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.8868726411099463,-0.45188038550049126,-0.09623427482241323,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.8868726411099463,-0.45188038550049126,-0.09623427482241323,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.8868726411099463,-0.45188038550049126,-0.09623427482241323,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.754417575236775,-0.548114140004082,-0.36114403179541904,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.754417575236775,-0.548114140004082,-0.36114403179541904,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.754417575236775,-0.548114140004082,-0.36114403179541904,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.45188374182885427,-0.8868707696675268,-0.09623576144075405,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.45188374182885427,-0.8868707696675268,-0.09623576144075405,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.45188374182885427,-0.8868707696675268,-0.09623576144075405,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,0.1557084584099035,-0.9831040677591575,-0.09623548168429982,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.1557084584099035,-0.9831040677591575,-0.09623548168429982,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.1557084584099035,-0.9831040677591575,-0.09623548168429982,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.2881638898822667,-0.8868681304880176,-0.361146080821334,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.2881638898822667,-0.8868681304880176,-0.361146080821334,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.2881638898822667,-0.8868681304880176,-0.361146080821334,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.9831043836297443,0.15570605339378868,-0.09623614614328271,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9831043836297443,0.15570605339378868,-0.09623614614328271,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.9831043836297443,0.15570605339378868,-0.09623614614328271,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.9831043830057655,-0.1557060532949616,-0.09623615267746147,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.9831043830057655,-0.1557060532949616,-0.09623615267746147,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9831043830057655,-0.1557060532949616,-0.09623615267746147,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.932509341793352,0.0,-0.3611458534555385,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.932509341793352,0.0,-0.3611458534555385,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.932509341793352,0.0,-0.3611458534555385,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.31054658039044,0.4518780978661704,-0.8362816547531434,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.31054658039044,0.4518780978661704,-0.8362816547531434,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.31054658039044,0.4518780978661704,-0.8362816547531434,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.22868908812893654,0.7038198371342458,-0.6725614751285413,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.22868908812893654,0.7038198371342458,-0.6725614751285413,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,0.22868908812893654,0.7038198371342458,-0.6725614751285413,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,0.014375025187359785,0.5481113791633897,-0.8362818153484325,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,0.014375025187359785,0.5481113791633897,-0.8362818153484325,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.014375025187359785,0.5481113791633897,-0.8362818153484325,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.33379769012392096,0.4349849838051005,-0.8362817503282082,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.33379769012392096,0.4349849838051005,-0.8362817503282082,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.33379769012392096,0.4349849838051005,-0.8362817503282082,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.5987063332641228,0.43498543079189106,-0.6725610764147907,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.5987063332641228,0.43498543079189106,-0.6725610764147907,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.5987063332641228,0.43498543079189106,-0.6725610764147907,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.5168458529709213,0.1830457918075477,-0.8362802176114825,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.5168458529709213,0.1830457918075477,-0.8362802176114825,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.5168458529709213,0.1830457918075477,-0.8362802176114825,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.5168458649633575,-0.18304578392835744,-0.8362802119244075,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.5168458649633575,-0.18304578392835744,-0.8362802119244075,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.5168458649633575,-0.18304578392835744,-0.8362802119244075,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.598706333264664,-0.43498543078968377,-0.6725610764157365,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.598706333264664,-0.43498543078968377,-0.6725610764157365,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.598706333264664,-0.43498543078968377,-0.6725610764157365,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.3337976811194137,-0.4349850166946449,-0.8362817368150889,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.3337976811194137,-0.4349850166946449,-0.8362817368150889,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.3337976811194137,-0.4349850166946449,-0.8362817368150889,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.5257288565113233,0.15570514544984582,-0.836280501453752,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.5257288565113233,0.15570514544984582,-0.836280501453752,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.5257288565113233,0.15570514544984582,-0.836280501453752,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.7400431604567397,0.0,-0.6725593807696092,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.7400431604567397,0.0,-0.6725593807696092,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.7400431604567397,0.0,-0.6725593807696092,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.5257288496935323,-0.15570515706632646,-0.8362805035769194,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.5257288496935323,-0.15570515706632646,-0.8362805035769194,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.5257288496935323,-0.15570515706632646,-0.8362805035769194,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,0.014375025183341193,-0.5481113791642283,-0.8362818153479519,
    0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.014375025183341193,-0.5481113791642283,-0.8362818153479519,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,0.014375025183341193,-0.5481113791642283,-0.8362818153479519,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.22868908812963903,-0.7038198371336523,-0.6725614751289233,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,0.22868908812963903,-0.7038198371336523,-0.6725614751289233,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.22868908812963903,-0.7038198371336523,-0.6725614751289233,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.3105466063403448,-0.45187806863117663,-0.8362816609137453,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.3105466063403448,-0.45187806863117663,-0.8362816609137453,
    0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.3105466063403448,-0.45187806863117663,-0.8362816609137453
  ]);
  
  var tenSphere = new Float32Array(960*10);
  
  for (let i = 0; i < 960; i++) {
    tenSphere[10*i+0] = sphere[7*i+0];
    tenSphere[10*i+1] = sphere[7*i+1];
    tenSphere[10*i+2] = sphere[7*i+2];
    tenSphere[10*i+3] = sphere[7*i+3];
    tenSphere[10*i+4] = 0.0;//sphere[7*i+4];
    tenSphere[10*i+5] = 1.0;//sphere[7*i+5];
    tenSphere[10*i+6] = 1.0;//sphere[7*i+6];
    tenSphere[10*i+7] = sphere[7*i+0];
    tenSphere[10*i+8] = sphere[7*i+1];
    tenSphere[10*i+9] = sphere[7*i+2];
  }
  
  
  
  var tetra_rect =  new Float32Array ([
      // Face 0: (right side).  Unit Normal Vector: N0 = (sq23, sq29, thrd)
      0.0,	 0.0, sq2, 1.0,			0.0, 	0.0,	1.0,		 sq23,	sq29, thrd,
      c30, -0.5, 0.0, 1.0, 			1.0,  0.0,  0.0, 		sq23,	sq29, thrd,
      0.0,  1.0, 0.0, 1.0,  		0.0,  1.0,  0.0,		sq23,	sq29, thrd, 
      // Face 1: (left side).		Unit Normal Vector: N1 = (-sq23, sq29, thrd)
      0.0,	 0.0, sq2, 1.0,			0.0, 	0.0,	1.0,	 -sq23,	sq29, thrd,
      0.0,  1.0, 0.0, 1.0,  		0.0,  1.0,  0.0,	 -sq23,	sq29, thrd,
      -c30, -0.5, 0.0, 1.0, 		1.0,  1.0,  1.0, 	 -sq23,	sq29,	thrd,
      // Face 2: (lower side) 	Unit Normal Vector: N2 = (0.0, -sq89, thrd)
      0.0,	 0.0, sq2, 1.0,			0.0, 	0.0,	1.0,		0.0, -sq89,	thrd,
      -c30, -0.5, 0.0, 1.0, 		1.0,  1.0,  1.0, 		0.0, -sq89,	thrd,          																							//0.0, 0.0, 0.0, // Normals debug
      c30, -0.5, 0.0, 1.0, 			1.0,  0.0,  0.0, 		0.0, -sq89,	thrd,
      // Face 3: (base side)  Unit Normal Vector: N2 = (0.0, 0.0, -1.0)
      -c30, -0.5, 0.0, 1.0, 		1.0,  1.0,  1.0, 		0.0, 	0.0, -1.0,
      0.0,  1.0, 0.0, 1.0,  		0.0,  1.0,  0.0,		0.0, 	0.0, -1.0,
      c30, -0.5, 0.0, 1.0, 			1.0,  0.0,  0.0, 		0.0, 	0.0, -1.0,
  
      
  //Side 1 for rectangle (000,101,001)(000,101,100) -> (0,-1,0) (RED)
  0.00, 0.00, 0.00, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  0.20, 0.00, 0.20, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  0.00, 0.00, 0.20, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  
  0.00, 0.00, 0.00, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  0.20, 0.00, 0.20, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  0.20, 0.00, 0.00, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  
  //Side 2 of rectangle, (000,110,100)(000,110,010) -> (0,0,-1) (GREEN)
  0.00, 0.00, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  0.20, 0.50, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  0.20, 0.00, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  
  0.00, 0.00, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  0.20, 0.50, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  0.00, 0.50, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  
  //Side 3 of rectangle, (000,011,010)(000,011,001) -> (-1,0,0) (BLUE)
  0.00, 0.00, 0.00, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  0.00, 0.50, 0.20, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  0.00, 0.50, 0.00, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  
  0.00, 0.00, 0.00, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  0.00, 0.50, 0.20, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  0.00, 0.00, 0.20, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  
  //Side 4 of rectangle, (111,001,011)(111,001,101) -> (001) (YELLOW)
  0.20, 0.50, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  0.00, 0.00, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  0.00, 0.50, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  
  0.20, 0.50, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  0.00, 0.00, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  0.20, 0.00, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  
  //Side 5 of rectangle, (111,010,011)(111,010,110) -> (010) (CYAN)
  0.20, 0.50, 0.20, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  0.00, 0.50, 0.00, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  0.00, 0.50, 0.20, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  
  0.20, 0.50, 0.20, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  0.00, 0.50, 0.00, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  0.20, 0.50, 0.00, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  
  //Side 6 of rectangle, (111,100,101)(111,100,110) -> (100) (MAGENTA)
  0.20, 0.50, 0.20, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  0.20, 0.00, 0.00, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  0.20, 0.00, 0.20, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  
  0.20, 0.50, 0.20, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  0.20, 0.00, 0.00, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  0.20, 0.50, 0.00, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  ]);
    
  for (let i = 0; i < 12+36; i++) {
    tetra_rect[10*i+7] = tetra_rect[10*i+7] * 1;
    tetra_rect[10*i+8] = tetra_rect[10*i+8] * 1;
    tetra_rect[10*i+9] = tetra_rect[10*i+9] * 1;
  }
  
  for (let i = 0; i < 12+36; i++) {
    tetra_rect[10*i+4] = 1.0;
    tetra_rect[10*i+5] = 1.0;
    tetra_rect[10*i+6] = 0.0;
  }
  
    this.vboContents = new Float32Array((960+36+12)*10);
    this.vboContents.set(tenSphere, offset=0);
    this.vboContents.set(tetra_rect, offset=9600);
      
    this.vboVerts = 960+36+12;							// # of vertices held in 'vboContents' array;
    this.FSIZE = this.vboContents.BYTES_PER_ELEMENT;  
                                  // bytes req'd by 1 vboContents array element;
                                  // (why? used to compute stride and offset 
                                  // in bytes for vertexAttribPointer() calls)
    this.vboBytes = this.vboContents.length * this.FSIZE;               
                                  // (#  of floats in vboContents array) * 
                                  // (# of bytes/float).
    this.vboStride = this.vboBytes / this.vboVerts;     
                                  // (== # of bytes to store one complete vertex).
                                  // From any attrib in a given vertex in the VBO, 
                                  // move forward by 'vboStride' bytes to arrive 
                                  // at the same attrib for the next vertex.
                                   
                //----------------------Attribute sizes
    this.vboFcount_a_Pos1 =  4;    // # of floats in the VBO needed to store the
                                  // attribute named a_Pos1. (4: x,y,z,w values)
    this.vboFcount_a_Colr1 = 3;   // # of floats for this attrib (r,g,b values)
    this.vboFcount_a_Normal = 3;  // # of floats for this attrib (just one!)   
    console.assert((this.vboFcount_a_Pos1 +     // check the size of each and
                    this.vboFcount_a_Colr1 +
                    this.vboFcount_a_Normal) *   // every attribute in our VBO
                    this.FSIZE == this.vboStride, // for agreeement with'stride'
                    "Uh oh! VBObox1.vboStride disagrees with attribute-size values!");
                    
                //----------------------Attribute offsets
    this.vboOffset_a_Pos1 = 0;    //# of bytes from START of vbo to the START
                                  // of 1st a_Pos1 attrib value in vboContents[]
    this.vboOffset_a_Colr1 = (this.vboFcount_a_Pos1) * this.FSIZE;  
                                  // == 4 floats * bytes/float
                                  //# of bytes from START of vbo to the START
                                  // of 1st a_Colr1 attrib value in vboContents[]
    this.vboOffset_a_Normal =(this.vboFcount_a_Pos1 +
                              this.vboFcount_a_Colr1) * this.FSIZE; 
                                  // == 7 floats * bytes/float
                                  // # of bytes from START of vbo to the START
                                  // of 1st a_PtSize attrib value in vboContents[]
  
                //-----------------------GPU memory locations:                                
    this.vboLoc;									// GPU Location for Vertex Buffer Object, 
                                  // returned by gl.createBuffer() function call
    this.shaderLoc;								// GPU Location for compiled Shader-program  
                                  // set by compile/link of VERT_SRC and FRAG_SRC.
                            //------Attribute locations in our shaders:
    this.a_Pos1Loc;							  // GPU location: shader 'a_Pos1' attribute
    this.a_Colr1Loc;							// GPU location: shader 'a_Colr1' attribute
    this.a_NormalLoc;							// GPU location: shader 'a_PtSiz1' attribute
    
                //---------------------- Uniform locations &values in our shaders
    this.ModelMatrix = new Matrix4();	// Transforms CVV axes to model axes.
    this.u_ModelMatrixLoc;						// GPU location for u_ModelMat uniform
  
    //Felipe's addition: make a Normal Matrix too
    this.NormalMatrix = new Matrix4();
    this.u_NormalMatrixLoc;
    this.MvpMatrix = new Matrix4();
    this.u_MvpMatrixLoc;
  
    this.EyePos = new Vector3();
    this.u_EyePosLoc;
  
    this.LightColor = new Vector3();
    this.LightPosition = new Vector3();
    this.AmbientLight = new Vector3();
    this.SpecularLight = new Vector3();
  
    this.u_LightColorLoc;
    this.u_LightPositionLoc;
    this.u_AmbientLightLoc;
    this.u_SpecularLightLoc;
  
    this.emit = new Vector3();
    this.ambi = new Vector3();
    this.diff = new Vector3();
    this.spec = new Vector3();
    this.shiny = 0;
  
    this.u_emitLoc;
    this.u_ambiLoc;
    this.u_diffLoc;
    this.u_specLoc;
    this.u_shinyLoc;
  };
  
  //USE
  VBObox2.prototype.init = function() {
  //--------------------
  // a) Compile,link,upload shaders-----------------------------------------------
    this.shaderLoc = createProgram(gl, this.VERT_SRC, this.FRAG_SRC);
    if (!this.shaderLoc) {
      console.log(this.constructor.name + 
                  '.init() failed to create executable Shaders on the GPU. Bye!');
      return;
    }
  // CUTE TRICK: let's print the NAME of this VBObox object: tells us which one!
  //  else{console.log('You called: '+ this.constructor.name + '.init() fcn!');}
  
    gl.program = this.shaderLoc;		// (to match cuon-utils.js -- initShaders())
  
  // b) Create VBO on GPU, fill it------------------------------------------------
    this.vboLoc = gl.createBuffer();	
    if (!this.vboLoc) {
      console.log(this.constructor.name + 
                  '.init() failed to create VBO in GPU. Bye!'); 
      return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,	      // GLenum 'target' for this GPU buffer 
                    this.vboLoc);	
    gl.bufferData(gl.ARRAY_BUFFER, 			  // GLenum target(same as 'bindBuffer()')
                      this.vboContents, 		// JavaScript Float32Array
                     gl.STATIC_DRAW);
  
  // c1) Find All Attributes:-----------------------------------------------------
  //  Find & save the GPU location of all our shaders' attribute-variables and 
  //  uniform-variables (for switchToMe(), adjust(), draw(), reload(), etc.)
    this.a_Pos1Loc = gl.getAttribLocation(this.shaderLoc, 'a_Position');
    if(this.a_Pos1Loc < 0) {
      console.log(this.constructor.name + 
                  '.init() Failed to get GPU location of attribute a_Pos1');
      return -1;	// error exit.
    }
     this.a_Colr1Loc = gl.getAttribLocation(this.shaderLoc, 'a_Color');
    if(this.a_Colr1Loc < 0) {
      console.log(this.constructor.name + 
                  '.init() failed to get the GPU location of attribute a_Colr1');
      return -1;	// error exit.
    }
    this.a_NormalLoc = gl.getAttribLocation(this.shaderLoc, 'a_Normal');
    if(this.a_NormalLoc < 0) {
      console.log(this.constructor.name + 
                  '.init() failed to get the GPU location of attribute a_PtSiz1');
      return -1;	// error exit.
    }
    // c2) Find All Uniforms:-----------------------------------------------------
    //Get GPU storage location for each uniform var used in our shader programs: 
    this.u_ModelMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_ModelMatrix');
    if (!this.u_ModelMatrixLoc) { 
      console.log(this.constructor.name + 
                  '.init() failed to get GPU location for u_ModelMatrix uniform');
      return;
    }
  
    //Felipe's addition: find the uniform for Normal matrix
    this.u_NormalMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_NormalMatrix');
    if (!this.u_NormalMatrixLoc) { 
      console.log(this.constructor.name + 
                  '.init() failed to get GPU location for u_NormalMatrix uniform');
      //return;
    }
    this.u_MvpMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_MvpMatrix');
    if (!this.u_MvpMatrixLoc) { 
      console.log(this.constructor.name + 
                  '.init() failed to get GPU location for u_MvpMatrix uniform');
      //return;
    }
    this.u_EyePosLoc = gl.getUniformLocation(this.shaderLoc, 'u_EyePos');
    if (!this.u_EyePosLoc) { 
      console.log(this.constructor.name + 
                  '.init() failed to get GPU location for u_EyePos uniform');
      //return;
    }
  
    this.u_LightColorLoc = gl.getUniformLocation(this.shaderLoc, 'u_LightColor');
    if (!this.u_LightColorLoc) { 
      console.log(this.constructor.name +  '.init() failed to get GPU location for u_LightColor uniform');
      return;
    }
    this.u_LightPositionLoc = gl.getUniformLocation(this.shaderLoc, 'u_LightPosition');
    if (!this.u_LightPositionLoc) { 
      console.log(this.constructor.name +  '.init() failed to get GPU location for u_LightPosition uniform');
      //return;
    }
    this.u_AmbientLightLoc = gl.getUniformLocation(this.shaderLoc, 'u_AmbientLight');
    if (!this.u_AmbientLightLoc) { 
      console.log(this.constructor.name +  '.init() failed to get GPU location for u_AmbientLight uniform');
      return;
    }
    this.u_SpecularLightLoc = gl.getUniformLocation(this.shaderLoc, 'u_SpecularLight');
    if (!this.u_SpecularLightLoc) console.log(this.constructor.name +  ' u_SpecularLight failed');
  
    this.u_emitLoc = gl.getUniformLocation(this.shaderLoc, 'u_emit');
    if (!this.u_emitLoc) console.log(this.constructor.name +  ' u_emit failed');
    this.u_ambiLoc = gl.getUniformLocation(this.shaderLoc, 'u_ambi');
    if (!this.u_ambiLoc) console.log(this.constructor.name +  ' u_ambi failed');
    this.u_diffLoc = gl.getUniformLocation(this.shaderLoc, 'u_diff');
    if (!this.u_diffLoc) console.log(this.constructor.name +  ' u_diff failed');
    this.u_specLoc = gl.getUniformLocation(this.shaderLoc, 'u_spec');
    if (!this.u_specLoc) console.log(this.constructor.name +  ' u_spec failed');
    this.u_shinyLoc = gl.getUniformLocation(this.shaderLoc, 'u_shiny');
    if (!this.u_shinyLoc) console.log(this.constructor.name +  ' u_shiny failed');
  }
  
  VBObox2.prototype.switchToMe = function () {
  //==============================================================================
  // Set GPU to use this VBObox's contents (VBO, shader, attributes, uniforms...)
  //
  // We only do this AFTER we called the init() function, which does the one-time-
  // only setup tasks to put our VBObox contents into GPU memory.  !SURPRISE!
  // even then, you are STILL not ready to draw our VBObox's contents onscreen!
  // We must also first complete these steps:
  //  a) tell the GPU to use our VBObox's shader program (already in GPU memory),
  //  b) tell the GPU to use our VBObox's VBO  (already in GPU memory),
  //  c) tell the GPU to connect the shader program's attributes to that VBO.
  
  // a) select our shader program:
    gl.useProgram(this.shaderLoc);	
  //		Each call to useProgram() selects a shader program from the GPU memory,
  // but that's all -- it does nothing else!  Any previously used shader program's 
  // connections to attributes and uniforms are now invalid, and thus we must now
  // establish new connections between our shader program's attributes and the VBO
  // we wish to use.  
    
  // b) call bindBuffer to disconnect the GPU from its currently-bound VBO and
  //  instead connect to our own already-created-&-filled VBO.  This new VBO can 
  //    supply values to use as attributes in our newly-selected shader program:
    gl.bindBuffer(gl.ARRAY_BUFFER,	    // GLenum 'target' for this GPU buffer 
                      this.vboLoc);			// the ID# the GPU uses for our VBO.
  
  // c) connect our newly-bound VBO to supply attribute variable values for each
  // vertex to our SIMD shader program, using 'vertexAttribPointer()' function.
  // this sets up data paths from VBO to our shader units:
    // 	Here's how to use the almost-identical OpenGL version of this function:
    //		http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttribPointer.xml )
    gl.vertexAttribPointer(
      this.a_Pos1Loc,//index == ID# for the attribute var in GLSL shader pgm;
      this.vboFcount_a_Pos1, // # of floats used by this attribute: 1,2,3 or 4?
      gl.FLOAT,		  // type == what data type did we use for those numbers?
      false,				// isNormalized == are these fixed-point values that we need
                    //									normalize before use? true or false
      this.vboStride,// Stride == #bytes we must skip in the VBO to move from the
                    // stored attrib for this vertex to the same stored attrib
                    //  for the next vertex in our VBO.  This is usually the 
                    // number of bytes used to store one complete vertex.  If set 
                    // to zero, the GPU gets attribute values sequentially from 
                    // VBO, starting at 'Offset'.	
                    // (Our vertex size in bytes: 4 floats for pos + 3 for color)
      this.vboOffset_a_Pos1);						
                    // Offset == how many bytes from START of buffer to the first
                    // value we will actually use?  (we start with position).
    gl.vertexAttribPointer(this.a_Colr1Loc, this.vboFcount_a_Colr1,
                           gl.FLOAT, false, 
                           this.vboStride,  this.vboOffset_a_Colr1);
    gl.vertexAttribPointer(this.a_NormalLoc,this.vboFcount_a_Normal, 
                           gl.FLOAT, false, 
                           this.vboStride,	this.vboOffset_a_Normal);	
    //-- Enable this assignment of the attribute to its' VBO source:
    gl.enableVertexAttribArray(this.a_Pos1Loc);
    gl.enableVertexAttribArray(this.a_Colr1Loc);
    gl.enableVertexAttribArray(this.a_NormalLoc);
  }
  
  VBObox2.prototype.isReady = function() {
  //==============================================================================
  // Returns 'true' if our WebGL rendering context ('gl') is ready to render using
  // this objects VBO and shader program; else return false.
  // see: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter
  
  var isOK = true;
  
    if(gl.getParameter(gl.CURRENT_PROGRAM) != this.shaderLoc)  {
      console.log(this.constructor.name + 
                  '.isReady() false: shader program at this.shaderLoc not in use!');
      isOK = false;
    }
    if(gl.getParameter(gl.ARRAY_BUFFER_BINDING) != this.vboLoc) {
        console.log(this.constructor.name + 
                '.isReady() false: vbo at this.vboLoc not in use!');
      isOK = false;
    }
    return isOK;
  }
  
  VBObox2.prototype.adjust = function() {
  //==============================================================================
  // Update the GPU to newer, current values we now store for 'uniform' vars on 
  // the GPU; and (if needed) update each attribute's stride and offset in VBO.
  
    // check: was WebGL context set to use our VBO & shader program?
    if(this.isReady()==false) {
          console.log('ERROR! before' + this.constructor.name + 
                '.adjust() call you needed to call this.switchToMe()!!');
    }
    // Adjust values for our uniforms,
    this.ModelMatrix.setIdentity();
    //this.ModelMatrix.set(g_worldMat);
    this.MvpMatrix.setIdentity();
    this.MvpMatrix.set(g_mvpMat);
  
    //this.ModelMatrix.translate(1.0, -2.0, 0);						// then translate them.
    //this.ModelMatrix.rotate(g_angleNow2, 0, 0, 1);	// -spin drawing axes,
  
  }
  
  VBObox2.prototype.draw = function() {
    //=============================================================================
    // Send commands to GPU to select and render current VBObox contents.
    
      // check: was WebGL context set to use our VBO & shader program?
      if(this.isReady()==false) {
            console.log('ERROR! before' + this.constructor.name + 
                  '.draw() call you needed to call this.switchToMe()!!');
      }
      this.reMatrix = function() {
        actualMvp = new Matrix4();
        actualMvp.set(this.MvpMatrix);
        actualMvp.multiply(this.ModelMatrix);
        this.NormalMatrix.setInverseOf(this.ModelMatrix);
        this.NormalMatrix.transpose();
        gl.uniformMatrix4fv(this.u_ModelMatrixLoc, false, actualMvp.elements);	// send data from Javascript.
        gl.uniformMatrix4fv(this.u_NormalMatrixLoc, false, this.NormalMatrix.elements);	// send data from Javascript.
        gl.uniformMatrix4fv(this.u_MvpMatrixLoc, false, this.ModelMatrix.elements);	// send data from Javascript.
        
        gl.uniform3f(this.u_EyePos, posX, posY, posZ);
        
        this.LightColor = diffuseColor;
        this.LightPosition = lightPos;
        if(!ambientToggle){ this.AmbientLight = ambientColor; }
        else{ 
          this.AmbientLight = new Vector3(); 
          this.AmbientLight.x = 0.05;
          this.AmbientLight.y = 0.05;
          this.AmbientLight.z = 0.05;
        }
        if(diffuseToggle){ this.LightColor = diffuseColor; }
        else{ 
          this.LightColor = new Vector3(); 
          this.LightColor.x = 0.01;
          this.LightColor.y = 0.01;
          this.LightColor.z = 0.01;
        }
        if(specularToggle){ this.SpecularLight = specularColor; }
        else{ 
          this.SpecularLight = new Vector3(); 
          this.SpecularLight.x = 0.01;
          this.SpecularLight.y = 0.01;
          this.SpecularLight.z = 0.01;
        }
    
        //Light source
        gl.uniform3f(this.u_LightColorLoc, this.LightColor.x,this.LightColor.y,this.LightColor.z);
        gl.uniform3f(this.u_LightPositionLoc, this.LightPosition.x, this.LightPosition.y, this.LightPosition.z);
        gl.uniform3f(this.u_AmbientLightLoc, this.AmbientLight.x, this.AmbientLight.y, this.AmbientLight.z);
        gl.uniform3f(this.u_SpecularLightLoc, this.SpecularLight.x, this.SpecularLight.y, this.SpecularLight.z);
      
        //eye source
      }
    
      this.reMaterial = function(emissive, ambient, diffuse, specular, shiny){
    
        gl.uniform3fv(this.u_emitLoc, emissive);
        gl.uniform3fv(this.u_ambiLoc, ambient);
        gl.uniform3fv(this.u_diffLoc, diffuse);
        gl.uniform3fv(this.u_specLoc, specular);
        gl.uniform1f(this.u_shinyLoc, shiny);
      }
    
      this.drawBox = function() {
        this.reMatrix();
        gl.drawArrays(gl.TRIANGLES, 960+12, 36);		// number of vertices to draw on-screen.
      }
      this.drawSphere = function() {
        this.reMatrix();
        gl.drawArrays(gl.TRIANGLES, 0, 960);		// number of vertices to draw on-screen.
      }
      this.drawJointTree = function(count, pivotAngle, curlAngle){
        pushMatrix(this.ModelMatrix);
        this.ModelMatrix.rotate(-pivotAngle, 0, 0, 1);
        this.ModelMatrix.translate(-0.2, 0 , 0);
        this.drawBox();
        for(i = 0; i < count-1; i++){
          this.ModelMatrix.translate(0.2, 0.5, 0.0);
          this.ModelMatrix.scale(0.8,0.8,0.8);
          this.ModelMatrix.rotate(-curlAngle, 0,0,1);
          this.ModelMatrix.translate(-0.2, 0, 0);
          this.drawBox();
        }
        this.ModelMatrix = popMatrix();
      }
      this.drawSquid = function(pivotAngle, curlAngle, arms, joints){
        pushMatrix(this.ModelMatrix);
        for(k = 0; k<arms; k++){
          this.drawBox();
          this.ModelMatrix.translate(0,0.5,0);
          pushMatrix(this.ModelMatrix);
          this.drawJointTree(joints, pivotAngle, curlAngle);
          this.ModelMatrix = popMatrix();
          this.ModelMatrix.translate(0, -0.5, 0);
          this.ModelMatrix.rotate(360/arms, 1, 0, 0);
        }
        this.ModelMatrix = popMatrix();
      }
      this.drawTree = function(leanAngle, branchAngle, arms, joints){
        pushMatrix(this.ModelMatrix);
        this.ModelMatrix.rotate(90, 1, 0, 0);
        this.reMaterial([0,0,0],[0,0,0],[89/255,57/255,0],[0,0,0],0.0);
        this.drawJointTree(4, 0, 0);
        this.ModelMatrix.rotate(90, 1, 0, 0);
        this.ModelMatrix.rotate(90, 0, 1, 0);
        this.ModelMatrix.translate(1.5,0,0);
        this.ModelMatrix.scale(0.5,0.5,0.5);
        this.reMaterial([0,0,0],[0.05,0.05,0.05],[0,0.6,0],[0.2,0.2,0.2],60.0);
        this.drawSquid(leanAngle,branchAngle, arms, joints);
        this.ModelMatrix = popMatrix();
      }
      this.drawForest = function(xs, ys, zs, count){
        for(j = 0; j < count; j++){
          pushMatrix(this.ModelMatrix);
          this.ModelMatrix.translate(xs[j], ys[j], zs[j]);
          leanAngle = makeAngle(5,g_angleNow0 + j,-10,-15);
          this.drawTree(leanAngle, leanAngle, 5, 5);
          this.ModelMatrix = popMatrix();
        }
      }
      simulationSpeed = 1000;
      this.drawPlanet = function(radius, size, speed, offset, offsetSpeed){
        xpos = radius * Math.sin(g_angleNow0*speed / simulationSpeed);
        ypos = radius * Math.cos(g_angleNow0*speed / simulationSpeed);
        zpos = offset * Math.sin(g_angleNow0*offsetSpeed / simulationSpeed);
        this.ModelMatrix.translate(xpos, ypos, zpos);
        this.ModelMatrix.scale(size, size, size);
        this.drawSphere();
      }
      this.drawMoon = function(radius, size, speed, offset, offsetSpeed){
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[221/256,221/256,221/256],[0.5,0.5,0.5],1000.0);
        pushMatrix(this.ModelMatrix);
        xpos = radius * Math.sin(g_angleNow0*speed / simulationSpeed);
        ypos = radius * Math.cos(g_angleNow0*speed / simulationSpeed);
        zpos = offset * Math.sin(g_angleNow0*offsetSpeed / simulationSpeed);
        this.ModelMatrix.translate(xpos, ypos, zpos);
        this.ModelMatrix.scale(size, size, size);
        this.drawSphere();
        this.ModelMatrix = popMatrix();
      }
  
      this.drawPlanets = function(){
        pushMatrix(this.ModelMatrix);
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[0,0,0.6],[0.6,0.6,0.6],100.0);
        this.ModelMatrix.rotate(g_angleNow0, 0, 0,1);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        eS = 0.5;
        eD = 8;
        //Mercury
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[.5,.5,.5],[0.5,0.5,0.5],1000.0);
        this.drawPlanet(0.38*eD,0.38*eS,47.9, 0,0);
        this.ModelMatrix = popMatrix();
        //Venus
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[204/256,194/256,206/256],[0.5,0.5,0.5],1000.0);
        this.drawPlanet(0.72*eD,0.94*eS,35.0,0,0);
        this.ModelMatrix = popMatrix();
        //Earth
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[0/256,105/256,179/256],[0.5,0.5,0.5],100.0);
        this.drawPlanet(1*eD,1*eS,29.8,0,0);
        this.drawMoon(0.1*eD,0.2727,100,0.1,10);
        this.ModelMatrix = popMatrix();
        //Mars
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[122/256,48/256,0/256],[0.5,0.5,0.5],1000.0);
        this.drawPlanet(1.52*eD,0.53*eS,24.1,0,0);
        this.drawMoon(0.2*eD,0.5*0.2727/0.53,100,0.1,10);
        this.drawMoon(0.2*eD,0.5*0.2727/0.53,120,0.5,20);
        this.ModelMatrix = popMatrix();
        //Jupiter
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[250/256,156/256,126/256],[0.5,0.5,0.5],10.0);
        this.drawPlanet(5.2*eD,10.97*eS,13.1,0,0);
        for(i = 0; i < 79; i++){
          this.drawMoon(0.2*eD,0.05*0.2727/0.53*(i%5)/5,100+i,0.1*i/30*(i%5),i/2);
        }
        this.ModelMatrix = popMatrix();
        //Saturn
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[255/256,201/256,137/256],[0.5,0.5,0.5],50.0);
        this.drawPlanet(9.5*eD,9.14*eS,9.7,0,0);
        for(i = 0; i < 82; i++){
          this.drawMoon(0.2*eD,0.1*0.2727/0.53*(i%5)/2,100+i,0.1*i/30,i/2);
        }
        this.ModelMatrix = popMatrix();
        //Uranus
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[145/256,167/256,195/256],[0.5,0.5,0.5],1000.0);
        this.drawPlanet(19.2*eD,3.981*eS,6.8,0,0);
        for(i = 0; i < 27; i++){
          this.drawMoon(0.2*eD,0.1*0.2727/0.53*(i%5)/5,100+i,0.1*i/30*(i%5),i/2);
        }
        this.ModelMatrix = popMatrix();
        //Neptune
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[72/256,155/256,255/256],[0.5,0.5,0.5],1000.0);
        this.drawPlanet(30*eD,3.865*eS,5.4,0,0);
        for(i = 0; i < 14; i++){
          this.drawMoon(0.2*eD,0.1*0.2727/0.53*(i%5)/5,100+i,0.1*i/30*(i%5),i/2);
        }
        this.ModelMatrix = popMatrix();
        //Pluto
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[221/256,221/256,221/256],[0.5,0.5,0.5],1000.0);
        this.drawPlanet(39.5*eD,0.187*eS,4.67,0,0);
        this.ModelMatrix = popMatrix();
    
        this.reMaterial([0,0,0],[0.24725,0.1995,0.0745],[0.75164,0.60648,0.22648],[0.628281,0.555802,0.366065],51.2);
        this.reMaterial([0,0,0],[0.135,0.222,0.158],[0.54,0.89,0.63],[0.316,0.316,0.316],12.8);
        this.reMaterial([0.5,0,0],[0,0,0],[0,0,0],[0,0,0],0.0);
    
        this.ModelMatrix = popMatrix();
      }
      //Sun
      this.reMaterial([1,0.8,0],[0.1,0.1,0.1],[.5,.5,.5],[0.5,0.5,0.5],1000.0);
      this.drawSphere();
      if(planetsToggle) this.drawPlanets();
      if(treesToggle){
        this.ModelMatrix.translate(15.0, 0.0, 0);
        this.drawForest(
          [0,2,4,6,8,1,3,5,7,9,0,2,4,6,8,1,3,5,7,9,0,2,4,6,8],
          [0,0,0,0,0,2,2,2,2,2,4,4,4,4,4,6,6,6,6,6,8,8,8,8,8],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          25
        );
      }
      if(fingersToggle){
        this.ModelMatrix.setIdentity();
        this.ModelMatrix.rotate(g_angleNow0, 0, 0,1);
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[0.6,0.6,0.6],[0.6,0.6,0.6],100.0);
        this.ModelMatrix.translate(-2.3, -3.0, 0);
        this.ModelMatrix.scale(10,10,10);
        this.drawJointTree(5, 0,makeAngle(1,g_angleNow0, 0,90));
  
        
        this.ModelMatrix.setIdentity();
        this.ModelMatrix.rotate(g_angleNow0, 0, 0,1);
        this.ModelMatrix.translate(-2.3, -3.0, 2);
        this.ModelMatrix.rotate(90, 1, 0,0);
        this.ModelMatrix.scale(1,1,1);
        for(k = 0; k < 10; k++){
          this.ModelMatrix.translate(0, 0, -0.5);
          this.reMaterial([0,0,0],[0.1,0.1,0.1],[k/10,0,1-k/10],[0.6,0.6,0.6],100.0);
          this.drawJointTree(5, 0,makeAngle(1,g_angleNow0*(k+1), 0,90));
        }
  
      }
      
    
    }
  
  VBObox2.prototype.reload = function() {
  //=============================================================================
  // Over-write current values in the GPU for our already-created VBO: use 
  // gl.bufferSubData() call to re-transfer some or all of our Float32Array 
  // contents to our VBO without changing any GPU memory allocations.
  
   gl.bufferSubData(gl.ARRAY_BUFFER, 	// GLenum target(same as 'bindBuffer()')
                    0,                  // byte offset to where data replacement
                                        // begins in the VBO.
                      this.vboContents);   // the JS source-data array used to fill VBO
  }

//=============================================================================Colors
//=============================================================================
function VBObox3() {
  //=============================================================================
  //=============================================================================
  // CONSTRUCTOR for one re-usable 'VBObox1' object that holds all data and fcns
  // needed to render vertices from one Vertex Buffer Object (VBO) using one 
  // separate shader program (a vertex-shader & fragment-shader pair) and one
  // set of 'uniform' variables.
  
  // Constructor goal: 
  // Create and set member vars that will ELIMINATE ALL LITERALS (numerical values 
  // written into code) in all other VBObox functions. Keeping all these (initial)
  // values here, in this one coonstrutor function, ensures we can change them 
  // easily WITHOUT disrupting any other code, ever!
    
  this.VERT_SRC = 
    'uniform mat4 u_ModelMatrix;\n' +
    'attribute vec4 a_Position;\n' +
    'attribute vec3 a_Color;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '   gl_Position = u_ModelMatrix * a_Position;\n' +
    '   v_Color = vec4(-a_Color.x, -a_Color.y, -a_Color.z, 1.0);\n' +
  '}\n';
  
  // Fragment shader program----------------------------------
  this.FRAG_SRC = 
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
  '}\n';
  
  var c30 = Math.sqrt(0.75);					// == cos(30deg) == sqrt(3) / 2
  var sq2	= Math.sqrt(2.0);						 
  // for surface normals:
  var sq23 = Math.sqrt(2.0/3.0)
  var sq29 = Math.sqrt(2.0/9.0)
  var sq89 = Math.sqrt(8.0/9.0)
  var thrd = 1.0/3.0;
  
  var sphere = new Float32Array([0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.1875938387542828,-0.577343625690456,-0.7946589768800393,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.1875938387542828,-0.577343625690456,-0.7946589768800393,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,0.1875938387542828,-0.577343625690456,-0.7946589768800393,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.6070569201887998,0.0,-0.7946583515265471,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.6070569201887998,0.0,-0.7946583515265471,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.6070569201887998,0.0,-0.7946583515265471,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.4911213143210803,-0.3568183375876395,-0.7946574913638756,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.4911213143210803,-0.3568183375876395,-0.7946574913638756,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.4911213143210803,-0.3568183375876395,-0.7946574913638756,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.4911212952319224,0.356818323720363,-0.7946575093882327,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.4911212952319224,0.356818323720363,-0.7946575093882327,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.4911212952319224,0.356818323720363,-0.7946575093882327,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.18759383875292585,0.5773436256885401,-0.7946589768817515,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,0.18759383875292585,0.5773436256885401,-0.7946589768817515,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.18759383875292585,0.5773436256885401,-0.7946589768817515,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.9822470326522897,0.0,-0.18759202234042818,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9822470326522897,0.0,-0.18759202234042818,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.9822470326522897,0.0,-0.18759202234042818,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.30353357597519004,-0.934171212988684,-0.18759401130890158,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.30353357597519004,-0.934171212988684,-0.18759401130890158,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.30353357597519004,-0.934171212988684,-0.18759401130890158,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.7946554066806886,-0.5773485124543632,-0.18759392260913862,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.7946554066806886,-0.5773485124543632,-0.18759392260913862,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.7946554066806886,-0.5773485124543632,-0.18759392260913862,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.794655462880779,0.5773484504343182,-0.18759387541928604,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.794655462880779,0.5773484504343182,-0.18759387541928604,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.794655462880779,0.5773484504343182,-0.18759387541928604,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.3035335759751898,0.9341712129886843,-0.18759401130890102,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.3035335759751898,0.9341712129886843,-0.18759401130890102,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.3035335759751898,0.9341712129886843,-0.18759401130890102,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.7946554066806881,-0.5773485124543637,0.18759392260913862,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.7946554066806881,-0.5773485124543637,0.18759392260913862,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.7946554066806881,-0.5773485124543637,0.18759392260913862,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.30353357597519004,-0.934171212988684,0.1875940113089015,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.30353357597519004,-0.934171212988684,0.1875940113089015,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.30353357597519004,-0.934171212988684,0.1875940113089015,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9822470326522897,0.0,0.1875920223404278,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.9822470326522897,0.0,0.1875920223404278,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.9822470326522897,0.0,0.1875920223404278,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.30353357597518976,0.9341712129886842,0.18759401130890094,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.30353357597518976,0.9341712129886842,0.18759401130890094,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.30353357597518976,0.9341712129886842,0.18759401130890094,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.7946554628807785,0.5773484504343186,0.18759387541928607,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.7946554628807785,0.5773484504343186,0.18759387541928607,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.7946554628807785,0.5773484504343186,0.18759387541928607,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.49112131432107986,-0.3568183375876391,0.794657491363876,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.49112131432107986,-0.3568183375876391,0.794657491363876,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.49112131432107986,-0.3568183375876391,0.794657491363876,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,-0.1875938387542832,-0.5773436256904565,0.7946589768800388,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.1875938387542832,-0.5773436256904565,0.7946589768800388,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.1875938387542832,-0.5773436256904565,0.7946589768800388,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.6070569201888002,0.0,0.7946583515265467,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.6070569201888002,0.0,0.7946583515265467,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.6070569201888002,0.0,0.7946583515265467,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.18759383875292623,0.5773436256885406,0.794658976881751,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.18759383875292623,0.5773436256885406,0.794658976881751,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,-0.18759383875292623,0.5773436256885406,0.794658976881751,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.49112129523192194,0.3568183237203626,0.794657509388233,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.49112129523192194,0.3568183237203626,0.794657509388233,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.49112129523192194,0.3568183237203626,0.794657509388233,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.39277083954784114,0.6647053901731114,0.6355295523228608,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.39277083954784114,0.6647053901731114,0.6355295523228608,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.39277083954784114,0.6647053901731114,0.6355295523228608,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.23142914359315586,0.16814384664118306,0.9582109362413084,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.23142914359315586,0.16814384664118306,0.9582109362413084,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,0.23142914359315586,0.16814384664118306,0.9582109362413084,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.753547360433901,0.16814471954107602,0.6355263400312792,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.753547360433901,0.16814471954107602,0.6355263400312792,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.753547360433901,0.16814471954107602,0.6355263400312792,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.5108013377780002,0.5789515093717558,0.635529026182417,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.5108013377780002,0.5789515093717558,0.635529026182417,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.5108013377780002,0.5789515093717558,0.635529026182417,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,-0.08839935760178926,0.2720608540734848,0.958211065087644,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.08839935760178926,0.2720608540734848,0.958211065087644,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.08839935760178926,0.2720608540734848,0.958211065087644,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,0.07293921197231296,0.7686236608447644,0.6355293379116738,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,0.07293921197231296,0.7686236608447644,0.6355293379116738,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.07293921197231296,0.7686236608447644,0.6355293379116738,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.7084658042311468,-0.3068886946778563,0.6355277596722553,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.7084658042311468,-0.3068886946778563,0.6355277596722553,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.7084658042311468,-0.3068886946778563,0.6355277596722553,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.28606474884708283,0.0,0.958210289793976,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.28606474884708283,0.0,0.958210289793976,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.28606474884708283,0.0,0.958210289793976,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.708465804230484,0.3068886946789983,0.6355277596724428,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.708465804230484,0.3068886946789983,0.6355277596724428,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.708465804230484,0.3068886946789983,0.6355277596724428,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.07293907981253693,-0.7686236864389787,0.6355293221253091,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,0.07293907981253693,-0.7686236864389787,0.6355293221253091,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,0.07293907981253693,-0.7686236864389787,0.6355293221253091,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.08839938045579887,-0.2720608602432967,0.9582110612274878,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.08839938045579887,-0.2720608602432967,0.9582110612274878,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,-0.08839938045579887,-0.2720608602432967,0.9582110612274878,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.5108013129423995,-0.5789514469236773,0.6355291030325059,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.5108013129423995,-0.5789514469236773,0.6355291030325059,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.5108013129423995,-0.5789514469236773,0.6355291030325059,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.7535473604341476,-0.1681447195414963,0.6355263400308759,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.7535473604341476,-0.1681447195414963,0.6355263400308759,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.7535473604341476,-0.1681447195414963,0.6355263400308759,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,0.23142914432949518,-0.16814383202830113,0.9582109386276887,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.23142914432949518,-0.16814383202830113,0.9582109386276887,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.23142914432949518,-0.16814383202830113,0.9582109386276887,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.39277100439986257,-0.6647053901773582,0.6355294504363187,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.39277100439986257,-0.6647053901773582,0.6355294504363187,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.39277100439986257,-0.6647053901773582,0.6355294504363187,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.7968690849665907,0.5789540848799208,-0.17266102346899806,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.7968690849665907,0.5789540848799208,-0.17266102346899806,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.7968690849665907,0.5789540848799208,-0.17266102346899806,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.8965821692443947,0.2720605719210893,0.3494616702858627,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.8965821692443947,0.2720605719210893,0.3494616702858627,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.8965821692443947,0.2720605719210893,0.3494616702858627,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.535806440050527,0.7686269265317828,0.34946259686937375,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.535806440050527,0.7686269265317828,0.34946259686937375,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.535806440050527,0.7686269265317828,0.34946259686937375,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.30437401847623374,0.9367735492298488,-0.17266086510828546,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.30437401847623374,0.9367735492298488,-0.17266086510828546,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.30437401847623374,0.9367735492298488,-0.17266086510828546,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,0.018308870240782232,0.9367708785687859,0.34946402724167636,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.018308870240782232,0.9367708785687859,0.34946402724167636,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,0.018308870240782232,0.9367708785687859,0.34946402724167636,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.5654358177612575,0.7470993573185782,0.3494637124034841,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.5654358177612575,0.7470993573185782,0.3494637124034841,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.5654358177612575,0.7470993573185782,0.3494637124034841,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9849818442352473,-0.0,-0.17265794660811634,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.9849818442352473,-0.0,-0.17265794660811634,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9849818442352473,-0.0,-0.17265794660811634,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.8852651476838903,0.3068895341634237,0.3494630625934256,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.8852651476838903,0.3068895341634237,0.3494630625934256,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.8852651476838903,0.3068895341634237,0.3494630625934256,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.8852651543182758,-0.3068895218351865,0.34946305661344207,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.8852651543182758,-0.3068895218351865,0.34946305661344207,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.8852651543182758,-0.3068895218351865,0.34946305661344207,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.3043740184762341,-0.9367735492298489,-0.17266086510828474,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.3043740184762341,-0.9367735492298489,-0.17266086510828474,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.3043740184762341,-0.9367735492298489,-0.17266086510828474,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.5654359322761605,-0.7470993573184301,0.34946352711746276,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.5654359322761605,-0.7470993573184301,0.34946352711746276,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.5654359322761605,-0.7470993573184301,0.34946352711746276,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.01830887024078118,-0.9367708785687856,0.3494640272416773,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,0.01830887024078118,-0.9367708785687856,0.3494640272416773,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,0.01830887024078118,-0.9367708785687856,0.3494640272416773,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.7968690273363406,-0.5789541473282623,-0.17266108004828137,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.7968690273363406,-0.5789541473282623,-0.17266108004828137,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.7968690273363406,-0.5789541473282623,-0.17266108004828137,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.5358065214403914,-0.7686268400790313,0.34946266222884337,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.5358065214403914,-0.7686268400790313,0.34946266222884337,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.5358065214403914,-0.7686268400790313,0.34946266222884337,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.896582164193717,-0.27206058113615955,0.3494616760698745,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.896582164193717,-0.27206058113615955,0.3494616760698745,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.896582164193717,-0.27206058113615955,0.3494616760698745,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.018308870240782205,0.9367708785687859,-0.34946402724167613,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,-0.018308870240782205,0.9367708785687859,-0.34946402724167613,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,-0.018308870240782205,0.9367708785687859,-0.34946402724167613,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.30437401847623347,0.9367735492298487,0.17266086510828524,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.30437401847623347,0.9367735492298487,0.17266086510828524,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.30437401847623347,0.9367735492298487,0.17266086510828524,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.5654358177612576,0.7470993573185785,-0.3494637124034841,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.5654358177612576,0.7470993573185785,-0.3494637124034841,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.5654358177612576,0.7470993573185785,-0.3494637124034841,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.8965821692443952,0.2720605719210894,-0.34946167028586195,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.8965821692443952,0.2720605719210894,-0.34946167028586195,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.8965821692443952,0.2720605719210894,-0.34946167028586195,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.7968690849665907,0.5789540848799208,0.17266102346899803,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.7968690849665907,0.5789540848799208,0.17266102346899803,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.7968690849665907,0.5789540848799208,0.17266102346899803,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.5358064400505267,0.7686269265317832,-0.34946259686937364,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.5358064400505267,0.7686269265317832,-0.34946259686937364,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.5358064400505267,0.7686269265317832,-0.34946259686937364,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.535806521440391,-0.7686268400790315,-0.34946266222884337,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.535806521440391,-0.7686268400790315,-0.34946266222884337,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.535806521440391,-0.7686268400790315,-0.34946266222884337,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.7968690273363406,-0.5789541473282624,0.17266108004828132,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.7968690273363406,-0.5789541473282624,0.17266108004828132,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.7968690273363406,-0.5789541473282624,0.17266108004828132,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.8965821641937172,-0.27206058113615966,-0.3494616760698737,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.8965821641937172,-0.27206058113615966,-0.3494616760698737,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.8965821641937172,-0.27206058113615966,-0.3494616760698737,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.5654359322761607,-0.7470993573184304,-0.34946352711746276,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.5654359322761607,-0.7470993573184304,-0.34946352711746276,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.5654359322761607,-0.7470993573184304,-0.34946352711746276,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.30437401847623385,-0.9367735492298487,0.17266086510828454,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.30437401847623385,-0.9367735492298487,0.17266086510828454,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.30437401847623385,-0.9367735492298487,0.17266086510828454,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,-0.01830887024078116,-0.9367708785687855,-0.3494640272416772,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,-0.01830887024078116,-0.9367708785687855,-0.3494640272416772,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.01830887024078116,-0.9367708785687855,-0.3494640272416772,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.8852651476838904,0.30688953416342346,-0.3494630625934258,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.8852651476838904,0.30688953416342346,-0.3494630625934258,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.8852651476838904,0.30688953416342346,-0.3494630625934258,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9849818442352474,0.0,0.17265794660811573,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9849818442352474,0.0,0.17265794660811573,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9849818442352474,0.0,0.17265794660811573,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.8852651543182759,-0.30688952183518625,-0.3494630566134423,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.8852651543182759,-0.30688952183518625,-0.3494630566134423,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.8852651543182759,-0.30688952183518625,-0.3494630566134423,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.08839935760178921,0.2720608540734848,-0.958211065087644,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,0.08839935760178921,0.2720608540734848,-0.958211065087644,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.08839935760178921,0.2720608540734848,-0.958211065087644,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.5108013377780005,0.578951509371756,-0.6355290261824166,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.5108013377780005,0.578951509371756,-0.6355290261824166,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.5108013377780005,0.578951509371756,-0.6355290261824166,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.07293921197231347,0.7686236608447645,-0.6355293379116738,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,-0.07293921197231347,0.7686236608447645,-0.6355293379116738,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,-0.07293921197231347,0.7686236608447645,-0.6355293379116738,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,-0.2314291435931551,0.1681438466411829,-0.9582109362413085,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.2314291435931551,0.1681438466411829,-0.9582109362413085,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.2314291435931551,0.1681438466411829,-0.9582109362413085,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.39277083954784103,0.6647053901731109,-0.6355295523228613,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.39277083954784103,0.6647053901731109,-0.6355295523228613,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.39277083954784103,0.6647053901731109,-0.6355295523228613,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.7535473604339004,0.16814471954107618,-0.6355263400312802,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.7535473604339004,0.16814471954107618,-0.6355263400312802,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.7535473604339004,0.16814471954107618,-0.6355263400312802,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.23142914432949452,-0.168143832028301,-0.9582109386276889,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,-0.23142914432949452,-0.168143832028301,-0.9582109386276889,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.23142914432949452,-0.168143832028301,-0.9582109386276889,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.7535473604341468,-0.16814471954149637,-0.6355263400308768,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.7535473604341468,-0.16814471954149637,-0.6355263400308768,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.7535473604341468,-0.16814471954149637,-0.6355263400308768,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.39277100439986257,-0.6647053901773577,-0.6355294504363193,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.39277100439986257,-0.6647053901773577,-0.6355294504363193,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.39277100439986257,-0.6647053901773577,-0.6355294504363193,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.28606474884708194,0.0,-0.9582102897939762,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.28606474884708194,0.0,-0.9582102897939762,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.28606474884708194,0.0,-0.9582102897939762,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.7084658042304844,0.3068886946789989,-0.6355277596724419,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.7084658042304844,0.3068886946789989,-0.6355277596724419,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.7084658042304844,0.3068886946789989,-0.6355277596724419,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.7084658042311474,-0.3068886946778569,-0.6355277596722544,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.7084658042311474,-0.3068886946778569,-0.6355277596722544,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.7084658042311474,-0.3068886946778569,-0.6355277596722544,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,0.08839938045579884,-0.2720608602432967,-0.9582110612274878,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.08839938045579884,-0.2720608602432967,-0.9582110612274878,
    0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.08839938045579884,-0.2720608602432967,-0.9582110612274878,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,-0.07293907981253746,-0.7686236864389787,-0.6355293221253092,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.07293907981253746,-0.7686236864389787,-0.6355293221253092,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,-0.07293907981253746,-0.7686236864389787,-0.6355293221253092,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.5108013129423997,-0.5789514469236775,-0.6355291030325054,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.5108013129423997,-0.5789514469236775,-0.6355291030325054,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.5108013129423997,-0.5789514469236775,-0.6355291030325054,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.4556801884210278,-0.45302720531155727,-0.7662388120737402,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.4556801884210278,-0.45302720531155727,-0.7662388120737402,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.4556801884210278,-0.45302720531155727,-0.7662388120737402,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.3736135165266664,-0.7056100416852756,-0.6021024907285153,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.3736135165266664,-0.7056100416852756,-0.6021024907285153,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.3736135165266664,-0.7056100416852756,-0.6021024907285153,
    0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.6048673099190088,-0.5626946300326399,-0.563480514945967,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.6048673099190088,-0.5626946300326399,-0.563480514945967,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.6048673099190088,-0.5626946300326399,-0.563480514945967,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.11249635206289342,-0.790453586184493,-0.6021027311519319,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,0.11249635206289342,-0.790453586184493,-0.6021027311519319,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,0.11249635206289342,-0.790453586184493,-0.6021027311519319,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.10236296935915444,-0.634348937053083,-0.7662396808855573,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,-0.10236296935915444,-0.634348937053083,-0.7662396808855573,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.10236296935915444,-0.634348937053083,-0.7662396808855573,
    -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.15859766198666153,-0.8107643536568595,-0.5634784329960992,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.15859766198666153,-0.8107643536568595,-0.5634784329960992,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,-0.15859766198666153,-0.8107643536568595,-0.5634784329960992,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.030193516312269564,-0.41222790039055296,-0.9105803148060565,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,-0.030193516312269564,-0.41222790039055296,-0.9105803148060565,
    0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,-0.030193516312269564,-0.41222790039055296,-0.9105803148060565,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.2667315616493873,-0.3157493036139344,-0.9105803925449936,
    0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.2667315616493873,-0.3157493036139344,-0.9105803925449936,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.2667315616493873,-0.3157493036139344,-0.9105803925449936,
    -0.08942674659491123,0.08942674659491123,-1.0,1.0,0.05243045372163609,-0.16136170037511793,-0.9855016231212377,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.05243045372163609,-0.16136170037511793,-0.9855016231212377,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,0.05243045372163609,-0.16136170037511793,-0.9855016231212377,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.5716702792979942,-0.2933787781117714,-0.7662388559196129,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.5716702792979942,-0.2933787781117714,-0.7662388559196129,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.5716702792979942,-0.2933787781117714,-0.7662388559196129,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.7865295373716213,-0.13727635663558188,-0.6021017262480185,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.7865295373716213,-0.13727635663558188,-0.6021017262480185,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.7865295373716213,-0.13727635663558188,-0.6021017262480185,
    0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.7220727651688029,-0.40137334761281973,-0.5634805743125112,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.7220727651688029,-0.40137334761281973,-0.5634805743125112,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.7220727651688029,-0.40137334761281973,-0.5634805743125112,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.7865295373716089,0.1372763566355817,-0.6021017262480348,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.7865295373716089,0.1372763566355817,-0.6021017262480348,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.7865295373716089,0.1372763566355817,-0.6021017262480348,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.5716703002569032,0.29337878079020263,-0.7662388392572099,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.5716703002569032,0.29337878079020263,-0.7662388392572099,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.5716703002569032,0.29337878079020263,-0.7662388392572099,
    0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.7220727651677648,0.40137334761328575,-0.5634805743135096,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.7220727651677648,0.40137334761328575,-0.5634805743135096,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.7220727651677648,0.40137334761328575,-0.5634805743135096,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.38272124069341656,0.15610136154465032,-0.910580483453274,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.38272124069341656,0.15610136154465032,-0.910580483453274,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.38272124069341656,0.15610136154465032,-0.910580483453274,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.3827212475001285,-0.15610137316785758,-0.9105804785998076,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.3827212475001285,-0.15610137316785758,-0.9105804785998076,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.3827212475001285,-0.15610137316785758,-0.9105804785998076,
    -0.08942674659491123,0.08942674659491123,-1.0,1.0,0.16966523322150937,0.0,-0.9855017547604321,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.16966523322150937,0.0,-0.9855017547604321,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.16966523322150937,0.0,-0.9855017547604321,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.2900434909837939,-0.5733687582967675,-0.7662395450165417,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.2900434909837939,-0.5733687582967675,-0.7662395450165417,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.2900434909837939,-0.5733687582967675,-0.7662395450165417,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.5556259833512646,-0.5733698183711547,-0.6021019996694658,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.5556259833512646,-0.5733698183711547,-0.6021019996694658,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.5556259833512646,-0.5733698183711547,-0.6021019996694658,
    -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.3482411474888479,-0.7491463488592234,-0.5634783502376512,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.3482411474888479,-0.7491463488592234,-0.5634783502376512,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.3482411474888479,-0.7491463488592234,-0.5634783502376512,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.7170079792657081,-0.35124827568421596,-0.6020998310065955,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.7170079792657081,-0.35124827568421596,-0.6020998310065955,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.7170079792657081,-0.35124827568421596,-0.6020998310065955,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.6349390266407596,-0.09866770853416246,-0.7662356789794523,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.6349390266407596,-0.09866770853416246,-0.7662356789794523,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.6349390266407596,-0.09866770853416246,-0.7662356789794523,
    -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.8200745038929086,-0.09972382650385823,-0.5635006357513968,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.8200745038929086,-0.09972382650385823,-0.5635006357513968,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.8200745038929086,-0.09972382650385823,-0.5635006357513968,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.40138618486326477,-0.09866777504353715,-0.9105788273229676,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.40138618486326477,-0.09866777504353715,-0.9105788273229676,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.40138618486326477,-0.09866777504353715,-0.9105788273229676,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.21787243246147198,-0.3512482946875778,-0.9105801659669454,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.21787243246147198,-0.3512482946875778,-0.9105801659669454,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,-0.21787243246147198,-0.3512482946875778,-0.9105801659669454,
    -0.08942674659491123,0.08942674659491123,-1.0,1.0,-0.13726376049162442,-0.09972733209314655,-0.9855014557519847,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,-0.13726376049162442,-0.09972733209314655,-0.9855014557519847,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.13726376049162442,-0.09972733209314655,-0.9855014557519847,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.6349390266407687,0.09866770853401646,-0.7662356789794637,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.6349390266407687,0.09866770853401646,-0.7662356789794637,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.6349390266407687,0.09866770853401646,-0.7662356789794637,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.7170079792643385,0.35124827568689115,-0.6020998310066659,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.7170079792643385,0.35124827568689115,-0.6020998310066659,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.7170079792643385,0.35124827568689115,-0.6020998310066659,
    -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.8200745038929456,0.09972382650341055,-0.5635006357514222,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.8200745038929456,0.09972382650341055,-0.5635006357514222,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.8200745038929456,0.09972382650341055,-0.5635006357514222,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.5556260194438505,0.5733697244076056,-0.6021020558424696,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.5556260194438505,0.5733697244076056,-0.6021020558424696,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.5556260194438505,0.5733697244076056,-0.6021020558424696,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.29004345688710037,0.5733688522583721,-0.7662394876126509,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.29004345688710037,0.5733688522583721,-0.7662394876126509,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.29004345688710037,0.5733688522583721,-0.7662394876126509,
    -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.3482409616935952,0.7491463488573392,-0.563478465065381,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.3482409616935952,0.7491463488573392,-0.563478465065381,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.3482409616935952,0.7491463488573392,-0.563478465065381,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.2178724354453621,0.35124826452696245,-0.9105801768871886,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,-0.2178724354453621,0.35124826452696245,-0.9105801768871886,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.2178724354453621,0.35124826452696245,-0.9105801768871886,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.40138618451518493,0.09866778374700656,-0.9105788265333188,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.40138618451518493,0.09866778374700656,-0.9105788265333188,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.40138618451518493,0.09866778374700656,-0.9105788265333188,
    -0.08942674659491123,0.08942674659491123,-1.0,1.0,-0.13726376036863866,0.09972734098810344,-0.9855014548689939,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.13726376036863866,0.09972734098810344,-0.9855014548689939,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,-0.13726376036863866,0.09972734098810344,-0.9855014548689939,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.1023630609837684,0.6343489989811777,-0.7662396173767128,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.1023630609837684,0.6343489989811777,-0.7662396173767128,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,-0.1023630609837684,0.6343489989811777,-0.7662396173767128,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.1124963520628935,0.7904535861844924,-0.602102731151933,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,0.1124963520628935,0.7904535861844924,-0.602102731151933,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,0.1124963520628935,0.7904535861844924,-0.602102731151933,
    -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.15859768341130098,0.810764268801057,-0.5634785490611477,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,-0.15859768341130098,0.810764268801057,-0.5634785490611477,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.15859768341130098,0.810764268801057,-0.5634785490611477,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.37361364022533977,0.7056100351752889,-0.602102421600759,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.37361364022533977,0.7056100351752889,-0.602102421600759,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.37361364022533977,0.7056100351752889,-0.602102421600759,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.4556802023562997,0.4530272348130372,-0.7662387863441624,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.4556802023562997,0.4530272348130372,-0.7662387863441624,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.4556802023562997,0.4530272348130372,-0.7662387863441624,
    0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.6048672442080645,0.5626947063712658,-0.5634805092511155,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.6048672442080645,0.5626947063712658,-0.5634805092511155,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.6048672442080645,0.5626947063712658,-0.5634805092511155,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.2667315350342877,0.315749297785993,-0.9105804023620896,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.2667315350342877,0.315749297785993,-0.9105804023620896,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.2667315350342877,0.315749297785993,-0.9105804023620896,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.030193527704173675,0.41222786395924527,-0.9105803309210974,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,-0.030193527704173675,0.41222786395924527,-0.9105803309210974,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,-0.030193527704173675,0.41222786395924527,-0.9105803309210974,
    -0.08942674659491123,0.08942674659491123,-1.0,1.0,0.052430445101050945,0.16136171190180873,-0.9855016216925385,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,0.052430445101050945,0.16136171190180873,-0.9855016216925385,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.052430445101050945,0.16136171190180873,-0.9855016216925385,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.8902790375102705,-0.13727627232073927,-0.43423318669524646,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.8902790375102705,-0.13727627232073927,-0.43423318669524646,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.8902790375102705,-0.13727627232073927,-0.43423318669524646,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.9410026579935737,-0.2933790714736124,-0.16864969039494385,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.9410026579935737,-0.2933790714736124,-0.16864969039494385,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.9410026579935737,-0.2933790714736124,-0.16864969039494385,
    0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.8269096225934555,-0.4013733060946441,-0.3938526948200357,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.8269096225934555,-0.4013733060946441,-0.3938526948200357,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.8269096225934555,-0.4013733060946441,-0.3938526948200357,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.9856061035044801,-0.15610228082891986,0.0649052128470842,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9856061035044801,-0.15610228082891986,0.0649052128470842,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9856061035044801,-0.15610228082891986,0.0649052128470842,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.9856061030015378,0.1561022807492629,0.0649052206760001,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9856061030015378,0.1561022807492629,0.0649052206760001,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9856061030015378,0.1561022807492629,0.0649052206760001,
    0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.9573342053980672,-0.0,0.28898307766174003,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9573342053980672,-0.0,0.28898307766174003,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9573342053980672,-0.0,0.28898307766174003,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.9410026557723999,0.29337908242205546,-0.16864968374261155,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.9410026557723999,0.29337908242205546,-0.16864968374261155,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.9410026557723999,0.29337908242205546,-0.16864968374261155,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.8902790348330735,0.13727627240355514,-0.4342331921579418,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.8902790348330735,0.13727627240355514,-0.4342331921579418,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.8902790348330735,0.13727627240355514,-0.4342331921579418,
    0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.8269096225925395,0.4013733060952317,-0.3938526948213602,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.8269096225925395,0.4013733060952317,-0.3938526948213602,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.8269096225925395,0.4013733060952317,-0.3938526948213602,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.1445571334445321,-0.8891249105991275,-0.4342351074272938,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.1445571334445321,-0.8891249105991275,-0.4342351074272938,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,0.1445571334445321,-0.8891249105991275,-0.4342351074272938,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,0.011764727228162504,-0.9856057285447228,-0.16865034554685346,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,0.011764727228162504,-0.9856057285447228,-0.16865034554685346,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.011764727228162504,-0.9856057285447228,-0.16865034554685346,
    -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.1262013834435303,-0.9104677303474127,-0.3938549514897206,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,-0.1262013834435303,-0.9104677303474127,-0.3938549514897206,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.1262013834435303,-0.9104677303474127,-0.3938549514897206,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,0.1561046864437102,-0.985605751969338,0.06490476527395082,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.1561046864437102,-0.985605751969338,0.06490476527395082,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.1561046864437102,-0.985605751969338,0.06490476527395082,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.4530336513178341,-0.8891275915425783,0.0649048282589597,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.4530336513178341,-0.8891275915425783,0.0649048282589597,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.4530336513178341,-0.8891275915425783,0.0649048282589597,
    0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.295826750452272,-0.9104677767205127,0.2890241534378325,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.295826750452272,-0.9104677767205127,0.2890241534378325,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.295826750452272,-0.9104677767205127,0.2890241534378325,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.5698107195795923,-0.8042839992138734,-0.1686505038851809,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.5698107195795923,-0.8042839992138734,-0.1686505038851809,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.5698107195795923,-0.8042839992138734,-0.1686505038851809,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.40567420298669166,-0.8042813632252391,-0.43423487860795257,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.40567420298669166,-0.8042813632252391,-0.43423487860795257,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.40567420298669166,-0.8042813632252391,-0.43423487860795257,
    0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.6372639607508351,-0.6623999850829347,-0.39385391211753373,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.6372639607508351,-0.6623999850829347,-0.39385391211753373,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.6372639607508351,-0.6623999850829347,-0.39385391211753373,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.8009411223662419,-0.41223065105961343,-0.434234048445849,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.8009411223662419,-0.41223065105961343,-0.434234048445849,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.8009411223662419,-0.41223065105961343,-0.434234048445849,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.9337331376183107,-0.31575244801226804,-0.16864999047650403,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.9337331376183107,-0.31575244801226804,-0.16864999047650403,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.9337331376183107,-0.31575244801226804,-0.16864999047650403,
    -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.9049059478911285,-0.1613589781678624,-0.3938381718877458,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.9049059478911285,-0.1613589781678624,-0.3938381718877458,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.9049059478911285,-0.1613589781678624,-0.3938381718877458,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.8891293781902415,-0.453030240817418,0.0649041581406515,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.8891293781902415,-0.453030240817418,0.0649041581406515,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.8891293781902415,-0.453030240817418,0.0649041581406515,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.7056169875642115,-0.7056147471288743,0.0649037402239831,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.7056169875642115,-0.7056147471288743,0.0649037402239831,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.7056169875642115,-0.7056147471288743,0.0649037402239831,
    -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.7744929412069025,-0.5626970574800776,0.2890202510620039,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.7744929412069025,-0.5626970574800776,0.2890202510620039,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.7744929412069025,-0.5626970574800776,0.2890202510620039,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.5888393715456425,-0.7904587170290158,-0.16865115235472017,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.5888393715456425,-0.7904587170290158,-0.16865115235472017,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.5888393715456425,-0.7904587170290158,-0.16865115235472017,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.6395598605847257,-0.6343526933842694,-0.43423478110921676,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.6395598605847257,-0.6343526933842694,-0.43423478110921676,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.6395598605847257,-0.6343526933842694,-0.43423478110921676,
    -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.43305286287212297,-0.8107669263659469,-0.39385556879314715,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.43305286287212297,-0.8107669263659469,-0.39385556879314715,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.43305286287212297,-0.8107669263659469,-0.39385556879314715,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.6395599174302818,0.6343526036081132,-0.43423482853426115,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.6395599174302818,0.6343526036081132,-0.43423482853426115,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.6395599174302818,0.6343526036081132,-0.43423482853426115,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.5888392828155132,0.790458798422897,-0.1686510806640205,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.5888392828155132,0.790458798422897,-0.1686510806640205,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.5888392828155132,0.790458798422897,-0.1686510806640205,
    -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.43305276864121595,0.8107670112207223,-0.39385549772523787,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.43305276864121595,0.8107670112207223,-0.39385549772523787,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.43305276864121595,0.8107670112207223,-0.39385549772523787,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.7056169940736836,0.7056147536395789,0.06490359867199426,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.7056169940736836,0.7056147536395789,0.06490359867199426,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.7056169940736836,0.7056147536395789,0.06490359867199426,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.8891293781905673,0.45303024081694554,0.06490415813948672,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.8891293781905673,0.45303024081694554,0.06490415813948672,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.8891293781905673,0.45303024081694554,0.06490415813948672,
    -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.7744929756870417,0.5626969811415766,0.28902030728927613,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.7744929756870417,0.5626969811415766,0.28902030728927613,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.7744929756870417,0.5626969811415766,0.28902030728927613,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.9337331410506727,0.31575243415701776,-0.16864999741346762,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.9337331410506727,0.31575243415701776,-0.16864999741346762,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9337331410506727,0.31575243415701776,-0.16864999741346762,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.8009411223638105,0.4122306510621237,-0.4342340484479505,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.8009411223638105,0.4122306510621237,-0.4342340484479505,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.8009411223638105,0.4122306510621237,-0.4342340484479505,
    -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.9049059503270416,0.1613589802965544,-0.39383816541870337,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9049059503270416,0.1613589802965544,-0.39383816541870337,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.9049059503270416,0.1613589802965544,-0.39383816541870337,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.40567431596737213,0.8042812695824455,-0.4342349465016079,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.40567431596737213,0.8042812695824455,-0.4342349465016079,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.40567431596737213,0.8042812695824455,-0.4342349465016079,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.5698106083247312,0.8042840928568619,-0.16865043319841977,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.5698106083247312,0.8042840928568619,-0.16865043319841977,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.5698106083247312,0.8042840928568619,-0.16865043319841977,
    0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.6372638592193767,0.6623999850826678,-0.3938540763979827,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.6372638592193767,0.6623999850826678,-0.3938540763979827,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.6372638592193767,0.6623999850826678,-0.3938540763979827,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.4530336513178344,0.8891275915425781,0.06490482825895993,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.4530336513178344,0.8891275915425781,0.06490482825895993,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.4530336513178344,0.8891275915425781,0.06490482825895993,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,0.15610468644371014,0.9856057519693379,0.06490476527395184,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.15610468644371014,0.9856057519693379,0.06490476527395184,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.15610468644371014,0.9856057519693379,0.06490476527395184,
    0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.29582675045227164,0.9104677767205127,0.2890241534378327,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.29582675045227164,0.9104677767205127,0.2890241534378327,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.29582675045227164,0.9104677767205127,0.2890241534378327,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,0.011764727228161192,0.9856057285447228,-0.16865034554685368,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.011764727228161192,0.9856057285447228,-0.16865034554685368,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,0.011764727228161192,0.9856057285447228,-0.16865034554685368,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.14455713344453255,0.8891249105991275,-0.43423510742729354,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,0.14455713344453255,0.8891249105991275,-0.43423510742729354,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.14455713344453255,0.8891249105991275,-0.43423510742729354,
    -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.12620138344353177,0.9104677303474128,-0.3938549514897198,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.12620138344353177,0.9104677303474128,-0.3938549514897198,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,-0.12620138344353177,0.9104677303474128,-0.3938549514897198,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.9337331376183107,-0.3157524480122681,0.16864999047650445,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9337331376183107,-0.3157524480122681,0.16864999047650445,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.9337331376183107,-0.3157524480122681,0.16864999047650445,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.8009411223662424,-0.4122306510596123,0.43423404844584906,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.8009411223662424,-0.4122306510596123,0.43423404844584906,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.8009411223662424,-0.4122306510596123,0.43423404844584906,
    0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.9049059478911281,-0.16135897816786288,0.3938381718877464,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.9049059478911281,-0.16135897816786288,0.3938381718877464,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9049059478911281,-0.16135897816786288,0.3938381718877464,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.6395598605847254,-0.63435269338427,0.43423478110921626,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.6395598605847254,-0.63435269338427,0.43423478110921626,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.6395598605847254,-0.63435269338427,0.43423478110921626,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.5888393715456428,-0.7904587170290155,0.16865115235472064,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.5888393715456428,-0.7904587170290155,0.16865115235472064,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.5888393715456428,-0.7904587170290155,0.16865115235472064,
    0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.43305286287212336,-0.8107669263659466,0.39385556879314715,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.43305286287212336,-0.8107669263659466,0.39385556879314715,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.43305286287212336,-0.8107669263659466,0.39385556879314715,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.7056169875642118,-0.7056147471288738,-0.06490374022398354,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.7056169875642118,-0.7056147471288738,-0.06490374022398354,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.7056169875642118,-0.7056147471288738,-0.06490374022398354,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.8891293781902413,-0.45303024081741866,-0.06490415814065198,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.8891293781902413,-0.45303024081741866,-0.06490415814065198,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.8891293781902413,-0.45303024081741866,-0.06490415814065198,
    0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.774492941206902,-0.5626970574800776,-0.28902025106200485,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.774492941206902,-0.5626970574800776,-0.28902025106200485,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.774492941206902,-0.5626970574800776,-0.28902025106200485,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,-0.011764727228162521,-0.9856057285447228,0.1686503455468534,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,-0.011764727228162521,-0.9856057285447228,0.1686503455468534,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.011764727228162521,-0.9856057285447228,0.1686503455468534,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.144557133444532,-0.8891249105991275,0.4342351074272939,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.144557133444532,-0.8891249105991275,0.4342351074272939,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,-0.144557133444532,-0.8891249105991275,0.4342351074272939,
    0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.12620138344352988,-0.9104677303474127,0.3938549514897206,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,0.12620138344352988,-0.9104677303474127,0.3938549514897206,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.12620138344352988,-0.9104677303474127,0.3938549514897206,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.4056742029866914,-0.8042813632252392,0.4342348786079527,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.4056742029866914,-0.8042813632252392,0.4342348786079527,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.4056742029866914,-0.8042813632252392,0.4342348786079527,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.5698107195795922,-0.8042839992138735,0.16865050388518024,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.5698107195795922,-0.8042839992138735,0.16865050388518024,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.5698107195795922,-0.8042839992138735,0.16865050388518024,
    -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.6372639607508346,-0.6623999850829355,0.3938539121175335,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.6372639607508346,-0.6623999850829355,0.3938539121175335,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.6372639607508346,-0.6623999850829355,0.3938539121175335,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.45303365131783446,-0.8891275915425783,-0.06490482825895973,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.45303365131783446,-0.8891275915425783,-0.06490482825895973,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.45303365131783446,-0.8891275915425783,-0.06490482825895973,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,-0.1561046864437102,-0.9856057519693381,-0.06490476527395087,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.1561046864437102,-0.9856057519693381,-0.06490476527395087,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.1561046864437102,-0.9856057519693381,-0.06490476527395087,
    -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.29582675045227214,-0.9104677767205126,-0.2890241534378327,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.29582675045227214,-0.9104677767205126,-0.2890241534378327,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.29582675045227214,-0.9104677767205126,-0.2890241534378327,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.9410026579935737,-0.29337907147361264,0.1686496903949428,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.9410026579935737,-0.29337907147361264,0.1686496903949428,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.9410026579935737,-0.29337907147361264,0.1686496903949428,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.8902790375102706,-0.13727627232073963,0.43423318669524613,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.8902790375102706,-0.13727627232073963,0.43423318669524613,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.8902790375102706,-0.13727627232073963,0.43423318669524613,
    -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.8269096225934561,-0.40137330609464344,0.3938526948200351,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.8269096225934561,-0.40137330609464344,0.3938526948200351,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.8269096225934561,-0.40137330609464344,0.3938526948200351,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.8902790348330736,0.13727627240355553,0.43423319215794154,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.8902790348330736,0.13727627240355553,0.43423319215794154,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.8902790348330736,0.13727627240355553,0.43423319215794154,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.9410026557724,0.2933790824220556,0.1686496837426105,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.9410026557724,0.2933790824220556,0.1686496837426105,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.9410026557724,0.2933790824220556,0.1686496837426105,
    -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.8269096225925401,0.40137330609523086,0.3938526948213595,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.8269096225925401,0.40137330609523086,0.3938526948213595,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.8269096225925401,0.40137330609523086,0.3938526948213595,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.9856061030015377,0.1561022807492637,-0.06490522067600012,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9856061030015377,0.1561022807492637,-0.06490522067600012,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9856061030015377,0.1561022807492637,-0.06490522067600012,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.98560610350448,-0.1561022808289206,-0.06490521284708418,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.98560610350448,-0.1561022808289206,-0.06490521284708418,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.98560610350448,-0.1561022808289206,-0.06490521284708418,
    -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.9573342053980672,0.0,-0.28898307766173964,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.9573342053980672,0.0,-0.28898307766173964,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9573342053980672,0.0,-0.28898307766173964,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.5698106083247311,0.804284092856862,0.16865043319841913,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.5698106083247311,0.804284092856862,0.16865043319841913,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.5698106083247311,0.804284092856862,0.16865043319841913,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.40567431596737197,0.8042812695824456,0.43423494650160793,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.40567431596737197,0.8042812695824456,0.43423494650160793,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.40567431596737197,0.8042812695824456,0.43423494650160793,
    -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.637263859219376,0.6623999850826685,0.3938540763979824,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.637263859219376,0.6623999850826685,0.3938540763979824,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.637263859219376,0.6623999850826685,0.3938540763979824,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.1445571334445324,0.8891249105991275,0.4342351074272937,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,-0.1445571334445324,0.8891249105991275,0.4342351074272937,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.1445571334445324,0.8891249105991275,0.4342351074272937,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,-0.011764727228161208,0.9856057285447228,0.16865034554685363,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.011764727228161208,0.9856057285447228,0.16865034554685363,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,-0.011764727228161208,0.9856057285447228,0.16865034554685363,
    0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.12620138344353132,0.9104677303474129,0.39385495148971983,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.12620138344353132,0.9104677303474129,0.39385495148971983,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,0.12620138344353132,0.9104677303474129,0.39385495148971983,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,-0.15610468644371017,0.985605751969338,-0.06490476527395188,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.15610468644371017,0.985605751969338,-0.06490476527395188,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.15610468644371017,0.985605751969338,-0.06490476527395188,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.4530336513178348,0.889127591542578,-0.06490482825895996,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.4530336513178348,0.889127591542578,-0.06490482825895996,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.4530336513178348,0.889127591542578,-0.06490482825895996,
    -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.29582675045227175,0.9104677767205126,-0.289024153437833,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.29582675045227175,0.9104677767205126,-0.289024153437833,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.29582675045227175,0.9104677767205126,-0.289024153437833,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.5888392828155135,0.7904587984228967,0.16865108066402096,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.5888392828155135,0.7904587984228967,0.16865108066402096,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.5888392828155135,0.7904587984228967,0.16865108066402096,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.6395599174302816,0.6343526036081139,0.43423482853426054,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.6395599174302816,0.6343526036081139,0.43423482853426054,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.6395599174302816,0.6343526036081139,0.43423482853426054,
    0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.43305276864121645,0.8107670112207219,0.393855497725238,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.43305276864121645,0.8107670112207219,0.393855497725238,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.43305276864121645,0.8107670112207219,0.393855497725238,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.8009411223638112,0.4122306510621225,0.4342340484479506,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.8009411223638112,0.4122306510621225,0.4342340484479506,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.8009411223638112,0.4122306510621225,0.4342340484479506,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.9337331410506727,0.3157524341570177,0.16864999741346798,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.9337331410506727,0.3157524341570177,0.16864999741346798,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9337331410506727,0.3157524341570177,0.16864999741346798,
    0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.9049059503270411,0.161358980296555,0.3938381654187039,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9049059503270411,0.161358980296555,0.3938381654187039,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.9049059503270411,0.161358980296555,0.3938381654187039,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.8891293781905669,0.45303024081694615,-0.06490415813948722,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.8891293781905669,0.45303024081694615,-0.06490415813948722,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.8891293781905669,0.45303024081694615,-0.06490415813948722,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.7056169940736841,0.7056147536395786,-0.06490359867199468,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.7056169940736841,0.7056147536395786,-0.06490359867199468,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.7056169940736841,0.7056147536395786,-0.06490359867199468,
    0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.7744929756870413,0.5626969811415766,-0.2890203072892772,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.7744929756870413,0.5626969811415766,-0.2890203072892772,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.7744929756870413,0.5626969811415766,-0.2890203072892772,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.5556259833512643,-0.5733698183711554,0.6021019996694653,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.5556259833512643,-0.5733698183711554,0.6021019996694653,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.5556259833512643,-0.5733698183711554,0.6021019996694653,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.29004349098379356,-0.5733687582967675,0.7662395450165418,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.29004349098379356,-0.5733687582967675,0.7662395450165418,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.29004349098379356,-0.5733687582967675,0.7662395450165418,
    0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.3482411474888483,-0.7491463488592232,0.5634783502376516,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.3482411474888483,-0.7491463488592232,0.5634783502376516,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.3482411474888483,-0.7491463488592232,0.5634783502376516,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.21787243246147264,-0.35124829468757784,0.9105801659669451,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.21787243246147264,-0.35124829468757784,0.9105801659669451,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,0.21787243246147264,-0.35124829468757784,0.9105801659669451,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.40138618486326494,-0.0986677750435375,0.9105788273229676,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.40138618486326494,-0.0986677750435375,0.9105788273229676,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.40138618486326494,-0.0986677750435375,0.9105788273229676,
    -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,0.13726376049162398,-0.0997273320931458,0.985501455751985,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,0.13726376049162398,-0.0997273320931458,0.985501455751985,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.13726376049162398,-0.0997273320931458,0.985501455751985,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.6349390266407596,-0.0986677085341618,0.7662356789794524,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.6349390266407596,-0.0986677085341618,0.7662356789794524,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.6349390266407596,-0.0986677085341618,0.7662356789794524,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.717007979265709,-0.3512482756842151,0.6020998310065948,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.717007979265709,-0.3512482756842151,0.6020998310065948,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.717007979265709,-0.3512482756842151,0.6020998310065948,
    0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.8200745038929085,-0.09972382650385908,0.5635006357513968,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.8200745038929085,-0.09972382650385908,0.5635006357513968,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.8200745038929085,-0.09972382650385908,0.5635006357513968,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.373613516526666,-0.7056100416852755,0.6021024907285157,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.373613516526666,-0.7056100416852755,0.6021024907285157,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.373613516526666,-0.7056100416852755,0.6021024907285157,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.45568018842102764,-0.45302720531155777,0.7662388120737401,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.45568018842102764,-0.45302720531155777,0.7662388120737401,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.45568018842102764,-0.45302720531155777,0.7662388120737401,
    -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.6048673099190082,-0.56269463003264,0.5634805149459678,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.6048673099190082,-0.56269463003264,0.5634805149459678,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.6048673099190082,-0.56269463003264,0.5634805149459678,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.2667315616493877,-0.3157493036139345,0.9105803925449935,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.2667315616493877,-0.3157493036139345,0.9105803925449935,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.2667315616493877,-0.3157493036139345,0.9105803925449935,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.030193516312269852,-0.4122279003905533,0.9105803148060564,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,0.030193516312269852,-0.4122279003905533,0.9105803148060564,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,0.030193516312269852,-0.4122279003905533,0.9105803148060564,
    -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,-0.05243045372163579,-0.161361700375117,0.9855016231212379,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.05243045372163579,-0.161361700375117,0.9855016231212379,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,-0.05243045372163579,-0.161361700375117,0.9855016231212379,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.10236296935915389,-0.634348937053083,0.7662396808855574,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,0.10236296935915389,-0.634348937053083,0.7662396808855574,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.10236296935915389,-0.634348937053083,0.7662396808855574,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.11249635206289318,-0.7904535861844931,0.602102731151932,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,-0.11249635206289318,-0.7904535861844931,0.602102731151932,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,-0.11249635206289318,-0.7904535861844931,0.602102731151932,
    0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.158597661986661,-0.8107643536568595,0.5634784329960995,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.158597661986661,-0.8107643536568595,0.5634784329960995,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,0.158597661986661,-0.8107643536568595,0.5634784329960995,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.786529537371608,0.13727635663558196,0.6021017262480359,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.786529537371608,0.13727635663558196,0.6021017262480359,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.786529537371608,0.13727635663558196,0.6021017262480359,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.5716703002569036,0.29337878079020213,0.7662388392572097,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.5716703002569036,0.29337878079020213,0.7662388392572097,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.5716703002569036,0.29337878079020213,0.7662388392572097,
    -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.7220727651677643,0.4013733476132851,0.5634805743135106,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.7220727651677643,0.4013733476132851,0.5634805743135106,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.7220727651677643,0.4013733476132851,0.5634805743135106,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.3827212406934171,0.15610136154465007,0.9105804834532737,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.3827212406934171,0.15610136154465007,0.9105804834532737,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.3827212406934171,0.15610136154465007,0.9105804834532737,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.38272124750012904,-0.15610137316785738,0.9105804785998074,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.38272124750012904,-0.15610137316785738,0.9105804785998074,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.38272124750012904,-0.15610137316785738,0.9105804785998074,
    -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,-0.16966523322150842,0.0,0.9855017547604323,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.16966523322150842,0.0,0.9855017547604323,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.16966523322150842,0.0,0.9855017547604323,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.5716702792979945,-0.29337877811177093,0.7662388559196127,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.5716702792979945,-0.29337877811177093,0.7662388559196127,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.5716702792979945,-0.29337877811177093,0.7662388559196127,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.7865295373716205,-0.1372763566355822,0.6021017262480196,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.7865295373716205,-0.1372763566355822,0.6021017262480196,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.7865295373716205,-0.1372763566355822,0.6021017262480196,
    -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.7220727651688026,-0.40137334761281906,0.563480574312512,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.7220727651688026,-0.40137334761281906,0.563480574312512,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.7220727651688026,-0.40137334761281906,0.563480574312512,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.11249635206289327,0.7904535861844922,0.6021027311519331,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,-0.11249635206289327,0.7904535861844922,0.6021027311519331,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,-0.11249635206289327,0.7904535861844922,0.6021027311519331,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.10236306098376788,0.6343489989811777,0.7662396173767129,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.10236306098376788,0.6343489989811777,0.7662396173767129,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,0.10236306098376788,0.6343489989811777,0.7662396173767129,
    0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.1585976834113004,0.810764268801057,0.5634785490611477,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,0.1585976834113004,0.810764268801057,0.5634785490611477,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.1585976834113004,0.810764268801057,0.5634785490611477,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.03019352770417396,0.41222786395924554,0.9105803309210972,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,0.03019352770417396,0.41222786395924554,0.9105803309210972,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,0.03019352770417396,0.41222786395924554,0.9105803309210972,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.26673153503428815,0.31574929778599303,0.9105804023620895,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.26673153503428815,0.31574929778599303,0.9105804023620895,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.26673153503428815,0.31574929778599303,0.9105804023620895,
    -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,-0.05243044510105064,0.16136171190180773,0.9855016216925386,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,-0.05243044510105064,0.16136171190180773,0.9855016216925386,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.05243044510105064,0.16136171190180773,0.9855016216925386,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.4556802023562995,0.4530272348130376,0.7662387863441623,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.4556802023562995,0.4530272348130376,0.7662387863441623,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.4556802023562995,0.4530272348130376,0.7662387863441623,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.3736136402253394,0.7056100351752885,0.6021024216007594,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.3736136402253394,0.7056100351752885,0.6021024216007594,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.3736136402253394,0.7056100351752885,0.6021024216007594,
    -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.6048672442080638,0.562694706371266,0.5634805092511163,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.6048672442080638,0.562694706371266,0.5634805092511163,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.6048672442080638,0.562694706371266,0.5634805092511163,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.7170079792643393,0.3512482756868904,0.6020998310066653,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.7170079792643393,0.3512482756868904,0.6020998310066653,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.7170079792643393,0.3512482756868904,0.6020998310066653,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.6349390266407688,0.09866770853401576,0.7662356789794635,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.6349390266407688,0.09866770853401576,0.7662356789794635,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.6349390266407688,0.09866770853401576,0.7662356789794635,
    0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.8200745038929455,0.0997238265034114,0.5635006357514222,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.8200745038929455,0.0997238265034114,0.5635006357514222,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.8200745038929455,0.0997238265034114,0.5635006357514222,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.4013861845151851,0.09866778374700691,0.9105788265333187,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.4013861845151851,0.09866778374700691,0.9105788265333187,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.4013861845151851,0.09866778374700691,0.9105788265333187,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.21787243544536275,0.35124826452696245,0.9105801768871884,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,0.21787243544536275,0.35124826452696245,0.9105801768871884,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.21787243544536275,0.35124826452696245,0.9105801768871884,
    -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,0.13726376036863816,0.09972734098810271,0.9855014548689939,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.13726376036863816,0.09972734098810271,0.9855014548689939,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,0.13726376036863816,0.09972734098810271,0.9855014548689939,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.2900434568871001,0.5733688522583722,0.7662394876126509,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.2900434568871001,0.5733688522583722,0.7662394876126509,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.2900434568871001,0.5733688522583722,0.7662394876126509,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.5556260194438501,0.5733697244076063,0.6021020558424691,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.5556260194438501,0.5733697244076063,0.6021020558424691,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.5556260194438501,0.5733697244076063,0.6021020558424691,
    0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.3482409616935957,0.7491463488573389,0.5634784650653812,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.3482409616935957,0.7491463488573389,0.5634784650653812,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.3482409616935957,0.7491463488573389,0.5634784650653812,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.3337976901239209,0.4349849838050999,0.8362817503282085,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.3337976901239209,0.4349849838050999,0.8362817503282085,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.3337976901239209,0.4349849838050999,0.8362817503282085,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.5168458529709208,0.18304579180754743,0.8362802176114829,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.5168458529709208,0.18304579180754743,0.8362802176114829,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.5168458529709208,0.18304579180754743,0.8362802176114829,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.5987063332641229,0.43498543079189117,0.6725610764147907,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.5987063332641229,0.43498543079189117,0.6725610764147907,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.5987063332641229,0.43498543079189117,0.6725610764147907,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.3105465803904405,0.45187809786617095,0.836281654753143,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.3105465803904405,0.45187809786617095,0.836281654753143,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.3105465803904405,0.45187809786617095,0.836281654753143,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,-0.014375025187359633,0.54811137916339,0.836281815348432,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,-0.014375025187359633,0.54811137916339,0.836281815348432,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.014375025187359633,0.54811137916339,0.836281815348432,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.22868908812893668,0.7038198371342455,0.6725614751285416,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.22868908812893668,0.7038198371342455,0.6725614751285416,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,-0.22868908812893668,0.7038198371342455,0.6725614751285416,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.5257288496935327,-0.15570515706632634,0.8362805035769193,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.5257288496935327,-0.15570515706632634,0.8362805035769193,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.5257288496935327,-0.15570515706632634,0.8362805035769193,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.5257288565113238,0.15570514544984565,0.8362805014537518,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.5257288565113238,0.15570514544984565,0.8362805014537518,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.5257288565113238,0.15570514544984565,0.8362805014537518,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.7400431604567386,0.0,0.6725593807696104,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.7400431604567386,0.0,0.6725593807696104,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.7400431604567386,0.0,0.6725593807696104,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,-0.014375025183341017,-0.5481113791642288,0.8362818153479515,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.014375025183341017,-0.5481113791642288,0.8362818153479515,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,-0.014375025183341017,-0.5481113791642288,0.8362818153479515,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.31054660634034525,-0.45187806863117713,0.8362816609137449,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.31054660634034525,-0.45187806863117713,0.8362816609137449,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.31054660634034525,-0.45187806863117713,0.8362816609137449,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.22868908812963912,-0.7038198371336519,0.6725614751289236,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,-0.22868908812963912,-0.7038198371336519,0.6725614751289236,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.22868908812963912,-0.7038198371336519,0.6725614751289236,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.5168458649633569,-0.18304578392835724,0.8362802119244079,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.5168458649633569,-0.18304578392835724,0.8362802119244079,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.5168458649633569,-0.18304578392835724,0.8362802119244079,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.33379768111941355,-0.4349850166946444,0.8362817368150892,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.33379768111941355,-0.4349850166946444,0.8362817368150892,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.33379768111941355,-0.4349850166946444,0.8362817368150892,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.598706333264664,-0.4349854307896837,0.6725610764157365,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.598706333264664,-0.4349854307896837,0.6725610764157365,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.598706333264664,-0.4349854307896837,0.6725610764157365,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.8868726411103974,0.45188038550008525,0.09623427482016117,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.8868726411103974,0.45188038550008525,0.09623427482016117,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.8868726411103974,0.45188038550008525,0.09623427482016117,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.7544176076440144,0.5481140659055463,0.36114407655833464,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.7544176076440144,0.5481140659055463,0.36114407655833464,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.7544176076440144,0.5481140659055463,0.36114407655833464,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.703826009734567,0.7038237749870908,0.09623430668965156,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.703826009734567,0.7038237749870908,0.09623430668965156,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.703826009734567,0.7038237749870908,0.09623430668965156,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,-0.1557084584099035,0.9831040677591577,0.09623548168429935,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.1557084584099035,0.9831040677591577,0.09623548168429935,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.1557084584099035,0.9831040677591577,0.09623548168429935,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.28816388988226643,0.8868681304880176,0.3611460808213343,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.28816388988226643,0.8868681304880176,0.3611460808213343,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.28816388988226643,0.8868681304880176,0.3611460808213343,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.45188374182885493,0.8868707696675265,0.09623576144075277,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.45188374182885493,0.8868707696675265,0.09623576144075277,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.45188374182885493,0.8868707696675265,0.09623576144075277,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.9831043836297442,0.1557060533937894,0.09623614614328184,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9831043836297442,0.1557060533937894,0.09623614614328184,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.9831043836297442,0.1557060533937894,0.09623614614328184,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.9325093417933523,0.0,0.361145853455538,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.9325093417933523,0.0,0.361145853455538,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.9325093417933523,0.0,0.361145853455538,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.9831043830057655,-0.15570605329496234,0.0962361526774606,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.9831043830057655,-0.15570605329496234,0.0962361526774606,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9831043830057655,-0.15570605329496234,0.0962361526774606,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.45188374182885466,-0.8868707696675268,0.09623576144075378,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.45188374182885466,-0.8868707696675268,0.09623576144075378,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.45188374182885466,-0.8868707696675268,0.09623576144075378,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.2881638898822667,-0.8868681304880176,0.3611460808213341,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.2881638898822667,-0.8868681304880176,0.3611460808213341,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.2881638898822667,-0.8868681304880176,0.3611460808213341,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,-0.1557084584099035,-0.9831040677591577,0.0962354816842998,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.1557084584099035,-0.9831040677591577,0.0962354816842998,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.1557084584099035,-0.9831040677591577,0.0962354816842998,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.7038260016581754,-0.7038237669094751,0.09623442483448079,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.7038260016581754,-0.7038237669094751,0.09623442483448079,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.7038260016581754,-0.7038237669094751,0.09623442483448079,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.7544175752367749,-0.5481141400040827,0.36114403179541826,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.7544175752367749,-0.5481141400040827,0.36114403179541826,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.7544175752367749,-0.5481141400040827,0.36114403179541826,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.886872641109946,-0.45188038550049187,0.09623427482241326,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.886872641109946,-0.45188038550049187,0.09623427482241326,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.886872641109946,-0.45188038550049187,0.09623427482241326,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,0.15570845840990344,0.9831040677591575,-0.09623548168429938,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.15570845840990344,0.9831040677591575,-0.09623548168429938,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.15570845840990344,0.9831040677591575,-0.09623548168429938,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.45188374182885466,0.8868707696675268,-0.09623576144075305,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.45188374182885466,0.8868707696675268,-0.09623576144075305,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.45188374182885466,0.8868707696675268,-0.09623576144075305,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.28816388988226643,0.8868681304880176,-0.36114608082133426,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.28816388988226643,0.8868681304880176,-0.36114608082133426,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.28816388988226643,0.8868681304880176,-0.36114608082133426,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.8868726411103979,0.45188038550008464,-0.09623427482016111,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.8868726411103979,0.45188038550008464,-0.09623427482016111,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.8868726411103979,0.45188038550008464,-0.09623427482016111,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.7038260097345667,0.7038237749870914,-0.09623430668965094,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.7038260097345667,0.7038237749870914,-0.09623430668965094,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.7038260097345667,0.7038237749870914,-0.09623430668965094,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.7544176076440146,0.5481140659055457,-0.3611440765583354,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.7544176076440146,0.5481140659055457,-0.3611440765583354,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.7544176076440146,0.5481140659055457,-0.3611440765583354,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.703826001658175,-0.7038237669094755,-0.09623442483448011,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.703826001658175,-0.7038237669094755,-0.09623442483448011,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.703826001658175,-0.7038237669094755,-0.09623442483448011,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.8868726411099463,-0.45188038550049126,-0.09623427482241323,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.8868726411099463,-0.45188038550049126,-0.09623427482241323,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.8868726411099463,-0.45188038550049126,-0.09623427482241323,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.754417575236775,-0.548114140004082,-0.36114403179541904,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.754417575236775,-0.548114140004082,-0.36114403179541904,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.754417575236775,-0.548114140004082,-0.36114403179541904,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.45188374182885427,-0.8868707696675268,-0.09623576144075405,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.45188374182885427,-0.8868707696675268,-0.09623576144075405,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.45188374182885427,-0.8868707696675268,-0.09623576144075405,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,0.1557084584099035,-0.9831040677591575,-0.09623548168429982,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.1557084584099035,-0.9831040677591575,-0.09623548168429982,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.1557084584099035,-0.9831040677591575,-0.09623548168429982,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.2881638898822667,-0.8868681304880176,-0.361146080821334,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.2881638898822667,-0.8868681304880176,-0.361146080821334,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.2881638898822667,-0.8868681304880176,-0.361146080821334,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.9831043836297443,0.15570605339378868,-0.09623614614328271,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9831043836297443,0.15570605339378868,-0.09623614614328271,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.9831043836297443,0.15570605339378868,-0.09623614614328271,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.9831043830057655,-0.1557060532949616,-0.09623615267746147,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.9831043830057655,-0.1557060532949616,-0.09623615267746147,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9831043830057655,-0.1557060532949616,-0.09623615267746147,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.932509341793352,0.0,-0.3611458534555385,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.932509341793352,0.0,-0.3611458534555385,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.932509341793352,0.0,-0.3611458534555385,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.31054658039044,0.4518780978661704,-0.8362816547531434,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.31054658039044,0.4518780978661704,-0.8362816547531434,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.31054658039044,0.4518780978661704,-0.8362816547531434,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.22868908812893654,0.7038198371342458,-0.6725614751285413,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.22868908812893654,0.7038198371342458,-0.6725614751285413,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,0.22868908812893654,0.7038198371342458,-0.6725614751285413,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,0.014375025187359785,0.5481113791633897,-0.8362818153484325,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,0.014375025187359785,0.5481113791633897,-0.8362818153484325,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.014375025187359785,0.5481113791633897,-0.8362818153484325,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.33379769012392096,0.4349849838051005,-0.8362817503282082,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.33379769012392096,0.4349849838051005,-0.8362817503282082,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.33379769012392096,0.4349849838051005,-0.8362817503282082,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.5987063332641228,0.43498543079189106,-0.6725610764147907,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.5987063332641228,0.43498543079189106,-0.6725610764147907,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.5987063332641228,0.43498543079189106,-0.6725610764147907,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.5168458529709213,0.1830457918075477,-0.8362802176114825,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.5168458529709213,0.1830457918075477,-0.8362802176114825,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.5168458529709213,0.1830457918075477,-0.8362802176114825,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.5168458649633575,-0.18304578392835744,-0.8362802119244075,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.5168458649633575,-0.18304578392835744,-0.8362802119244075,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.5168458649633575,-0.18304578392835744,-0.8362802119244075,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.598706333264664,-0.43498543078968377,-0.6725610764157365,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.598706333264664,-0.43498543078968377,-0.6725610764157365,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.598706333264664,-0.43498543078968377,-0.6725610764157365,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.3337976811194137,-0.4349850166946449,-0.8362817368150889,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.3337976811194137,-0.4349850166946449,-0.8362817368150889,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.3337976811194137,-0.4349850166946449,-0.8362817368150889,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.5257288565113233,0.15570514544984582,-0.836280501453752,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.5257288565113233,0.15570514544984582,-0.836280501453752,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.5257288565113233,0.15570514544984582,-0.836280501453752,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.7400431604567397,0.0,-0.6725593807696092,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.7400431604567397,0.0,-0.6725593807696092,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.7400431604567397,0.0,-0.6725593807696092,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.5257288496935323,-0.15570515706632646,-0.8362805035769194,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.5257288496935323,-0.15570515706632646,-0.8362805035769194,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.5257288496935323,-0.15570515706632646,-0.8362805035769194,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,0.014375025183341193,-0.5481113791642283,-0.8362818153479519,
    0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.014375025183341193,-0.5481113791642283,-0.8362818153479519,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,0.014375025183341193,-0.5481113791642283,-0.8362818153479519,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.22868908812963903,-0.7038198371336523,-0.6725614751289233,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,0.22868908812963903,-0.7038198371336523,-0.6725614751289233,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.22868908812963903,-0.7038198371336523,-0.6725614751289233,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.3105466063403448,-0.45187806863117663,-0.8362816609137453,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.3105466063403448,-0.45187806863117663,-0.8362816609137453,
    0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.3105466063403448,-0.45187806863117663,-0.8362816609137453
  ]);
  
  var tenSphere = new Float32Array(960*10);
  
  for (let i = 0; i < 960; i++) {
    tenSphere[10*i+0] = sphere[7*i+0];
    tenSphere[10*i+1] = sphere[7*i+1];
    tenSphere[10*i+2] = sphere[7*i+2];
    tenSphere[10*i+3] = sphere[7*i+3];
    tenSphere[10*i+4] = sphere[7*i+0];
    tenSphere[10*i+5] = sphere[7*i+1];
    tenSphere[10*i+6] = sphere[7*i+2];
    tenSphere[10*i+7] = sphere[7*i+4];
    tenSphere[10*i+8] = sphere[7*i+5];
    tenSphere[10*i+9] = sphere[7*i+6];
  }
  
  
  
  var tetra_rect =  new Float32Array ([
      // Face 0: (right side).  Unit Normal Vector: N0 = (sq23, sq29, thrd)
      0.0,	 0.0, sq2, 1.0,			0.0, 	0.0,	1.0,		 sq23,	sq29, thrd,
      c30, -0.5, 0.0, 1.0, 			1.0,  0.0,  0.0, 		sq23,	sq29, thrd,
      0.0,  1.0, 0.0, 1.0,  		0.0,  1.0,  0.0,		sq23,	sq29, thrd, 
      // Face 1: (left side).		Unit Normal Vector: N1 = (-sq23, sq29, thrd)
      0.0,	 0.0, sq2, 1.0,			0.0, 	0.0,	1.0,	 -sq23,	sq29, thrd,
      0.0,  1.0, 0.0, 1.0,  		0.0,  1.0,  0.0,	 -sq23,	sq29, thrd,
      -c30, -0.5, 0.0, 1.0, 		1.0,  1.0,  1.0, 	 -sq23,	sq29,	thrd,
      // Face 2: (lower side) 	Unit Normal Vector: N2 = (0.0, -sq89, thrd)
      0.0,	 0.0, sq2, 1.0,			0.0, 	0.0,	1.0,		0.0, -sq89,	thrd,
      -c30, -0.5, 0.0, 1.0, 		1.0,  1.0,  1.0, 		0.0, -sq89,	thrd,          																							//0.0, 0.0, 0.0, // Normals debug
      c30, -0.5, 0.0, 1.0, 			1.0,  0.0,  0.0, 		0.0, -sq89,	thrd,
      // Face 3: (base side)  Unit Normal Vector: N2 = (0.0, 0.0, -1.0)
      -c30, -0.5, 0.0, 1.0, 		1.0,  1.0,  1.0, 		0.0, 	0.0, -1.0,
      0.0,  1.0, 0.0, 1.0,  		0.0,  1.0,  0.0,		0.0, 	0.0, -1.0,
      c30, -0.5, 0.0, 1.0, 			1.0,  0.0,  0.0, 		0.0, 	0.0, -1.0,
  
      
  //Side 1 for rectangle (000,101,001)(000,101,100) -> (0,-1,0) (RED)
  0.00, 0.00, 0.00, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  0.20, 0.00, 0.20, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  0.00, 0.00, 0.20, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  
  0.00, 0.00, 0.00, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  0.20, 0.00, 0.20, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  0.20, 0.00, 0.00, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  
  //Side 2 of rectangle, (000,110,100)(000,110,010) -> (0,0,-1) (GREEN)
  0.00, 0.00, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  0.20, 0.50, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  0.20, 0.00, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  
  0.00, 0.00, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  0.20, 0.50, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  0.00, 0.50, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  
  //Side 3 of rectangle, (000,011,010)(000,011,001) -> (-1,0,0) (BLUE)
  0.00, 0.00, 0.00, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  0.00, 0.50, 0.20, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  0.00, 0.50, 0.00, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  
  0.00, 0.00, 0.00, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  0.00, 0.50, 0.20, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  0.00, 0.00, 0.20, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  
  //Side 4 of rectangle, (111,001,011)(111,001,101) -> (001) (YELLOW)
  0.20, 0.50, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  0.00, 0.00, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  0.00, 0.50, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  
  0.20, 0.50, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  0.00, 0.00, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  0.20, 0.00, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  
  //Side 5 of rectangle, (111,010,011)(111,010,110) -> (010) (CYAN)
  0.20, 0.50, 0.20, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  0.00, 0.50, 0.00, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  0.00, 0.50, 0.20, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  
  0.20, 0.50, 0.20, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  0.00, 0.50, 0.00, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  0.20, 0.50, 0.00, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  
  //Side 6 of rectangle, (111,100,101)(111,100,110) -> (100) (MAGENTA)
  0.20, 0.50, 0.20, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  0.20, 0.00, 0.00, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  0.20, 0.00, 0.20, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  
  0.20, 0.50, 0.20, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  0.20, 0.00, 0.00, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  0.20, 0.50, 0.00, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  ]);
    
  //for (let i = 0; i < 12+36; i++) {
  //  tetra_rect[10*i+7] = tetra_rect[10*i+7] * -1;
  //  tetra_rect[10*i+8] = tetra_rect[10*i+8] * -1;
  //  tetra_rect[10*i+9] = tetra_rect[10*i+9] * -1;
  //}
  
  for (let i = 0; i < 12+36; i++) {
    tetra_rect[10*i+4] = -1.0;
    tetra_rect[10*i+5] = -1.0;
    tetra_rect[10*i+6] = 0.0;
  }
  
    this.vboContents = new Float32Array((960+36+12)*10);
    this.vboContents.set(tenSphere, offset=0);
    this.vboContents.set(tetra_rect, offset=9600);
      
    this.vboVerts = 960+36+12;							// # of vertices held in 'vboContents' array;
    this.FSIZE = this.vboContents.BYTES_PER_ELEMENT;  
                                  // bytes req'd by 1 vboContents array element;
                                  // (why? used to compute stride and offset 
                                  // in bytes for vertexAttribPointer() calls)
    this.vboBytes = this.vboContents.length * this.FSIZE;               
                                  // (#  of floats in vboContents array) * 
                                  // (# of bytes/float).
    this.vboStride = this.vboBytes / this.vboVerts;     
                                  // (== # of bytes to store one complete vertex).
                                  // From any attrib in a given vertex in the VBO, 
                                  // move forward by 'vboStride' bytes to arrive 
                                  // at the same attrib for the next vertex.
                                   
                //----------------------Attribute sizes
    this.vboFcount_a_Pos1 =  4;    // # of floats in the VBO needed to store the
                                  // attribute named a_Pos1. (4: x,y,z,w values)
    this.vboFcount_a_Colr1 = 3;   // # of floats for this attrib (r,g,b values)
    this.vboFcount_a_Normal = 3;  // # of floats for this attrib (just one!)   
    console.assert((this.vboFcount_a_Pos1 +     // check the size of each and
                    this.vboFcount_a_Colr1 +
                    this.vboFcount_a_Normal) *   // every attribute in our VBO
                    this.FSIZE == this.vboStride, // for agreeement with'stride'
                    "Uh oh! VBObox1.vboStride disagrees with attribute-size values!");
                    
                //----------------------Attribute offsets
    this.vboOffset_a_Pos1 = 0;    //# of bytes from START of vbo to the START
                                  // of 1st a_Pos1 attrib value in vboContents[]
    this.vboOffset_a_Colr1 = (this.vboFcount_a_Pos1) * this.FSIZE;  
                                  // == 4 floats * bytes/float
                                  //# of bytes from START of vbo to the START
                                  // of 1st a_Colr1 attrib value in vboContents[]
    this.vboOffset_a_Normal =(this.vboFcount_a_Pos1 +
                              this.vboFcount_a_Colr1) * this.FSIZE; 
                                  // == 7 floats * bytes/float
                                  // # of bytes from START of vbo to the START
                                  // of 1st a_PtSize attrib value in vboContents[]
  
                //-----------------------GPU memory locations:                                
    this.vboLoc;									// GPU Location for Vertex Buffer Object, 
                                  // returned by gl.createBuffer() function call
    this.shaderLoc;								// GPU Location for compiled Shader-program  
                                  // set by compile/link of VERT_SRC and FRAG_SRC.
                            //------Attribute locations in our shaders:
    this.a_Pos1Loc;							  // GPU location: shader 'a_Pos1' attribute
    this.a_Colr1Loc;							// GPU location: shader 'a_Colr1' attribute
    this.a_NormalLoc;							// GPU location: shader 'a_PtSiz1' attribute
    
                //---------------------- Uniform locations &values in our shaders
    this.ModelMatrix = new Matrix4();	// Transforms CVV axes to model axes.
    this.u_ModelMatrixLoc;						// GPU location for u_ModelMat uniform
  
    //Felipe's addition: make a Normal Matrix too
};
  
VBObox3.prototype.init = function() {
//==============================================================================
// Prepare the GPU to use all vertices, GLSL shaders, attributes, & uniforms 
// kept in this VBObox. (This function usually called only once, within main()).
// Specifically:
// a) Create, compile, link our GLSL vertex- and fragment-shaders to form an 
//  executable 'program' stored and ready to use inside the GPU.  
// b) create a new VBO object in GPU memory and fill it by transferring in all
//  the vertex data held in our Float32array member 'VBOcontents'. 
// c) Find & save the GPU location of all our shaders' attribute-variables and 
//  uniform-variables (needed by switchToMe(), adjust(), draw(), reload(), etc.)
// -------------------
// CAREFUL!  before you can draw pictures using this VBObox contents, 
//  you must call this VBObox object's switchToMe() function too!
//--------------------
// a) Compile,link,upload shaders-----------------------------------------------
  this.shaderLoc = createProgram(gl, this.VERT_SRC, this.FRAG_SRC);
  if (!this.shaderLoc) {
    console.log(this.constructor.name + 
                '.init() failed to create executable Shaders on the GPU. Bye!');
    return;
  }
// CUTE TRICK: let's print the NAME of this VBObox object: tells us which one!
//  else{console.log('You called: '+ this.constructor.name + '.init() fcn!');}

  gl.program = this.shaderLoc;		// (to match cuon-utils.js -- initShaders())

// b) Create VBO on GPU, fill it------------------------------------------------
  this.vboLoc = gl.createBuffer();	
  if (!this.vboLoc) {
    console.log(this.constructor.name + 
                '.init() failed to create VBO in GPU. Bye!'); 
    return;
  }
  
  // Specify the purpose of our newly-created VBO on the GPU.  Your choices are:
  //	== "gl.ARRAY_BUFFER" : the VBO holds vertices, each made of attributes 
  // (positions, colors, normals, etc), or 
  //	== "gl.ELEMENT_ARRAY_BUFFER" : the VBO holds indices only; integer values 
  // that each select one vertex from a vertex array stored in another VBO.
  gl.bindBuffer(gl.ARRAY_BUFFER,	      // GLenum 'target' for this GPU buffer 
                  this.vboLoc);				  // the ID# the GPU uses for this buffer.
                        
  // Fill the GPU's newly-created VBO object with the vertex data we stored in
  //  our 'vboContents' member (JavaScript Float32Array object).
  //  (Recall gl.bufferData() will evoke GPU's memory allocation & management: 
  //	 use gl.bufferSubData() to modify VBO contents without changing VBO size)
  gl.bufferData(gl.ARRAY_BUFFER, 			  // GLenum target(same as 'bindBuffer()')
                    this.vboContents, 		// JavaScript Float32Array
                    gl.STATIC_DRAW);			// Usage hint.  
  //	The 'hint' helps GPU allocate its shared memory for best speed & efficiency
  //	(see OpenGL ES specification for more info).  Your choices are:
  //		--STATIC_DRAW is for vertex buffers rendered many times, but whose 
  //				contents rarely or never change.
  //		--DYNAMIC_DRAW is for vertex buffers rendered many times, but whose 
  //				contents may change often as our program runs.
  //		--STREAM_DRAW is for vertex buffers that are rendered a small number of 
  // 			times and then discarded; for rapidly supplied & consumed VBOs.

// c1) Find All Attributes:-----------------------------------------------------
//  Find & save the GPU location of all our shaders' attribute-variables and 
//  uniform-variables (for switchToMe(), adjust(), draw(), reload(), etc.)
  this.a_Pos1Loc = gl.getAttribLocation(this.shaderLoc, 'a_Position');
  if(this.a_Pos1Loc < 0) {
    console.log(this.constructor.name + 
                '.init() Failed to get GPU location of attribute a_Pos1');
    return -1;	// error exit.
  }
    this.a_Colr1Loc = gl.getAttribLocation(this.shaderLoc, 'a_Color');
  if(this.a_Colr1Loc < 0) {
    console.log(this.constructor.name + 
                '.init() failed to get the GPU location of attribute a_Colr1');
    return -1;	// error exit.
  }
  // c2) Find All Uniforms:-----------------------------------------------------
  //Get GPU storage location for each uniform var used in our shader programs: 
  this.u_ModelMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_ModelMatrix');
  if (!this.u_ModelMatrixLoc) { 
    console.log(this.constructor.name + 
                '.init() failed to get GPU location for u_ModelMatrix uniform');
    return;
  }
}

VBObox3.prototype.switchToMe = function () {
//==============================================================================
// Set GPU to use this VBObox's contents (VBO, shader, attributes, uniforms...)
//
// We only do this AFTER we called the init() function, which does the one-time-
// only setup tasks to put our VBObox contents into GPU memory.  !SURPRISE!
// even then, you are STILL not ready to draw our VBObox's contents onscreen!
// We must also first complete these steps:
//  a) tell the GPU to use our VBObox's shader program (already in GPU memory),
//  b) tell the GPU to use our VBObox's VBO  (already in GPU memory),
//  c) tell the GPU to connect the shader program's attributes to that VBO.

// a) select our shader program:
  gl.useProgram(this.shaderLoc);	
//		Each call to useProgram() selects a shader program from the GPU memory,
// but that's all -- it does nothing else!  Any previously used shader program's 
// connections to attributes and uniforms are now invalid, and thus we must now
// establish new connections between our shader program's attributes and the VBO
// we wish to use.  
  
// b) call bindBuffer to disconnect the GPU from its currently-bound VBO and
//  instead connect to our own already-created-&-filled VBO.  This new VBO can 
//    supply values to use as attributes in our newly-selected shader program:
  gl.bindBuffer(gl.ARRAY_BUFFER,	    // GLenum 'target' for this GPU buffer 
                    this.vboLoc);			// the ID# the GPU uses for our VBO.

// c) connect our newly-bound VBO to supply attribute variable values for each
// vertex to our SIMD shader program, using 'vertexAttribPointer()' function.
// this sets up data paths from VBO to our shader units:
  // 	Here's how to use the almost-identical OpenGL version of this function:
  //		http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttribPointer.xml )
  gl.vertexAttribPointer(
    this.a_Pos1Loc,//index == ID# for the attribute var in GLSL shader pgm;
    this.vboFcount_a_Pos1, // # of floats used by this attribute: 1,2,3 or 4?
    gl.FLOAT,		  // type == what data type did we use for those numbers?
    false,				// isNormalized == are these fixed-point values that we need
                  //									normalize before use? true or false
    this.vboStride,// Stride == #bytes we must skip in the VBO to move from the
                  // stored attrib for this vertex to the same stored attrib
                  //  for the next vertex in our VBO.  This is usually the 
                  // number of bytes used to store one complete vertex.  If set 
                  // to zero, the GPU gets attribute values sequentially from 
                  // VBO, starting at 'Offset'.	
                  // (Our vertex size in bytes: 4 floats for pos + 3 for color)
    this.vboOffset_a_Pos1);						
                  // Offset == how many bytes from START of buffer to the first
                  // value we will actually use?  (we start with position).
  gl.vertexAttribPointer(this.a_Colr1Loc, this.vboFcount_a_Colr1,
                          gl.FLOAT, false, 
                          this.vboStride,  this.vboOffset_a_Colr1);
  //-- Enable this assignment of the attribute to its' VBO source:
  gl.enableVertexAttribArray(this.a_Pos1Loc);
  gl.enableVertexAttribArray(this.a_Colr1Loc);
}

VBObox3.prototype.isReady = function() {
//==============================================================================
// Returns 'true' if our WebGL rendering context ('gl') is ready to render using
// this objects VBO and shader program; else return false.
// see: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter

var isOK = true;

  if(gl.getParameter(gl.CURRENT_PROGRAM) != this.shaderLoc)  {
    console.log(this.constructor.name + 
                '.isReady() false: shader program at this.shaderLoc not in use!');
    isOK = false;
  }
  if(gl.getParameter(gl.ARRAY_BUFFER_BINDING) != this.vboLoc) {
      console.log(this.constructor.name + 
              '.isReady() false: vbo at this.vboLoc not in use!');
    isOK = false;
  }
  return isOK;
}

VBObox3.prototype.adjust = function() {
//==============================================================================
// Update the GPU to newer, current values we now store for 'uniform' vars on 
// the GPU; and (if needed) update each attribute's stride and offset in VBO.

  // check: was WebGL context set to use our VBO & shader program?
  if(this.isReady()==false) {
        console.log('ERROR! before' + this.constructor.name + 
              '.adjust() call you needed to call this.switchToMe()!!');
  }
  // Adjust values for our uniforms,
  this.ModelMatrix.setIdentity();
  this.ModelMatrix.set(g_worldMat);

  //this.ModelMatrix.translate(1.0, -2.0, 0);						// then translate them.
  //this.ModelMatrix.rotate(g_angleNow2, 0, 0, 1);	// -spin drawing axes,
  
  //  Transfer new uniforms' values to the GPU:-------------
  // Send  new 'ModelMat' values to the GPU's 'u_ModelMat1' uniform: 
  gl.uniformMatrix4fv(this.u_ModelMatrixLoc, false, this.ModelMatrix.elements);
}

VBObox3.prototype.draw = function() {
//=============================================================================
// Send commands to GPU to select and render current VBObox contents.

  // check: was WebGL context set to use our VBO & shader program?
  if(this.isReady()==false) {
        console.log('ERROR! before' + this.constructor.name + 
              '.draw() call you needed to call this.switchToMe()!!');
  }
  
  // ----------------------------Draw the contents of the currently-bound VBO:
  /*gl.drawArrays(gl.TRIANGLES,		    // select the drawing primitive to draw:
                  // choices: gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, 
                  //          gl.TRIANGLES, gl.TRIANGLE_STRIP,
                0, 								// location of 1st vertex to draw;
                12);		// number of vertices to draw on-screen.
*/

  //  Transfer new uniforms' values to the GPU:-------------
  // Send  new 'ModelMat' values to the GPU's 'u_ModelMat1' uniform: 
  
  //this.ModelMatrix.translate(0.0, 0.0, 1.0);
  this.drawBox = function() {
    gl.uniformMatrix4fv(this.u_ModelMatrixLoc, false, this.ModelMatrix.elements);	// send data from Javascript.
    gl.drawArrays(gl.TRIANGLES, 960+12, 36);		// number of vertices to draw on-screen.
  }
  this.drawSphere = function() {
    gl.uniformMatrix4fv(this.u_ModelMatrixLoc, false, this.ModelMatrix.elements);	// send data from Javascript.
    gl.drawArrays(gl.TRIANGLES, 0, 960);		// number of vertices to draw on-screen.
  }
  this.drawJointTree = function(count, pivotAngle, curlAngle){
    pushMatrix(this.ModelMatrix);
    this.ModelMatrix.rotate(-pivotAngle, 0, 0, 1);
    this.ModelMatrix.translate(-0.2, 0 , 0);
    this.drawBox();
    for(i = 0; i < count-1; i++){
      this.ModelMatrix.translate(0.2, 0.5, 0.0);
      this.ModelMatrix.scale(0.8,0.8,0.8);
      this.ModelMatrix.rotate(-curlAngle, 0,0,1);
      this.ModelMatrix.translate(-0.2, 0, 0);
      this.drawBox();
    }
    this.ModelMatrix = popMatrix();
  }
  
  this.ModelMatrix.rotate(g_angleNow0, 0, 0,1);
  this.drawSphere();
  this.ModelMatrix.rotate(90, 90, 0, 1);
  this.ModelMatrix.translate(2.0, 0.0, 0);
  this.drawJointTree(5,0,makeAngle(1,g_angleNow0,0,100));
  this.ModelMatrix.translate(1.0, 0.0, 0);
  this.drawJointTree(5,0,makeAngle(1,g_angleNow0,0,100));
  this.ModelMatrix.translate(1.0, 0.0, 0);
  this.drawJointTree(5,0,makeAngle(1,g_angleNow0,0,100));

}

//=============================================================================Gouraud Phong
//=============================================================================
function VBObox4() {
  //=============================================================================
  //=============================================================================
  // CONSTRUCTOR for one re-usable 'VBObox1' object that holds all data and fcns
  // needed to render vertices from one Vertex Buffer Object (VBO) using one 
  // separate shader program (a vertex-shader & fragment-shader pair) and one
  // set of 'uniform' variables.
  
  // Constructor goal: 
  // Create and set member vars that will ELIMINATE ALL LITERALS (numerical values 
  // written into code) in all other VBObox functions. Keeping all these (initial)
  // values here, in this one coonstrutor function, ensures we can change them 
  // easily WITHOUT disrupting any other code, ever!
    
  this.VERT_SRC = 
    `uniform mat4 u_ModelMatrix;
    uniform mat4 u_NormalMatrix;
    uniform mat4 u_MvpMatrix;
    uniform vec3 u_EyePos;
  
    //Light Variables
    uniform vec3 u_LightColor;
    uniform vec3 u_LightPosition;
    uniform vec3 u_AmbientLight;
    uniform vec3 u_SpecularLight;
  
    //Material Variables
    uniform vec3 u_emit;
    uniform vec3 u_ambi;
    uniform vec3 u_diff;
    uniform vec3 u_spec;
    uniform float u_shiny;
  
    attribute vec4 a_Position;
    attribute vec3 a_Color;
    attribute vec3 a_Normal;
    varying vec4 v_Color;
    void main() {
       vec4 transVec = u_NormalMatrix * vec4(a_Normal, 0.0);
       vec3 normal = normalize(transVec.xyz);
       gl_Position = u_ModelMatrix * a_Position;
  
       a_Color;
       vec4 vertexPosition = u_MvpMatrix * a_Position;
       vec3 lightDirection = normalize(u_LightPosition - vec3(vertexPosition));
       float nDotL = max(dot(lightDirection, normal), 0.0);
  
       //phong
       vec3 eyeDirection = normalize(u_EyePos - vertexPosition.xyz);
       vec3 lightDir = normalize(u_LightPosition - vec3(vertexPosition));
       vec3 R = reflect(-lightDir, normal);
       vec3 H = normalize(lightDir + eyeDirection);
       float nDotH = max(dot(H, normal),0.0);
       float rDotV = max(dot(R, eyeDirection),0.0);
       float e64 = pow(rDotV, float(u_shiny));
       vec3 specular = u_SpecularLight * u_spec * e64;
  
       //float e64 = pow(nDotH, float(u_MatlSet[0].shiny));
       vec3 emissive = u_emit;
       vec3 diffuse = u_LightColor * u_diff * nDotL;
       vec3 ambient = u_AmbientLight * u_ambi;
       //vec3 specular = u_SpecularLight * u_spec * e64;
       v_Color = vec4(diffuse + ambient + emissive + specular, 1.0);
    }`;
  
  // Fragment shader program----------------------------------
  this.FRAG_SRC = 
    `precision mediump float;
    varying vec4 v_Color;
    void main() {
      gl_FragColor = v_Color;
    }`;
  
  var c30 = Math.sqrt(0.75);					// == cos(30deg) == sqrt(3) / 2
  var sq2	= Math.sqrt(2.0);						 
  // for surface normals:
  var sq23 = Math.sqrt(2.0/3.0)
  var sq29 = Math.sqrt(2.0/9.0)
  var sq89 = Math.sqrt(8.0/9.0)
  var thrd = 1.0/3.0;
  
  var sphere = new Float32Array([0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.1875938387542828,-0.577343625690456,-0.7946589768800393,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.1875938387542828,-0.577343625690456,-0.7946589768800393,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,0.1875938387542828,-0.577343625690456,-0.7946589768800393,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.6070569201887998,0.0,-0.7946583515265471,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.6070569201887998,0.0,-0.7946583515265471,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.6070569201887998,0.0,-0.7946583515265471,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.4911213143210803,-0.3568183375876395,-0.7946574913638756,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.4911213143210803,-0.3568183375876395,-0.7946574913638756,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.4911213143210803,-0.3568183375876395,-0.7946574913638756,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.4911212952319224,0.356818323720363,-0.7946575093882327,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.4911212952319224,0.356818323720363,-0.7946575093882327,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.4911212952319224,0.356818323720363,-0.7946575093882327,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.18759383875292585,0.5773436256885401,-0.7946589768817515,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,0.18759383875292585,0.5773436256885401,-0.7946589768817515,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.18759383875292585,0.5773436256885401,-0.7946589768817515,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.9822470326522897,0.0,-0.18759202234042818,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9822470326522897,0.0,-0.18759202234042818,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.9822470326522897,0.0,-0.18759202234042818,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.30353357597519004,-0.934171212988684,-0.18759401130890158,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.30353357597519004,-0.934171212988684,-0.18759401130890158,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.30353357597519004,-0.934171212988684,-0.18759401130890158,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.7946554066806886,-0.5773485124543632,-0.18759392260913862,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.7946554066806886,-0.5773485124543632,-0.18759392260913862,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.7946554066806886,-0.5773485124543632,-0.18759392260913862,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.794655462880779,0.5773484504343182,-0.18759387541928604,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.794655462880779,0.5773484504343182,-0.18759387541928604,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.794655462880779,0.5773484504343182,-0.18759387541928604,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.3035335759751898,0.9341712129886843,-0.18759401130890102,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.3035335759751898,0.9341712129886843,-0.18759401130890102,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.3035335759751898,0.9341712129886843,-0.18759401130890102,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.7946554066806881,-0.5773485124543637,0.18759392260913862,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.7946554066806881,-0.5773485124543637,0.18759392260913862,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.7946554066806881,-0.5773485124543637,0.18759392260913862,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.30353357597519004,-0.934171212988684,0.1875940113089015,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.30353357597519004,-0.934171212988684,0.1875940113089015,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.30353357597519004,-0.934171212988684,0.1875940113089015,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9822470326522897,0.0,0.1875920223404278,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.9822470326522897,0.0,0.1875920223404278,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.9822470326522897,0.0,0.1875920223404278,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.30353357597518976,0.9341712129886842,0.18759401130890094,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.30353357597518976,0.9341712129886842,0.18759401130890094,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.30353357597518976,0.9341712129886842,0.18759401130890094,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.7946554628807785,0.5773484504343186,0.18759387541928607,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.7946554628807785,0.5773484504343186,0.18759387541928607,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.7946554628807785,0.5773484504343186,0.18759387541928607,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.49112131432107986,-0.3568183375876391,0.794657491363876,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.49112131432107986,-0.3568183375876391,0.794657491363876,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.49112131432107986,-0.3568183375876391,0.794657491363876,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,-0.1875938387542832,-0.5773436256904565,0.7946589768800388,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.1875938387542832,-0.5773436256904565,0.7946589768800388,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.1875938387542832,-0.5773436256904565,0.7946589768800388,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.6070569201888002,0.0,0.7946583515265467,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.6070569201888002,0.0,0.7946583515265467,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.6070569201888002,0.0,0.7946583515265467,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.18759383875292623,0.5773436256885406,0.794658976881751,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.18759383875292623,0.5773436256885406,0.794658976881751,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,-0.18759383875292623,0.5773436256885406,0.794658976881751,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.49112129523192194,0.3568183237203626,0.794657509388233,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.49112129523192194,0.3568183237203626,0.794657509388233,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.49112129523192194,0.3568183237203626,0.794657509388233,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.39277083954784114,0.6647053901731114,0.6355295523228608,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.39277083954784114,0.6647053901731114,0.6355295523228608,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.39277083954784114,0.6647053901731114,0.6355295523228608,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.23142914359315586,0.16814384664118306,0.9582109362413084,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.23142914359315586,0.16814384664118306,0.9582109362413084,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,0.23142914359315586,0.16814384664118306,0.9582109362413084,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.753547360433901,0.16814471954107602,0.6355263400312792,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.753547360433901,0.16814471954107602,0.6355263400312792,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.753547360433901,0.16814471954107602,0.6355263400312792,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.5108013377780002,0.5789515093717558,0.635529026182417,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.5108013377780002,0.5789515093717558,0.635529026182417,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.5108013377780002,0.5789515093717558,0.635529026182417,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,-0.08839935760178926,0.2720608540734848,0.958211065087644,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.08839935760178926,0.2720608540734848,0.958211065087644,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.08839935760178926,0.2720608540734848,0.958211065087644,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,0.07293921197231296,0.7686236608447644,0.6355293379116738,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,0.07293921197231296,0.7686236608447644,0.6355293379116738,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.07293921197231296,0.7686236608447644,0.6355293379116738,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.7084658042311468,-0.3068886946778563,0.6355277596722553,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.7084658042311468,-0.3068886946778563,0.6355277596722553,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.7084658042311468,-0.3068886946778563,0.6355277596722553,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.28606474884708283,0.0,0.958210289793976,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.28606474884708283,0.0,0.958210289793976,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.28606474884708283,0.0,0.958210289793976,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.708465804230484,0.3068886946789983,0.6355277596724428,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.708465804230484,0.3068886946789983,0.6355277596724428,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.708465804230484,0.3068886946789983,0.6355277596724428,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.07293907981253693,-0.7686236864389787,0.6355293221253091,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,0.07293907981253693,-0.7686236864389787,0.6355293221253091,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,0.07293907981253693,-0.7686236864389787,0.6355293221253091,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.08839938045579887,-0.2720608602432967,0.9582110612274878,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.08839938045579887,-0.2720608602432967,0.9582110612274878,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,-0.08839938045579887,-0.2720608602432967,0.9582110612274878,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.5108013129423995,-0.5789514469236773,0.6355291030325059,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.5108013129423995,-0.5789514469236773,0.6355291030325059,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.5108013129423995,-0.5789514469236773,0.6355291030325059,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.7535473604341476,-0.1681447195414963,0.6355263400308759,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.7535473604341476,-0.1681447195414963,0.6355263400308759,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.7535473604341476,-0.1681447195414963,0.6355263400308759,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,0.23142914432949518,-0.16814383202830113,0.9582109386276887,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.23142914432949518,-0.16814383202830113,0.9582109386276887,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.23142914432949518,-0.16814383202830113,0.9582109386276887,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.39277100439986257,-0.6647053901773582,0.6355294504363187,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.39277100439986257,-0.6647053901773582,0.6355294504363187,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.39277100439986257,-0.6647053901773582,0.6355294504363187,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.7968690849665907,0.5789540848799208,-0.17266102346899806,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.7968690849665907,0.5789540848799208,-0.17266102346899806,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.7968690849665907,0.5789540848799208,-0.17266102346899806,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.8965821692443947,0.2720605719210893,0.3494616702858627,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.8965821692443947,0.2720605719210893,0.3494616702858627,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.8965821692443947,0.2720605719210893,0.3494616702858627,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.535806440050527,0.7686269265317828,0.34946259686937375,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.535806440050527,0.7686269265317828,0.34946259686937375,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.535806440050527,0.7686269265317828,0.34946259686937375,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.30437401847623374,0.9367735492298488,-0.17266086510828546,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.30437401847623374,0.9367735492298488,-0.17266086510828546,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.30437401847623374,0.9367735492298488,-0.17266086510828546,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,0.018308870240782232,0.9367708785687859,0.34946402724167636,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.018308870240782232,0.9367708785687859,0.34946402724167636,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,0.018308870240782232,0.9367708785687859,0.34946402724167636,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.5654358177612575,0.7470993573185782,0.3494637124034841,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.5654358177612575,0.7470993573185782,0.3494637124034841,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.5654358177612575,0.7470993573185782,0.3494637124034841,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9849818442352473,-0.0,-0.17265794660811634,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.9849818442352473,-0.0,-0.17265794660811634,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9849818442352473,-0.0,-0.17265794660811634,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.8852651476838903,0.3068895341634237,0.3494630625934256,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.8852651476838903,0.3068895341634237,0.3494630625934256,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.8852651476838903,0.3068895341634237,0.3494630625934256,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.8852651543182758,-0.3068895218351865,0.34946305661344207,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.8852651543182758,-0.3068895218351865,0.34946305661344207,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.8852651543182758,-0.3068895218351865,0.34946305661344207,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.3043740184762341,-0.9367735492298489,-0.17266086510828474,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.3043740184762341,-0.9367735492298489,-0.17266086510828474,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.3043740184762341,-0.9367735492298489,-0.17266086510828474,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.5654359322761605,-0.7470993573184301,0.34946352711746276,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.5654359322761605,-0.7470993573184301,0.34946352711746276,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.5654359322761605,-0.7470993573184301,0.34946352711746276,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.01830887024078118,-0.9367708785687856,0.3494640272416773,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,0.01830887024078118,-0.9367708785687856,0.3494640272416773,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,0.01830887024078118,-0.9367708785687856,0.3494640272416773,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.7968690273363406,-0.5789541473282623,-0.17266108004828137,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.7968690273363406,-0.5789541473282623,-0.17266108004828137,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.7968690273363406,-0.5789541473282623,-0.17266108004828137,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.5358065214403914,-0.7686268400790313,0.34946266222884337,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.5358065214403914,-0.7686268400790313,0.34946266222884337,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.5358065214403914,-0.7686268400790313,0.34946266222884337,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.896582164193717,-0.27206058113615955,0.3494616760698745,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.896582164193717,-0.27206058113615955,0.3494616760698745,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.896582164193717,-0.27206058113615955,0.3494616760698745,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.018308870240782205,0.9367708785687859,-0.34946402724167613,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,-0.018308870240782205,0.9367708785687859,-0.34946402724167613,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,-0.018308870240782205,0.9367708785687859,-0.34946402724167613,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.30437401847623347,0.9367735492298487,0.17266086510828524,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.30437401847623347,0.9367735492298487,0.17266086510828524,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.30437401847623347,0.9367735492298487,0.17266086510828524,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.5654358177612576,0.7470993573185785,-0.3494637124034841,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.5654358177612576,0.7470993573185785,-0.3494637124034841,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.5654358177612576,0.7470993573185785,-0.3494637124034841,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.8965821692443952,0.2720605719210894,-0.34946167028586195,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.8965821692443952,0.2720605719210894,-0.34946167028586195,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.8965821692443952,0.2720605719210894,-0.34946167028586195,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.7968690849665907,0.5789540848799208,0.17266102346899803,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.7968690849665907,0.5789540848799208,0.17266102346899803,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.7968690849665907,0.5789540848799208,0.17266102346899803,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.5358064400505267,0.7686269265317832,-0.34946259686937364,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.5358064400505267,0.7686269265317832,-0.34946259686937364,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.5358064400505267,0.7686269265317832,-0.34946259686937364,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.535806521440391,-0.7686268400790315,-0.34946266222884337,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.535806521440391,-0.7686268400790315,-0.34946266222884337,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.535806521440391,-0.7686268400790315,-0.34946266222884337,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.7968690273363406,-0.5789541473282624,0.17266108004828132,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.7968690273363406,-0.5789541473282624,0.17266108004828132,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.7968690273363406,-0.5789541473282624,0.17266108004828132,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.8965821641937172,-0.27206058113615966,-0.3494616760698737,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.8965821641937172,-0.27206058113615966,-0.3494616760698737,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.8965821641937172,-0.27206058113615966,-0.3494616760698737,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.5654359322761607,-0.7470993573184304,-0.34946352711746276,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.5654359322761607,-0.7470993573184304,-0.34946352711746276,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.5654359322761607,-0.7470993573184304,-0.34946352711746276,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.30437401847623385,-0.9367735492298487,0.17266086510828454,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.30437401847623385,-0.9367735492298487,0.17266086510828454,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.30437401847623385,-0.9367735492298487,0.17266086510828454,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,-0.01830887024078116,-0.9367708785687855,-0.3494640272416772,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,-0.01830887024078116,-0.9367708785687855,-0.3494640272416772,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.01830887024078116,-0.9367708785687855,-0.3494640272416772,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.8852651476838904,0.30688953416342346,-0.3494630625934258,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.8852651476838904,0.30688953416342346,-0.3494630625934258,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.8852651476838904,0.30688953416342346,-0.3494630625934258,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9849818442352474,0.0,0.17265794660811573,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9849818442352474,0.0,0.17265794660811573,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9849818442352474,0.0,0.17265794660811573,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.8852651543182759,-0.30688952183518625,-0.3494630566134423,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.8852651543182759,-0.30688952183518625,-0.3494630566134423,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.8852651543182759,-0.30688952183518625,-0.3494630566134423,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.08839935760178921,0.2720608540734848,-0.958211065087644,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,0.08839935760178921,0.2720608540734848,-0.958211065087644,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.08839935760178921,0.2720608540734848,-0.958211065087644,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.5108013377780005,0.578951509371756,-0.6355290261824166,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.5108013377780005,0.578951509371756,-0.6355290261824166,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.5108013377780005,0.578951509371756,-0.6355290261824166,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.07293921197231347,0.7686236608447645,-0.6355293379116738,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,-0.07293921197231347,0.7686236608447645,-0.6355293379116738,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,-0.07293921197231347,0.7686236608447645,-0.6355293379116738,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,-0.2314291435931551,0.1681438466411829,-0.9582109362413085,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.2314291435931551,0.1681438466411829,-0.9582109362413085,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.2314291435931551,0.1681438466411829,-0.9582109362413085,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.39277083954784103,0.6647053901731109,-0.6355295523228613,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.39277083954784103,0.6647053901731109,-0.6355295523228613,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.39277083954784103,0.6647053901731109,-0.6355295523228613,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.7535473604339004,0.16814471954107618,-0.6355263400312802,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.7535473604339004,0.16814471954107618,-0.6355263400312802,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.7535473604339004,0.16814471954107618,-0.6355263400312802,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.23142914432949452,-0.168143832028301,-0.9582109386276889,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,-0.23142914432949452,-0.168143832028301,-0.9582109386276889,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.23142914432949452,-0.168143832028301,-0.9582109386276889,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.7535473604341468,-0.16814471954149637,-0.6355263400308768,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.7535473604341468,-0.16814471954149637,-0.6355263400308768,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.7535473604341468,-0.16814471954149637,-0.6355263400308768,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.39277100439986257,-0.6647053901773577,-0.6355294504363193,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.39277100439986257,-0.6647053901773577,-0.6355294504363193,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.39277100439986257,-0.6647053901773577,-0.6355294504363193,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.28606474884708194,0.0,-0.9582102897939762,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.28606474884708194,0.0,-0.9582102897939762,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.28606474884708194,0.0,-0.9582102897939762,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.7084658042304844,0.3068886946789989,-0.6355277596724419,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.7084658042304844,0.3068886946789989,-0.6355277596724419,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.7084658042304844,0.3068886946789989,-0.6355277596724419,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.7084658042311474,-0.3068886946778569,-0.6355277596722544,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.7084658042311474,-0.3068886946778569,-0.6355277596722544,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.7084658042311474,-0.3068886946778569,-0.6355277596722544,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,0.08839938045579884,-0.2720608602432967,-0.9582110612274878,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.08839938045579884,-0.2720608602432967,-0.9582110612274878,
    0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.08839938045579884,-0.2720608602432967,-0.9582110612274878,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,-0.07293907981253746,-0.7686236864389787,-0.6355293221253092,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.07293907981253746,-0.7686236864389787,-0.6355293221253092,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,-0.07293907981253746,-0.7686236864389787,-0.6355293221253092,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.5108013129423997,-0.5789514469236775,-0.6355291030325054,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.5108013129423997,-0.5789514469236775,-0.6355291030325054,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.5108013129423997,-0.5789514469236775,-0.6355291030325054,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.4556801884210278,-0.45302720531155727,-0.7662388120737402,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.4556801884210278,-0.45302720531155727,-0.7662388120737402,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.4556801884210278,-0.45302720531155727,-0.7662388120737402,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.3736135165266664,-0.7056100416852756,-0.6021024907285153,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.3736135165266664,-0.7056100416852756,-0.6021024907285153,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.3736135165266664,-0.7056100416852756,-0.6021024907285153,
    0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.6048673099190088,-0.5626946300326399,-0.563480514945967,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.6048673099190088,-0.5626946300326399,-0.563480514945967,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.6048673099190088,-0.5626946300326399,-0.563480514945967,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.11249635206289342,-0.790453586184493,-0.6021027311519319,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,0.11249635206289342,-0.790453586184493,-0.6021027311519319,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,0.11249635206289342,-0.790453586184493,-0.6021027311519319,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.10236296935915444,-0.634348937053083,-0.7662396808855573,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,-0.10236296935915444,-0.634348937053083,-0.7662396808855573,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.10236296935915444,-0.634348937053083,-0.7662396808855573,
    -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.15859766198666153,-0.8107643536568595,-0.5634784329960992,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.15859766198666153,-0.8107643536568595,-0.5634784329960992,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,-0.15859766198666153,-0.8107643536568595,-0.5634784329960992,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.030193516312269564,-0.41222790039055296,-0.9105803148060565,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,-0.030193516312269564,-0.41222790039055296,-0.9105803148060565,
    0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,-0.030193516312269564,-0.41222790039055296,-0.9105803148060565,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.2667315616493873,-0.3157493036139344,-0.9105803925449936,
    0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.2667315616493873,-0.3157493036139344,-0.9105803925449936,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.2667315616493873,-0.3157493036139344,-0.9105803925449936,
    -0.08942674659491123,0.08942674659491123,-1.0,1.0,0.05243045372163609,-0.16136170037511793,-0.9855016231212377,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.05243045372163609,-0.16136170037511793,-0.9855016231212377,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,0.05243045372163609,-0.16136170037511793,-0.9855016231212377,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.5716702792979942,-0.2933787781117714,-0.7662388559196129,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.5716702792979942,-0.2933787781117714,-0.7662388559196129,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.5716702792979942,-0.2933787781117714,-0.7662388559196129,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.7865295373716213,-0.13727635663558188,-0.6021017262480185,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.7865295373716213,-0.13727635663558188,-0.6021017262480185,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.7865295373716213,-0.13727635663558188,-0.6021017262480185,
    0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.7220727651688029,-0.40137334761281973,-0.5634805743125112,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.7220727651688029,-0.40137334761281973,-0.5634805743125112,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.7220727651688029,-0.40137334761281973,-0.5634805743125112,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.7865295373716089,0.1372763566355817,-0.6021017262480348,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.7865295373716089,0.1372763566355817,-0.6021017262480348,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.7865295373716089,0.1372763566355817,-0.6021017262480348,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.5716703002569032,0.29337878079020263,-0.7662388392572099,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.5716703002569032,0.29337878079020263,-0.7662388392572099,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.5716703002569032,0.29337878079020263,-0.7662388392572099,
    0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.7220727651677648,0.40137334761328575,-0.5634805743135096,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.7220727651677648,0.40137334761328575,-0.5634805743135096,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.7220727651677648,0.40137334761328575,-0.5634805743135096,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.38272124069341656,0.15610136154465032,-0.910580483453274,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.38272124069341656,0.15610136154465032,-0.910580483453274,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.38272124069341656,0.15610136154465032,-0.910580483453274,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.3827212475001285,-0.15610137316785758,-0.9105804785998076,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.3827212475001285,-0.15610137316785758,-0.9105804785998076,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.3827212475001285,-0.15610137316785758,-0.9105804785998076,
    -0.08942674659491123,0.08942674659491123,-1.0,1.0,0.16966523322150937,0.0,-0.9855017547604321,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.16966523322150937,0.0,-0.9855017547604321,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.16966523322150937,0.0,-0.9855017547604321,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.2900434909837939,-0.5733687582967675,-0.7662395450165417,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.2900434909837939,-0.5733687582967675,-0.7662395450165417,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.2900434909837939,-0.5733687582967675,-0.7662395450165417,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.5556259833512646,-0.5733698183711547,-0.6021019996694658,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.5556259833512646,-0.5733698183711547,-0.6021019996694658,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.5556259833512646,-0.5733698183711547,-0.6021019996694658,
    -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.3482411474888479,-0.7491463488592234,-0.5634783502376512,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.3482411474888479,-0.7491463488592234,-0.5634783502376512,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.3482411474888479,-0.7491463488592234,-0.5634783502376512,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.7170079792657081,-0.35124827568421596,-0.6020998310065955,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.7170079792657081,-0.35124827568421596,-0.6020998310065955,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.7170079792657081,-0.35124827568421596,-0.6020998310065955,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.6349390266407596,-0.09866770853416246,-0.7662356789794523,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.6349390266407596,-0.09866770853416246,-0.7662356789794523,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.6349390266407596,-0.09866770853416246,-0.7662356789794523,
    -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.8200745038929086,-0.09972382650385823,-0.5635006357513968,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.8200745038929086,-0.09972382650385823,-0.5635006357513968,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.8200745038929086,-0.09972382650385823,-0.5635006357513968,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.40138618486326477,-0.09866777504353715,-0.9105788273229676,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.40138618486326477,-0.09866777504353715,-0.9105788273229676,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.40138618486326477,-0.09866777504353715,-0.9105788273229676,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.21787243246147198,-0.3512482946875778,-0.9105801659669454,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.21787243246147198,-0.3512482946875778,-0.9105801659669454,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,-0.21787243246147198,-0.3512482946875778,-0.9105801659669454,
    -0.08942674659491123,0.08942674659491123,-1.0,1.0,-0.13726376049162442,-0.09972733209314655,-0.9855014557519847,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,-0.13726376049162442,-0.09972733209314655,-0.9855014557519847,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.13726376049162442,-0.09972733209314655,-0.9855014557519847,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.6349390266407687,0.09866770853401646,-0.7662356789794637,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.6349390266407687,0.09866770853401646,-0.7662356789794637,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.6349390266407687,0.09866770853401646,-0.7662356789794637,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.7170079792643385,0.35124827568689115,-0.6020998310066659,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.7170079792643385,0.35124827568689115,-0.6020998310066659,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.7170079792643385,0.35124827568689115,-0.6020998310066659,
    -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.8200745038929456,0.09972382650341055,-0.5635006357514222,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.8200745038929456,0.09972382650341055,-0.5635006357514222,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.8200745038929456,0.09972382650341055,-0.5635006357514222,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.5556260194438505,0.5733697244076056,-0.6021020558424696,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.5556260194438505,0.5733697244076056,-0.6021020558424696,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.5556260194438505,0.5733697244076056,-0.6021020558424696,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.29004345688710037,0.5733688522583721,-0.7662394876126509,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.29004345688710037,0.5733688522583721,-0.7662394876126509,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.29004345688710037,0.5733688522583721,-0.7662394876126509,
    -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.3482409616935952,0.7491463488573392,-0.563478465065381,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.3482409616935952,0.7491463488573392,-0.563478465065381,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.3482409616935952,0.7491463488573392,-0.563478465065381,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.2178724354453621,0.35124826452696245,-0.9105801768871886,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,-0.2178724354453621,0.35124826452696245,-0.9105801768871886,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.2178724354453621,0.35124826452696245,-0.9105801768871886,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.40138618451518493,0.09866778374700656,-0.9105788265333188,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.40138618451518493,0.09866778374700656,-0.9105788265333188,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.40138618451518493,0.09866778374700656,-0.9105788265333188,
    -0.08942674659491123,0.08942674659491123,-1.0,1.0,-0.13726376036863866,0.09972734098810344,-0.9855014548689939,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.13726376036863866,0.09972734098810344,-0.9855014548689939,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,-0.13726376036863866,0.09972734098810344,-0.9855014548689939,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.1023630609837684,0.6343489989811777,-0.7662396173767128,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.1023630609837684,0.6343489989811777,-0.7662396173767128,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,-0.1023630609837684,0.6343489989811777,-0.7662396173767128,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.1124963520628935,0.7904535861844924,-0.602102731151933,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,0.1124963520628935,0.7904535861844924,-0.602102731151933,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,0.1124963520628935,0.7904535861844924,-0.602102731151933,
    -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.15859768341130098,0.810764268801057,-0.5634785490611477,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,-0.15859768341130098,0.810764268801057,-0.5634785490611477,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.15859768341130098,0.810764268801057,-0.5634785490611477,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.37361364022533977,0.7056100351752889,-0.602102421600759,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.37361364022533977,0.7056100351752889,-0.602102421600759,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.37361364022533977,0.7056100351752889,-0.602102421600759,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.4556802023562997,0.4530272348130372,-0.7662387863441624,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.4556802023562997,0.4530272348130372,-0.7662387863441624,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.4556802023562997,0.4530272348130372,-0.7662387863441624,
    0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.6048672442080645,0.5626947063712658,-0.5634805092511155,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.6048672442080645,0.5626947063712658,-0.5634805092511155,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.6048672442080645,0.5626947063712658,-0.5634805092511155,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.2667315350342877,0.315749297785993,-0.9105804023620896,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.2667315350342877,0.315749297785993,-0.9105804023620896,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.2667315350342877,0.315749297785993,-0.9105804023620896,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.030193527704173675,0.41222786395924527,-0.9105803309210974,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,-0.030193527704173675,0.41222786395924527,-0.9105803309210974,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,-0.030193527704173675,0.41222786395924527,-0.9105803309210974,
    -0.08942674659491123,0.08942674659491123,-1.0,1.0,0.052430445101050945,0.16136171190180873,-0.9855016216925385,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,0.052430445101050945,0.16136171190180873,-0.9855016216925385,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.052430445101050945,0.16136171190180873,-0.9855016216925385,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.8902790375102705,-0.13727627232073927,-0.43423318669524646,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.8902790375102705,-0.13727627232073927,-0.43423318669524646,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.8902790375102705,-0.13727627232073927,-0.43423318669524646,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.9410026579935737,-0.2933790714736124,-0.16864969039494385,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.9410026579935737,-0.2933790714736124,-0.16864969039494385,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.9410026579935737,-0.2933790714736124,-0.16864969039494385,
    0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.8269096225934555,-0.4013733060946441,-0.3938526948200357,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.8269096225934555,-0.4013733060946441,-0.3938526948200357,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.8269096225934555,-0.4013733060946441,-0.3938526948200357,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.9856061035044801,-0.15610228082891986,0.0649052128470842,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9856061035044801,-0.15610228082891986,0.0649052128470842,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9856061035044801,-0.15610228082891986,0.0649052128470842,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.9856061030015378,0.1561022807492629,0.0649052206760001,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9856061030015378,0.1561022807492629,0.0649052206760001,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9856061030015378,0.1561022807492629,0.0649052206760001,
    0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.9573342053980672,-0.0,0.28898307766174003,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9573342053980672,-0.0,0.28898307766174003,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9573342053980672,-0.0,0.28898307766174003,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.9410026557723999,0.29337908242205546,-0.16864968374261155,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.9410026557723999,0.29337908242205546,-0.16864968374261155,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.9410026557723999,0.29337908242205546,-0.16864968374261155,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.8902790348330735,0.13727627240355514,-0.4342331921579418,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.8902790348330735,0.13727627240355514,-0.4342331921579418,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.8902790348330735,0.13727627240355514,-0.4342331921579418,
    0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.8269096225925395,0.4013733060952317,-0.3938526948213602,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.8269096225925395,0.4013733060952317,-0.3938526948213602,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.8269096225925395,0.4013733060952317,-0.3938526948213602,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.1445571334445321,-0.8891249105991275,-0.4342351074272938,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.1445571334445321,-0.8891249105991275,-0.4342351074272938,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,0.1445571334445321,-0.8891249105991275,-0.4342351074272938,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,0.011764727228162504,-0.9856057285447228,-0.16865034554685346,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,0.011764727228162504,-0.9856057285447228,-0.16865034554685346,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.011764727228162504,-0.9856057285447228,-0.16865034554685346,
    -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.1262013834435303,-0.9104677303474127,-0.3938549514897206,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,-0.1262013834435303,-0.9104677303474127,-0.3938549514897206,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.1262013834435303,-0.9104677303474127,-0.3938549514897206,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,0.1561046864437102,-0.985605751969338,0.06490476527395082,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.1561046864437102,-0.985605751969338,0.06490476527395082,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.1561046864437102,-0.985605751969338,0.06490476527395082,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.4530336513178341,-0.8891275915425783,0.0649048282589597,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.4530336513178341,-0.8891275915425783,0.0649048282589597,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.4530336513178341,-0.8891275915425783,0.0649048282589597,
    0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.295826750452272,-0.9104677767205127,0.2890241534378325,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.295826750452272,-0.9104677767205127,0.2890241534378325,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.295826750452272,-0.9104677767205127,0.2890241534378325,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.5698107195795923,-0.8042839992138734,-0.1686505038851809,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.5698107195795923,-0.8042839992138734,-0.1686505038851809,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.5698107195795923,-0.8042839992138734,-0.1686505038851809,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.40567420298669166,-0.8042813632252391,-0.43423487860795257,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.40567420298669166,-0.8042813632252391,-0.43423487860795257,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.40567420298669166,-0.8042813632252391,-0.43423487860795257,
    0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.6372639607508351,-0.6623999850829347,-0.39385391211753373,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.6372639607508351,-0.6623999850829347,-0.39385391211753373,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.6372639607508351,-0.6623999850829347,-0.39385391211753373,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.8009411223662419,-0.41223065105961343,-0.434234048445849,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.8009411223662419,-0.41223065105961343,-0.434234048445849,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.8009411223662419,-0.41223065105961343,-0.434234048445849,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.9337331376183107,-0.31575244801226804,-0.16864999047650403,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.9337331376183107,-0.31575244801226804,-0.16864999047650403,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.9337331376183107,-0.31575244801226804,-0.16864999047650403,
    -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.9049059478911285,-0.1613589781678624,-0.3938381718877458,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.9049059478911285,-0.1613589781678624,-0.3938381718877458,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.9049059478911285,-0.1613589781678624,-0.3938381718877458,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.8891293781902415,-0.453030240817418,0.0649041581406515,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.8891293781902415,-0.453030240817418,0.0649041581406515,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.8891293781902415,-0.453030240817418,0.0649041581406515,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.7056169875642115,-0.7056147471288743,0.0649037402239831,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.7056169875642115,-0.7056147471288743,0.0649037402239831,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.7056169875642115,-0.7056147471288743,0.0649037402239831,
    -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.7744929412069025,-0.5626970574800776,0.2890202510620039,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.7744929412069025,-0.5626970574800776,0.2890202510620039,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.7744929412069025,-0.5626970574800776,0.2890202510620039,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.5888393715456425,-0.7904587170290158,-0.16865115235472017,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.5888393715456425,-0.7904587170290158,-0.16865115235472017,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.5888393715456425,-0.7904587170290158,-0.16865115235472017,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.6395598605847257,-0.6343526933842694,-0.43423478110921676,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.6395598605847257,-0.6343526933842694,-0.43423478110921676,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.6395598605847257,-0.6343526933842694,-0.43423478110921676,
    -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.43305286287212297,-0.8107669263659469,-0.39385556879314715,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.43305286287212297,-0.8107669263659469,-0.39385556879314715,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.43305286287212297,-0.8107669263659469,-0.39385556879314715,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.6395599174302818,0.6343526036081132,-0.43423482853426115,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.6395599174302818,0.6343526036081132,-0.43423482853426115,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.6395599174302818,0.6343526036081132,-0.43423482853426115,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.5888392828155132,0.790458798422897,-0.1686510806640205,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.5888392828155132,0.790458798422897,-0.1686510806640205,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.5888392828155132,0.790458798422897,-0.1686510806640205,
    -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.43305276864121595,0.8107670112207223,-0.39385549772523787,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.43305276864121595,0.8107670112207223,-0.39385549772523787,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.43305276864121595,0.8107670112207223,-0.39385549772523787,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.7056169940736836,0.7056147536395789,0.06490359867199426,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.7056169940736836,0.7056147536395789,0.06490359867199426,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.7056169940736836,0.7056147536395789,0.06490359867199426,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.8891293781905673,0.45303024081694554,0.06490415813948672,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.8891293781905673,0.45303024081694554,0.06490415813948672,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.8891293781905673,0.45303024081694554,0.06490415813948672,
    -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.7744929756870417,0.5626969811415766,0.28902030728927613,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.7744929756870417,0.5626969811415766,0.28902030728927613,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.7744929756870417,0.5626969811415766,0.28902030728927613,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.9337331410506727,0.31575243415701776,-0.16864999741346762,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.9337331410506727,0.31575243415701776,-0.16864999741346762,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9337331410506727,0.31575243415701776,-0.16864999741346762,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.8009411223638105,0.4122306510621237,-0.4342340484479505,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.8009411223638105,0.4122306510621237,-0.4342340484479505,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.8009411223638105,0.4122306510621237,-0.4342340484479505,
    -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.9049059503270416,0.1613589802965544,-0.39383816541870337,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9049059503270416,0.1613589802965544,-0.39383816541870337,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.9049059503270416,0.1613589802965544,-0.39383816541870337,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.40567431596737213,0.8042812695824455,-0.4342349465016079,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.40567431596737213,0.8042812695824455,-0.4342349465016079,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.40567431596737213,0.8042812695824455,-0.4342349465016079,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.5698106083247312,0.8042840928568619,-0.16865043319841977,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.5698106083247312,0.8042840928568619,-0.16865043319841977,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.5698106083247312,0.8042840928568619,-0.16865043319841977,
    0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.6372638592193767,0.6623999850826678,-0.3938540763979827,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.6372638592193767,0.6623999850826678,-0.3938540763979827,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.6372638592193767,0.6623999850826678,-0.3938540763979827,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.4530336513178344,0.8891275915425781,0.06490482825895993,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.4530336513178344,0.8891275915425781,0.06490482825895993,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.4530336513178344,0.8891275915425781,0.06490482825895993,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,0.15610468644371014,0.9856057519693379,0.06490476527395184,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.15610468644371014,0.9856057519693379,0.06490476527395184,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.15610468644371014,0.9856057519693379,0.06490476527395184,
    0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.29582675045227164,0.9104677767205127,0.2890241534378327,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.29582675045227164,0.9104677767205127,0.2890241534378327,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.29582675045227164,0.9104677767205127,0.2890241534378327,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,0.011764727228161192,0.9856057285447228,-0.16865034554685368,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.011764727228161192,0.9856057285447228,-0.16865034554685368,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,0.011764727228161192,0.9856057285447228,-0.16865034554685368,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.14455713344453255,0.8891249105991275,-0.43423510742729354,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,0.14455713344453255,0.8891249105991275,-0.43423510742729354,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.14455713344453255,0.8891249105991275,-0.43423510742729354,
    -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.12620138344353177,0.9104677303474128,-0.3938549514897198,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.12620138344353177,0.9104677303474128,-0.3938549514897198,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,-0.12620138344353177,0.9104677303474128,-0.3938549514897198,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.9337331376183107,-0.3157524480122681,0.16864999047650445,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9337331376183107,-0.3157524480122681,0.16864999047650445,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.9337331376183107,-0.3157524480122681,0.16864999047650445,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.8009411223662424,-0.4122306510596123,0.43423404844584906,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.8009411223662424,-0.4122306510596123,0.43423404844584906,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.8009411223662424,-0.4122306510596123,0.43423404844584906,
    0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.9049059478911281,-0.16135897816786288,0.3938381718877464,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.9049059478911281,-0.16135897816786288,0.3938381718877464,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9049059478911281,-0.16135897816786288,0.3938381718877464,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.6395598605847254,-0.63435269338427,0.43423478110921626,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.6395598605847254,-0.63435269338427,0.43423478110921626,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.6395598605847254,-0.63435269338427,0.43423478110921626,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.5888393715456428,-0.7904587170290155,0.16865115235472064,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.5888393715456428,-0.7904587170290155,0.16865115235472064,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.5888393715456428,-0.7904587170290155,0.16865115235472064,
    0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.43305286287212336,-0.8107669263659466,0.39385556879314715,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.43305286287212336,-0.8107669263659466,0.39385556879314715,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.43305286287212336,-0.8107669263659466,0.39385556879314715,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.7056169875642118,-0.7056147471288738,-0.06490374022398354,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.7056169875642118,-0.7056147471288738,-0.06490374022398354,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.7056169875642118,-0.7056147471288738,-0.06490374022398354,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.8891293781902413,-0.45303024081741866,-0.06490415814065198,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.8891293781902413,-0.45303024081741866,-0.06490415814065198,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.8891293781902413,-0.45303024081741866,-0.06490415814065198,
    0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.774492941206902,-0.5626970574800776,-0.28902025106200485,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.774492941206902,-0.5626970574800776,-0.28902025106200485,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.774492941206902,-0.5626970574800776,-0.28902025106200485,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,-0.011764727228162521,-0.9856057285447228,0.1686503455468534,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,-0.011764727228162521,-0.9856057285447228,0.1686503455468534,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.011764727228162521,-0.9856057285447228,0.1686503455468534,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.144557133444532,-0.8891249105991275,0.4342351074272939,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.144557133444532,-0.8891249105991275,0.4342351074272939,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,-0.144557133444532,-0.8891249105991275,0.4342351074272939,
    0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.12620138344352988,-0.9104677303474127,0.3938549514897206,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,0.12620138344352988,-0.9104677303474127,0.3938549514897206,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.12620138344352988,-0.9104677303474127,0.3938549514897206,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.4056742029866914,-0.8042813632252392,0.4342348786079527,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.4056742029866914,-0.8042813632252392,0.4342348786079527,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.4056742029866914,-0.8042813632252392,0.4342348786079527,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.5698107195795922,-0.8042839992138735,0.16865050388518024,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.5698107195795922,-0.8042839992138735,0.16865050388518024,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.5698107195795922,-0.8042839992138735,0.16865050388518024,
    -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.6372639607508346,-0.6623999850829355,0.3938539121175335,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.6372639607508346,-0.6623999850829355,0.3938539121175335,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.6372639607508346,-0.6623999850829355,0.3938539121175335,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.45303365131783446,-0.8891275915425783,-0.06490482825895973,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.45303365131783446,-0.8891275915425783,-0.06490482825895973,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.45303365131783446,-0.8891275915425783,-0.06490482825895973,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,-0.1561046864437102,-0.9856057519693381,-0.06490476527395087,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.1561046864437102,-0.9856057519693381,-0.06490476527395087,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.1561046864437102,-0.9856057519693381,-0.06490476527395087,
    -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.29582675045227214,-0.9104677767205126,-0.2890241534378327,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.29582675045227214,-0.9104677767205126,-0.2890241534378327,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.29582675045227214,-0.9104677767205126,-0.2890241534378327,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.9410026579935737,-0.29337907147361264,0.1686496903949428,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.9410026579935737,-0.29337907147361264,0.1686496903949428,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.9410026579935737,-0.29337907147361264,0.1686496903949428,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.8902790375102706,-0.13727627232073963,0.43423318669524613,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.8902790375102706,-0.13727627232073963,0.43423318669524613,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.8902790375102706,-0.13727627232073963,0.43423318669524613,
    -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.8269096225934561,-0.40137330609464344,0.3938526948200351,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.8269096225934561,-0.40137330609464344,0.3938526948200351,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.8269096225934561,-0.40137330609464344,0.3938526948200351,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.8902790348330736,0.13727627240355553,0.43423319215794154,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.8902790348330736,0.13727627240355553,0.43423319215794154,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.8902790348330736,0.13727627240355553,0.43423319215794154,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.9410026557724,0.2933790824220556,0.1686496837426105,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.9410026557724,0.2933790824220556,0.1686496837426105,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.9410026557724,0.2933790824220556,0.1686496837426105,
    -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.8269096225925401,0.40137330609523086,0.3938526948213595,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.8269096225925401,0.40137330609523086,0.3938526948213595,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.8269096225925401,0.40137330609523086,0.3938526948213595,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.9856061030015377,0.1561022807492637,-0.06490522067600012,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9856061030015377,0.1561022807492637,-0.06490522067600012,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9856061030015377,0.1561022807492637,-0.06490522067600012,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.98560610350448,-0.1561022808289206,-0.06490521284708418,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.98560610350448,-0.1561022808289206,-0.06490521284708418,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.98560610350448,-0.1561022808289206,-0.06490521284708418,
    -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.9573342053980672,0.0,-0.28898307766173964,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.9573342053980672,0.0,-0.28898307766173964,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9573342053980672,0.0,-0.28898307766173964,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.5698106083247311,0.804284092856862,0.16865043319841913,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.5698106083247311,0.804284092856862,0.16865043319841913,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.5698106083247311,0.804284092856862,0.16865043319841913,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.40567431596737197,0.8042812695824456,0.43423494650160793,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.40567431596737197,0.8042812695824456,0.43423494650160793,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.40567431596737197,0.8042812695824456,0.43423494650160793,
    -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.637263859219376,0.6623999850826685,0.3938540763979824,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.637263859219376,0.6623999850826685,0.3938540763979824,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.637263859219376,0.6623999850826685,0.3938540763979824,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.1445571334445324,0.8891249105991275,0.4342351074272937,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,-0.1445571334445324,0.8891249105991275,0.4342351074272937,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.1445571334445324,0.8891249105991275,0.4342351074272937,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,-0.011764727228161208,0.9856057285447228,0.16865034554685363,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.011764727228161208,0.9856057285447228,0.16865034554685363,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,-0.011764727228161208,0.9856057285447228,0.16865034554685363,
    0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.12620138344353132,0.9104677303474129,0.39385495148971983,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.12620138344353132,0.9104677303474129,0.39385495148971983,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,0.12620138344353132,0.9104677303474129,0.39385495148971983,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,-0.15610468644371017,0.985605751969338,-0.06490476527395188,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.15610468644371017,0.985605751969338,-0.06490476527395188,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.15610468644371017,0.985605751969338,-0.06490476527395188,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.4530336513178348,0.889127591542578,-0.06490482825895996,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.4530336513178348,0.889127591542578,-0.06490482825895996,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.4530336513178348,0.889127591542578,-0.06490482825895996,
    -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.29582675045227175,0.9104677767205126,-0.289024153437833,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.29582675045227175,0.9104677767205126,-0.289024153437833,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.29582675045227175,0.9104677767205126,-0.289024153437833,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.5888392828155135,0.7904587984228967,0.16865108066402096,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.5888392828155135,0.7904587984228967,0.16865108066402096,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.5888392828155135,0.7904587984228967,0.16865108066402096,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.6395599174302816,0.6343526036081139,0.43423482853426054,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.6395599174302816,0.6343526036081139,0.43423482853426054,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.6395599174302816,0.6343526036081139,0.43423482853426054,
    0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.43305276864121645,0.8107670112207219,0.393855497725238,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.43305276864121645,0.8107670112207219,0.393855497725238,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.43305276864121645,0.8107670112207219,0.393855497725238,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.8009411223638112,0.4122306510621225,0.4342340484479506,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.8009411223638112,0.4122306510621225,0.4342340484479506,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.8009411223638112,0.4122306510621225,0.4342340484479506,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.9337331410506727,0.3157524341570177,0.16864999741346798,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.9337331410506727,0.3157524341570177,0.16864999741346798,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9337331410506727,0.3157524341570177,0.16864999741346798,
    0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.9049059503270411,0.161358980296555,0.3938381654187039,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9049059503270411,0.161358980296555,0.3938381654187039,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.9049059503270411,0.161358980296555,0.3938381654187039,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.8891293781905669,0.45303024081694615,-0.06490415813948722,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.8891293781905669,0.45303024081694615,-0.06490415813948722,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.8891293781905669,0.45303024081694615,-0.06490415813948722,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.7056169940736841,0.7056147536395786,-0.06490359867199468,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.7056169940736841,0.7056147536395786,-0.06490359867199468,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.7056169940736841,0.7056147536395786,-0.06490359867199468,
    0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.7744929756870413,0.5626969811415766,-0.2890203072892772,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.7744929756870413,0.5626969811415766,-0.2890203072892772,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.7744929756870413,0.5626969811415766,-0.2890203072892772,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.5556259833512643,-0.5733698183711554,0.6021019996694653,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.5556259833512643,-0.5733698183711554,0.6021019996694653,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.5556259833512643,-0.5733698183711554,0.6021019996694653,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.29004349098379356,-0.5733687582967675,0.7662395450165418,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.29004349098379356,-0.5733687582967675,0.7662395450165418,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.29004349098379356,-0.5733687582967675,0.7662395450165418,
    0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.3482411474888483,-0.7491463488592232,0.5634783502376516,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.3482411474888483,-0.7491463488592232,0.5634783502376516,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.3482411474888483,-0.7491463488592232,0.5634783502376516,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.21787243246147264,-0.35124829468757784,0.9105801659669451,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.21787243246147264,-0.35124829468757784,0.9105801659669451,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,0.21787243246147264,-0.35124829468757784,0.9105801659669451,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.40138618486326494,-0.0986677750435375,0.9105788273229676,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.40138618486326494,-0.0986677750435375,0.9105788273229676,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.40138618486326494,-0.0986677750435375,0.9105788273229676,
    -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,0.13726376049162398,-0.0997273320931458,0.985501455751985,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,0.13726376049162398,-0.0997273320931458,0.985501455751985,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.13726376049162398,-0.0997273320931458,0.985501455751985,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.6349390266407596,-0.0986677085341618,0.7662356789794524,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.6349390266407596,-0.0986677085341618,0.7662356789794524,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.6349390266407596,-0.0986677085341618,0.7662356789794524,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.717007979265709,-0.3512482756842151,0.6020998310065948,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.717007979265709,-0.3512482756842151,0.6020998310065948,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.717007979265709,-0.3512482756842151,0.6020998310065948,
    0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.8200745038929085,-0.09972382650385908,0.5635006357513968,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.8200745038929085,-0.09972382650385908,0.5635006357513968,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.8200745038929085,-0.09972382650385908,0.5635006357513968,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.373613516526666,-0.7056100416852755,0.6021024907285157,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.373613516526666,-0.7056100416852755,0.6021024907285157,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.373613516526666,-0.7056100416852755,0.6021024907285157,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.45568018842102764,-0.45302720531155777,0.7662388120737401,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.45568018842102764,-0.45302720531155777,0.7662388120737401,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.45568018842102764,-0.45302720531155777,0.7662388120737401,
    -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.6048673099190082,-0.56269463003264,0.5634805149459678,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.6048673099190082,-0.56269463003264,0.5634805149459678,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.6048673099190082,-0.56269463003264,0.5634805149459678,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.2667315616493877,-0.3157493036139345,0.9105803925449935,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.2667315616493877,-0.3157493036139345,0.9105803925449935,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.2667315616493877,-0.3157493036139345,0.9105803925449935,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.030193516312269852,-0.4122279003905533,0.9105803148060564,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,0.030193516312269852,-0.4122279003905533,0.9105803148060564,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,0.030193516312269852,-0.4122279003905533,0.9105803148060564,
    -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,-0.05243045372163579,-0.161361700375117,0.9855016231212379,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.05243045372163579,-0.161361700375117,0.9855016231212379,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,-0.05243045372163579,-0.161361700375117,0.9855016231212379,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.10236296935915389,-0.634348937053083,0.7662396808855574,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,0.10236296935915389,-0.634348937053083,0.7662396808855574,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.10236296935915389,-0.634348937053083,0.7662396808855574,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.11249635206289318,-0.7904535861844931,0.602102731151932,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,-0.11249635206289318,-0.7904535861844931,0.602102731151932,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,-0.11249635206289318,-0.7904535861844931,0.602102731151932,
    0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.158597661986661,-0.8107643536568595,0.5634784329960995,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.158597661986661,-0.8107643536568595,0.5634784329960995,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,0.158597661986661,-0.8107643536568595,0.5634784329960995,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.786529537371608,0.13727635663558196,0.6021017262480359,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.786529537371608,0.13727635663558196,0.6021017262480359,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.786529537371608,0.13727635663558196,0.6021017262480359,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.5716703002569036,0.29337878079020213,0.7662388392572097,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.5716703002569036,0.29337878079020213,0.7662388392572097,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.5716703002569036,0.29337878079020213,0.7662388392572097,
    -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.7220727651677643,0.4013733476132851,0.5634805743135106,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.7220727651677643,0.4013733476132851,0.5634805743135106,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.7220727651677643,0.4013733476132851,0.5634805743135106,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.3827212406934171,0.15610136154465007,0.9105804834532737,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.3827212406934171,0.15610136154465007,0.9105804834532737,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.3827212406934171,0.15610136154465007,0.9105804834532737,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.38272124750012904,-0.15610137316785738,0.9105804785998074,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.38272124750012904,-0.15610137316785738,0.9105804785998074,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.38272124750012904,-0.15610137316785738,0.9105804785998074,
    -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,-0.16966523322150842,0.0,0.9855017547604323,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.16966523322150842,0.0,0.9855017547604323,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.16966523322150842,0.0,0.9855017547604323,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.5716702792979945,-0.29337877811177093,0.7662388559196127,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.5716702792979945,-0.29337877811177093,0.7662388559196127,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.5716702792979945,-0.29337877811177093,0.7662388559196127,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.7865295373716205,-0.1372763566355822,0.6021017262480196,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.7865295373716205,-0.1372763566355822,0.6021017262480196,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.7865295373716205,-0.1372763566355822,0.6021017262480196,
    -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.7220727651688026,-0.40137334761281906,0.563480574312512,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.7220727651688026,-0.40137334761281906,0.563480574312512,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.7220727651688026,-0.40137334761281906,0.563480574312512,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.11249635206289327,0.7904535861844922,0.6021027311519331,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,-0.11249635206289327,0.7904535861844922,0.6021027311519331,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,-0.11249635206289327,0.7904535861844922,0.6021027311519331,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.10236306098376788,0.6343489989811777,0.7662396173767129,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.10236306098376788,0.6343489989811777,0.7662396173767129,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,0.10236306098376788,0.6343489989811777,0.7662396173767129,
    0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.1585976834113004,0.810764268801057,0.5634785490611477,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,0.1585976834113004,0.810764268801057,0.5634785490611477,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.1585976834113004,0.810764268801057,0.5634785490611477,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.03019352770417396,0.41222786395924554,0.9105803309210972,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,0.03019352770417396,0.41222786395924554,0.9105803309210972,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,0.03019352770417396,0.41222786395924554,0.9105803309210972,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.26673153503428815,0.31574929778599303,0.9105804023620895,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.26673153503428815,0.31574929778599303,0.9105804023620895,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.26673153503428815,0.31574929778599303,0.9105804023620895,
    -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,-0.05243044510105064,0.16136171190180773,0.9855016216925386,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,-0.05243044510105064,0.16136171190180773,0.9855016216925386,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.05243044510105064,0.16136171190180773,0.9855016216925386,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.4556802023562995,0.4530272348130376,0.7662387863441623,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.4556802023562995,0.4530272348130376,0.7662387863441623,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.4556802023562995,0.4530272348130376,0.7662387863441623,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.3736136402253394,0.7056100351752885,0.6021024216007594,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.3736136402253394,0.7056100351752885,0.6021024216007594,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.3736136402253394,0.7056100351752885,0.6021024216007594,
    -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.6048672442080638,0.562694706371266,0.5634805092511163,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.6048672442080638,0.562694706371266,0.5634805092511163,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.6048672442080638,0.562694706371266,0.5634805092511163,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.7170079792643393,0.3512482756868904,0.6020998310066653,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.7170079792643393,0.3512482756868904,0.6020998310066653,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.7170079792643393,0.3512482756868904,0.6020998310066653,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.6349390266407688,0.09866770853401576,0.7662356789794635,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.6349390266407688,0.09866770853401576,0.7662356789794635,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.6349390266407688,0.09866770853401576,0.7662356789794635,
    0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.8200745038929455,0.0997238265034114,0.5635006357514222,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.8200745038929455,0.0997238265034114,0.5635006357514222,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.8200745038929455,0.0997238265034114,0.5635006357514222,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.4013861845151851,0.09866778374700691,0.9105788265333187,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.4013861845151851,0.09866778374700691,0.9105788265333187,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.4013861845151851,0.09866778374700691,0.9105788265333187,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.21787243544536275,0.35124826452696245,0.9105801768871884,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,0.21787243544536275,0.35124826452696245,0.9105801768871884,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.21787243544536275,0.35124826452696245,0.9105801768871884,
    -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,0.13726376036863816,0.09972734098810271,0.9855014548689939,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.13726376036863816,0.09972734098810271,0.9855014548689939,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,0.13726376036863816,0.09972734098810271,0.9855014548689939,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.2900434568871001,0.5733688522583722,0.7662394876126509,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.2900434568871001,0.5733688522583722,0.7662394876126509,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.2900434568871001,0.5733688522583722,0.7662394876126509,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.5556260194438501,0.5733697244076063,0.6021020558424691,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.5556260194438501,0.5733697244076063,0.6021020558424691,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.5556260194438501,0.5733697244076063,0.6021020558424691,
    0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.3482409616935957,0.7491463488573389,0.5634784650653812,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.3482409616935957,0.7491463488573389,0.5634784650653812,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.3482409616935957,0.7491463488573389,0.5634784650653812,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.3337976901239209,0.4349849838050999,0.8362817503282085,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.3337976901239209,0.4349849838050999,0.8362817503282085,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.3337976901239209,0.4349849838050999,0.8362817503282085,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.5168458529709208,0.18304579180754743,0.8362802176114829,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.5168458529709208,0.18304579180754743,0.8362802176114829,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.5168458529709208,0.18304579180754743,0.8362802176114829,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.5987063332641229,0.43498543079189117,0.6725610764147907,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.5987063332641229,0.43498543079189117,0.6725610764147907,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.5987063332641229,0.43498543079189117,0.6725610764147907,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.3105465803904405,0.45187809786617095,0.836281654753143,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.3105465803904405,0.45187809786617095,0.836281654753143,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.3105465803904405,0.45187809786617095,0.836281654753143,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,-0.014375025187359633,0.54811137916339,0.836281815348432,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,-0.014375025187359633,0.54811137916339,0.836281815348432,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.014375025187359633,0.54811137916339,0.836281815348432,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.22868908812893668,0.7038198371342455,0.6725614751285416,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.22868908812893668,0.7038198371342455,0.6725614751285416,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,-0.22868908812893668,0.7038198371342455,0.6725614751285416,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.5257288496935327,-0.15570515706632634,0.8362805035769193,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.5257288496935327,-0.15570515706632634,0.8362805035769193,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.5257288496935327,-0.15570515706632634,0.8362805035769193,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.5257288565113238,0.15570514544984565,0.8362805014537518,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.5257288565113238,0.15570514544984565,0.8362805014537518,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.5257288565113238,0.15570514544984565,0.8362805014537518,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.7400431604567386,0.0,0.6725593807696104,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.7400431604567386,0.0,0.6725593807696104,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.7400431604567386,0.0,0.6725593807696104,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,-0.014375025183341017,-0.5481113791642288,0.8362818153479515,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.014375025183341017,-0.5481113791642288,0.8362818153479515,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,-0.014375025183341017,-0.5481113791642288,0.8362818153479515,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.31054660634034525,-0.45187806863117713,0.8362816609137449,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.31054660634034525,-0.45187806863117713,0.8362816609137449,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.31054660634034525,-0.45187806863117713,0.8362816609137449,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.22868908812963912,-0.7038198371336519,0.6725614751289236,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,-0.22868908812963912,-0.7038198371336519,0.6725614751289236,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.22868908812963912,-0.7038198371336519,0.6725614751289236,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.5168458649633569,-0.18304578392835724,0.8362802119244079,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.5168458649633569,-0.18304578392835724,0.8362802119244079,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.5168458649633569,-0.18304578392835724,0.8362802119244079,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.33379768111941355,-0.4349850166946444,0.8362817368150892,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.33379768111941355,-0.4349850166946444,0.8362817368150892,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.33379768111941355,-0.4349850166946444,0.8362817368150892,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.598706333264664,-0.4349854307896837,0.6725610764157365,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.598706333264664,-0.4349854307896837,0.6725610764157365,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.598706333264664,-0.4349854307896837,0.6725610764157365,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.8868726411103974,0.45188038550008525,0.09623427482016117,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.8868726411103974,0.45188038550008525,0.09623427482016117,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.8868726411103974,0.45188038550008525,0.09623427482016117,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.7544176076440144,0.5481140659055463,0.36114407655833464,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.7544176076440144,0.5481140659055463,0.36114407655833464,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.7544176076440144,0.5481140659055463,0.36114407655833464,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.703826009734567,0.7038237749870908,0.09623430668965156,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.703826009734567,0.7038237749870908,0.09623430668965156,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.703826009734567,0.7038237749870908,0.09623430668965156,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,-0.1557084584099035,0.9831040677591577,0.09623548168429935,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.1557084584099035,0.9831040677591577,0.09623548168429935,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.1557084584099035,0.9831040677591577,0.09623548168429935,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.28816388988226643,0.8868681304880176,0.3611460808213343,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.28816388988226643,0.8868681304880176,0.3611460808213343,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.28816388988226643,0.8868681304880176,0.3611460808213343,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.45188374182885493,0.8868707696675265,0.09623576144075277,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.45188374182885493,0.8868707696675265,0.09623576144075277,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.45188374182885493,0.8868707696675265,0.09623576144075277,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.9831043836297442,0.1557060533937894,0.09623614614328184,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9831043836297442,0.1557060533937894,0.09623614614328184,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.9831043836297442,0.1557060533937894,0.09623614614328184,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.9325093417933523,0.0,0.361145853455538,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.9325093417933523,0.0,0.361145853455538,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.9325093417933523,0.0,0.361145853455538,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.9831043830057655,-0.15570605329496234,0.0962361526774606,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.9831043830057655,-0.15570605329496234,0.0962361526774606,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9831043830057655,-0.15570605329496234,0.0962361526774606,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.45188374182885466,-0.8868707696675268,0.09623576144075378,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.45188374182885466,-0.8868707696675268,0.09623576144075378,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.45188374182885466,-0.8868707696675268,0.09623576144075378,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.2881638898822667,-0.8868681304880176,0.3611460808213341,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.2881638898822667,-0.8868681304880176,0.3611460808213341,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.2881638898822667,-0.8868681304880176,0.3611460808213341,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,-0.1557084584099035,-0.9831040677591577,0.0962354816842998,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.1557084584099035,-0.9831040677591577,0.0962354816842998,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.1557084584099035,-0.9831040677591577,0.0962354816842998,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.7038260016581754,-0.7038237669094751,0.09623442483448079,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.7038260016581754,-0.7038237669094751,0.09623442483448079,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.7038260016581754,-0.7038237669094751,0.09623442483448079,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.7544175752367749,-0.5481141400040827,0.36114403179541826,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.7544175752367749,-0.5481141400040827,0.36114403179541826,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.7544175752367749,-0.5481141400040827,0.36114403179541826,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.886872641109946,-0.45188038550049187,0.09623427482241326,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.886872641109946,-0.45188038550049187,0.09623427482241326,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.886872641109946,-0.45188038550049187,0.09623427482241326,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,0.15570845840990344,0.9831040677591575,-0.09623548168429938,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.15570845840990344,0.9831040677591575,-0.09623548168429938,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.15570845840990344,0.9831040677591575,-0.09623548168429938,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.45188374182885466,0.8868707696675268,-0.09623576144075305,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.45188374182885466,0.8868707696675268,-0.09623576144075305,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.45188374182885466,0.8868707696675268,-0.09623576144075305,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.28816388988226643,0.8868681304880176,-0.36114608082133426,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.28816388988226643,0.8868681304880176,-0.36114608082133426,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.28816388988226643,0.8868681304880176,-0.36114608082133426,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.8868726411103979,0.45188038550008464,-0.09623427482016111,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.8868726411103979,0.45188038550008464,-0.09623427482016111,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.8868726411103979,0.45188038550008464,-0.09623427482016111,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.7038260097345667,0.7038237749870914,-0.09623430668965094,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.7038260097345667,0.7038237749870914,-0.09623430668965094,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.7038260097345667,0.7038237749870914,-0.09623430668965094,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.7544176076440146,0.5481140659055457,-0.3611440765583354,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.7544176076440146,0.5481140659055457,-0.3611440765583354,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.7544176076440146,0.5481140659055457,-0.3611440765583354,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.703826001658175,-0.7038237669094755,-0.09623442483448011,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.703826001658175,-0.7038237669094755,-0.09623442483448011,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.703826001658175,-0.7038237669094755,-0.09623442483448011,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.8868726411099463,-0.45188038550049126,-0.09623427482241323,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.8868726411099463,-0.45188038550049126,-0.09623427482241323,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.8868726411099463,-0.45188038550049126,-0.09623427482241323,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.754417575236775,-0.548114140004082,-0.36114403179541904,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.754417575236775,-0.548114140004082,-0.36114403179541904,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.754417575236775,-0.548114140004082,-0.36114403179541904,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.45188374182885427,-0.8868707696675268,-0.09623576144075405,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.45188374182885427,-0.8868707696675268,-0.09623576144075405,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.45188374182885427,-0.8868707696675268,-0.09623576144075405,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,0.1557084584099035,-0.9831040677591575,-0.09623548168429982,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.1557084584099035,-0.9831040677591575,-0.09623548168429982,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.1557084584099035,-0.9831040677591575,-0.09623548168429982,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.2881638898822667,-0.8868681304880176,-0.361146080821334,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.2881638898822667,-0.8868681304880176,-0.361146080821334,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.2881638898822667,-0.8868681304880176,-0.361146080821334,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.9831043836297443,0.15570605339378868,-0.09623614614328271,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9831043836297443,0.15570605339378868,-0.09623614614328271,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.9831043836297443,0.15570605339378868,-0.09623614614328271,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.9831043830057655,-0.1557060532949616,-0.09623615267746147,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.9831043830057655,-0.1557060532949616,-0.09623615267746147,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9831043830057655,-0.1557060532949616,-0.09623615267746147,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.932509341793352,0.0,-0.3611458534555385,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.932509341793352,0.0,-0.3611458534555385,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.932509341793352,0.0,-0.3611458534555385,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.31054658039044,0.4518780978661704,-0.8362816547531434,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.31054658039044,0.4518780978661704,-0.8362816547531434,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.31054658039044,0.4518780978661704,-0.8362816547531434,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.22868908812893654,0.7038198371342458,-0.6725614751285413,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.22868908812893654,0.7038198371342458,-0.6725614751285413,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,0.22868908812893654,0.7038198371342458,-0.6725614751285413,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,0.014375025187359785,0.5481113791633897,-0.8362818153484325,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,0.014375025187359785,0.5481113791633897,-0.8362818153484325,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.014375025187359785,0.5481113791633897,-0.8362818153484325,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.33379769012392096,0.4349849838051005,-0.8362817503282082,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.33379769012392096,0.4349849838051005,-0.8362817503282082,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.33379769012392096,0.4349849838051005,-0.8362817503282082,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.5987063332641228,0.43498543079189106,-0.6725610764147907,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.5987063332641228,0.43498543079189106,-0.6725610764147907,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.5987063332641228,0.43498543079189106,-0.6725610764147907,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.5168458529709213,0.1830457918075477,-0.8362802176114825,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.5168458529709213,0.1830457918075477,-0.8362802176114825,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.5168458529709213,0.1830457918075477,-0.8362802176114825,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.5168458649633575,-0.18304578392835744,-0.8362802119244075,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.5168458649633575,-0.18304578392835744,-0.8362802119244075,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.5168458649633575,-0.18304578392835744,-0.8362802119244075,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.598706333264664,-0.43498543078968377,-0.6725610764157365,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.598706333264664,-0.43498543078968377,-0.6725610764157365,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.598706333264664,-0.43498543078968377,-0.6725610764157365,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.3337976811194137,-0.4349850166946449,-0.8362817368150889,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.3337976811194137,-0.4349850166946449,-0.8362817368150889,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.3337976811194137,-0.4349850166946449,-0.8362817368150889,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.5257288565113233,0.15570514544984582,-0.836280501453752,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.5257288565113233,0.15570514544984582,-0.836280501453752,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.5257288565113233,0.15570514544984582,-0.836280501453752,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.7400431604567397,0.0,-0.6725593807696092,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.7400431604567397,0.0,-0.6725593807696092,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.7400431604567397,0.0,-0.6725593807696092,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.5257288496935323,-0.15570515706632646,-0.8362805035769194,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.5257288496935323,-0.15570515706632646,-0.8362805035769194,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.5257288496935323,-0.15570515706632646,-0.8362805035769194,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,0.014375025183341193,-0.5481113791642283,-0.8362818153479519,
    0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.014375025183341193,-0.5481113791642283,-0.8362818153479519,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,0.014375025183341193,-0.5481113791642283,-0.8362818153479519,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.22868908812963903,-0.7038198371336523,-0.6725614751289233,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,0.22868908812963903,-0.7038198371336523,-0.6725614751289233,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.22868908812963903,-0.7038198371336523,-0.6725614751289233,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.3105466063403448,-0.45187806863117663,-0.8362816609137453,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.3105466063403448,-0.45187806863117663,-0.8362816609137453,
    0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.3105466063403448,-0.45187806863117663,-0.8362816609137453
  ]);
  
  var tenSphere = new Float32Array(960*10);
  
  for (let i = 0; i < 960; i++) {
    tenSphere[10*i+0] = sphere[7*i+0];
    tenSphere[10*i+1] = sphere[7*i+1];
    tenSphere[10*i+2] = sphere[7*i+2];
    tenSphere[10*i+3] = sphere[7*i+3];
    tenSphere[10*i+4] = 0.0;//sphere[7*i+4];
    tenSphere[10*i+5] = 1.0;//sphere[7*i+5];
    tenSphere[10*i+6] = 1.0;//sphere[7*i+6];
    tenSphere[10*i+7] = sphere[7*i+0];
    tenSphere[10*i+8] = sphere[7*i+1];
    tenSphere[10*i+9] = sphere[7*i+2];
  }
  
  
  
  var tetra_rect =  new Float32Array ([
      // Face 0: (right side).  Unit Normal Vector: N0 = (sq23, sq29, thrd)
      0.0,	 0.0, sq2, 1.0,			0.0, 	0.0,	1.0,		 sq23,	sq29, thrd,
      c30, -0.5, 0.0, 1.0, 			1.0,  0.0,  0.0, 		sq23,	sq29, thrd,
      0.0,  1.0, 0.0, 1.0,  		0.0,  1.0,  0.0,		sq23,	sq29, thrd, 
      // Face 1: (left side).		Unit Normal Vector: N1 = (-sq23, sq29, thrd)
      0.0,	 0.0, sq2, 1.0,			0.0, 	0.0,	1.0,	 -sq23,	sq29, thrd,
      0.0,  1.0, 0.0, 1.0,  		0.0,  1.0,  0.0,	 -sq23,	sq29, thrd,
      -c30, -0.5, 0.0, 1.0, 		1.0,  1.0,  1.0, 	 -sq23,	sq29,	thrd,
      // Face 2: (lower side) 	Unit Normal Vector: N2 = (0.0, -sq89, thrd)
      0.0,	 0.0, sq2, 1.0,			0.0, 	0.0,	1.0,		0.0, -sq89,	thrd,
      -c30, -0.5, 0.0, 1.0, 		1.0,  1.0,  1.0, 		0.0, -sq89,	thrd,          																							//0.0, 0.0, 0.0, // Normals debug
      c30, -0.5, 0.0, 1.0, 			1.0,  0.0,  0.0, 		0.0, -sq89,	thrd,
      // Face 3: (base side)  Unit Normal Vector: N2 = (0.0, 0.0, -1.0)
      -c30, -0.5, 0.0, 1.0, 		1.0,  1.0,  1.0, 		0.0, 	0.0, -1.0,
      0.0,  1.0, 0.0, 1.0,  		0.0,  1.0,  0.0,		0.0, 	0.0, -1.0,
      c30, -0.5, 0.0, 1.0, 			1.0,  0.0,  0.0, 		0.0, 	0.0, -1.0,
  
      
  //Side 1 for rectangle (000,101,001)(000,101,100) -> (0,-1,0) (RED)
  0.00, 0.00, 0.00, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  0.20, 0.00, 0.20, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  0.00, 0.00, 0.20, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  
  0.00, 0.00, 0.00, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  0.20, 0.00, 0.20, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  0.20, 0.00, 0.00, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  
  //Side 2 of rectangle, (000,110,100)(000,110,010) -> (0,0,-1) (GREEN)
  0.00, 0.00, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  0.20, 0.50, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  0.20, 0.00, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  
  0.00, 0.00, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  0.20, 0.50, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  0.00, 0.50, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  
  //Side 3 of rectangle, (000,011,010)(000,011,001) -> (-1,0,0) (BLUE)
  0.00, 0.00, 0.00, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  0.00, 0.50, 0.20, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  0.00, 0.50, 0.00, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  
  0.00, 0.00, 0.00, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  0.00, 0.50, 0.20, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  0.00, 0.00, 0.20, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  
  //Side 4 of rectangle, (111,001,011)(111,001,101) -> (001) (YELLOW)
  0.20, 0.50, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  0.00, 0.00, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  0.00, 0.50, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  
  0.20, 0.50, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  0.00, 0.00, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  0.20, 0.00, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  
  //Side 5 of rectangle, (111,010,011)(111,010,110) -> (010) (CYAN)
  0.20, 0.50, 0.20, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  0.00, 0.50, 0.00, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  0.00, 0.50, 0.20, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  
  0.20, 0.50, 0.20, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  0.00, 0.50, 0.00, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  0.20, 0.50, 0.00, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  
  //Side 6 of rectangle, (111,100,101)(111,100,110) -> (100) (MAGENTA)
  0.20, 0.50, 0.20, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  0.20, 0.00, 0.00, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  0.20, 0.00, 0.20, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  
  0.20, 0.50, 0.20, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  0.20, 0.00, 0.00, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  0.20, 0.50, 0.00, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  ]);
    
  for (let i = 0; i < 12+36; i++) {
    tetra_rect[10*i+7] = tetra_rect[10*i+7] * 1;
    tetra_rect[10*i+8] = tetra_rect[10*i+8] * 1;
    tetra_rect[10*i+9] = tetra_rect[10*i+9] * 1;
  }
  
  for (let i = 0; i < 12+36; i++) {
    tetra_rect[10*i+4] = 1.0;
    tetra_rect[10*i+5] = 1.0;
    tetra_rect[10*i+6] = 0.0;
  }
  
    this.vboContents = new Float32Array((960+36+12)*10);
    this.vboContents.set(tenSphere, offset=0);
    this.vboContents.set(tetra_rect, offset=9600);
      
    this.vboVerts = 960+36+12;							// # of vertices held in 'vboContents' array;
    this.FSIZE = this.vboContents.BYTES_PER_ELEMENT;  
                                  // bytes req'd by 1 vboContents array element;
                                  // (why? used to compute stride and offset 
                                  // in bytes for vertexAttribPointer() calls)
    this.vboBytes = this.vboContents.length * this.FSIZE;               
                                  // (#  of floats in vboContents array) * 
                                  // (# of bytes/float).
    this.vboStride = this.vboBytes / this.vboVerts;     
                                  // (== # of bytes to store one complete vertex).
                                  // From any attrib in a given vertex in the VBO, 
                                  // move forward by 'vboStride' bytes to arrive 
                                  // at the same attrib for the next vertex.
                                   
                //----------------------Attribute sizes
    this.vboFcount_a_Pos1 =  4;    // # of floats in the VBO needed to store the
                                  // attribute named a_Pos1. (4: x,y,z,w values)
    this.vboFcount_a_Colr1 = 3;   // # of floats for this attrib (r,g,b values)
    this.vboFcount_a_Normal = 3;  // # of floats for this attrib (just one!)   
    console.assert((this.vboFcount_a_Pos1 +     // check the size of each and
                    this.vboFcount_a_Colr1 +
                    this.vboFcount_a_Normal) *   // every attribute in our VBO
                    this.FSIZE == this.vboStride, // for agreeement with'stride'
                    "Uh oh! VBObox1.vboStride disagrees with attribute-size values!");
                    
                //----------------------Attribute offsets
    this.vboOffset_a_Pos1 = 0;    //# of bytes from START of vbo to the START
                                  // of 1st a_Pos1 attrib value in vboContents[]
    this.vboOffset_a_Colr1 = (this.vboFcount_a_Pos1) * this.FSIZE;  
                                  // == 4 floats * bytes/float
                                  //# of bytes from START of vbo to the START
                                  // of 1st a_Colr1 attrib value in vboContents[]
    this.vboOffset_a_Normal =(this.vboFcount_a_Pos1 +
                              this.vboFcount_a_Colr1) * this.FSIZE; 
                                  // == 7 floats * bytes/float
                                  // # of bytes from START of vbo to the START
                                  // of 1st a_PtSize attrib value in vboContents[]
  
                //-----------------------GPU memory locations:                                
    this.vboLoc;									// GPU Location for Vertex Buffer Object, 
                                  // returned by gl.createBuffer() function call
    this.shaderLoc;								// GPU Location for compiled Shader-program  
                                  // set by compile/link of VERT_SRC and FRAG_SRC.
                            //------Attribute locations in our shaders:
    this.a_Pos1Loc;							  // GPU location: shader 'a_Pos1' attribute
    this.a_Colr1Loc;							// GPU location: shader 'a_Colr1' attribute
    this.a_NormalLoc;							// GPU location: shader 'a_PtSiz1' attribute
    
                //---------------------- Uniform locations &values in our shaders
    this.ModelMatrix = new Matrix4();	// Transforms CVV axes to model axes.
    this.u_ModelMatrixLoc;						// GPU location for u_ModelMat uniform
  
    //Felipe's addition: make a Normal Matrix too
    this.NormalMatrix = new Matrix4();
    this.u_NormalMatrixLoc;
    this.MvpMatrix = new Matrix4();
    this.u_MvpMatrixLoc;
  
    this.EyePos = new Vector3();
    this.u_EyePosLoc;
  
    this.LightColor = new Vector3();
    this.LightPosition = new Vector3();
    this.AmbientLight = new Vector3();
    this.SpecularLight = new Vector3();
  
    this.u_LightColorLoc;
    this.u_LightPositionLoc;
    this.u_AmbientLightLoc;
    this.u_SpecularLightLoc;
  
    this.emit = new Vector3();
    this.ambi = new Vector3();
    this.diff = new Vector3();
    this.spec = new Vector3();
    this.shiny = 0;
  
    this.u_emitLoc;
    this.u_ambiLoc;
    this.u_diffLoc;
    this.u_specLoc;
    this.u_shinyLoc;
  };
  
  //USE
  VBObox4.prototype.init = function() {
  //--------------------
  // a) Compile,link,upload shaders-----------------------------------------------
    this.shaderLoc = createProgram(gl, this.VERT_SRC, this.FRAG_SRC);
    if (!this.shaderLoc) {
      console.log(this.constructor.name + 
                  '.init() failed to create executable Shaders on the GPU. Bye!');
      return;
    }
  // CUTE TRICK: let's print the NAME of this VBObox object: tells us which one!
  //  else{console.log('You called: '+ this.constructor.name + '.init() fcn!');}
  
    gl.program = this.shaderLoc;		// (to match cuon-utils.js -- initShaders())
  
  // b) Create VBO on GPU, fill it------------------------------------------------
    this.vboLoc = gl.createBuffer();	
    if (!this.vboLoc) {
      console.log(this.constructor.name + 
                  '.init() failed to create VBO in GPU. Bye!'); 
      return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,	      // GLenum 'target' for this GPU buffer 
                    this.vboLoc);	
    gl.bufferData(gl.ARRAY_BUFFER, 			  // GLenum target(same as 'bindBuffer()')
                      this.vboContents, 		// JavaScript Float32Array
                     gl.STATIC_DRAW);
  
  // c1) Find All Attributes:-----------------------------------------------------
  //  Find & save the GPU location of all our shaders' attribute-variables and 
  //  uniform-variables (for switchToMe(), adjust(), draw(), reload(), etc.)
    this.a_Pos1Loc = gl.getAttribLocation(this.shaderLoc, 'a_Position');
    if(this.a_Pos1Loc < 0) {
      console.log(this.constructor.name + 
                  '.init() Failed to get GPU location of attribute a_Pos1');
      return -1;	// error exit.
    }
     this.a_Colr1Loc = gl.getAttribLocation(this.shaderLoc, 'a_Color');
    if(this.a_Colr1Loc < 0) {
      console.log(this.constructor.name + 
                  '.init() failed to get the GPU location of attribute a_Colr1');
      return -1;	// error exit.
    }
    this.a_NormalLoc = gl.getAttribLocation(this.shaderLoc, 'a_Normal');
    if(this.a_NormalLoc < 0) {
      console.log(this.constructor.name + 
                  '.init() failed to get the GPU location of attribute a_PtSiz1');
      return -1;	// error exit.
    }
    // c2) Find All Uniforms:-----------------------------------------------------
    //Get GPU storage location for each uniform var used in our shader programs: 
    this.u_ModelMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_ModelMatrix');
    if (!this.u_ModelMatrixLoc) { 
      console.log(this.constructor.name + 
                  '.init() failed to get GPU location for u_ModelMatrix uniform');
      return;
    }
  
    //Felipe's addition: find the uniform for Normal matrix
    this.u_NormalMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_NormalMatrix');
    if (!this.u_NormalMatrixLoc) { 
      console.log(this.constructor.name + 
                  '.init() failed to get GPU location for u_NormalMatrix uniform');
      //return;
    }
    this.u_MvpMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_MvpMatrix');
    if (!this.u_MvpMatrixLoc) { 
      console.log(this.constructor.name + 
                  '.init() failed to get GPU location for u_MvpMatrix uniform');
      //return;
    }
    this.u_EyePosLoc = gl.getUniformLocation(this.shaderLoc, 'u_EyePos');
    if (!this.u_EyePosLoc) { 
      console.log(this.constructor.name + 
                  '.init() failed to get GPU location for u_EyePos uniform');
      //return;
    }
  
    this.u_LightColorLoc = gl.getUniformLocation(this.shaderLoc, 'u_LightColor');
    if (!this.u_LightColorLoc) { 
      console.log(this.constructor.name +  '.init() failed to get GPU location for u_LightColor uniform');
      return;
    }
    this.u_LightPositionLoc = gl.getUniformLocation(this.shaderLoc, 'u_LightPosition');
    if (!this.u_LightPositionLoc) { 
      console.log(this.constructor.name +  '.init() failed to get GPU location for u_LightPosition uniform');
      //return;
    }
    this.u_AmbientLightLoc = gl.getUniformLocation(this.shaderLoc, 'u_AmbientLight');
    if (!this.u_AmbientLightLoc) { 
      console.log(this.constructor.name +  '.init() failed to get GPU location for u_AmbientLight uniform');
      return;
    }
    this.u_SpecularLightLoc = gl.getUniformLocation(this.shaderLoc, 'u_SpecularLight');
    if (!this.u_SpecularLightLoc) console.log(this.constructor.name +  ' u_SpecularLight failed');
  
    this.u_emitLoc = gl.getUniformLocation(this.shaderLoc, 'u_emit');
    if (!this.u_emitLoc) console.log(this.constructor.name +  ' u_emit failed');
    this.u_ambiLoc = gl.getUniformLocation(this.shaderLoc, 'u_ambi');
    if (!this.u_ambiLoc) console.log(this.constructor.name +  ' u_ambi failed');
    this.u_diffLoc = gl.getUniformLocation(this.shaderLoc, 'u_diff');
    if (!this.u_diffLoc) console.log(this.constructor.name +  ' u_diff failed');
    this.u_specLoc = gl.getUniformLocation(this.shaderLoc, 'u_spec');
    if (!this.u_specLoc) console.log(this.constructor.name +  ' u_spec failed');
    this.u_shinyLoc = gl.getUniformLocation(this.shaderLoc, 'u_shiny');
    if (!this.u_shinyLoc) console.log(this.constructor.name +  ' u_shiny failed');
  }
  
  VBObox4.prototype.switchToMe = function () {
  //==============================================================================
  // Set GPU to use this VBObox's contents (VBO, shader, attributes, uniforms...)
  //
  // We only do this AFTER we called the init() function, which does the one-time-
  // only setup tasks to put our VBObox contents into GPU memory.  !SURPRISE!
  // even then, you are STILL not ready to draw our VBObox's contents onscreen!
  // We must also first complete these steps:
  //  a) tell the GPU to use our VBObox's shader program (already in GPU memory),
  //  b) tell the GPU to use our VBObox's VBO  (already in GPU memory),
  //  c) tell the GPU to connect the shader program's attributes to that VBO.
  
  // a) select our shader program:
    gl.useProgram(this.shaderLoc);	
  //		Each call to useProgram() selects a shader program from the GPU memory,
  // but that's all -- it does nothing else!  Any previously used shader program's 
  // connections to attributes and uniforms are now invalid, and thus we must now
  // establish new connections between our shader program's attributes and the VBO
  // we wish to use.  
    
  // b) call bindBuffer to disconnect the GPU from its currently-bound VBO and
  //  instead connect to our own already-created-&-filled VBO.  This new VBO can 
  //    supply values to use as attributes in our newly-selected shader program:
    gl.bindBuffer(gl.ARRAY_BUFFER,	    // GLenum 'target' for this GPU buffer 
                      this.vboLoc);			// the ID# the GPU uses for our VBO.
  
  // c) connect our newly-bound VBO to supply attribute variable values for each
  // vertex to our SIMD shader program, using 'vertexAttribPointer()' function.
  // this sets up data paths from VBO to our shader units:
    // 	Here's how to use the almost-identical OpenGL version of this function:
    //		http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttribPointer.xml )
    gl.vertexAttribPointer(
      this.a_Pos1Loc,//index == ID# for the attribute var in GLSL shader pgm;
      this.vboFcount_a_Pos1, // # of floats used by this attribute: 1,2,3 or 4?
      gl.FLOAT,		  // type == what data type did we use for those numbers?
      false,				// isNormalized == are these fixed-point values that we need
                    //									normalize before use? true or false
      this.vboStride,// Stride == #bytes we must skip in the VBO to move from the
                    // stored attrib for this vertex to the same stored attrib
                    //  for the next vertex in our VBO.  This is usually the 
                    // number of bytes used to store one complete vertex.  If set 
                    // to zero, the GPU gets attribute values sequentially from 
                    // VBO, starting at 'Offset'.	
                    // (Our vertex size in bytes: 4 floats for pos + 3 for color)
      this.vboOffset_a_Pos1);						
                    // Offset == how many bytes from START of buffer to the first
                    // value we will actually use?  (we start with position).
    gl.vertexAttribPointer(this.a_Colr1Loc, this.vboFcount_a_Colr1,
                           gl.FLOAT, false, 
                           this.vboStride,  this.vboOffset_a_Colr1);
    gl.vertexAttribPointer(this.a_NormalLoc,this.vboFcount_a_Normal, 
                           gl.FLOAT, false, 
                           this.vboStride,	this.vboOffset_a_Normal);	
    //-- Enable this assignment of the attribute to its' VBO source:
    gl.enableVertexAttribArray(this.a_Pos1Loc);
    gl.enableVertexAttribArray(this.a_Colr1Loc);
    gl.enableVertexAttribArray(this.a_NormalLoc);
  }
  
  VBObox4.prototype.isReady = function() {
  //==============================================================================
  // Returns 'true' if our WebGL rendering context ('gl') is ready to render using
  // this objects VBO and shader program; else return false.
  // see: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter
  
  var isOK = true;
  
    if(gl.getParameter(gl.CURRENT_PROGRAM) != this.shaderLoc)  {
      console.log(this.constructor.name + 
                  '.isReady() false: shader program at this.shaderLoc not in use!');
      isOK = false;
    }
    if(gl.getParameter(gl.ARRAY_BUFFER_BINDING) != this.vboLoc) {
        console.log(this.constructor.name + 
                '.isReady() false: vbo at this.vboLoc not in use!');
      isOK = false;
    }
    return isOK;
  }
  
  VBObox4.prototype.adjust = function() {
  //==============================================================================
  // Update the GPU to newer, current values we now store for 'uniform' vars on 
  // the GPU; and (if needed) update each attribute's stride and offset in VBO.
  
    // check: was WebGL context set to use our VBO & shader program?
    if(this.isReady()==false) {
          console.log('ERROR! before' + this.constructor.name + 
                '.adjust() call you needed to call this.switchToMe()!!');
    }
    // Adjust values for our uniforms,
    this.ModelMatrix.setIdentity();
    //this.ModelMatrix.set(g_worldMat);
    this.MvpMatrix.setIdentity();
    this.MvpMatrix.set(g_mvpMat);
  
    //this.ModelMatrix.translate(1.0, -2.0, 0);						// then translate them.
    //this.ModelMatrix.rotate(g_angleNow2, 0, 0, 1);	// -spin drawing axes,
  
  }
  
  VBObox4.prototype.draw = function() {
    //=============================================================================
    // Send commands to GPU to select and render current VBObox contents.
    
      // check: was WebGL context set to use our VBO & shader program?
      if(this.isReady()==false) {
            console.log('ERROR! before' + this.constructor.name + 
                  '.draw() call you needed to call this.switchToMe()!!');
      }
      this.reMatrix = function() {
        actualMvp = new Matrix4();
        actualMvp.set(this.MvpMatrix);
        actualMvp.multiply(this.ModelMatrix);
        this.NormalMatrix.setInverseOf(this.ModelMatrix);
        this.NormalMatrix.transpose();
        gl.uniformMatrix4fv(this.u_ModelMatrixLoc, false, actualMvp.elements);	// send data from Javascript.
        gl.uniformMatrix4fv(this.u_NormalMatrixLoc, false, this.NormalMatrix.elements);	// send data from Javascript.
        gl.uniformMatrix4fv(this.u_MvpMatrixLoc, false, this.ModelMatrix.elements);	// send data from Javascript.
        
        gl.uniform3f(this.u_EyePos, posX, posY, posZ);
        
        this.LightColor = diffuseColor;
        this.LightPosition = lightPos;
        if(!ambientToggle){ this.AmbientLight = ambientColor; }
        else{ 
          this.AmbientLight = new Vector3(); 
          this.AmbientLight.x = 0.05;
          this.AmbientLight.y = 0.05;
          this.AmbientLight.z = 0.05;
        }
        if(diffuseToggle){ this.LightColor = diffuseColor; }
        else{ 
          this.LightColor = new Vector3(); 
          this.LightColor.x = 0.01;
          this.LightColor.y = 0.01;
          this.LightColor.z = 0.01;
        }
        if(specularToggle){ this.SpecularLight = specularColor; }
        else{ 
          this.SpecularLight = new Vector3(); 
          this.SpecularLight.x = 0.01;
          this.SpecularLight.y = 0.01;
          this.SpecularLight.z = 0.01;
        }
    
        //Light source
        gl.uniform3f(this.u_LightColorLoc, this.LightColor.x,this.LightColor.y,this.LightColor.z);
        gl.uniform3f(this.u_LightPositionLoc, this.LightPosition.x, this.LightPosition.y, this.LightPosition.z);
        gl.uniform3f(this.u_AmbientLightLoc, this.AmbientLight.x, this.AmbientLight.y, this.AmbientLight.z);
        gl.uniform3f(this.u_SpecularLightLoc, this.SpecularLight.x, this.SpecularLight.y, this.SpecularLight.z);
      
        //eye source
      }
    
      this.reMaterial = function(emissive, ambient, diffuse, specular, shiny){
    
        gl.uniform3fv(this.u_emitLoc, emissive);
        gl.uniform3fv(this.u_ambiLoc, ambient);
        gl.uniform3fv(this.u_diffLoc, diffuse);
        gl.uniform3fv(this.u_specLoc, specular);
        gl.uniform1f(this.u_shinyLoc, shiny);
      }
    
      this.drawBox = function() {
        this.reMatrix();
        gl.drawArrays(gl.TRIANGLES, 960+12, 36);		// number of vertices to draw on-screen.
      }
      this.drawSphere = function() {
        this.reMatrix();
        gl.drawArrays(gl.TRIANGLES, 0, 960);		// number of vertices to draw on-screen.
      }
      this.drawJointTree = function(count, pivotAngle, curlAngle){
        pushMatrix(this.ModelMatrix);
        this.ModelMatrix.rotate(-pivotAngle, 0, 0, 1);
        this.ModelMatrix.translate(-0.2, 0 , 0);
        this.drawBox();
        for(i = 0; i < count-1; i++){
          this.ModelMatrix.translate(0.2, 0.5, 0.0);
          this.ModelMatrix.scale(0.8,0.8,0.8);
          this.ModelMatrix.rotate(-curlAngle, 0,0,1);
          this.ModelMatrix.translate(-0.2, 0, 0);
          this.drawBox();
        }
        this.ModelMatrix = popMatrix();
      }
      this.drawSquid = function(pivotAngle, curlAngle, arms, joints){
        pushMatrix(this.ModelMatrix);
        for(k = 0; k<arms; k++){
          this.drawBox();
          this.ModelMatrix.translate(0,0.5,0);
          pushMatrix(this.ModelMatrix);
          this.drawJointTree(joints, pivotAngle, curlAngle);
          this.ModelMatrix = popMatrix();
          this.ModelMatrix.translate(0, -0.5, 0);
          this.ModelMatrix.rotate(360/arms, 1, 0, 0);
        }
        this.ModelMatrix = popMatrix();
      }
      this.drawTree = function(leanAngle, branchAngle, arms, joints){
        pushMatrix(this.ModelMatrix);
        this.ModelMatrix.rotate(90, 1, 0, 0);
        this.reMaterial([0,0,0],[0,0,0],[89/255,57/255,0],[0,0,0],0.0);
        this.drawJointTree(4, 0, 0);
        this.ModelMatrix.rotate(90, 1, 0, 0);
        this.ModelMatrix.rotate(90, 0, 1, 0);
        this.ModelMatrix.translate(1.5,0,0);
        this.ModelMatrix.scale(0.5,0.5,0.5);
        this.reMaterial([0,0,0],[0.05,0.05,0.05],[0,0.6,0],[0.2,0.2,0.2],60.0);
        this.drawSquid(leanAngle,branchAngle, arms, joints);
        this.ModelMatrix = popMatrix();
      }
      this.drawForest = function(xs, ys, zs, count){
        for(j = 0; j < count; j++){
          pushMatrix(this.ModelMatrix);
          this.ModelMatrix.translate(xs[j], ys[j], zs[j]);
          leanAngle = makeAngle(5,g_angleNow0 + j,-10,-15);
          this.drawTree(leanAngle, leanAngle, 5, 5);
          this.ModelMatrix = popMatrix();
        }
      }
      simulationSpeed = 1000;
      this.drawPlanet = function(radius, size, speed, offset, offsetSpeed){
        xpos = radius * Math.sin(g_angleNow0*speed / simulationSpeed);
        ypos = radius * Math.cos(g_angleNow0*speed / simulationSpeed);
        zpos = offset * Math.sin(g_angleNow0*offsetSpeed / simulationSpeed);
        this.ModelMatrix.translate(xpos, ypos, zpos);
        this.ModelMatrix.scale(size, size, size);
        this.drawSphere();
      }
      this.drawMoon = function(radius, size, speed, offset, offsetSpeed){
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[221/256,221/256,221/256],[0.5,0.5,0.5],1000.0);
        pushMatrix(this.ModelMatrix);
        xpos = radius * Math.sin(g_angleNow0*speed / simulationSpeed);
        ypos = radius * Math.cos(g_angleNow0*speed / simulationSpeed);
        zpos = offset * Math.sin(g_angleNow0*offsetSpeed / simulationSpeed);
        this.ModelMatrix.translate(xpos, ypos, zpos);
        this.ModelMatrix.scale(size, size, size);
        this.drawSphere();
        this.ModelMatrix = popMatrix();
      }
  
      this.drawPlanets = function(){
        pushMatrix(this.ModelMatrix);
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[0,0,0.6],[0.6,0.6,0.6],100.0);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        eS = 0.5;
        eD = 8;
        //Mercury
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[.5,.5,.5],[0.5,0.5,0.5],1000.0);
        this.drawPlanet(0.38*eD,0.38*eS,47.9, 0,0);
        this.ModelMatrix = popMatrix();
        //Venus
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[204/256,194/256,206/256],[0.5,0.5,0.5],1000.0);
        this.drawPlanet(0.72*eD,0.94*eS,35.0,0,0);
        this.ModelMatrix = popMatrix();
        //Earth
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[0/256,105/256,179/256],[0.5,0.5,0.5],100.0);
        this.drawPlanet(1*eD,1*eS,29.8,0,0);
        this.drawMoon(0.1*eD,0.2727,100,0.1,10);
        this.ModelMatrix = popMatrix();
        //Mars
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[122/256,48/256,0/256],[0.5,0.5,0.5],1000.0);
        this.drawPlanet(1.52*eD,0.53*eS,24.1,0,0);
        this.drawMoon(0.2*eD,0.5*0.2727/0.53,100,0.1,10);
        this.drawMoon(0.2*eD,0.5*0.2727/0.53,120,0.5,20);
        this.ModelMatrix = popMatrix();
        //Jupiter
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[250/256,156/256,126/256],[0.5,0.5,0.5],10.0);
        this.drawPlanet(5.2*eD,10.97*eS,13.1,0,0);
        for(i = 0; i < 79; i++){
          this.drawMoon(0.2*eD,0.05*0.2727/0.53*(i%5)/5,100+i,0.1*i/30*(i%5),i/2);
        }
        this.ModelMatrix = popMatrix();
        //Saturn
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[255/256,201/256,137/256],[0.5,0.5,0.5],50.0);
        this.drawPlanet(9.5*eD,9.14*eS,9.7,0,0);
        for(i = 0; i < 82; i++){
          this.drawMoon(0.2*eD,0.1*0.2727/0.53*(i%5)/2,100+i,0.1*i/30,i/2);
        }
        this.ModelMatrix = popMatrix();
        //Uranus
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[145/256,167/256,195/256],[0.5,0.5,0.5],1000.0);
        this.drawPlanet(19.2*eD,3.981*eS,6.8,0,0);
        for(i = 0; i < 27; i++){
          this.drawMoon(0.2*eD,0.1*0.2727/0.53*(i%5)/5,100+i,0.1*i/30*(i%5),i/2);
        }
        this.ModelMatrix = popMatrix();
        //Neptune
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[72/256,155/256,255/256],[0.5,0.5,0.5],1000.0);
        this.drawPlanet(30*eD,3.865*eS,5.4,0,0);
        for(i = 0; i < 14; i++){
          this.drawMoon(0.2*eD,0.1*0.2727/0.53*(i%5)/5,100+i,0.1*i/30*(i%5),i/2);
        }
        this.ModelMatrix = popMatrix();
        //Pluto
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[221/256,221/256,221/256],[0.5,0.5,0.5],1000.0);
        this.drawPlanet(39.5*eD,0.187*eS,4.67,0,0);
        this.ModelMatrix = popMatrix();
    
        this.reMaterial([0,0,0],[0.24725,0.1995,0.0745],[0.75164,0.60648,0.22648],[0.628281,0.555802,0.366065],51.2);
        this.reMaterial([0,0,0],[0.135,0.222,0.158],[0.54,0.89,0.63],[0.316,0.316,0.316],12.8);
        this.reMaterial([0.5,0,0],[0,0,0],[0,0,0],[0,0,0],0.0);
    
        this.ModelMatrix = popMatrix();
      }
      //Sun
      this.ModelMatrix.rotate(g_angleNow0, 0, 0,1);
      this.reMaterial([1,0.8,0],[0.1,0.1,0.1],[.5,.5,.5],[0.5,0.5,0.5],1000.0);
      this.drawSphere();
      if(planetsToggle) this.drawPlanets();
      if(treesToggle){
        this.ModelMatrix.setIdentity();
        this.ModelMatrix.translate(15.0, 0.0, 0);
        this.drawForest(
          [0,2,4,6,8,1,3,5,7,9,0,2,4,6,8,1,3,5,7,9,0,2,4,6,8],
          [0,0,0,0,0,2,2,2,2,2,4,4,4,4,4,6,6,6,6,6,8,8,8,8,8],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          25
        );
      }
      if(fingersToggle){
        this.ModelMatrix.setIdentity();
        this.ModelMatrix.rotate(g_angleNow0, 0, 0,1);
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[0.6,0.6,0.6],[0.6,0.6,0.6],100.0);
        this.ModelMatrix.translate(-2.3, -3.0, 0);
        this.ModelMatrix.scale(10,10,10);
        this.drawJointTree(5, 0,makeAngle(1,g_angleNow0, 0,90));
  
        
        this.ModelMatrix.setIdentity();
        this.ModelMatrix.rotate(g_angleNow0, 0, 0,1);
        this.ModelMatrix.translate(-2.3, -3.0, 2);
        this.ModelMatrix.rotate(90, 1, 0,0);
        this.ModelMatrix.scale(1,1,1);
        for(k = 0; k < 10; k++){
          this.ModelMatrix.translate(0, 0, -0.5);
          this.reMaterial([0,0,0],[0.1,0.1,0.1],[k/10,0,1-k/10],[0.6,0.6,0.6],100.0);
          this.drawJointTree(5, 0,makeAngle(1,g_angleNow0*(k+1), 0,90));
        }
  
      }
      
    
    }
  
  VBObox4.prototype.reload = function() {
  //=============================================================================
  // Over-write current values in the GPU for our already-created VBO: use 
  // gl.bufferSubData() call to re-transfer some or all of our Float32Array 
  // contents to our VBO without changing any GPU memory allocations.
  
   gl.bufferSubData(gl.ARRAY_BUFFER, 	// GLenum target(same as 'bindBuffer()')
                    0,                  // byte offset to where data replacement
                                        // begins in the VBO.
                      this.vboContents);   // the JS source-data array used to fill VBO
  }

  //=============================================================================Phong Blinn-Phong
//=============================================================================
function VBObox5() {
  //=============================================================================
  //=============================================================================
  // CONSTRUCTOR for one re-usable 'VBObox1' object that holds all data and fcns
  // needed to render vertices from one Vertex Buffer Object (VBO) using one 
  // separate shader program (a vertex-shader & fragment-shader pair) and one
  // set of 'uniform' variables.
  
  // Constructor goal: 
  // Create and set member vars that will ELIMINATE ALL LITERALS (numerical values 
  // written into code) in all other VBObox functions. Keeping all these (initial)
  // values here, in this one coonstrutor function, ensures we can change them 
  // easily WITHOUT disrupting any other code, ever!
    
  this.VERT_SRC = 
    `uniform mat4 u_ModelMatrix;
    uniform mat4 u_NormalMatrix;
    uniform mat4 u_MvpMatrix;
    
    
    attribute vec4 a_Position;
    attribute vec3 a_Color;
    attribute vec3 a_Normal;
    
    varying vec4 v_Color;
    varying vec4 v_Position;
    varying vec3 v_Normal;

    void main() {
      a_Color;
       vec4 transVec = u_NormalMatrix * vec4(a_Normal, 0.0);
       vec3 normal = normalize(transVec.xyz);
       gl_Position = u_ModelMatrix * a_Position;
       v_Position = u_MvpMatrix * a_Position;
       v_Normal = normal;
  
      
    }`;
  
  // Fragment shader program----------------------------------
  this.FRAG_SRC = 
    `precision mediump float;
    varying vec4 v_Color;
    varying vec4 v_Position;
    varying vec3 v_Normal;

    uniform vec3 u_EyePos;
  
    //Light Variables
    uniform vec3 u_LightColor;
    uniform vec3 u_LightPosition;
    uniform vec3 u_AmbientLight;
    uniform vec3 u_SpecularLight;
  
    //Material Variables
    uniform vec3 u_emit;
    uniform vec3 u_ambi;
    uniform vec3 u_diff;
    uniform vec3 u_spec;
    uniform float u_shiny;

    void main() {
      vec3 normal = normalize(v_Normal);
      vec3 lightDirection = normalize(u_LightPosition - vec3(v_Position));
      float nDotL = max(dot(lightDirection, normal), 0.0);

      //phong
       vec3 eyeDirection = normalize(u_EyePos - v_Position.xyz);
       vec3 lightDir = normalize(u_LightPosition - vec3(v_Position));
       vec3 R = reflect(-lightDir, normal);
       vec3 H = normalize(lightDir + eyeDirection);
       float nDotH = max(dot(H, normal),0.0);
       float rDotV = max(dot(R, eyeDirection),0.0);
       float e64 = pow(rDotV, float(u_shiny));
       vec3 specular = u_SpecularLight * u_spec * e64;
 
      //float e64 = pow(nDotH, float(u_MatlSet[0].shiny));
      vec3 emissive = u_emit;
      vec3 diffuse = u_LightColor * u_diff * nDotL;
      vec3 ambient = u_AmbientLight * u_ambi;
      //vec3 specular = u_SpecularLight * u_spec * e64;
      gl_FragColor = vec4(diffuse + ambient + emissive + specular, 1.0);
    }`;
  
  var c30 = Math.sqrt(0.75);					// == cos(30deg) == sqrt(3) / 2
  var sq2	= Math.sqrt(2.0);						 
  // for surface normals:
  var sq23 = Math.sqrt(2.0/3.0)
  var sq29 = Math.sqrt(2.0/9.0)
  var sq89 = Math.sqrt(8.0/9.0)
  var thrd = 1.0/3.0;
  
  var sphere = new Float32Array([0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.1875938387542828,-0.577343625690456,-0.7946589768800393,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.1875938387542828,-0.577343625690456,-0.7946589768800393,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,0.1875938387542828,-0.577343625690456,-0.7946589768800393,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.6070569201887998,0.0,-0.7946583515265471,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.6070569201887998,0.0,-0.7946583515265471,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.6070569201887998,0.0,-0.7946583515265471,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.4911213143210803,-0.3568183375876395,-0.7946574913638756,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.4911213143210803,-0.3568183375876395,-0.7946574913638756,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.4911213143210803,-0.3568183375876395,-0.7946574913638756,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.4911212952319224,0.356818323720363,-0.7946575093882327,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.4911212952319224,0.356818323720363,-0.7946575093882327,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.4911212952319224,0.356818323720363,-0.7946575093882327,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.18759383875292585,0.5773436256885401,-0.7946589768817515,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,0.18759383875292585,0.5773436256885401,-0.7946589768817515,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.18759383875292585,0.5773436256885401,-0.7946589768817515,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.9822470326522897,0.0,-0.18759202234042818,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9822470326522897,0.0,-0.18759202234042818,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.9822470326522897,0.0,-0.18759202234042818,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.30353357597519004,-0.934171212988684,-0.18759401130890158,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.30353357597519004,-0.934171212988684,-0.18759401130890158,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.30353357597519004,-0.934171212988684,-0.18759401130890158,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.7946554066806886,-0.5773485124543632,-0.18759392260913862,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.7946554066806886,-0.5773485124543632,-0.18759392260913862,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.7946554066806886,-0.5773485124543632,-0.18759392260913862,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.794655462880779,0.5773484504343182,-0.18759387541928604,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.794655462880779,0.5773484504343182,-0.18759387541928604,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.794655462880779,0.5773484504343182,-0.18759387541928604,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.3035335759751898,0.9341712129886843,-0.18759401130890102,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.3035335759751898,0.9341712129886843,-0.18759401130890102,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.3035335759751898,0.9341712129886843,-0.18759401130890102,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.7946554066806881,-0.5773485124543637,0.18759392260913862,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.7946554066806881,-0.5773485124543637,0.18759392260913862,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.7946554066806881,-0.5773485124543637,0.18759392260913862,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.30353357597519004,-0.934171212988684,0.1875940113089015,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.30353357597519004,-0.934171212988684,0.1875940113089015,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.30353357597519004,-0.934171212988684,0.1875940113089015,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9822470326522897,0.0,0.1875920223404278,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.9822470326522897,0.0,0.1875920223404278,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.9822470326522897,0.0,0.1875920223404278,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.30353357597518976,0.9341712129886842,0.18759401130890094,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.30353357597518976,0.9341712129886842,0.18759401130890094,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.30353357597518976,0.9341712129886842,0.18759401130890094,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.7946554628807785,0.5773484504343186,0.18759387541928607,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.7946554628807785,0.5773484504343186,0.18759387541928607,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.7946554628807785,0.5773484504343186,0.18759387541928607,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.49112131432107986,-0.3568183375876391,0.794657491363876,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.49112131432107986,-0.3568183375876391,0.794657491363876,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.49112131432107986,-0.3568183375876391,0.794657491363876,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,-0.1875938387542832,-0.5773436256904565,0.7946589768800388,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.1875938387542832,-0.5773436256904565,0.7946589768800388,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.1875938387542832,-0.5773436256904565,0.7946589768800388,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.6070569201888002,0.0,0.7946583515265467,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.6070569201888002,0.0,0.7946583515265467,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.6070569201888002,0.0,0.7946583515265467,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.18759383875292623,0.5773436256885406,0.794658976881751,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.18759383875292623,0.5773436256885406,0.794658976881751,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,-0.18759383875292623,0.5773436256885406,0.794658976881751,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.49112129523192194,0.3568183237203626,0.794657509388233,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.49112129523192194,0.3568183237203626,0.794657509388233,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.49112129523192194,0.3568183237203626,0.794657509388233,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.39277083954784114,0.6647053901731114,0.6355295523228608,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.39277083954784114,0.6647053901731114,0.6355295523228608,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.39277083954784114,0.6647053901731114,0.6355295523228608,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.23142914359315586,0.16814384664118306,0.9582109362413084,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.23142914359315586,0.16814384664118306,0.9582109362413084,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,0.23142914359315586,0.16814384664118306,0.9582109362413084,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.753547360433901,0.16814471954107602,0.6355263400312792,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.753547360433901,0.16814471954107602,0.6355263400312792,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.753547360433901,0.16814471954107602,0.6355263400312792,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.5108013377780002,0.5789515093717558,0.635529026182417,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.5108013377780002,0.5789515093717558,0.635529026182417,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.5108013377780002,0.5789515093717558,0.635529026182417,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,-0.08839935760178926,0.2720608540734848,0.958211065087644,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.08839935760178926,0.2720608540734848,0.958211065087644,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.08839935760178926,0.2720608540734848,0.958211065087644,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,0.07293921197231296,0.7686236608447644,0.6355293379116738,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,0.07293921197231296,0.7686236608447644,0.6355293379116738,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.07293921197231296,0.7686236608447644,0.6355293379116738,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.7084658042311468,-0.3068886946778563,0.6355277596722553,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.7084658042311468,-0.3068886946778563,0.6355277596722553,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.7084658042311468,-0.3068886946778563,0.6355277596722553,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.28606474884708283,0.0,0.958210289793976,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.28606474884708283,0.0,0.958210289793976,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.28606474884708283,0.0,0.958210289793976,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.708465804230484,0.3068886946789983,0.6355277596724428,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.708465804230484,0.3068886946789983,0.6355277596724428,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.708465804230484,0.3068886946789983,0.6355277596724428,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.07293907981253693,-0.7686236864389787,0.6355293221253091,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,0.07293907981253693,-0.7686236864389787,0.6355293221253091,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,0.07293907981253693,-0.7686236864389787,0.6355293221253091,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.08839938045579887,-0.2720608602432967,0.9582110612274878,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.08839938045579887,-0.2720608602432967,0.9582110612274878,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,-0.08839938045579887,-0.2720608602432967,0.9582110612274878,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.5108013129423995,-0.5789514469236773,0.6355291030325059,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.5108013129423995,-0.5789514469236773,0.6355291030325059,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.5108013129423995,-0.5789514469236773,0.6355291030325059,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.7535473604341476,-0.1681447195414963,0.6355263400308759,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.7535473604341476,-0.1681447195414963,0.6355263400308759,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.7535473604341476,-0.1681447195414963,0.6355263400308759,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,0.23142914432949518,-0.16814383202830113,0.9582109386276887,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.23142914432949518,-0.16814383202830113,0.9582109386276887,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.23142914432949518,-0.16814383202830113,0.9582109386276887,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.39277100439986257,-0.6647053901773582,0.6355294504363187,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.39277100439986257,-0.6647053901773582,0.6355294504363187,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.39277100439986257,-0.6647053901773582,0.6355294504363187,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.7968690849665907,0.5789540848799208,-0.17266102346899806,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.7968690849665907,0.5789540848799208,-0.17266102346899806,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.7968690849665907,0.5789540848799208,-0.17266102346899806,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.8965821692443947,0.2720605719210893,0.3494616702858627,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.8965821692443947,0.2720605719210893,0.3494616702858627,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.8965821692443947,0.2720605719210893,0.3494616702858627,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.535806440050527,0.7686269265317828,0.34946259686937375,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.535806440050527,0.7686269265317828,0.34946259686937375,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.535806440050527,0.7686269265317828,0.34946259686937375,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.30437401847623374,0.9367735492298488,-0.17266086510828546,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.30437401847623374,0.9367735492298488,-0.17266086510828546,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.30437401847623374,0.9367735492298488,-0.17266086510828546,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,0.018308870240782232,0.9367708785687859,0.34946402724167636,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.018308870240782232,0.9367708785687859,0.34946402724167636,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,0.018308870240782232,0.9367708785687859,0.34946402724167636,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.5654358177612575,0.7470993573185782,0.3494637124034841,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.5654358177612575,0.7470993573185782,0.3494637124034841,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.5654358177612575,0.7470993573185782,0.3494637124034841,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9849818442352473,-0.0,-0.17265794660811634,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.9849818442352473,-0.0,-0.17265794660811634,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9849818442352473,-0.0,-0.17265794660811634,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.8852651476838903,0.3068895341634237,0.3494630625934256,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.8852651476838903,0.3068895341634237,0.3494630625934256,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.8852651476838903,0.3068895341634237,0.3494630625934256,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.8852651543182758,-0.3068895218351865,0.34946305661344207,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.8852651543182758,-0.3068895218351865,0.34946305661344207,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.8852651543182758,-0.3068895218351865,0.34946305661344207,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.3043740184762341,-0.9367735492298489,-0.17266086510828474,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.3043740184762341,-0.9367735492298489,-0.17266086510828474,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.3043740184762341,-0.9367735492298489,-0.17266086510828474,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.5654359322761605,-0.7470993573184301,0.34946352711746276,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.5654359322761605,-0.7470993573184301,0.34946352711746276,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.5654359322761605,-0.7470993573184301,0.34946352711746276,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.01830887024078118,-0.9367708785687856,0.3494640272416773,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,0.01830887024078118,-0.9367708785687856,0.3494640272416773,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,0.01830887024078118,-0.9367708785687856,0.3494640272416773,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.7968690273363406,-0.5789541473282623,-0.17266108004828137,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.7968690273363406,-0.5789541473282623,-0.17266108004828137,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.7968690273363406,-0.5789541473282623,-0.17266108004828137,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.5358065214403914,-0.7686268400790313,0.34946266222884337,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.5358065214403914,-0.7686268400790313,0.34946266222884337,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.5358065214403914,-0.7686268400790313,0.34946266222884337,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.896582164193717,-0.27206058113615955,0.3494616760698745,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.896582164193717,-0.27206058113615955,0.3494616760698745,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.896582164193717,-0.27206058113615955,0.3494616760698745,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.018308870240782205,0.9367708785687859,-0.34946402724167613,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,-0.018308870240782205,0.9367708785687859,-0.34946402724167613,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,-0.018308870240782205,0.9367708785687859,-0.34946402724167613,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.30437401847623347,0.9367735492298487,0.17266086510828524,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.30437401847623347,0.9367735492298487,0.17266086510828524,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.30437401847623347,0.9367735492298487,0.17266086510828524,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.5654358177612576,0.7470993573185785,-0.3494637124034841,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.5654358177612576,0.7470993573185785,-0.3494637124034841,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.5654358177612576,0.7470993573185785,-0.3494637124034841,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.8965821692443952,0.2720605719210894,-0.34946167028586195,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.8965821692443952,0.2720605719210894,-0.34946167028586195,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.8965821692443952,0.2720605719210894,-0.34946167028586195,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.7968690849665907,0.5789540848799208,0.17266102346899803,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.7968690849665907,0.5789540848799208,0.17266102346899803,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.7968690849665907,0.5789540848799208,0.17266102346899803,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.5358064400505267,0.7686269265317832,-0.34946259686937364,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.5358064400505267,0.7686269265317832,-0.34946259686937364,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.5358064400505267,0.7686269265317832,-0.34946259686937364,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.535806521440391,-0.7686268400790315,-0.34946266222884337,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.535806521440391,-0.7686268400790315,-0.34946266222884337,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.535806521440391,-0.7686268400790315,-0.34946266222884337,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.7968690273363406,-0.5789541473282624,0.17266108004828132,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.7968690273363406,-0.5789541473282624,0.17266108004828132,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.7968690273363406,-0.5789541473282624,0.17266108004828132,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.8965821641937172,-0.27206058113615966,-0.3494616760698737,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.8965821641937172,-0.27206058113615966,-0.3494616760698737,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.8965821641937172,-0.27206058113615966,-0.3494616760698737,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.5654359322761607,-0.7470993573184304,-0.34946352711746276,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.5654359322761607,-0.7470993573184304,-0.34946352711746276,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.5654359322761607,-0.7470993573184304,-0.34946352711746276,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.30437401847623385,-0.9367735492298487,0.17266086510828454,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.30437401847623385,-0.9367735492298487,0.17266086510828454,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.30437401847623385,-0.9367735492298487,0.17266086510828454,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,-0.01830887024078116,-0.9367708785687855,-0.3494640272416772,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,-0.01830887024078116,-0.9367708785687855,-0.3494640272416772,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.01830887024078116,-0.9367708785687855,-0.3494640272416772,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.8852651476838904,0.30688953416342346,-0.3494630625934258,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.8852651476838904,0.30688953416342346,-0.3494630625934258,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.8852651476838904,0.30688953416342346,-0.3494630625934258,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9849818442352474,0.0,0.17265794660811573,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9849818442352474,0.0,0.17265794660811573,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9849818442352474,0.0,0.17265794660811573,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.8852651543182759,-0.30688952183518625,-0.3494630566134423,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.8852651543182759,-0.30688952183518625,-0.3494630566134423,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.8852651543182759,-0.30688952183518625,-0.3494630566134423,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.08839935760178921,0.2720608540734848,-0.958211065087644,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,0.08839935760178921,0.2720608540734848,-0.958211065087644,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.08839935760178921,0.2720608540734848,-0.958211065087644,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.5108013377780005,0.578951509371756,-0.6355290261824166,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.5108013377780005,0.578951509371756,-0.6355290261824166,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.5108013377780005,0.578951509371756,-0.6355290261824166,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.07293921197231347,0.7686236608447645,-0.6355293379116738,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,-0.07293921197231347,0.7686236608447645,-0.6355293379116738,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,-0.07293921197231347,0.7686236608447645,-0.6355293379116738,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,-0.2314291435931551,0.1681438466411829,-0.9582109362413085,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.2314291435931551,0.1681438466411829,-0.9582109362413085,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.2314291435931551,0.1681438466411829,-0.9582109362413085,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.39277083954784103,0.6647053901731109,-0.6355295523228613,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.39277083954784103,0.6647053901731109,-0.6355295523228613,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.39277083954784103,0.6647053901731109,-0.6355295523228613,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.7535473604339004,0.16814471954107618,-0.6355263400312802,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.7535473604339004,0.16814471954107618,-0.6355263400312802,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.7535473604339004,0.16814471954107618,-0.6355263400312802,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.23142914432949452,-0.168143832028301,-0.9582109386276889,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,-0.23142914432949452,-0.168143832028301,-0.9582109386276889,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.23142914432949452,-0.168143832028301,-0.9582109386276889,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.7535473604341468,-0.16814471954149637,-0.6355263400308768,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.7535473604341468,-0.16814471954149637,-0.6355263400308768,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.7535473604341468,-0.16814471954149637,-0.6355263400308768,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.39277100439986257,-0.6647053901773577,-0.6355294504363193,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.39277100439986257,-0.6647053901773577,-0.6355294504363193,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.39277100439986257,-0.6647053901773577,-0.6355294504363193,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.28606474884708194,0.0,-0.9582102897939762,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.28606474884708194,0.0,-0.9582102897939762,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.28606474884708194,0.0,-0.9582102897939762,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.7084658042304844,0.3068886946789989,-0.6355277596724419,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.7084658042304844,0.3068886946789989,-0.6355277596724419,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.7084658042304844,0.3068886946789989,-0.6355277596724419,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.7084658042311474,-0.3068886946778569,-0.6355277596722544,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.7084658042311474,-0.3068886946778569,-0.6355277596722544,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.7084658042311474,-0.3068886946778569,-0.6355277596722544,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,0.08839938045579884,-0.2720608602432967,-0.9582110612274878,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.08839938045579884,-0.2720608602432967,-0.9582110612274878,
    0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.08839938045579884,-0.2720608602432967,-0.9582110612274878,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,-0.07293907981253746,-0.7686236864389787,-0.6355293221253092,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.07293907981253746,-0.7686236864389787,-0.6355293221253092,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,-0.07293907981253746,-0.7686236864389787,-0.6355293221253092,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.5108013129423997,-0.5789514469236775,-0.6355291030325054,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.5108013129423997,-0.5789514469236775,-0.6355291030325054,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.5108013129423997,-0.5789514469236775,-0.6355291030325054,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.4556801884210278,-0.45302720531155727,-0.7662388120737402,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.4556801884210278,-0.45302720531155727,-0.7662388120737402,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.4556801884210278,-0.45302720531155727,-0.7662388120737402,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.3736135165266664,-0.7056100416852756,-0.6021024907285153,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.3736135165266664,-0.7056100416852756,-0.6021024907285153,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.3736135165266664,-0.7056100416852756,-0.6021024907285153,
    0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.6048673099190088,-0.5626946300326399,-0.563480514945967,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.6048673099190088,-0.5626946300326399,-0.563480514945967,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.6048673099190088,-0.5626946300326399,-0.563480514945967,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.11249635206289342,-0.790453586184493,-0.6021027311519319,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,0.11249635206289342,-0.790453586184493,-0.6021027311519319,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,0.11249635206289342,-0.790453586184493,-0.6021027311519319,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.10236296935915444,-0.634348937053083,-0.7662396808855573,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,-0.10236296935915444,-0.634348937053083,-0.7662396808855573,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.10236296935915444,-0.634348937053083,-0.7662396808855573,
    -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.15859766198666153,-0.8107643536568595,-0.5634784329960992,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.15859766198666153,-0.8107643536568595,-0.5634784329960992,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,-0.15859766198666153,-0.8107643536568595,-0.5634784329960992,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.030193516312269564,-0.41222790039055296,-0.9105803148060565,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,-0.030193516312269564,-0.41222790039055296,-0.9105803148060565,
    0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,-0.030193516312269564,-0.41222790039055296,-0.9105803148060565,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.2667315616493873,-0.3157493036139344,-0.9105803925449936,
    0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.2667315616493873,-0.3157493036139344,-0.9105803925449936,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.2667315616493873,-0.3157493036139344,-0.9105803925449936,
    -0.08942674659491123,0.08942674659491123,-1.0,1.0,0.05243045372163609,-0.16136170037511793,-0.9855016231212377,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.05243045372163609,-0.16136170037511793,-0.9855016231212377,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,0.05243045372163609,-0.16136170037511793,-0.9855016231212377,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.5716702792979942,-0.2933787781117714,-0.7662388559196129,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.5716702792979942,-0.2933787781117714,-0.7662388559196129,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.5716702792979942,-0.2933787781117714,-0.7662388559196129,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.7865295373716213,-0.13727635663558188,-0.6021017262480185,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.7865295373716213,-0.13727635663558188,-0.6021017262480185,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.7865295373716213,-0.13727635663558188,-0.6021017262480185,
    0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.7220727651688029,-0.40137334761281973,-0.5634805743125112,
    0.4543625320130238,-0.30565466976804523,-0.7037129238519375,1.0,0.7220727651688029,-0.40137334761281973,-0.5634805743125112,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.7220727651688029,-0.40137334761281973,-0.5634805743125112,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.7865295373716089,0.1372763566355817,-0.6021017262480348,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.7865295373716089,0.1372763566355817,-0.6021017262480348,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.7865295373716089,0.1372763566355817,-0.6021017262480348,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.5716703002569032,0.29337878079020263,-0.7662388392572099,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.5716703002569032,0.29337878079020263,-0.7662388392572099,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.5716703002569032,0.29337878079020263,-0.7662388392572099,
    0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.7220727651677648,0.40137334761328575,-0.5634805743135096,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.7220727651677648,0.40137334761328575,-0.5634805743135096,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.7220727651677648,0.40137334761328575,-0.5634805743135096,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.38272124069341656,0.15610136154465032,-0.910580483453274,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.38272124069341656,0.15610136154465032,-0.910580483453274,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.38272124069341656,0.15610136154465032,-0.910580483453274,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.3827212475001285,-0.15610137316785758,-0.9105804785998076,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.3827212475001285,-0.15610137316785758,-0.9105804785998076,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.3827212475001285,-0.15610137316785758,-0.9105804785998076,
    -0.08942674659491123,0.08942674659491123,-1.0,1.0,0.16966523322150937,0.0,-0.9855017547604321,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.16966523322150937,0.0,-0.9855017547604321,
    0.11187884470891607,-0.056828603909637176,-0.9653429738380725,1.0,0.16966523322150937,0.0,-0.9855017547604321,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.2900434909837939,-0.5733687582967675,-0.7662395450165417,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.2900434909837939,-0.5733687582967675,-0.7662395450165417,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.2900434909837939,-0.5733687582967675,-0.7662395450165417,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.5556259833512646,-0.5733698183711547,-0.6021019996694658,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.5556259833512646,-0.5733698183711547,-0.6021019996694658,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.5556259833512646,-0.5733698183711547,-0.6021019996694658,
    -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.3482411474888479,-0.7491463488592234,-0.5634783502376512,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.3482411474888479,-0.7491463488592234,-0.5634783502376512,
    -0.2971316648377794,-0.5498341226369787,-0.7037133076286091,1.0,-0.3482411474888479,-0.7491463488592234,-0.5634783502376512,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.7170079792657081,-0.35124827568421596,-0.6020998310065955,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.7170079792657081,-0.35124827568421596,-0.6020998310065955,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.7170079792657081,-0.35124827568421596,-0.6020998310065955,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.6349390266407596,-0.09866770853416246,-0.7662356789794523,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.6349390266407596,-0.09866770853416246,-0.7662356789794523,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.6349390266407596,-0.09866770853416246,-0.7662356789794523,
    -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.8200745038929086,-0.09972382650385823,-0.5635006357513968,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.8200745038929086,-0.09972382650385823,-0.5635006357513968,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.8200745038929086,-0.09972382650385823,-0.5635006357513968,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.40138618486326477,-0.09866777504353715,-0.9105788273229676,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.40138618486326477,-0.09866777504353715,-0.9105788273229676,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.40138618486326477,-0.09866777504353715,-0.9105788273229676,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.21787243246147198,-0.3512482946875778,-0.9105801659669454,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.21787243246147198,-0.3512482946875778,-0.9105801659669454,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,-0.21787243246147198,-0.3512482946875778,-0.9105801659669454,
    -0.08942674659491123,0.08942674659491123,-1.0,1.0,-0.13726376049162442,-0.09972733209314655,-0.9855014557519847,
    -0.1663170982465726,-0.1472214262383973,-0.9653429738380725,1.0,-0.13726376049162442,-0.09972733209314655,-0.9855014557519847,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.13726376049162442,-0.09972733209314655,-0.9855014557519847,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.6349390266407687,0.09866770853401646,-0.7662356789794637,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.6349390266407687,0.09866770853401646,-0.7662356789794637,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.6349390266407687,0.09866770853401646,-0.7662356789794637,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.7170079792643385,0.35124827568689115,-0.6020998310066659,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.7170079792643385,0.35124827568689115,-0.6020998310066659,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.7170079792643385,0.35124827568689115,-0.6020998310066659,
    -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.8200745038929456,0.09972382650341055,-0.5635006357514222,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.8200745038929456,0.09972382650341055,-0.5635006357514222,
    -0.7615881329031425,0.08942674659491123,-0.7037090434286639,1.0,-0.8200745038929456,0.09972382650341055,-0.5635006357514222,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.5556260194438505,0.5733697244076056,-0.6021020558424696,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.5556260194438505,0.5733697244076056,-0.6021020558424696,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.5556260194438505,0.5733697244076056,-0.6021020558424696,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.29004345688710037,0.5733688522583721,-0.7662394876126509,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.29004345688710037,0.5733688522583721,-0.7662394876126509,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.29004345688710037,0.5733688522583721,-0.7662394876126509,
    -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.3482409616935952,0.7491463488573392,-0.563478465065381,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.3482409616935952,0.7491463488573392,-0.563478465065381,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.3482409616935952,0.7491463488573392,-0.563478465065381,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.2178724354453621,0.35124826452696245,-0.9105801768871886,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,-0.2178724354453621,0.35124826452696245,-0.9105801768871886,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.2178724354453621,0.35124826452696245,-0.9105801768871886,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.40138618451518493,0.09866778374700656,-0.9105788265333188,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.40138618451518493,0.09866778374700656,-0.9105788265333188,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.40138618451518493,0.09866778374700656,-0.9105788265333188,
    -0.08942674659491123,0.08942674659491123,-1.0,1.0,-0.13726376036863866,0.09972734098810344,-0.9855014548689939,
    -0.3382552643679121,0.08942674659491123,-0.9653423768501518,1.0,-0.13726376036863866,0.09972734098810344,-0.9855014548689939,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,-0.13726376036863866,0.09972734098810344,-0.9855014548689939,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.1023630609837684,0.6343489989811777,-0.7662396173767128,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.1023630609837684,0.6343489989811777,-0.7662396173767128,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,-0.1023630609837684,0.6343489989811777,-0.7662396173767128,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.1124963520628935,0.7904535861844924,-0.602102731151933,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,0.1124963520628935,0.7904535861844924,-0.602102731151933,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,0.1124963520628935,0.7904535861844924,-0.602102731151933,
    -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.15859768341130098,0.810764268801057,-0.5634785490611477,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,-0.15859768341130098,0.810764268801057,-0.5634785490611477,
    -0.2971316648377794,0.7286875731845512,-0.7037133076286091,1.0,-0.15859768341130098,0.810764268801057,-0.5634785490611477,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.37361364022533977,0.7056100351752889,-0.602102421600759,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.37361364022533977,0.7056100351752889,-0.602102421600759,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.37361364022533977,0.7056100351752889,-0.602102421600759,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.4556802023562997,0.4530272348130372,-0.7662387863441624,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.4556802023562997,0.4530272348130372,-0.7662387863441624,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.4556802023562997,0.4530272348130372,-0.7662387863441624,
    0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.6048672442080645,0.5626947063712658,-0.5634805092511155,
    0.4543625320130238,0.48450816295679444,-0.7037129238519375,1.0,0.6048672442080645,0.5626947063712658,-0.5634805092511155,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.6048672442080645,0.5626947063712658,-0.5634805092511155,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.2667315350342877,0.315749297785993,-0.9105804023620896,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.2667315350342877,0.315749297785993,-0.9105804023620896,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.2667315350342877,0.315749297785993,-0.9105804023620896,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.030193527704173675,0.41222786395924527,-0.9105803309210974,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,-0.030193527704173675,0.41222786395924527,-0.9105803309210974,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,-0.030193527704173675,0.41222786395924527,-0.9105803309210974,
    -0.08942674659491123,0.08942674659491123,-1.0,1.0,0.052430445101050945,0.16136171190180873,-0.9855016216925385,
    -0.1663170982465726,0.32607489810888346,-0.9653429738380725,1.0,0.052430445101050945,0.16136171190180873,-0.9855016216925385,
    0.11187884470891607,0.235682097099567,-0.9653429738380725,1.0,0.052430445101050945,0.16136171190180873,-0.9855016216925385,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.8902790375102705,-0.13727627232073927,-0.43423318669524646,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.8902790375102705,-0.13727627232073927,-0.43423318669524646,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.8902790375102705,-0.13727627232073927,-0.43423318669524646,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.9410026579935737,-0.2933790714736124,-0.16864969039494385,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.9410026579935737,-0.2933790714736124,-0.16864969039494385,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.9410026579935737,-0.2933790714736124,-0.16864969039494385,
    0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.8269096225934555,-0.4013733060946441,-0.3938526948200357,
    0.6556698929594884,-0.1593982105713322,-0.5499274659674465,1.0,0.8269096225934555,-0.4013733060946441,-0.3938526948200357,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.8269096225934555,-0.4013733060946441,-0.3938526948200357,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.9856061035044801,-0.15610228082891986,0.0649052128470842,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9856061035044801,-0.15610228082891986,0.0649052128470842,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9856061035044801,-0.15610228082891986,0.0649052128470842,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.9856061030015378,0.1561022807492629,0.0649052206760001,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9856061030015378,0.1561022807492629,0.0649052206760001,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9856061030015378,0.1561022807492629,0.0649052206760001,
    0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.9573342053980672,-0.0,0.28898307766174003,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9573342053980672,-0.0,0.28898307766174003,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9573342053980672,-0.0,0.28898307766174003,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.9410026557723999,0.29337908242205546,-0.16864968374261155,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.9410026557723999,0.29337908242205546,-0.16864968374261155,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.9410026557723999,0.29337908242205546,-0.16864968374261155,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.8902790348330735,0.13727627240355514,-0.4342331921579418,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.8902790348330735,0.13727627240355514,-0.4342331921579418,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.8902790348330735,0.13727627240355514,-0.4342331921579418,
    0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.8269096225925395,0.4013733060952317,-0.3938526948213602,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.8269096225925395,0.4013733060952317,-0.3938526948213602,
    0.6556698929594884,0.33825170376115454,-0.5499274659674465,1.0,0.8269096225925395,0.4013733060952317,-0.3938526948213602,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.1445571334445321,-0.8891249105991275,-0.4342351074272938,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.1445571334445321,-0.8891249105991275,-0.4342351074272938,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,0.1445571334445321,-0.8891249105991275,-0.4342351074272938,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,0.011764727228162504,-0.9856057285447228,-0.16865034554685346,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,0.011764727228162504,-0.9856057285447228,-0.16865034554685346,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.011764727228162504,-0.9856057285447228,-0.16865034554685346,
    -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.1262013834435303,-0.9104677303474127,-0.3938549514897206,
    -0.0958239947363626,-0.6960925433653804,-0.5499289157932101,1.0,-0.1262013834435303,-0.9104677303474127,-0.3938549514897206,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.1262013834435303,-0.9104677303474127,-0.3938549514897206,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,0.1561046864437102,-0.985605751969338,0.06490476527395082,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.1561046864437102,-0.985605751969338,0.06490476527395082,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.1561046864437102,-0.985605751969338,0.06490476527395082,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.4530336513178341,-0.8891275915425783,0.0649048282589597,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.4530336513178341,-0.8891275915425783,0.0649048282589597,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.4530336513178341,-0.8891275915425783,0.0649048282589597,
    0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.295826750452272,-0.9104677767205127,0.2890241534378325,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.295826750452272,-0.9104677767205127,0.2890241534378325,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.295826750452272,-0.9104677767205127,0.2890241534378325,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.5698107195795923,-0.8042839992138734,-0.1686505038851809,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.5698107195795923,-0.8042839992138734,-0.1686505038851809,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.5698107195795923,-0.8042839992138734,-0.1686505038851809,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.40567420298669166,-0.8042813632252391,-0.43423487860795257,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.40567420298669166,-0.8042813632252391,-0.43423487860795257,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.40567420298669166,-0.8042813632252391,-0.43423487860795257,
    0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.6372639607508351,-0.6623999850829347,-0.39385391211753373,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.6372639607508351,-0.6623999850829347,-0.39385391211753373,
    0.3774725321586718,-0.5423064458507189,-0.549928659943288,1.0,0.6372639607508351,-0.6623999850829347,-0.39385391211753373,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.8009411223662419,-0.41223065105961343,-0.434234048445849,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.8009411223662419,-0.41223065105961343,-0.434234048445849,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.8009411223662419,-0.41223065105961343,-0.434234048445849,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.9337331376183107,-0.31575244801226804,-0.16864999047650403,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.9337331376183107,-0.31575244801226804,-0.16864999047650403,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.9337331376183107,-0.31575244801226804,-0.16864999047650403,
    -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.9049059478911285,-0.1613589781678624,-0.3938381718877458,
    -0.8384803075015056,-0.1472225136093298,-0.5499259308536062,1.0,-0.9049059478911285,-0.1613589781678624,-0.3938381718877458,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.9049059478911285,-0.1613589781678624,-0.3938381718877458,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.8891293781902415,-0.453030240817418,0.0649041581406515,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.8891293781902415,-0.453030240817418,0.0649041581406515,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.8891293781902415,-0.453030240817418,0.0649041581406515,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.7056169875642115,-0.7056147471288743,0.0649037402239831,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.7056169875642115,-0.7056147471288743,0.0649037402239831,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.7056169875642115,-0.7056147471288743,0.0649037402239831,
    -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.7744929412069025,-0.5626970574800776,0.2890202510620039,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.7744929412069025,-0.5626970574800776,0.2890202510620039,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.7744929412069025,-0.5626970574800776,0.2890202510620039,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.5888393715456425,-0.7904587170290158,-0.16865115235472017,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.5888393715456425,-0.7904587170290158,-0.16865115235472017,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.5888393715456425,-0.7904587170290158,-0.16865115235472017,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.6395598605847257,-0.6343526933842694,-0.43423478110921676,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.6395598605847257,-0.6343526933842694,-0.43423478110921676,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.6395598605847257,-0.6343526933842694,-0.43423478110921676,
    -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.43305286287212297,-0.8107669263659469,-0.39385556879314715,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.43305286287212297,-0.8107669263659469,-0.39385556879314715,
    -0.5459637218946243,-0.5498352313283206,-0.5499285320165386,1.0,-0.43305286287212297,-0.8107669263659469,-0.39385556879314715,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.6395599174302818,0.6343526036081132,-0.43423482853426115,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.6395599174302818,0.6343526036081132,-0.43423482853426115,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.6395599174302818,0.6343526036081132,-0.43423482853426115,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.5888392828155132,0.790458798422897,-0.1686510806640205,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.5888392828155132,0.790458798422897,-0.1686510806640205,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.5888392828155132,0.790458798422897,-0.1686510806640205,
    -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.43305276864121595,0.8107670112207223,-0.39385549772523787,
    -0.5459637218946243,0.7286887671603928,-0.5499285320165386,1.0,-0.43305276864121595,0.8107670112207223,-0.39385549772523787,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.43305276864121595,0.8107670112207223,-0.39385549772523787,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.7056169940736836,0.7056147536395789,0.06490359867199426,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.7056169940736836,0.7056147536395789,0.06490359867199426,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.7056169940736836,0.7056147536395789,0.06490359867199426,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.8891293781905673,0.45303024081694554,0.06490415813948672,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.8891293781905673,0.45303024081694554,0.06490415813948672,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.8891293781905673,0.45303024081694554,0.06490415813948672,
    -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.7744929756870417,0.5626969811415766,0.28902030728927613,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.7744929756870417,0.5626969811415766,0.28902030728927613,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.7744929756870417,0.5626969811415766,0.28902030728927613,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.9337331410506727,0.31575243415701776,-0.16864999741346762,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.9337331410506727,0.31575243415701776,-0.16864999741346762,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9337331410506727,0.31575243415701776,-0.16864999741346762,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.8009411223638105,0.4122306510621237,-0.4342340484479505,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.8009411223638105,0.4122306510621237,-0.4342340484479505,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.8009411223638105,0.4122306510621237,-0.4342340484479505,
    -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.9049059503270416,0.1613589802965544,-0.39383816541870337,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9049059503270416,0.1613589802965544,-0.39383816541870337,
    -0.8384803075015056,0.3260760068002253,-0.5499259308536062,1.0,-0.9049059503270416,0.1613589802965544,-0.39383816541870337,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.40567431596737213,0.8042812695824455,-0.4342349465016079,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.40567431596737213,0.8042812695824455,-0.4342349465016079,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.40567431596737213,0.8042812695824455,-0.4342349465016079,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.5698106083247312,0.8042840928568619,-0.16865043319841977,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.5698106083247312,0.8042840928568619,-0.16865043319841977,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.5698106083247312,0.8042840928568619,-0.16865043319841977,
    0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.6372638592193767,0.6623999850826678,-0.3938540763979827,
    0.3774725321586718,0.7211598963982913,-0.549928659943288,1.0,0.6372638592193767,0.6623999850826678,-0.3938540763979827,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.6372638592193767,0.6623999850826678,-0.3938540763979827,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.4530336513178344,0.8891275915425781,0.06490482825895993,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.4530336513178344,0.8891275915425781,0.06490482825895993,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.4530336513178344,0.8891275915425781,0.06490482825895993,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,0.15610468644371014,0.9856057519693379,0.06490476527395184,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.15610468644371014,0.9856057519693379,0.06490476527395184,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.15610468644371014,0.9856057519693379,0.06490476527395184,
    0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.29582675045227164,0.9104677767205127,0.2890241534378327,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.29582675045227164,0.9104677767205127,0.2890241534378327,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.29582675045227164,0.9104677767205127,0.2890241534378327,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,0.011764727228161192,0.9856057285447228,-0.16865034554685368,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.011764727228161192,0.9856057285447228,-0.16865034554685368,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,0.011764727228161192,0.9856057285447228,-0.16865034554685368,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.14455713344453255,0.8891249105991275,-0.43423510742729354,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,0.14455713344453255,0.8891249105991275,-0.43423510742729354,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.14455713344453255,0.8891249105991275,-0.43423510742729354,
    -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.12620138344353177,0.9104677303474128,-0.3938549514897198,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.12620138344353177,0.9104677303474128,-0.3938549514897198,
    -0.0958239947363626,0.8749460365552031,-0.5499289157932101,1.0,-0.12620138344353177,0.9104677303474128,-0.3938549514897198,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.9337331376183107,-0.3157524480122681,0.16864999047650445,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9337331376183107,-0.3157524480122681,0.16864999047650445,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.9337331376183107,-0.3157524480122681,0.16864999047650445,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.8009411223662424,-0.4122306510596123,0.43423404844584906,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.8009411223662424,-0.4122306510596123,0.43423404844584906,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.8009411223662424,-0.4122306510596123,0.43423404844584906,
    0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.9049059478911281,-0.16135897816786288,0.3938381718877464,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.9049059478911281,-0.16135897816786288,0.3938381718877464,
    0.7840431946356263,-0.05682942476804631,0.12224082834662764,1.0,0.9049059478911281,-0.16135897816786288,0.3938381718877464,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.6395598605847254,-0.63435269338427,0.43423478110921626,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.6395598605847254,-0.63435269338427,0.43423478110921626,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.6395598605847254,-0.63435269338427,0.43423478110921626,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.5888393715456428,-0.7904587170290155,0.16865115235472064,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.5888393715456428,-0.7904587170290155,0.16865115235472064,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.5888393715456428,-0.7904587170290155,0.16865115235472064,
    0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.43305286287212336,-0.8107669263659466,0.39385556879314715,
    0.31958905055749853,-0.6960960400084054,0.12224208628548627,1.0,0.43305286287212336,-0.8107669263659466,0.39385556879314715,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.43305286287212336,-0.8107669263659466,0.39385556879314715,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.7056169875642118,-0.7056147471288738,-0.06490374022398354,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.7056169875642118,-0.7056147471288738,-0.06490374022398354,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.7056169875642118,-0.7056147471288738,-0.06490374022398354,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.8891293781902413,-0.45303024081741866,-0.06490415814065198,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.8891293781902413,-0.45303024081741866,-0.06490415814065198,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.8891293781902413,-0.45303024081741866,-0.06490415814065198,
    0.5694641095121618,-0.38927984491985734,-0.49664876555714743,1.0,0.774492941206902,-0.5626970574800776,-0.28902025106200485,
    0.7031955058757364,-0.30565556524992643,-0.3010953875862574,1.0,0.774492941206902,-0.5626970574800776,-0.28902025106200485,
    0.531257648908741,-0.5423097719247445,-0.30109549419116666,1.0,0.774492941206902,-0.5626970574800776,-0.28902025106200485,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,-0.011764727228162521,-0.9856057285447228,0.1686503455468534,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,-0.011764727228162521,-0.9856057285447228,0.1686503455468534,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.011764727228162521,-0.9856057285447228,0.1686503455468534,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.144557133444532,-0.8891249105991275,0.4342351074272939,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.144557133444532,-0.8891249105991275,0.4342351074272939,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,-0.144557133444532,-0.8891249105991275,0.4342351074272939,
    0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.12620138344352988,-0.9104677303474127,0.3938549514897206,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,0.12620138344352988,-0.9104677303474127,0.3938549514897206,
    0.04138738291591748,-0.7864886278068304,0.1222419370383272,1.0,0.12620138344352988,-0.9104677303474127,0.3938549514897206,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.4056742029866914,-0.8042813632252392,0.4342348786079527,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.4056742029866914,-0.8042813632252392,0.4342348786079527,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.4056742029866914,-0.8042813632252392,0.4342348786079527,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.5698107195795922,-0.8042839992138735,0.16865050388518024,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.5698107195795922,-0.8042839992138735,0.16865050388518024,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.5698107195795922,-0.8042839992138735,0.16865050388518024,
    -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.6372639607508346,-0.6623999850829355,0.3938539121175335,
    -0.7101111420985635,-0.5423097719247445,0.1222420010013443,1.0,-0.6372639607508346,-0.6623999850829355,0.3938539121175335,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.6372639607508346,-0.6623999850829355,0.3938539121175335,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.45303365131783446,-0.8891275915425783,-0.06490482825895973,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.45303365131783446,-0.8891275915425783,-0.06490482825895973,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.45303365131783446,-0.8891275915425783,-0.06490482825895973,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,-0.1561046864437102,-0.9856057519693381,-0.06490476527395087,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.1561046864437102,-0.9856057519693381,-0.06490476527395087,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.1561046864437102,-0.9856057519693381,-0.06490476527395087,
    -0.3410955410974984,-0.6851432728407503,-0.49664876555714743,1.0,-0.29582675045227214,-0.9104677767205126,-0.2890241534378327,
    -0.22024087610573995,-0.7864886278068304,-0.30109543022814955,1.0,-0.29582675045227214,-0.9104677767205126,-0.2890241534378327,
    -0.4984425437473209,-0.6960960400084054,-0.30109557947530863,1.0,-0.29582675045227214,-0.9104677767205126,-0.2890241534378327,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.9410026579935737,-0.29337907147361264,0.1686496903949428,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.9410026579935737,-0.29337907147361264,0.1686496903949428,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.9410026579935737,-0.29337907147361264,0.1686496903949428,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.8902790375102706,-0.13727627232073963,0.43423318669524613,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.8902790375102706,-0.13727627232073963,0.43423318669524613,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.8902790375102706,-0.13727627232073963,0.43423318669524613,
    -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.8269096225934561,-0.40137330609464344,0.3938526948200351,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.8269096225934561,-0.40137330609464344,0.3938526948200351,
    -0.8820489990655589,-0.30565556524992643,0.12224189439643496,1.0,-0.8269096225934561,-0.40137330609464344,0.3938526948200351,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.8902790348330736,0.13727627240355553,0.43423319215794154,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.8902790348330736,0.13727627240355553,0.43423319215794154,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.8902790348330736,0.13727627240355553,0.43423319215794154,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.9410026557724,0.2933790824220556,0.1686496837426105,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.9410026557724,0.2933790824220556,0.1686496837426105,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.9410026557724,0.2933790824220556,0.1686496837426105,
    -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.8269096225925401,0.40137330609523086,0.3938526948213595,
    -0.8820489990655589,0.4845090584404643,0.12224189439643496,1.0,-0.8269096225925401,0.40137330609523086,0.3938526948213595,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.8269096225925401,0.40137330609523086,0.3938526948213595,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.9856061030015377,0.1561022807492637,-0.06490522067600012,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9856061030015377,0.1561022807492637,-0.06490522067600012,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9856061030015377,0.1561022807492637,-0.06490522067600012,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.98560610350448,-0.1561022808289206,-0.06490521284708418,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.98560610350448,-0.1561022808289206,-0.06490521284708418,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.98560610350448,-0.1561022808289206,-0.06490521284708418,
    -0.9038661791850169,0.08942674659491123,-0.49664876555714743,1.0,-0.9573342053980672,0.0,-0.28898307766173964,
    -0.9628966878254487,-0.05682942476804631,-0.30109432153645,1.0,-0.9573342053980672,0.0,-0.28898307766173964,
    -0.9628966878254487,0.23568290729730612,-0.30109432153645,1.0,-0.9573342053980672,0.0,-0.28898307766173964,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.5698106083247311,0.804284092856862,0.16865043319841913,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.5698106083247311,0.804284092856862,0.16865043319841913,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.5698106083247311,0.804284092856862,0.16865043319841913,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.40567431596737197,0.8042812695824456,0.43423494650160793,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.40567431596737197,0.8042812695824456,0.43423494650160793,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.40567431596737197,0.8042812695824456,0.43423494650160793,
    -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.637263859219376,0.6623999850826685,0.3938540763979824,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.637263859219376,0.6623999850826685,0.3938540763979824,
    -0.7101111420985635,0.7211633077568167,0.1222420010013443,1.0,-0.637263859219376,0.6623999850826685,0.3938540763979824,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.1445571334445324,0.8891249105991275,0.4342351074272937,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,-0.1445571334445324,0.8891249105991275,0.4342351074272937,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.1445571334445324,0.8891249105991275,0.4342351074272937,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,-0.011764727228161208,0.9856057285447228,0.16865034554685363,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.011764727228161208,0.9856057285447228,0.16865034554685363,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,-0.011764727228161208,0.9856057285447228,0.16865034554685363,
    0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.12620138344353132,0.9104677303474129,0.39385495148971983,
    0.04138738291591748,0.9653421209966526,0.1222419370383272,1.0,0.12620138344353132,0.9104677303474129,0.39385495148971983,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,0.12620138344353132,0.9104677303474129,0.39385495148971983,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,-0.15610468644371017,0.985605751969338,-0.06490476527395188,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.15610468644371017,0.985605751969338,-0.06490476527395188,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.15610468644371017,0.985605751969338,-0.06490476527395188,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.4530336513178348,0.889127591542578,-0.06490482825895996,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.4530336513178348,0.889127591542578,-0.06490482825895996,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.4530336513178348,0.889127591542578,-0.06490482825895996,
    -0.3410955410974984,0.8639967660305725,-0.49664876555714743,1.0,-0.29582675045227175,0.9104677767205126,-0.289024153437833,
    -0.4984425437473209,0.8749495331982278,-0.30109557947530863,1.0,-0.29582675045227175,0.9104677767205126,-0.289024153437833,
    -0.22024087610573995,0.9653421209966526,-0.30109543022814955,1.0,-0.29582675045227175,0.9104677767205126,-0.289024153437833,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.5888392828155135,0.7904587984228967,0.16865108066402096,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.5888392828155135,0.7904587984228967,0.16865108066402096,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.5888392828155135,0.7904587984228967,0.16865108066402096,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.6395599174302816,0.6343526036081139,0.43423482853426054,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.6395599174302816,0.6343526036081139,0.43423482853426054,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.6395599174302816,0.6343526036081139,0.43423482853426054,
    0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.43305276864121645,0.8107670112207219,0.393855497725238,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.43305276864121645,0.8107670112207219,0.393855497725238,
    0.31958905055749853,0.8749495331982278,0.12224208628548627,1.0,0.43305276864121645,0.8107670112207219,0.393855497725238,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.8009411223638112,0.4122306510621225,0.4342340484479506,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.8009411223638112,0.4122306510621225,0.4342340484479506,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.8009411223638112,0.4122306510621225,0.4342340484479506,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.9337331410506727,0.3157524341570177,0.16864999741346798,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.9337331410506727,0.3157524341570177,0.16864999741346798,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9337331410506727,0.3157524341570177,0.16864999741346798,
    0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.9049059503270411,0.161358980296555,0.3938381654187039,
    0.7840431946356263,0.23568290729730612,0.12224082834662764,1.0,0.9049059503270411,0.161358980296555,0.3938381654187039,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.9049059503270411,0.161358980296555,0.3938381654187039,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.8891293781905669,0.45303024081694615,-0.06490415813948722,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.8891293781905669,0.45303024081694615,-0.06490415813948722,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.8891293781905669,0.45303024081694615,-0.06490415813948722,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.7056169940736841,0.7056147536395786,-0.06490359867199468,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.7056169940736841,0.7056147536395786,-0.06490359867199468,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.7056169940736841,0.7056147536395786,-0.06490359867199468,
    0.5694641095121618,0.5681333381093223,-0.49664876555714743,1.0,0.7744929756870413,0.5626969811415766,-0.2890203072892772,
    0.531257648908741,0.7211633077568167,-0.30109549419116666,1.0,0.7744929756870413,0.5626969811415766,-0.2890203072892772,
    0.7031955058757364,0.4845090584404643,-0.3010953875862574,1.0,0.7744929756870413,0.5626969811415766,-0.2890203072892772,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.5556259833512643,-0.5733698183711554,0.6021019996694653,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.5556259833512643,-0.5733698183711554,0.6021019996694653,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.5556259833512643,-0.5733698183711554,0.6021019996694653,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.29004349098379356,-0.5733687582967675,0.7662395450165418,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.29004349098379356,-0.5733687582967675,0.7662395450165418,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.29004349098379356,-0.5733687582967675,0.7662395450165418,
    0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.3482411474888483,-0.7491463488592232,0.5634783502376516,
    0.3671102287048018,-0.5498352313283206,0.3710750388267161,1.0,0.3482411474888483,-0.7491463488592232,0.5634783502376516,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.3482411474888483,-0.7491463488592232,0.5634783502376516,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.21787243246147264,-0.35124829468757784,0.9105801659669451,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.21787243246147264,-0.35124829468757784,0.9105801659669451,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,0.21787243246147264,-0.35124829468757784,0.9105801659669451,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.40138618486326494,-0.0986677750435375,0.9105788273229676,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.40138618486326494,-0.0986677750435375,0.9105788273229676,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.40138618486326494,-0.0986677750435375,0.9105788273229676,
    -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,0.13726376049162398,-0.0997273320931458,0.985501455751985,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,0.13726376049162398,-0.0997273320931458,0.985501455751985,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.13726376049162398,-0.0997273320931458,0.985501455751985,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.6349390266407596,-0.0986677085341618,0.7662356789794524,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.6349390266407596,-0.0986677085341618,0.7662356789794524,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.6349390266407596,-0.0986677085341618,0.7662356789794524,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.717007979265709,-0.3512482756842151,0.6020998310065948,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.717007979265709,-0.3512482756842151,0.6020998310065948,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.717007979265709,-0.3512482756842151,0.6020998310065948,
    0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.8200745038929085,-0.09972382650385908,0.5635006357513968,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.8200745038929085,-0.09972382650385908,0.5635006357513968,
    0.659626814311683,-0.1472225136093298,0.3710724376637837,1.0,0.8200745038929085,-0.09972382650385908,0.5635006357513968,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.373613516526666,-0.7056100416852755,0.6021024907285157,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.373613516526666,-0.7056100416852755,0.6021024907285157,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.373613516526666,-0.7056100416852755,0.6021024907285157,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.45568018842102764,-0.45302720531155777,0.7662388120737401,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.45568018842102764,-0.45302720531155777,0.7662388120737401,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.45568018842102764,-0.45302720531155777,0.7662388120737401,
    -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.6048673099190082,-0.56269463003264,0.5634805149459678,
    -0.5563260253484942,-0.5423064458507189,0.37107516675346575,1.0,-0.6048673099190082,-0.56269463003264,0.5634805149459678,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.6048673099190082,-0.56269463003264,0.5634805149459678,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.2667315616493877,-0.3157493036139345,0.9105803925449935,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.2667315616493877,-0.3157493036139345,0.9105803925449935,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.2667315616493877,-0.3157493036139345,0.9105803925449935,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.030193516312269852,-0.4122279003905533,0.9105803148060564,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,0.030193516312269852,-0.4122279003905533,0.9105803148060564,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,0.030193516312269852,-0.4122279003905533,0.9105803148060564,
    -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,-0.05243045372163579,-0.161361700375117,0.9855016231212379,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.05243045372163579,-0.161361700375117,0.9855016231212379,
    -0.012536394943249873,-0.1472214262383973,0.7864894806482503,1.0,-0.05243045372163579,-0.161361700375117,0.9855016231212379,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.10236296935915389,-0.634348937053083,0.7662396808855574,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,0.10236296935915389,-0.634348937053083,0.7662396808855574,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.10236296935915389,-0.634348937053083,0.7662396808855574,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.11249635206289318,-0.7904535861844931,0.602102731151932,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,-0.11249635206289318,-0.7904535861844931,0.602102731151932,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,-0.11249635206289318,-0.7904535861844931,0.602102731151932,
    0.16224204790767605,-0.6851432728407503,0.3177952723673252,1.0,0.158597661986661,-0.8107643536568595,0.5634784329960995,
    0.11827817164795684,-0.5498341226369787,0.5248598144387868,1.0,0.158597661986661,-0.8107643536568595,0.5634784329960995,
    -0.08302949845345986,-0.6960925433653804,0.37107542260338766,1.0,0.158597661986661,-0.8107643536568595,0.5634784329960995,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.786529537371608,0.13727635663558196,0.6021017262480359,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.786529537371608,0.13727635663558196,0.6021017262480359,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.786529537371608,0.13727635663558196,0.6021017262480359,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.5716703002569036,0.29337878079020213,0.7662388392572097,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.5716703002569036,0.29337878079020213,0.7662388392572097,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.5716703002569036,0.29337878079020213,0.7662388392572097,
    -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.7220727651677643,0.4013733476132851,0.5634805743135106,
    -0.8345233861493109,0.33825170376115454,0.3710739727776242,1.0,-0.7220727651677643,0.4013733476132851,0.5634805743135106,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.7220727651677643,0.4013733476132851,0.5634805743135106,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.3827212406934171,0.15610136154465007,0.9105804834532737,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.3827212406934171,0.15610136154465007,0.9105804834532737,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.3827212406934171,0.15610136154465007,0.9105804834532737,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.38272124750012904,-0.15610137316785738,0.9105804785998074,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.38272124750012904,-0.15610137316785738,0.9105804785998074,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.38272124750012904,-0.15610137316785738,0.9105804785998074,
    -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,-0.16966523322150842,0.0,0.9855017547604323,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.16966523322150842,0.0,0.9855017547604323,
    -0.2907323378987384,-0.056828603909637176,0.7864894806482503,1.0,-0.16966523322150842,0.0,0.9855017547604323,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.5716702792979945,-0.29337877811177093,0.7662388559196127,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.5716702792979945,-0.29337877811177093,0.7662388559196127,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.5716702792979945,-0.29337877811177093,0.7662388559196127,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.7865295373716205,-0.1372763566355822,0.6021017262480196,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.7865295373716205,-0.1372763566355822,0.6021017262480196,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.7865295373716205,-0.1372763566355822,0.6021017262480196,
    -0.7483176027019844,-0.38927984491985734,0.3177952723673252,1.0,-0.7220727651688026,-0.40137334761281906,0.563480574312512,
    -0.6332160252028463,-0.30565466976804523,0.524859430662115,1.0,-0.7220727651688026,-0.40137334761281906,0.563480574312512,
    -0.8345233861493109,-0.1593982105713322,0.3710739727776242,1.0,-0.7220727651688026,-0.40137334761281906,0.563480574312512,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.11249635206289327,0.7904535861844922,0.6021027311519331,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,-0.11249635206289327,0.7904535861844922,0.6021027311519331,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,-0.11249635206289327,0.7904535861844922,0.6021027311519331,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.10236306098376788,0.6343489989811777,0.7662396173767129,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.10236306098376788,0.6343489989811777,0.7662396173767129,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,0.10236306098376788,0.6343489989811777,0.7662396173767129,
    0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.1585976834113004,0.810764268801057,0.5634785490611477,
    -0.08302949845345986,0.8749460365552031,0.37107542260338766,1.0,0.1585976834113004,0.810764268801057,0.5634785490611477,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.1585976834113004,0.810764268801057,0.5634785490611477,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.03019352770417396,0.41222786395924554,0.9105803309210972,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,0.03019352770417396,0.41222786395924554,0.9105803309210972,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,0.03019352770417396,0.41222786395924554,0.9105803309210972,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.26673153503428815,0.31574929778599303,0.9105804023620895,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.26673153503428815,0.31574929778599303,0.9105804023620895,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.26673153503428815,0.31574929778599303,0.9105804023620895,
    -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,-0.05243044510105064,0.16136171190180773,0.9855016216925386,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,-0.05243044510105064,0.16136171190180773,0.9855016216925386,
    -0.2907323378987384,0.235682097099567,0.7864894806482503,1.0,-0.05243044510105064,0.16136171190180773,0.9855016216925386,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.4556802023562995,0.4530272348130376,0.7662387863441623,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.4556802023562995,0.4530272348130376,0.7662387863441623,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.4556802023562995,0.4530272348130376,0.7662387863441623,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.3736136402253394,0.7056100351752885,0.6021024216007594,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.3736136402253394,0.7056100351752885,0.6021024216007594,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.3736136402253394,0.7056100351752885,0.6021024216007594,
    -0.7483176027019844,0.5681333381093223,0.3177952723673252,1.0,-0.6048672442080638,0.562694706371266,0.5634805092511163,
    -0.6332160252028463,0.48450816295679444,0.524859430662115,1.0,-0.6048672442080638,0.562694706371266,0.5634805092511163,
    -0.5563260253484942,0.7211598963982913,0.37107516675346575,1.0,-0.6048672442080638,0.562694706371266,0.5634805092511163,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.7170079792643393,0.3512482756868904,0.6020998310066653,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.7170079792643393,0.3512482756868904,0.6020998310066653,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.7170079792643393,0.3512482756868904,0.6020998310066653,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.6349390266407688,0.09866770853401576,0.7662356789794635,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.6349390266407688,0.09866770853401576,0.7662356789794635,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.6349390266407688,0.09866770853401576,0.7662356789794635,
    0.7250126859951944,0.08942674659491123,0.3177952723673252,1.0,0.8200745038929455,0.0997238265034114,0.5635006357514222,
    0.659626814311683,0.3260760068002253,0.3710724376637837,1.0,0.8200745038929455,0.0997238265034114,0.5635006357514222,
    0.5827346397133202,0.08942674659491123,0.5248555502388415,1.0,0.8200745038929455,0.0997238265034114,0.5635006357514222,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.4013861845151851,0.09866778374700691,0.9105788265333187,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.4013861845151851,0.09866778374700691,0.9105788265333187,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.4013861845151851,0.09866778374700691,0.9105788265333187,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.21787243544536275,0.35124826452696245,0.9105801768871884,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,0.21787243544536275,0.35124826452696245,0.9105801768871884,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.21787243544536275,0.35124826452696245,0.9105801768871884,
    -0.08942674659491123,0.08942674659491123,0.8211465068101775,1.0,0.13726376036863816,0.09972734098810271,0.9855014548689939,
    0.15940177117808974,0.08942674659491123,0.7864888836603294,1.0,0.13726376036863816,0.09972734098810271,0.9855014548689939,
    -0.012536394943249873,0.32607489810888346,0.7864894806482503,1.0,0.13726376036863816,0.09972734098810271,0.9855014548689939,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.2900434568871001,0.5733688522583722,0.7662394876126509,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.2900434568871001,0.5733688522583722,0.7662394876126509,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.2900434568871001,0.5733688522583722,0.7662394876126509,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.5556260194438501,0.5733697244076063,0.6021020558424691,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.5556260194438501,0.5733697244076063,0.6021020558424691,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.5556260194438501,0.5733697244076063,0.6021020558424691,
    0.16224204790767605,0.8639967660305725,0.3177952723673252,1.0,0.3482409616935957,0.7491463488573389,0.5634784650653812,
    0.11827817164795684,0.7286875731845512,0.5248598144387868,1.0,0.3482409616935957,0.7491463488573389,0.5634784650653812,
    0.3671102287048018,0.7286887671603928,0.3710750388267161,1.0,0.3482409616935957,0.7491463488573389,0.5634784650653812,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,0.3337976901239209,0.4349849838050999,0.8362817503282085,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.3337976901239209,0.4349849838050999,0.8362817503282085,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.3337976901239209,0.4349849838050999,0.8362817503282085,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.5168458529709208,0.18304579180754743,0.8362802176114829,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.5168458529709208,0.18304579180754743,0.8362802176114829,
    0.24001895863146094,0.32878275011888514,0.7250166090571408,1.0,0.5168458529709208,0.18304579180754743,0.8362802176114829,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.5987063332641229,0.43498543079189117,0.6725610764147907,
    0.3177913066631288,0.5681398623342007,0.5694745568025643,1.0,0.5987063332641229,0.43498543079189117,0.6725610764147907,
    0.4916961109667275,0.3287834323913055,0.5694725526275528,1.0,0.5987063332641229,0.43498543079189117,0.6725610764147907,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.3105465803904405,0.45187809786617095,0.836281654753143,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.3105465803904405,0.45187809786617095,0.836281654753143,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.3105465803904405,0.45187809786617095,0.836281654753143,
    0.0585009483581691,0.544709109099299,0.6851563212940848,1.0,-0.014375025187359633,0.54811137916339,0.836281815348432,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,-0.014375025187359633,0.54811137916339,0.836281815348432,
    -0.2152655359718264,0.476711372534282,0.7250172060450619,1.0,-0.014375025187359633,0.54811137916339,0.836281815348432,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.22868908812893668,0.7038198371342455,0.6725614751285416,
    -0.4188753941189951,0.6246428093238603,0.5694747273679863,1.0,-0.22868908812893668,0.7038198371342455,0.6725614751285416,
    -0.13749624750459377,0.7160699772211878,0.569474855294736,1.0,-0.22868908812893668,0.7038198371342455,0.6725614751285416,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.5257288496935327,-0.15570515706632634,0.8362805035769193,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.5257288496935327,-0.15570515706632634,0.8362805035769193,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.5257288496935327,-0.15570515706632634,0.8362805035769193,
    -0.4767142721893861,0.37080430479570037,0.6851563212940848,1.0,-0.5257288565113238,0.15570514544984565,0.8362805014537518,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.5257288565113238,0.15570514544984565,0.8362805014537518,
    -0.49664411758053073,0.08942674659491123,0.7250164384917184,1.0,-0.5257288565113238,0.15570514544984565,0.8362805014537518,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.7400431604567386,0.0,0.6725593807696104,
    -0.7002547859236501,-0.05850208903141296,0.5694737892456441,1.0,-0.7400431604567386,0.0,0.6725593807696104,
    -0.7002547859236501,0.23735558222119946,0.5694737892456441,1.0,-0.7400431604567386,0.0,0.6725593807696104,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,-0.014375025183341017,-0.5481113791642288,0.8362818153479515,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.014375025183341017,-0.5481113791642288,0.8362818153479515,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,-0.014375025183341017,-0.5481113791642288,0.8362818153479515,
    -0.4767142721893861,-0.19195079028439532,0.6851563212940848,1.0,-0.31054660634034525,-0.45187806863117713,0.8362816609137449,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.31054660634034525,-0.45187806863117713,0.8362816609137449,
    -0.2152655359718264,-0.29785787934553254,0.7250172060450619,1.0,-0.31054660634034525,-0.45187806863117713,0.8362816609137449,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.22868908812963912,-0.7038198371336519,0.6725614751289236,
    -0.13749624750459377,-0.5372164840313656,0.569474855294736,1.0,-0.22868908812963912,-0.7038198371336519,0.6725614751289236,
    -0.4188753941189951,-0.4457893161336801,0.5694747273679863,1.0,-0.22868908812963912,-0.7038198371336519,0.6725614751289236,
    0.3892887570960615,0.08942674659491123,0.6851539333424017,1.0,0.5168458649633569,-0.18304578392835724,0.8362802119244079,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.5168458649633569,-0.18304578392835724,0.8362802119244079,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.5168458649633569,-0.18304578392835724,0.8362802119244079,
    0.0585009483581691,-0.36585561590840343,0.6851563212940848,1.0,0.33379768111941355,-0.4349850166946444,0.8362817368150892,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.33379768111941355,-0.4349850166946444,0.8362817368150892,
    0.24001895863146094,-0.14992927825018754,0.7250166090571408,1.0,0.33379768111941355,-0.4349850166946444,0.8362817368150892,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.598706333264664,-0.4349854307896837,0.6725610764157365,
    0.4916961109667275,-0.1499299392011253,0.5694725526275528,1.0,0.598706333264664,-0.4349854307896837,0.6725610764157365,
    0.3177913066631288,-0.38928636914545145,0.5694745568025643,1.0,0.598706333264664,-0.4349854307896837,0.6725610764157365,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.8868726411103974,0.45188038550008525,0.09623427482016117,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.8868726411103974,0.45188038550008525,0.09623427482016117,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.8868726411103974,0.45188038550008525,0.09623427482016117,
    0.5372201086011403,0.5447106015673124,0.38929459905209685,1.0,0.7544176076440144,0.5481140659055463,0.36114407655833464,
    0.6953091246192802,0.4767135899205426,0.16225219670268687,1.0,0.7544176076440144,0.5481140659055463,0.36114407655833464,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.7544176076440144,0.5481140659055463,0.36114407655833464,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.703826009734567,0.7038237749870908,0.09623430668965156,
    0.5214043203156813,0.716074070852134,0.16225219670268687,1.0,0.703826009734567,0.7038237749870908,0.09623430668965156,
    0.64724383460834,0.6246463912513849,-0.08942674659491123,1.0,0.703826009734567,0.7038237749870908,0.09623430668965156,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,-0.1557084584099035,0.9831040677591577,0.09623548168429935,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.1557084584099035,0.9831040677591577,0.09623548168429935,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.1557084584099035,0.9831040677591577,0.09623548168429935,
    -0.32878810168940487,0.8260911020654558,0.3892959209511109,1.0,-0.28816388988226643,0.8868681304880176,0.3611460808213343,
    -0.21526664466352585,0.9554321211933692,0.16225304954231823,1.0,-0.28816388988226643,0.8868681304880176,0.3611460808213343,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.28816388988226643,0.8868681304880176,0.3611460808213343,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.45188374182885493,0.8868707696675265,0.09623576144075277,
    -0.4966495331140677,0.8640044415926205,0.16225279369060774,1.0,-0.45188374182885493,0.8868707696675265,0.09623576144075277,
    -0.3708095924024877,0.9554333151692107,-0.08942674659491123,1.0,-0.45188374182885493,0.8868707696675265,0.09623576144075277,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.9831043836297442,0.1557060533937894,0.09623614614328184,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9831043836297442,0.1557060533937894,0.09623614614328184,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.9831043836297442,0.1557060533937894,0.09623614614328184,
    -0.864003929885622,0.08942674659491123,0.3892942579140981,1.0,-0.9325093417933523,0.0,0.361145853455538,
    -0.9519337718631403,0.23735634977704656,0.16225191952949358,1.0,-0.9325093417933523,0.0,0.361145853455538,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.9325093417933523,0.0,0.361145853455538,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.9831043830057655,-0.15570605329496234,0.0962361526774606,
    -0.9519337718631403,-0.05850284592684052,0.16225191952949358,1.0,-0.9831043830057655,-0.15570605329496234,0.0962361526774606,
    -1.0,0.08942674659491123,-0.08942674659491123,1.0,-0.9831043830057655,-0.15570605329496234,0.0962361526774606,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.45188374182885466,-0.8868707696675268,0.09623576144075378,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.45188374182885466,-0.8868707696675268,0.09623576144075378,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.45188374182885466,-0.8868707696675268,0.09623576144075378,
    -0.32878810168940487,-0.6472376088756332,0.3892959209511109,1.0,-0.2881638898822667,-0.8868681304880176,0.3611460808213341,
    -0.4966495331140677,-0.6851509484027978,0.16225279369060774,1.0,-0.2881638898822667,-0.8868681304880176,0.3611460808213341,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.2881638898822667,-0.8868681304880176,0.3611460808213341,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,-0.1557084584099035,-0.9831040677591577,0.0962354816842998,
    -0.21526664466352585,-0.7765786280035466,0.16225304954231823,1.0,-0.1557084584099035,-0.9831040677591577,0.0962354816842998,
    -0.3708095924024877,-0.7765798219793882,-0.08942674659491123,1.0,-0.1557084584099035,-0.9831040677591577,0.0962354816842998,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.7038260016581754,-0.7038237669094751,0.09623442483448079,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.7038260016581754,-0.7038237669094751,0.09623442483448079,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.7038260016581754,-0.7038237669094751,0.09623442483448079,
    0.5372201086011403,-0.3658571083785631,0.38929459905209685,1.0,0.7544175752367749,-0.5481141400040827,0.36114403179541826,
    0.5214043203156813,-0.5372205350200616,0.16225219670268687,1.0,0.7544175752367749,-0.5481141400040827,0.36114403179541826,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.7544175752367749,-0.5481141400040827,0.36114403179541826,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.886872641109946,-0.45188038550049187,0.09623427482241326,
    0.6953091246192802,-0.29786009672928937,0.16225219670268687,1.0,0.886872641109946,-0.45188038550049187,0.09623427482241326,
    0.64724383460834,-0.4457928980612048,-0.08942674659491123,1.0,0.886872641109946,-0.45188038550049187,0.09623427482241326,
    -0.08942674659491123,1.0,-0.08942674659491123,1.0,0.15570845840990344,0.9831040677591575,-0.09623548168429938,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.15570845840990344,0.9831040677591575,-0.09623548168429938,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.15570845840990344,0.9831040677591575,-0.09623548168429938,
    0.4457951580864963,0.8260957074033994,-0.08942674659491123,1.0,0.45188374182885466,0.8868707696675268,-0.09623576144075305,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.45188374182885466,0.8868707696675268,-0.09623576144075305,
    0.1919560992126652,0.9554333151692107,-0.08942674659491123,1.0,0.45188374182885466,0.8868707696675268,-0.09623576144075305,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.28816388988226643,0.8868681304880176,-0.36114608082133426,
    0.03641315147370339,0.9554321211933692,-0.3411065427321406,1.0,0.28816388988226643,0.8868681304880176,-0.36114608082133426,
    0.3177960399242452,0.8640044415926205,-0.3411062868804301,1.0,0.28816388988226643,0.8868681304880176,-0.36114608082133426,
    -0.9554346797140516,0.3708054134870422,-0.08942674659491123,1.0,-0.8868726411103979,0.45188038550008464,-0.09623427482016111,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.8868726411103979,0.45188038550008464,-0.09623427482016111,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.8868726411103979,0.45188038550008464,-0.09623427482016111,
    -0.6246486512763185,0.8260957074033994,-0.08942674659491123,1.0,-0.7038260097345667,0.7038237749870914,-0.09623430668965094,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.7038260097345667,0.7038237749870914,-0.09623430668965094,
    -0.8260973277981625,0.6246463912513849,-0.08942674659491123,1.0,-0.7038260097345667,0.7038237749870914,-0.09623430668965094,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.7544176076440146,0.5481140659055457,-0.3611440765583354,
    -0.8741626178091025,0.4767135899205426,-0.34110568989250933,1.0,-0.7544176076440146,0.5481140659055457,-0.3611440765583354,
    -0.7002578135055039,0.716074070852134,-0.34110568989250933,1.0,-0.7544176076440146,0.5481140659055457,-0.3611440765583354,
    -0.6246486512763185,-0.6472422142135771,-0.08942674659491123,1.0,-0.703826001658175,-0.7038237669094755,-0.09623442483448011,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.703826001658175,-0.7038237669094755,-0.09623442483448011,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.703826001658175,-0.7038237669094755,-0.09623442483448011,
    -0.9554346797140516,-0.19195192029721986,-0.08942674659491123,1.0,-0.8868726411099463,-0.45188038550049126,-0.09623427482241323,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.8868726411099463,-0.45188038550049126,-0.09623427482241323,
    -0.8260973277981625,-0.4457928980612048,-0.08942674659491123,1.0,-0.8868726411099463,-0.45188038550049126,-0.09623427482241323,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.754417575236775,-0.548114140004082,-0.36114403179541904,
    -0.7002578135055039,-0.5372205350200616,-0.34110568989250933,1.0,-0.754417575236775,-0.548114140004082,-0.36114403179541904,
    -0.8741626178091025,-0.29786009672928937,-0.34110568989250933,1.0,-0.754417575236775,-0.548114140004082,-0.36114403179541904,
    0.4457951580864963,-0.6472422142135771,-0.08942674659491123,1.0,0.45188374182885427,-0.8868707696675268,-0.09623576144075405,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.45188374182885427,-0.8868707696675268,-0.09623576144075405,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.45188374182885427,-0.8868707696675268,-0.09623576144075405,
    -0.08942674659491123,-0.8211465068101775,-0.08942674659491123,1.0,0.1557084584099035,-0.9831040677591575,-0.09623548168429982,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.1557084584099035,-0.9831040677591575,-0.09623548168429982,
    0.1919560992126652,-0.7765798219793882,-0.08942674659491123,1.0,0.1557084584099035,-0.9831040677591575,-0.09623548168429982,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.2881638898822667,-0.8868681304880176,-0.361146080821334,
    0.3177960399242452,-0.6851509484027978,-0.3411062868804301,1.0,0.2881638898822667,-0.8868681304880176,-0.361146080821334,
    0.03641315147370339,-0.7765786280035466,-0.3411065427321406,1.0,0.2881638898822667,-0.8868681304880176,-0.361146080821334,
    0.7765811865242294,0.3708054134870422,-0.08942674659491123,1.0,0.9831043836297443,0.15570605339378868,-0.09623614614328271,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9831043836297443,0.15570605339378868,-0.09623614614328271,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.9831043836297443,0.15570605339378868,-0.09623614614328271,
    0.7765811865242294,-0.19195192029721986,-0.08942674659491123,1.0,0.9831043830057655,-0.1557060532949616,-0.09623615267746147,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.9831043830057655,-0.1557060532949616,-0.09623615267746147,
    0.8211465068101775,0.08942674659491123,-0.08942674659491123,1.0,0.9831043830057655,-0.1557060532949616,-0.09623615267746147,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.932509341793352,0.0,-0.3611458534555385,
    0.7730802786733177,0.23735634977704656,-0.34110541271931616,1.0,0.932509341793352,0.0,-0.3611458534555385,
    0.7730802786733177,-0.05850284592684052,-0.34110541271931616,1.0,0.932509341793352,0.0,-0.3611458534555385,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.31054658039044,0.4518780978661704,-0.8362816547531434,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.31054658039044,0.4518780978661704,-0.8362816547531434,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.31054658039044,0.4518780978661704,-0.8362816547531434,
    0.1499346084995825,0.8260911020654558,-0.5681494141409332,1.0,0.22868908812893654,0.7038198371342458,-0.6725614751285413,
    0.24002190092917264,0.6246428093238603,-0.7483282205578089,1.0,0.22868908812893654,0.7038198371342458,-0.6725614751285413,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,0.22868908812893654,0.7038198371342458,-0.6725614751285413,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,0.014375025187359785,0.5481113791633897,-0.8362818153484325,
    -0.04135724568522858,0.7160699772211878,-0.7483283484845584,1.0,0.014375025187359785,0.5481113791633897,-0.8362818153484325,
    0.03641204278200405,0.476711372534282,-0.9038706992348842,1.0,0.014375025187359785,0.5481113791633897,-0.8362818153484325,
    -0.23735444154799146,0.544709109099299,-0.8640098144839071,1.0,-0.33379769012392096,0.4349849838051005,-0.8362817503282082,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.33379769012392096,0.4349849838051005,-0.8362817503282082,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.33379769012392096,0.4349849838051005,-0.8362817503282082,
    -0.7160736017909626,0.5447106015673124,-0.5681480922419192,1.0,-0.5987063332641228,0.43498543079189106,-0.6725610764147907,
    -0.4966447998529512,0.5681398623342007,-0.7483280499923866,1.0,-0.5987063332641228,0.43498543079189106,-0.6725610764147907,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.5987063332641228,0.43498543079189106,-0.6725610764147907,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.5168458529709213,0.1830457918075477,-0.8362802176114825,
    -0.6705496041565498,0.3287834323913055,-0.748326045817375,1.0,-0.5168458529709213,0.1830457918075477,-0.8362802176114825,
    -0.4188724518212833,0.32878275011888514,-0.9038701022469633,1.0,-0.5168458529709213,0.1830457918075477,-0.8362802176114825,
    -0.5681422502858839,0.08942674659491123,-0.8640074265322241,1.0,-0.5168458649633575,-0.18304578392835744,-0.8362802119244075,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.5168458649633575,-0.18304578392835744,-0.8362802119244075,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.5168458649633575,-0.18304578392835744,-0.8362802119244075,
    -0.7160736017909626,-0.3658571083785631,-0.5681480922419192,1.0,-0.598706333264664,-0.43498543078968377,-0.6725610764157365,
    -0.6705496041565498,-0.1499299392011253,-0.748326045817375,1.0,-0.598706333264664,-0.43498543078968377,-0.6725610764157365,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.598706333264664,-0.43498543078968377,-0.6725610764157365,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,-0.3337976811194137,-0.4349850166946449,-0.8362817368150889,
    -0.4966447998529512,-0.38928636914545145,-0.7483280499923866,1.0,-0.3337976811194137,-0.4349850166946449,-0.8362817368150889,
    -0.4188724518212833,-0.14992927825018754,-0.9038701022469633,1.0,-0.3337976811194137,-0.4349850166946449,-0.8362817368150889,
    0.29786077899956376,0.37080430479570037,-0.8640098144839071,1.0,0.5257288565113233,0.15570514544984582,-0.836280501453752,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.5257288565113233,0.15570514544984582,-0.836280501453752,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.5257288565113233,0.15570514544984582,-0.836280501453752,
    0.6851504366957994,0.08942674659491123,-0.5681477511039204,1.0,0.7400431604567397,0.0,-0.6725593807696092,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.7400431604567397,0.0,-0.6725593807696092,
    0.5214012927338278,0.23735558222119946,-0.7483272824354665,1.0,0.7400431604567397,0.0,-0.6725593807696092,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.5257288496935323,-0.15570515706632646,-0.8362805035769194,
    0.31779062439070827,0.08942674659491123,-0.9038699316815408,1.0,0.5257288496935323,-0.15570515706632646,-0.8362805035769194,
    0.5214012927338278,-0.05850208903141296,-0.7483272824354665,1.0,0.5257288496935323,-0.15570515706632646,-0.8362805035769194,
    -0.23735444154799146,-0.36585561590840343,-0.8640098144839071,1.0,0.014375025183341193,-0.5481113791642283,-0.8362818153479519,
    0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.014375025183341193,-0.5481113791642283,-0.8362818153479519,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,0.014375025183341193,-0.5481113791642283,-0.8362818153479519,
    0.1499346084995825,-0.6472376088756332,-0.5681494141409332,1.0,0.22868908812963903,-0.7038198371336523,-0.6725614751289233,
    -0.04135724568522858,-0.5372164840313656,-0.7483283484845584,1.0,0.22868908812963903,-0.7038198371336523,-0.6725614751289233,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.22868908812963903,-0.7038198371336523,-0.6725614751289233,
    0.29786077899956376,-0.19195079028439532,-0.8640098144839071,1.0,0.3105466063403448,-0.45187806863117663,-0.8362816609137453,
    0.24002190092917264,-0.4457893161336801,-0.7483282205578089,1.0,0.3105466063403448,-0.45187806863117663,-0.8362816609137453,
    0.03641204278200405,-0.29785787934553254,-0.9038706992348842,1.0,0.3105466063403448,-0.45187806863117663,-0.8362816609137453
  ]);
  
  var tenSphere = new Float32Array(960*10);
  
  for (let i = 0; i < 960; i++) {
    tenSphere[10*i+0] = sphere[7*i+0];
    tenSphere[10*i+1] = sphere[7*i+1];
    tenSphere[10*i+2] = sphere[7*i+2];
    tenSphere[10*i+3] = sphere[7*i+3];
    tenSphere[10*i+4] = 0.0;//sphere[7*i+4];
    tenSphere[10*i+5] = 1.0;//sphere[7*i+5];
    tenSphere[10*i+6] = 1.0;//sphere[7*i+6];
    tenSphere[10*i+7] = sphere[7*i+0];
    tenSphere[10*i+8] = sphere[7*i+1];
    tenSphere[10*i+9] = sphere[7*i+2];
  }
  
  
  
  var tetra_rect =  new Float32Array ([
      // Face 0: (right side).  Unit Normal Vector: N0 = (sq23, sq29, thrd)
      0.0,	 0.0, sq2, 1.0,			0.0, 	0.0,	1.0,		 sq23,	sq29, thrd,
      c30, -0.5, 0.0, 1.0, 			1.0,  0.0,  0.0, 		sq23,	sq29, thrd,
      0.0,  1.0, 0.0, 1.0,  		0.0,  1.0,  0.0,		sq23,	sq29, thrd, 
      // Face 1: (left side).		Unit Normal Vector: N1 = (-sq23, sq29, thrd)
      0.0,	 0.0, sq2, 1.0,			0.0, 	0.0,	1.0,	 -sq23,	sq29, thrd,
      0.0,  1.0, 0.0, 1.0,  		0.0,  1.0,  0.0,	 -sq23,	sq29, thrd,
      -c30, -0.5, 0.0, 1.0, 		1.0,  1.0,  1.0, 	 -sq23,	sq29,	thrd,
      // Face 2: (lower side) 	Unit Normal Vector: N2 = (0.0, -sq89, thrd)
      0.0,	 0.0, sq2, 1.0,			0.0, 	0.0,	1.0,		0.0, -sq89,	thrd,
      -c30, -0.5, 0.0, 1.0, 		1.0,  1.0,  1.0, 		0.0, -sq89,	thrd,          																							//0.0, 0.0, 0.0, // Normals debug
      c30, -0.5, 0.0, 1.0, 			1.0,  0.0,  0.0, 		0.0, -sq89,	thrd,
      // Face 3: (base side)  Unit Normal Vector: N2 = (0.0, 0.0, -1.0)
      -c30, -0.5, 0.0, 1.0, 		1.0,  1.0,  1.0, 		0.0, 	0.0, -1.0,
      0.0,  1.0, 0.0, 1.0,  		0.0,  1.0,  0.0,		0.0, 	0.0, -1.0,
      c30, -0.5, 0.0, 1.0, 			1.0,  0.0,  0.0, 		0.0, 	0.0, -1.0,
  
      
  //Side 1 for rectangle (000,101,001)(000,101,100) -> (0,-1,0) (RED)
  0.00, 0.00, 0.00, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  0.20, 0.00, 0.20, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  0.00, 0.00, 0.20, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  
  0.00, 0.00, 0.00, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  0.20, 0.00, 0.20, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  0.20, 0.00, 0.00, 1.00, 	1.00, 0.00, 0.00,	  0.0, -1.0, 0.0,
  
  //Side 2 of rectangle, (000,110,100)(000,110,010) -> (0,0,-1) (GREEN)
  0.00, 0.00, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  0.20, 0.50, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  0.20, 0.00, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  
  0.00, 0.00, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  0.20, 0.50, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  0.00, 0.50, 0.00, 1.00, 	0.00, 1.00, 0.00,	  0.0, 0.0, -1.0, 
  
  //Side 3 of rectangle, (000,011,010)(000,011,001) -> (-1,0,0) (BLUE)
  0.00, 0.00, 0.00, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  0.00, 0.50, 0.20, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  0.00, 0.50, 0.00, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  
  0.00, 0.00, 0.00, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  0.00, 0.50, 0.20, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  0.00, 0.00, 0.20, 1.00, 	0.00, 0.00, 1.00,	  -1.0, 0.0, 0.0, 
  
  //Side 4 of rectangle, (111,001,011)(111,001,101) -> (001) (YELLOW)
  0.20, 0.50, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  0.00, 0.00, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  0.00, 0.50, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  
  0.20, 0.50, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  0.00, 0.00, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  0.20, 0.00, 0.20, 1.00, 	1.00, 1.00, 0.00,	  0.0, 0.0, 1.0, 
  
  //Side 5 of rectangle, (111,010,011)(111,010,110) -> (010) (CYAN)
  0.20, 0.50, 0.20, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  0.00, 0.50, 0.00, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  0.00, 0.50, 0.20, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  
  0.20, 0.50, 0.20, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  0.00, 0.50, 0.00, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  0.20, 0.50, 0.00, 1.00, 	0.00, 1.00, 1.00,	  0.0, 1.0, 0.0, 
  
  //Side 6 of rectangle, (111,100,101)(111,100,110) -> (100) (MAGENTA)
  0.20, 0.50, 0.20, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  0.20, 0.00, 0.00, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  0.20, 0.00, 0.20, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  
  0.20, 0.50, 0.20, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  0.20, 0.00, 0.00, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  0.20, 0.50, 0.00, 1.00, 	1.00, 0.00, 1.00,	  1.0, 0.0, 0.0, 
  ]);
    
  for (let i = 0; i < 12+36; i++) {
    tetra_rect[10*i+7] = tetra_rect[10*i+7] * 1;
    tetra_rect[10*i+8] = tetra_rect[10*i+8] * 1;
    tetra_rect[10*i+9] = tetra_rect[10*i+9] * 1;
  }
  
  for (let i = 0; i < 12+36; i++) {
    tetra_rect[10*i+4] = 1.0;
    tetra_rect[10*i+5] = 1.0;
    tetra_rect[10*i+6] = 0.0;
  }
  
    this.vboContents = new Float32Array((960+36+12)*10);
    this.vboContents.set(tenSphere, offset=0);
    this.vboContents.set(tetra_rect, offset=9600);
      
    this.vboVerts = 960+36+12;							// # of vertices held in 'vboContents' array;
    this.FSIZE = this.vboContents.BYTES_PER_ELEMENT;  
                                  // bytes req'd by 1 vboContents array element;
                                  // (why? used to compute stride and offset 
                                  // in bytes for vertexAttribPointer() calls)
    this.vboBytes = this.vboContents.length * this.FSIZE;               
                                  // (#  of floats in vboContents array) * 
                                  // (# of bytes/float).
    this.vboStride = this.vboBytes / this.vboVerts;     
                                  // (== # of bytes to store one complete vertex).
                                  // From any attrib in a given vertex in the VBO, 
                                  // move forward by 'vboStride' bytes to arrive 
                                  // at the same attrib for the next vertex.
                                   
                //----------------------Attribute sizes
    this.vboFcount_a_Pos1 =  4;    // # of floats in the VBO needed to store the
                                  // attribute named a_Pos1. (4: x,y,z,w values)
    this.vboFcount_a_Colr1 = 3;   // # of floats for this attrib (r,g,b values)
    this.vboFcount_a_Normal = 3;  // # of floats for this attrib (just one!)   
    console.assert((this.vboFcount_a_Pos1 +     // check the size of each and
                    this.vboFcount_a_Colr1 +
                    this.vboFcount_a_Normal) *   // every attribute in our VBO
                    this.FSIZE == this.vboStride, // for agreeement with'stride'
                    "Uh oh! VBObox1.vboStride disagrees with attribute-size values!");
                    
                //----------------------Attribute offsets
    this.vboOffset_a_Pos1 = 0;    //# of bytes from START of vbo to the START
                                  // of 1st a_Pos1 attrib value in vboContents[]
    this.vboOffset_a_Colr1 = (this.vboFcount_a_Pos1) * this.FSIZE;  
                                  // == 4 floats * bytes/float
                                  //# of bytes from START of vbo to the START
                                  // of 1st a_Colr1 attrib value in vboContents[]
    this.vboOffset_a_Normal =(this.vboFcount_a_Pos1 +
                              this.vboFcount_a_Colr1) * this.FSIZE; 
                                  // == 7 floats * bytes/float
                                  // # of bytes from START of vbo to the START
                                  // of 1st a_PtSize attrib value in vboContents[]
  
                //-----------------------GPU memory locations:                                
    this.vboLoc;									// GPU Location for Vertex Buffer Object, 
                                  // returned by gl.createBuffer() function call
    this.shaderLoc;								// GPU Location for compiled Shader-program  
                                  // set by compile/link of VERT_SRC and FRAG_SRC.
                            //------Attribute locations in our shaders:
    this.a_Pos1Loc;							  // GPU location: shader 'a_Pos1' attribute
    this.a_Colr1Loc;							// GPU location: shader 'a_Colr1' attribute
    this.a_NormalLoc;							// GPU location: shader 'a_PtSiz1' attribute
    
                //---------------------- Uniform locations &values in our shaders
    this.ModelMatrix = new Matrix4();	// Transforms CVV axes to model axes.
    this.u_ModelMatrixLoc;						// GPU location for u_ModelMat uniform
  
    //Felipe's addition: make a Normal Matrix too
    this.NormalMatrix = new Matrix4();
    this.u_NormalMatrixLoc;
    this.MvpMatrix = new Matrix4();
    this.u_MvpMatrixLoc;
  
    this.EyePos = new Vector3();
    this.u_EyePosLoc;
  
    this.LightColor = new Vector3();
    this.LightPosition = new Vector3();
    this.AmbientLight = new Vector3();
    this.SpecularLight = new Vector3();
  
    this.u_LightColorLoc;
    this.u_LightPositionLoc;
    this.u_AmbientLightLoc;
    this.u_SpecularLightLoc;
  
    this.emit = new Vector3();
    this.ambi = new Vector3();
    this.diff = new Vector3();
    this.spec = new Vector3();
    this.shiny = 0;
  
    this.u_emitLoc;
    this.u_ambiLoc;
    this.u_diffLoc;
    this.u_specLoc;
    this.u_shinyLoc;
  };
  
  //USE
  VBObox5.prototype.init = function() {
  //--------------------
  // a) Compile,link,upload shaders-----------------------------------------------
    this.shaderLoc = createProgram(gl, this.VERT_SRC, this.FRAG_SRC);
    if (!this.shaderLoc) {
      console.log(this.constructor.name + 
                  '.init() failed to create executable Shaders on the GPU. Bye!');
      return;
    }
  // CUTE TRICK: let's print the NAME of this VBObox object: tells us which one!
  //  else{console.log('You called: '+ this.constructor.name + '.init() fcn!');}
  
    gl.program = this.shaderLoc;		// (to match cuon-utils.js -- initShaders())
  
  // b) Create VBO on GPU, fill it------------------------------------------------
    this.vboLoc = gl.createBuffer();	
    if (!this.vboLoc) {
      console.log(this.constructor.name + 
                  '.init() failed to create VBO in GPU. Bye!'); 
      return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,	      // GLenum 'target' for this GPU buffer 
                    this.vboLoc);	
    gl.bufferData(gl.ARRAY_BUFFER, 			  // GLenum target(same as 'bindBuffer()')
                      this.vboContents, 		// JavaScript Float32Array
                     gl.STATIC_DRAW);
  
  // c1) Find All Attributes:-----------------------------------------------------
  //  Find & save the GPU location of all our shaders' attribute-variables and 
  //  uniform-variables (for switchToMe(), adjust(), draw(), reload(), etc.)
    this.a_Pos1Loc = gl.getAttribLocation(this.shaderLoc, 'a_Position');
    if(this.a_Pos1Loc < 0) {
      console.log(this.constructor.name + 
                  '.init() Failed to get GPU location of attribute a_Pos1');
      return -1;	// error exit.
    }
     this.a_Colr1Loc = gl.getAttribLocation(this.shaderLoc, 'a_Color');
    if(this.a_Colr1Loc < 0) {
      console.log(this.constructor.name + 
                  '.init() failed to get the GPU location of attribute a_Colr1');
      return -1;	// error exit.
    }
    this.a_NormalLoc = gl.getAttribLocation(this.shaderLoc, 'a_Normal');
    if(this.a_NormalLoc < 0) {
      console.log(this.constructor.name + 
                  '.init() failed to get the GPU location of attribute a_PtSiz1');
      return -1;	// error exit.
    }
    // c2) Find All Uniforms:-----------------------------------------------------
    //Get GPU storage location for each uniform var used in our shader programs: 
    this.u_ModelMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_ModelMatrix');
    if (!this.u_ModelMatrixLoc) { 
      console.log(this.constructor.name + 
                  '.init() failed to get GPU location for u_ModelMatrix uniform');
      return;
    }
  
    //Felipe's addition: find the uniform for Normal matrix
    this.u_NormalMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_NormalMatrix');
    if (!this.u_NormalMatrixLoc) { 
      console.log(this.constructor.name + 
                  '.init() failed to get GPU location for u_NormalMatrix uniform');
      //return;
    }
    this.u_MvpMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_MvpMatrix');
    if (!this.u_MvpMatrixLoc) { 
      console.log(this.constructor.name + 
                  '.init() failed to get GPU location for u_MvpMatrix uniform');
      //return;
    }
    this.u_EyePosLoc = gl.getUniformLocation(this.shaderLoc, 'u_EyePos');
    if (!this.u_EyePosLoc) { 
      console.log(this.constructor.name + 
                  '.init() failed to get GPU location for u_EyePos uniform');
      //return;
    }
  
    this.u_LightColorLoc = gl.getUniformLocation(this.shaderLoc, 'u_LightColor');
    if (!this.u_LightColorLoc) { 
      console.log(this.constructor.name +  '.init() failed to get GPU location for u_LightColor uniform');
      return;
    }
    this.u_LightPositionLoc = gl.getUniformLocation(this.shaderLoc, 'u_LightPosition');
    if (!this.u_LightPositionLoc) { 
      console.log(this.constructor.name +  '.init() failed to get GPU location for u_LightPosition uniform');
      //return;
    }
    this.u_AmbientLightLoc = gl.getUniformLocation(this.shaderLoc, 'u_AmbientLight');
    if (!this.u_AmbientLightLoc) { 
      console.log(this.constructor.name +  '.init() failed to get GPU location for u_AmbientLight uniform');
      return;
    }
    this.u_SpecularLightLoc = gl.getUniformLocation(this.shaderLoc, 'u_SpecularLight');
    if (!this.u_SpecularLightLoc) console.log(this.constructor.name +  ' u_SpecularLight failed');
  
    this.u_emitLoc = gl.getUniformLocation(this.shaderLoc, 'u_emit');
    if (!this.u_emitLoc) console.log(this.constructor.name +  ' u_emit failed');
    this.u_ambiLoc = gl.getUniformLocation(this.shaderLoc, 'u_ambi');
    if (!this.u_ambiLoc) console.log(this.constructor.name +  ' u_ambi failed');
    this.u_diffLoc = gl.getUniformLocation(this.shaderLoc, 'u_diff');
    if (!this.u_diffLoc) console.log(this.constructor.name +  ' u_diff failed');
    this.u_specLoc = gl.getUniformLocation(this.shaderLoc, 'u_spec');
    if (!this.u_specLoc) console.log(this.constructor.name +  ' u_spec failed');
    this.u_shinyLoc = gl.getUniformLocation(this.shaderLoc, 'u_shiny');
    if (!this.u_shinyLoc) console.log(this.constructor.name +  ' u_shiny failed');
  }
  
  VBObox5.prototype.switchToMe = function () {
  //==============================================================================
  // Set GPU to use this VBObox's contents (VBO, shader, attributes, uniforms...)
  //
  // We only do this AFTER we called the init() function, which does the one-time-
  // only setup tasks to put our VBObox contents into GPU memory.  !SURPRISE!
  // even then, you are STILL not ready to draw our VBObox's contents onscreen!
  // We must also first complete these steps:
  //  a) tell the GPU to use our VBObox's shader program (already in GPU memory),
  //  b) tell the GPU to use our VBObox's VBO  (already in GPU memory),
  //  c) tell the GPU to connect the shader program's attributes to that VBO.
  
  // a) select our shader program:
    gl.useProgram(this.shaderLoc);	
  //		Each call to useProgram() selects a shader program from the GPU memory,
  // but that's all -- it does nothing else!  Any previously used shader program's 
  // connections to attributes and uniforms are now invalid, and thus we must now
  // establish new connections between our shader program's attributes and the VBO
  // we wish to use.  
    
  // b) call bindBuffer to disconnect the GPU from its currently-bound VBO and
  //  instead connect to our own already-created-&-filled VBO.  This new VBO can 
  //    supply values to use as attributes in our newly-selected shader program:
    gl.bindBuffer(gl.ARRAY_BUFFER,	    // GLenum 'target' for this GPU buffer 
                      this.vboLoc);			// the ID# the GPU uses for our VBO.
  
  // c) connect our newly-bound VBO to supply attribute variable values for each
  // vertex to our SIMD shader program, using 'vertexAttribPointer()' function.
  // this sets up data paths from VBO to our shader units:
    // 	Here's how to use the almost-identical OpenGL version of this function:
    //		http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttribPointer.xml )
    gl.vertexAttribPointer(
      this.a_Pos1Loc,//index == ID# for the attribute var in GLSL shader pgm;
      this.vboFcount_a_Pos1, // # of floats used by this attribute: 1,2,3 or 4?
      gl.FLOAT,		  // type == what data type did we use for those numbers?
      false,				// isNormalized == are these fixed-point values that we need
                    //									normalize before use? true or false
      this.vboStride,// Stride == #bytes we must skip in the VBO to move from the
                    // stored attrib for this vertex to the same stored attrib
                    //  for the next vertex in our VBO.  This is usually the 
                    // number of bytes used to store one complete vertex.  If set 
                    // to zero, the GPU gets attribute values sequentially from 
                    // VBO, starting at 'Offset'.	
                    // (Our vertex size in bytes: 4 floats for pos + 3 for color)
      this.vboOffset_a_Pos1);						
                    // Offset == how many bytes from START of buffer to the first
                    // value we will actually use?  (we start with position).
    gl.vertexAttribPointer(this.a_Colr1Loc, this.vboFcount_a_Colr1,
                           gl.FLOAT, false, 
                           this.vboStride,  this.vboOffset_a_Colr1);
    gl.vertexAttribPointer(this.a_NormalLoc,this.vboFcount_a_Normal, 
                           gl.FLOAT, false, 
                           this.vboStride,	this.vboOffset_a_Normal);	
    //-- Enable this assignment of the attribute to its' VBO source:
    gl.enableVertexAttribArray(this.a_Pos1Loc);
    gl.enableVertexAttribArray(this.a_Colr1Loc);
    gl.enableVertexAttribArray(this.a_NormalLoc);
  }
  
  VBObox5.prototype.isReady = function() {
  //==============================================================================
  // Returns 'true' if our WebGL rendering context ('gl') is ready to render using
  // this objects VBO and shader program; else return false.
  // see: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter
  
  var isOK = true;
  
    if(gl.getParameter(gl.CURRENT_PROGRAM) != this.shaderLoc)  {
      console.log(this.constructor.name + 
                  '.isReady() false: shader program at this.shaderLoc not in use!');
      isOK = false;
    }
    if(gl.getParameter(gl.ARRAY_BUFFER_BINDING) != this.vboLoc) {
        console.log(this.constructor.name + 
                '.isReady() false: vbo at this.vboLoc not in use!');
      isOK = false;
    }
    return isOK;
  }
  
  VBObox5.prototype.adjust = function() {
  //==============================================================================
  // Update the GPU to newer, current values we now store for 'uniform' vars on 
  // the GPU; and (if needed) update each attribute's stride and offset in VBO.
  
    // check: was WebGL context set to use our VBO & shader program?
    if(this.isReady()==false) {
          console.log('ERROR! before' + this.constructor.name + 
                '.adjust() call you needed to call this.switchToMe()!!');
    }
    // Adjust values for our uniforms,
    this.ModelMatrix.setIdentity();
    //this.ModelMatrix.set(g_worldMat);
    this.MvpMatrix.setIdentity();
    this.MvpMatrix.set(g_mvpMat);
  
    //this.ModelMatrix.translate(1.0, -2.0, 0);						// then translate them.
    //this.ModelMatrix.rotate(g_angleNow2, 0, 0, 1);	// -spin drawing axes,
  
  }
  
  VBObox5.prototype.draw = function() {
    //=============================================================================
    // Send commands to GPU to select and render current VBObox contents.
    
      // check: was WebGL context set to use our VBO & shader program?
      if(this.isReady()==false) {
            console.log('ERROR! before' + this.constructor.name + 
                  '.draw() call you needed to call this.switchToMe()!!');
      }
      this.reMatrix = function() {
        actualMvp = new Matrix4();
        actualMvp.set(this.MvpMatrix);
        actualMvp.multiply(this.ModelMatrix);
        this.NormalMatrix.setInverseOf(this.ModelMatrix);
        this.NormalMatrix.transpose();
        gl.uniformMatrix4fv(this.u_ModelMatrixLoc, false, actualMvp.elements);	// send data from Javascript.
        gl.uniformMatrix4fv(this.u_NormalMatrixLoc, false, this.NormalMatrix.elements);	// send data from Javascript.
        gl.uniformMatrix4fv(this.u_MvpMatrixLoc, false, this.ModelMatrix.elements);	// send data from Javascript.
        
        gl.uniform3f(this.u_EyePos, posX, posY, posZ);
        
        this.LightColor = diffuseColor;
        this.LightPosition = lightPos;
        if(!ambientToggle){ this.AmbientLight = ambientColor; }
        else{ 
          this.AmbientLight = new Vector3(); 
          this.AmbientLight.x = 0.05;
          this.AmbientLight.y = 0.05;
          this.AmbientLight.z = 0.05;
        }
        if(diffuseToggle){ this.LightColor = diffuseColor; }
        else{ 
          this.LightColor = new Vector3(); 
          this.LightColor.x = 0.01;
          this.LightColor.y = 0.01;
          this.LightColor.z = 0.01;
        }
        if(specularToggle){ this.SpecularLight = specularColor; }
        else{ 
          this.SpecularLight = new Vector3(); 
          this.SpecularLight.x = 0.01;
          this.SpecularLight.y = 0.01;
          this.SpecularLight.z = 0.01;
        }
    
        //Light source
        gl.uniform3f(this.u_LightColorLoc, this.LightColor.x,this.LightColor.y,this.LightColor.z);
        gl.uniform3f(this.u_LightPositionLoc, this.LightPosition.x, this.LightPosition.y, this.LightPosition.z);
        gl.uniform3f(this.u_AmbientLightLoc, this.AmbientLight.x, this.AmbientLight.y, this.AmbientLight.z);
        gl.uniform3f(this.u_SpecularLightLoc, this.SpecularLight.x, this.SpecularLight.y, this.SpecularLight.z);
      
        //eye source
      }
    
      this.reMaterial = function(emissive, ambient, diffuse, specular, shiny){
    
        gl.uniform3fv(this.u_emitLoc, emissive);
        gl.uniform3fv(this.u_ambiLoc, ambient);
        gl.uniform3fv(this.u_diffLoc, diffuse);
        gl.uniform3fv(this.u_specLoc, specular);
        gl.uniform1f(this.u_shinyLoc, shiny);
      }
    
      this.drawBox = function() {
        this.reMatrix();
        gl.drawArrays(gl.TRIANGLES, 960+12, 36);		// number of vertices to draw on-screen.
      }
      this.drawSphere = function() {
        this.reMatrix();
        gl.drawArrays(gl.TRIANGLES, 0, 960);		// number of vertices to draw on-screen.
      }
      this.drawJointTree = function(count, pivotAngle, curlAngle){
        pushMatrix(this.ModelMatrix);
        this.ModelMatrix.rotate(-pivotAngle, 0, 0, 1);
        this.ModelMatrix.translate(-0.2, 0 , 0);
        this.drawBox();
        for(i = 0; i < count-1; i++){
          this.ModelMatrix.translate(0.2, 0.5, 0.0);
          this.ModelMatrix.scale(0.8,0.8,0.8);
          this.ModelMatrix.rotate(-curlAngle, 0,0,1);
          this.ModelMatrix.translate(-0.2, 0, 0);
          this.drawBox();
        }
        this.ModelMatrix = popMatrix();
      }
      this.drawSquid = function(pivotAngle, curlAngle, arms, joints){
        pushMatrix(this.ModelMatrix);
        for(k = 0; k<arms; k++){
          this.drawBox();
          this.ModelMatrix.translate(0,0.5,0);
          pushMatrix(this.ModelMatrix);
          this.drawJointTree(joints, pivotAngle, curlAngle);
          this.ModelMatrix = popMatrix();
          this.ModelMatrix.translate(0, -0.5, 0);
          this.ModelMatrix.rotate(360/arms, 1, 0, 0);
        }
        this.ModelMatrix = popMatrix();
      }
      this.drawTree = function(leanAngle, branchAngle, arms, joints){
        pushMatrix(this.ModelMatrix);
        this.ModelMatrix.rotate(90, 1, 0, 0);
        this.reMaterial([0,0,0],[0,0,0],[89/255,57/255,0],[0,0,0],0.0);
        this.drawJointTree(4, 0, 0);
        this.ModelMatrix.rotate(90, 1, 0, 0);
        this.ModelMatrix.rotate(90, 0, 1, 0);
        this.ModelMatrix.translate(1.5,0,0);
        this.ModelMatrix.scale(0.5,0.5,0.5);
        this.reMaterial([0,0,0],[0.05,0.05,0.05],[0,0.6,0],[0.2,0.2,0.2],60.0);
        this.drawSquid(leanAngle,branchAngle, arms, joints);
        this.ModelMatrix = popMatrix();
      }
      this.drawForest = function(xs, ys, zs, count){
        for(j = 0; j < count; j++){
          pushMatrix(this.ModelMatrix);
          this.ModelMatrix.translate(xs[j], ys[j], zs[j]);
          leanAngle = makeAngle(5,g_angleNow0 + j,-10,-15);
          this.drawTree(leanAngle, leanAngle, 5, 5);
          this.ModelMatrix = popMatrix();
        }
      }
      simulationSpeed = 1000;
      this.drawPlanet = function(radius, size, speed, offset, offsetSpeed){
        xpos = radius * Math.sin(g_angleNow0*speed / simulationSpeed);
        ypos = radius * Math.cos(g_angleNow0*speed / simulationSpeed);
        zpos = offset * Math.sin(g_angleNow0*offsetSpeed / simulationSpeed);
        this.ModelMatrix.translate(xpos, ypos, zpos);
        this.ModelMatrix.scale(size, size, size);
        this.drawSphere();
      }
      this.drawMoon = function(radius, size, speed, offset, offsetSpeed){
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[221/256,221/256,221/256],[0.5,0.5,0.5],1000.0);
        pushMatrix(this.ModelMatrix);
        xpos = radius * Math.sin(g_angleNow0*speed / simulationSpeed);
        ypos = radius * Math.cos(g_angleNow0*speed / simulationSpeed);
        zpos = offset * Math.sin(g_angleNow0*offsetSpeed / simulationSpeed);
        this.ModelMatrix.translate(xpos, ypos, zpos);
        this.ModelMatrix.scale(size, size, size);
        this.drawSphere();
        this.ModelMatrix = popMatrix();
      }
  
      this.drawPlanets = function(){
        pushMatrix(this.ModelMatrix);
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[0,0,0.6],[0.6,0.6,0.6],100.0);
        this.ModelMatrix.rotate(g_angleNow0, 0, 0,1);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        pushMatrix(this.ModelMatrix);
        eS = 0.5;
        eD = 8;
        //Mercury
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[.5,.5,.5],[0.5,0.5,0.5],1000.0);
        this.drawPlanet(0.38*eD,0.38*eS,47.9, 0,0);
        this.ModelMatrix = popMatrix();
        //Venus
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[204/256,194/256,206/256],[0.5,0.5,0.5],1000.0);
        this.drawPlanet(0.72*eD,0.94*eS,35.0,0,0);
        this.ModelMatrix = popMatrix();
        //Earth
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[0/256,105/256,179/256],[0.5,0.5,0.5],100.0);
        this.drawPlanet(1*eD,1*eS,29.8,0,0);
        this.drawMoon(0.1*eD,0.2727,100,0.1,10);
        this.ModelMatrix = popMatrix();
        //Mars
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[122/256,48/256,0/256],[0.5,0.5,0.5],1000.0);
        this.drawPlanet(1.52*eD,0.53*eS,24.1,0,0);
        this.drawMoon(0.2*eD,0.5*0.2727/0.53,100,0.1,10);
        this.drawMoon(0.2*eD,0.5*0.2727/0.53,120,0.5,20);
        this.ModelMatrix = popMatrix();
        //Jupiter
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[250/256,156/256,126/256],[0.5,0.5,0.5],10.0);
        this.drawPlanet(5.2*eD,10.97*eS,13.1,0,0);
        for(i = 0; i < 79; i++){
          this.drawMoon(0.2*eD,0.05*0.2727/0.53*(i%5)/5,100+i,0.1*i/30*(i%5),i/2);
        }
        this.ModelMatrix = popMatrix();
        //Saturn
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[255/256,201/256,137/256],[0.5,0.5,0.5],50.0);
        this.drawPlanet(9.5*eD,9.14*eS,9.7,0,0);
        for(i = 0; i < 82; i++){
          this.drawMoon(0.2*eD,0.1*0.2727/0.53*(i%5)/2,100+i,0.1*i/30,i/2);
        }
        this.ModelMatrix = popMatrix();
        //Uranus
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[145/256,167/256,195/256],[0.5,0.5,0.5],1000.0);
        this.drawPlanet(19.2*eD,3.981*eS,6.8,0,0);
        for(i = 0; i < 27; i++){
          this.drawMoon(0.2*eD,0.1*0.2727/0.53*(i%5)/5,100+i,0.1*i/30*(i%5),i/2);
        }
        this.ModelMatrix = popMatrix();
        //Neptune
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[72/256,155/256,255/256],[0.5,0.5,0.5],1000.0);
        this.drawPlanet(30*eD,3.865*eS,5.4,0,0);
        for(i = 0; i < 14; i++){
          this.drawMoon(0.2*eD,0.1*0.2727/0.53*(i%5)/5,100+i,0.1*i/30*(i%5),i/2);
        }
        this.ModelMatrix = popMatrix();
        //Pluto
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[221/256,221/256,221/256],[0.5,0.5,0.5],1000.0);
        this.drawPlanet(39.5*eD,0.187*eS,4.67,0,0);
        this.ModelMatrix = popMatrix();
    
        this.reMaterial([0,0,0],[0.24725,0.1995,0.0745],[0.75164,0.60648,0.22648],[0.628281,0.555802,0.366065],51.2);
        this.reMaterial([0,0,0],[0.135,0.222,0.158],[0.54,0.89,0.63],[0.316,0.316,0.316],12.8);
        this.reMaterial([0.5,0,0],[0,0,0],[0,0,0],[0,0,0],0.0);
    
        this.ModelMatrix = popMatrix();
      }
      //Sun
      this.reMaterial([1,0.8,0],[0.1,0.1,0.1],[.5,.5,.5],[0.5,0.5,0.5],1000.0);
      this.drawSphere();
      if(planetsToggle) this.drawPlanets();
      if(treesToggle){
        this.ModelMatrix.translate(15.0, 0.0, 0);
        this.drawForest(
          [0,2,4,6,8,1,3,5,7,9,0,2,4,6,8,1,3,5,7,9,0,2,4,6,8],
          [0,0,0,0,0,2,2,2,2,2,4,4,4,4,4,6,6,6,6,6,8,8,8,8,8],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          25
        );
      }
      if(fingersToggle){
        this.ModelMatrix.setIdentity();
        this.ModelMatrix.rotate(g_angleNow0, 0, 0,1);
        this.reMaterial([0,0,0],[0.1,0.1,0.1],[0.6,0.6,0.6],[0.6,0.6,0.6],100.0);
        this.ModelMatrix.translate(-2.3, -3.0, 0);
        this.ModelMatrix.scale(10,10,10);
        this.drawJointTree(5, 0,makeAngle(1,g_angleNow0, 0,90));
  
        
        this.ModelMatrix.setIdentity();
        this.ModelMatrix.rotate(g_angleNow0, 0, 0,1);
        this.ModelMatrix.translate(-2.3, -3.0, 2);
        this.ModelMatrix.rotate(90, 1, 0,0);
        this.ModelMatrix.scale(1,1,1);
        for(k = 0; k < 10; k++){
          this.ModelMatrix.translate(0, 0, -0.5);
          this.reMaterial([0,0,0],[0.1,0.1,0.1],[k/10,0,1-k/10],[0.6,0.6,0.6],100.0);
          this.drawJointTree(5, 0,makeAngle(1,g_angleNow0*(k+1), 0,90));
        }
  
      }
      
    
    }
  
  VBObox5.prototype.reload = function() {
  //=============================================================================
  // Over-write current values in the GPU for our already-created VBO: use 
  // gl.bufferSubData() call to re-transfer some or all of our Float32Array 
  // contents to our VBO without changing any GPU memory allocations.
  
   gl.bufferSubData(gl.ARRAY_BUFFER, 	// GLenum target(same as 'bindBuffer()')
                    0,                  // byte offset to where data replacement
                                        // begins in the VBO.
                      this.vboContents);   // the JS source-data array used to fill VBO
  }

//=============================================================================
//=============================================================================
//=============================================================================