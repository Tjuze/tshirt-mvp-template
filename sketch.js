let design = "";
let mic;
let isListening = false;
let shirtImg;
let textColor = '#121F17'; // Your brand color
let textSizeVal = 24;

function preload() {
  shirtImg = loadImage('assets/shirt.png'); // Load shirt template
}

function setup() {
  createCanvas(windowWidth, windowHeight - 60);
  
  // Speech recognition setup (unchanged)
  if (typeof p5.SpeechRec !== 'undefined' && !window.useNativeSpeech) {
    mic = new p5.SpeechRec('en-US', gotSpeech);
    mic.continuous = true;
  } else {
    mic = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    mic.lang = 'en-US';
    mic.continuous = true;
    mic.onresult = gotSpeech;
  }

  // Mic button
  const micBtn = document.getElementById('mic-btn');
  micBtn.ontouchstart = micBtn.onmousedown = () => mic.start();
  micBtn.ontouchend = micBtn.onmouseup = () => mic.stop();
}

function gotSpeech(result) {
  const transcript = result.resultValue ? result.resultString : result.results[0][0].transcript;
  design = transcript;
}

function draw() {
  background(240);
  
  // Draw shirt (centered)
  const shirtAspect = shirtImg.height / shirtImg.width;
  const shirtWidth = width * 0.8;
  const shirtHeight = shirtWidth * shirtAspect;
  image(
    shirtImg, 
    width/2 - shirtWidth/2, 
    height/2 - shirtHeight/2, 
    shirtWidth, 
    shirtHeight
  );
  
  // Draw design text
  if (design) {
    fill(textColor);
    textSize(textSizeVal);
    textAlign(CENTER, CENTER);
    text(design, width/2, height/2);
  }
}
