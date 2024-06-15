const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
let fibs = [1, 1];
let scale = 1;
let minScale;
let canvasReady = false;

// Array to hold image URLs
let imageUrls = [
  'https://i.ibb.co/PG99NHq/20240529-194318.jpg', // Replace with your image URLs
  'https://i.ibb.co/3hZ2XHr/20240529-195123.jpg',
  'https://i.ibb.co/HrBw1z1/20240604-210001.jpg',
  'https://i.ibb.co/xs1QrTY/20240605-170900.jpg',
  'https://i.ibb.co/3dhrqjK/20240605-171057.jpg', 
  'https://i.ibb.co/VJrwngp/20240605-182809.jpg',
  'https://i.ibb.co/92hx1gR/20240605-182834.jpg',
  'https://i.ibb.co/VHgsB6m/20240605-182944.jpg'
];

// Array to hold loaded images
let images = [];
let imagesLoaded = 0;
let loadingMessage = 'Loading images...';

function preload() {
  // Load images from URLs
  for (let i = 0; i < imageUrls.length; i++) {
    loadImage(imageUrls[i], img => {
      images.push(img);
      imagesLoaded++;
      loadingMessage = `Loaded ${imagesLoaded} of ${imageUrls.length} images.`;
      if (imagesLoaded === imageUrls.length) {
        loadingMessage = 'All images loaded. Drawing Fibonacci spiral...';
        if (canvasReady) {
          drawFibonacciSpiral();
        }
      }
    }, err => {
      console.error('Error loading image:', err);
      loadingMessage = `Error loading image ${i + 1}.`;
    });
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

  canvasReady = true;

  // Initial placeholder background while images are loading
  background(200);
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(50);
  text(loadingMessage, width / 2, height / 2);
}

function drawFibonacciSpiral() {
  if (!canvasReady) return;
  
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

  // Reset the position and scale of the spiral if it gets too small
  if (scale <= minScale) {
    fibs = [1, 1];
    initFibs();
    scale = 1;
    drawFibonacciSpiral();
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
  drawFibonacciSpiral();
}

// Resize canvas on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawFibonacciSpiral();
}

function draw() {
  // Display loading messages during the preload phase
  if (imagesLoaded < imageUrls.length) {
    background(200);
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(50);
    text(loadingMessage, width / 2, height / 2);
  }
}
