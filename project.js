function setup() {
  createCanvas(innerWidth, innerHeight);
  frameRate(10);

  size = 10;
  numCols = ceil(width / size);
  numRows = ceil(height / size);
}

let synth;
let pulse = 0;
let mic;
let meter;
//const size = 10;
//const numRows = 170;
//const numCols = 170;
let counter = 10;

const soundTypes = ["sine2", "fatsine", "fatsawtooth", "pulse", "fmsquare"];
let currentSound = 0;

//----LOAD ------------
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
    synth.triggerAttackRelease(key, "8n", time);

    color = random(20, 250);
    pulse = 1;
  }, "5n");

  //Following lines 52-53 are copied from: https://tonejs.github.io/docs/14.7.58/UserMedia
  meter = new Tone.Meter();
  mic = new Tone.UserMedia().connect(meter);
});

//---------CLICK---------------
window.addEventListener("click", () => {
  Tone.start();
  Tone.Transport.start();
  loop.start(0);
  console.log("Tone.js ready");
  mic.open();
  console.log("mic open");

  // Changing sound on click
  if (synth) {
    currentSound = (currentSound + 1) % soundTypes.length;
    synth.oscillator.type = soundTypes[currentSound];
  }
});

// --------DRAWING---------------
function draw() {
  background(0);
  noiseSeed(1);
  noStroke();
  fill(0);
  let level = meter.getValue();
  let bwMode = level > -20;
  const startX = width / 2 - (numCols * size) / 2;
  const startY = height / 2 - (numRows * size) / 2;
  const pulseStrength = 1 + pulse * 0.6;

  // Changing the divider according to microphone
  if (meter) {
    level = meter.getValue();
    if (level > -30 && level <= -10) {
      divider = 1;
      console.log("1st", level);
    } else if (level > -40 && level <= -30) {
      divider = 10;
      console.log("2nd", level);
    } else if (level > -50 && level <= -40) {
      divider = 100;
      console.log("3rd", level);
    } else {
      divider = 50;
      console.log("4th", level);
    }
  }
  // The following code was made with inspiration from the noise tutorial shown during one of the lectures.
  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numCols; x++) {
      const value =
        noise(x / divider, y / divider, counter) * size * pulseStrength;

      // Wave effect
      const offsetX = noise(x / 15, y / 15, counter) * 20 - 10;
      const offsetY = noise(x / 15, y / 15, counter + 100) * 20 - 10;

      if (bwMode) {
        fill(255);
      } else {
        fill(color, 0, map(value, 0, 1, 70, 270));
      }

      square(startX + x * size + offsetX, startY + y * size + offsetY, value);
    }
  }

  counter += 0.05;
  pulse *= 0.6;

  // Glitch effect on loud microphone sound
  // Lines 131 & 136 were written with help from ChatGPT
  if (bwMode) {
    let numGlitches = int(random(5, 15));
    for (let i = 0; i < numGlitches; i++) {
      let glitchY = random(height);
      let glitchH = random(10, 30);
      let offsetX = random(-50, 50);
      copy(0, glitchY, width, glitchH, offsetX, glitchY, width, glitchH);
    }
  }
}
