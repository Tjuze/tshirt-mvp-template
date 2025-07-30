let design = "";
let mic;
let shirtImg;
let textColor = '#121F17';
let textSizeVal = 24;

function preload() {
  shirtImg = loadImage('assets/shirt.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Speech Recognition setup
  if (typeof p5.SpeechRec !== 'undefined') {
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
  micBtn.ontouchstart = micBtn.onmousedown = () => {
    mic.start();
    micBtn.textContent = "🔴 Listening...";
  };
  
  micBtn.ontouchend = micBtn.onmouseup = () => {
    mic.stop();
    micBtn.textContent = "🎤 Hold to Speak";
  };

  // Controls
  document.getElementById('text-color').addEventListener('input', (e) => {
    textColor = e.target.value;
  });

  document.getElementById('text-size').addEventListener('input', (e) => {
    textSizeVal = parseInt(e.target.value);
    document.getElementById('size-value').textContent = textSizeVal;
  });

  // Save button
  document.getElementById('share-btn').addEventListener('click', () => {
    saveCanvas('tshirt-design', 'png');
  });
}

function gotSpeech(result) {
  const transcript = result.resultValue ? result.resultString : result.results[0][0].transcript;
  design = transcript;
  console.log("Design:", design);
}

function draw() {
  background(240);
  
  // Draw shirt (centered with aspect ratio)
  const shirtRatio = shirtImg.height / shirtImg.width;
  const shirtWidth = width * 0.8;
  const shirtHeight = shirtWidth * shirtRatio;
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
