const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
let fibs = [1, 1];
let scale = 1;
let minScale;

// Array to hold loaded images
let images = [];

function preload() {
  // Load placeholder images using p5.js's built-in method
  for (let i = 0; i < 4; i++) {
    let img = createImage(100, 100); // Create a placeholder image
    img.loadPixels();
    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        img.set(x, y, color(random(255), random(255), random(255))); // Random color
      }
    }
    img.updatePixels();
    images.push(img);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  initFibs();
  setMinScale();

  // Disable default browser behavior for scrolling inside canvas
  document.getElementById('defaultCanvas0').addEventListener('wheel', function (e) {
    e.preventDefault();
    adjustScale(e.deltaY); // Adjust scale based on scroll direction
  });
}

function draw() {
  background(200);
  translate(width / 2, height / 2);

  for (let i = 0; i < fibs.length; i++) {
    const fib = fibs[i] * scale;
    const img = images[i % images.length]; // Select image based on current Fibonacci index
    if (img && img.width > 0) { // Check if image is loaded
      // Calculate the destination area on the canvas
      let destX = 0;
      let destY = 0;
      let destW = fib;
      let destH = fib;
      
      // Draw the cropped image to fit the Fibonacci rectangle
      image(img, destX, destY, destW, destH);
    }
    translate(fib, fib);
    rotate(-90);
  }

  // Reset the position and scale of the spiral
  if (scale <= minScale) {
    fibs = [1, 1];
    initFibs();
    scale = 1;
  } else {
    scale *= 0.99;
  }
}

function addFib() {
  const fibLen = fibs.length;
  fibs.push(fibs[fibLen - 1] + fibs[fibLen - 2]);
}

function initFibs() {
  fibs = [1, 1]; // Reset fibs to start fresh
  for (let i = 0; i < 25; i++) {
    addFib();
  }
}

function setMinScale() {
  const fibLen = fibs.length;
  minScale = fibs[fibLen - 5] / fibs[fibLen - 1];
}

function adjustScale(scrollDelta) {
  if (scrollDelta > 0) {
    // Scroll down (zoom out)
    scale *= 0.99;
  } else {
    // Scroll up (zoom in)
    scale /= 0.99;
  }
}

// Resize canvas on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
