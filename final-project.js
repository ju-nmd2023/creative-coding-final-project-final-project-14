function setup() {
  createCanvas(innerWidth, innerHeight);
  frameRate(10);
}

const size = 10;
const divider = 10;
const numRows = 70;
const numCols = 70;

let counter = 0;
let rez = 0.05;

function draw() {
  background(0);
  noiseSeed(1);

  const startX = width / 2 - (numCols * size) / 2;
  const startY = height / 2 - (numRows * size) / 2;

  //The following code was made with inspiration from the noise tutorial shown during one of the lectures.
  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numCols; x++) {
      const value = noise(x / divider, y / divider, counter) * size;
      square(startX + x * size, startY + y * size, value);

      // The following code was written with the help from https://www.gorillasun.de/blog/an-introduction-to-perlin-noise-in-p5js-and-processing
      const r = noise(x * rez, y * rez, counter) * 180;
      const g = noise(y * rez, counter, x * rez) * 15;
      const b = noise(counter, x * rez, y * rez) * 255;
      fill(r, g, b);
    }
  }

  counter += 0.05;
}
