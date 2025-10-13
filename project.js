function setup() {
  createCanvas(innerWidth, innerHeight);
  frameRate(10);
}
let synth;
let pulse = 0;

window.addEventListener("load", () => {
  synth = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.1, release: 0.2 },
  }).toDestination();

  const keys = [
    "A3",
    "A4",
    "C3",
    "C4",
    "E3",
    "E4",
    "G3",
    "G4",
    "B3",
    "B4",
    "D3",
    "D4",
    "F3",
    "F4",
  ];

  loop = new Tone.Loop((time) => {
    const key = random(keys);
    synth.triggerAttackRelease(key, time);

    color = random(20, 250);
    pulse = 1;
  }, "5n");
  Tone.Transport.start();
  loop.start(0);
});

const size = 10;
const divider = 20;
const numRows = 170;
const numCols = 170;

let counter = 10;

function draw() {
  background(0);
  noiseSeed(1);

  const startX = width / 2 - (numCols * size) / 2;
  const startY = height / 2 - (numRows * size) / 2;
  const pulseStrength = 1 + pulse * 0.6;

  //The following code was made with inspiration from the noise tutorial shown during one of the lectures.
  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numCols; x++) {
      const value =
        noise(x / divider, y / divider, counter) * size * pulseStrength;

      //Wave effect
      const offsetX = noise(x / 15, y / 15, counter) * 20 - 10;
      const offsetY = noise(x / 15, y / 15, counter + 100) * 20 - 10;

      fill(color, 0, map(value, 0, 1, 70, 270));
      square(startX + x * size + offsetX, startY + y * size + offsetY, value);
    }
  }

  counter += 0.05;
  pulse *= 0.6;
}
