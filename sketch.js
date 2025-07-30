
let design = "";
let mic;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Voice recognition setup
  mic = new p5.SpeechRec('en-US', gotSpeech);
  mic.continuous = true;
  mic.start();
}

function gotSpeech() {
  if (mic.resultValue) {
    design = mic.resultString;
    console.log(design); // Debug voice input
  }
}

function draw() {
  background(240);
  textSize(20);
  text("Say your t-shirt design:", 20, 40);
  text(design, 20, 80); // Show voice input
}
