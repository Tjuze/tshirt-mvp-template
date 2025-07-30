let design = "";
let mic;
let shirtImg;
let textColor = '#121F17';
let textSizeVal = 24;
let isImageLoaded = false;

function preload() {
  shirtImg = loadImage(
    'https://github.com/Tjuze/tshirt-mvp/tree/main/assets/shirt.png',
    () => {
      console.log('Image loaded successfully');
      isImageLoaded = true;
      document.getElementById('loading-message').style.display = 'none';
    },
    () => {
      console.error('Failed to load image');
      showError('Failed to load t-shirt image');
    }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Initialize UI
  document.getElementById('size-value').textContent = textSizeVal;
  
  // Speech Recognition setup
  try {
    if (typeof p5.SpeechRec !== 'undefined') {
      console.log("Using p5.speech");
      mic = new p5.SpeechRec('en-US', gotSpeech);
      mic.continuous = true;
      mic.onError = (err) => {
        console.error("Speech recognition error:", err);
        fallbackToNativeSpeech();
      };
    } else {
      fallbackToNativeSpeech();
    }
  } catch (e) {
    console.error("Speech setup failed:", e);
    fallbackToNativeSpeech();
  }

  // Mic button with comprehensive event handling
  const micBtn = document.getElementById('mic-btn');
  const handleStart = () => {
    try {
      mic.start();
      micBtn.textContent = "🔴 Listening...";
      console.log("Recording started");
    } catch (e) {
      console.error("Failed to start recording:", e);
      showError("Microphone access denied");
      micBtn.textContent = "❌ Mic Error";
      setTimeout(() => {
        micBtn.textContent = "🎤 Hold to Speak";
      }, 2000);
    }
  };

  const handleStop = () => {
    try {
      mic.stop();
      micBtn.textContent = "🎤 Hold to Speak";
    } catch (e) {
      console.error("Failed to stop recording:", e);
    }
  };

  // Add all possible event listeners
  micBtn.addEventListener('mousedown', handleStart);
  micBtn.addEventListener('touchstart', handleStart);
  micBtn.addEventListener('mouseup', handleStop);
  micBtn.addEventListener('touchend', handleStop);
  micBtn.addEventListener('mouseleave', handleStop);

  // Controls
  document.getElementById('text-color').addEventListener('input', (e) => {
    textColor = e.target.value;
  });

  document.getElementById('text-size').addEventListener('input', (e) => {
    textSizeVal = parseInt(e.target.value);
    document.getElementById('size-value').textContent = textSizeVal;
  });

  // Save button
  document.getElementById('share-btn').addEventListener('click', saveDesign);
}

function fallbackToNativeSpeech() {
  console.log("Using native Web Speech API");
  mic = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  mic.lang = 'en-US';
  mic.continuous = true;
  mic.onresult = gotSpeech;
  mic.onerror = (err) => {
    console.error("Native API error:", err);
    showError("Speech recognition not available");
  };
}

function gotSpeech(result) {
  const transcript = result.resultValue ? result.resultString : result.results[0][0].transcript;
  design = transcript;
  console.log("Design:", design);
}

function draw() {
  background(240);
  
  if (isImageLoaded) {
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
}

function saveDesign() {
  if (!isImageLoaded) {
    showError("Please wait for image to load");
    return;
  }

  try {
    // Create a temporary canvas
    const offscreenCanvas = document.createElement('canvas');
    const offscreenCtx = offscreenCanvas.getContext('2d');
    
    // Set dimensions matching your shirt display
    const shirtRatio = shirtImg.height / shirtImg.width;
    const shirtWidth = width * 0.8;
    const shirtHeight = shirtWidth * shirtRatio;
    
    offscreenCanvas.width = shirtWidth;
    offscreenCanvas.height = shirtHeight;
    
    // Draw shirt background
    offscreenCtx.fillStyle = '#f0f0f0';
    offscreenCtx.fillRect(0, 0, shirtWidth, shirtHeight);
    
    // Draw shirt image
    offscreenCtx.drawImage(
      shirtImg,
      0,
      0,
      shirtWidth,
      shirtHeight
    );
    
    // Draw text
    if (design) {
      offscreenCtx.fillStyle = textColor;
      offscreenCtx.font = `${textSizeVal}px Arial`;
      offscreenCtx.textAlign = 'center';
      offscreenCtx.textBaseline = 'middle';
      offscreenCtx.fillText(design, shirtWidth/2, shirtHeight/2);
    }
    
    // Convert to image and download
    offscreenCanvas.toBlob(function(blob) {
      const link = document.createElement('a');
      link.download = 'tshirt-design.png';
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    }, 'image/png');
  } catch (e) {
    console.error("Save failed:", e);
    showError("Failed to save design");
  }
}

function showError(message) {
  const errorDiv = document.getElementById('error-message');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
