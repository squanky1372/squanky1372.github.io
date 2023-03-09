var websocket = null;
var localhost = "";
var b = document.getElementById('btnWS');
var buttonClicked = false;

// Initialize the websocket
function init() {
	if(window.location.hostname != "") {
		localhost = window.location.hostname;
	}

	doConnect();
}

function doConnect() { // makes a connection and defines callbacks
	if (b.innerText == "Start Webcam") {
		writeToScreen("Connecting to ws://" + localhost + ":81/ ...");
		b.disabled = true;
		websocket = new WebSocket("ws://" + localhost + ":81/");
		websocket.onopen = function(evt) {
			onOpen(evt)
		};
		websocket.onclose = function(evt) {
			onClose(evt)
		};
		websocket.onmessage = function(evt) {
			onMessage(evt)
		};
		websocket.onerror = function(evt) {
			onError(evt)
		};
	} else {
		writeToScreen("Disconnecting ...");
		websocket.close();
	}
}

function onOpen(evt) { // when handshake is complete:
	writeToScreen("Connected.");
	//*** Change the text of the button to read "Stop Webcam" ***//
    b.innerHTML = "Stop Webcam";

    //*** Change the title attribute of the button to display "Click to stop webcam" ***//
    b.title = "Click to stop webcam";
		
    //*** Enable the button ***//
    b.disabled = false;


	buttonClicked = false;
}

function onClose(evt) { // when socket is closed:
	writeToScreen("Disconnected. Error: " + evt);
	//*** Change the text of the button to read "Start Webcam" ***//
    b.innerHTML = "Start Webcam";

    //*** Change the title attribute of the button to display "Click to start webcam" ***//
    b.title = "Click to start webcam";
		
    //*** Enable the button ***//
    b.disabled = false;
    
    
    // If the user never actually clicked the button to stop the webcam, reconnect.
	if (buttonClicked == false) {
		doConnect();
	}
	buttonClicked = false;
}

function onMessage(msg) {
	//*** Display a new timestamp ***//
	document.getElementById("timestamp").innerHTML = "Timestamp: " + new Date().toString();
	
	// Get the image just taken from WiFi chip's RAM.
	var image = document.getElementById('image');
	var reader = new FileReader();
	reader.onload = function(e) {
		var img_test = new Image();
		img_test.onload = function(){image.src = e.target.result;};
		img_test.onerror = function(){;};
		img_test.src = e.target.result;
	};
	reader.readAsDataURL(msg.data);
}

function onError(evt) { // when an error occurs
	websocket.close();
	writeToScreen("Websocket error");
	
	//*** Change the text of the button to read "Start Webcam" ***//
    b.innerHTML = "Start Webcam";

    //*** Change the title attribute of the button to display "Click to start webcam" ***//
    b.title = "Click to start webcam";
		
    //*** Enable the button ***//
    b.disabled = false;
	
	
	buttonClicked = false;
}

// Set up event listeners
//*** When the button is clicked, disable it and set the 'buttonClicked' variable to true, and depending on whether a Websocket is open or not, either run "doConnect()" or "websocket.close()" ***//
b.addEventListener("click", buttonEvent);
function buttonEvent(message){
    buttonClicked = true;
    b.disabled = true;
    if (websocket.readyState !== WebSocket.CLOSED) {
        websocket.close();
    }
    else{
        doConnect();
    }
}

// Function to display to the message box
 function writeToScreen(message)
  {
	document.getElementById("msg").innerHTML += message + "\n";
	document.getElementById("msg").scrollTop = document.getElementById("msg").scrollHeight;
  }

// Open Websocket as soon as page loads
window.addEventListener("load", init, false);