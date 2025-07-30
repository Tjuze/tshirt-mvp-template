let design = "";
let mic;
let isListening = false;

function setup() {
  createCanvas(windowWidth, windowHeight - 60); // Space for button
  
  // Check if p5.speech loaded or fallback to native API
  if (typeof p5.SpeechRec !== 'undefined' && !window.useNativeSpeech) {
    console.log("Using p5.speech");
    mic = new p5.SpeechRec('en-US', gotSpeech);
    mic.continuous = true;
    mic.onError = (err) => console.error("p5.speech error:", err);
  } else {
    console.log("Using native Web Speech API");
    mic = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    mic.lang = 'en-US';
    mic.continuous = true;
    mic.onresult = gotSpeech;
    mic.onerror = (err) => console.error("Native API error:", err);
  }

  // Mobile-friendly mic button
  const micBtn = document.getElementById('mic-btn');
  micBtn.ontouchstart = micBtn.onmousedown = () => {
    mic.start();
    isListening = true;
    micBtn.textContent = "🔴 Listening...";
  };
  
  micBtn.ontouchend = micBtn.onmouseup = () => {
    mic.stop();
    isListening = false;
    micBtn.textContent = "🎤 Hold to Speak";
  };
}

function gotSpeech(result) {
  // Handle both p5.speech and native API response formats
  const transcript = result.resultValue ? result.resultString : result.results[0][0].transcript;
  design = transcript;
  console.log("Heard:", design);
}

function draw() {
  background(240);
  textSize(24);
  textAlign(CENTER);
  text("Describe your t-shirt design:", width/2, 40);
  
  textSize(18);
  textAlign(LEFT);
  text(design, 20, 80, width - 40);
}
