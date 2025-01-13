var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');

document.getElementById("record").onclick = function ()  {
  recognition.start();
  console.log('Ready to receive a color command.');
}

recognition.onresult = function(event) { // See "script original backup" for desc of event struct
  var spoken_words = event.results[0][0].transcript;
  diagnostic.textContent = 'Result received: ' + spoken_words + '.';
  console.log('Confidence: ' + event.results[0][0].confidence);

  // Define the data object
  const data = {
    prompt: spoken_words
  };

  fetch('http://localhost:8080/gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Parse the JSON response
    })
    .then(result => {
      console.log('Success:', result);
      speak(result.answer)
    })
    .catch(error => {
      console.error('Error:', error);
  });
}

recognition.onspeechend = function() {
  recognition.stop();
}

recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that color.";
}

recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}