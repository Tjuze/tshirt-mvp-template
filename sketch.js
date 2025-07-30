let design = "";
let mic;

function setup() {
  createCanvas(400, 400);
  
  // Verify library loaded
  if (typeof p5.SpeechRec === 'undefined') {
    console.error("p5.speech not loaded!");
    return;
  }

  mic = new p5.SpeechRec('en-US', gotSpeech);
  mic.onError = console.error; // Log any mic errors
  mic.start();
}

function gotSpeech() {
  if (mic.resultValue) {
    design = mic.resultString;
    console.log("Heard:", design);
  }
}

function draw() {
  background(240);
  text("Speak your design:", 20, 40);
  text(design, 20, 80);
}
