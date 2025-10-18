function setup() {
  createCanvas(innerWidth, innerHeight);
  frameRate(10);
}
let numCols;
let numRows;
let size;
let synth;
let pulse = 0;
let mic;
let meter;
let level;
let counter = 0;
let noiseScale = 0.5;
let divider;
let startX, startY;
let x, y;
let offsetX, offsetY;
let c;
let newArt = false;
let nextArt = false;
let lastArt = false;
let shuffel = 100;

const soundTypes = ["sine2", "fatsawtooth", "pulse", "fmsquare"];
let currentSound = 0;

//----LOAD ------------
window.addEventListener("load", () => {
  synth = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 1, release: 2 },
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
    c = random(0, 100);

    pulse = 1;
  }, "5n");

  //Following lines 52-53 are copied from: https://tonejs.github.io/docs/14.7.58/UserMedia
  meter = new Tone.Meter();
  mic = new Tone.UserMedia().connect(meter);
  let level = meter.getValue();
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
    console.log(currentSound);
  }
});
//--------------SIZE------------
function sizeChanges() {
  if (soundTypes) {
    if (soundTypes[currentSound] === "sine2") {
      size = 5;
      newArt = false;
      nextArt = false;
      lastArt = true;
    } else if (soundTypes[currentSound] === "fatsawtooth") {
      size = 15;
      newArt = false;
      nextArt = false;
      lastArt = false;
    } else if (soundTypes[currentSound] === "pulse") {
      size = 10;
      newArt = true;
      nextArt = false;
      lastArt = false;
    } else if (soundTypes[currentSound] === "fmsquare") {
      size = 8;
      newArt = false;
      nextArt = true;
      lastArt = false;
    }
  }
}
//----------SOUND AND DIVIDER----------
function soundChanges() {
  let level = meter.getValue();
  // Changing the divider according to microphone
  if (meter) {
    // level = meter.getValue();
    if (level > -30 && level <= -10) {
      divider = 1;
      console.log("1st", level);
    } else if (level > -40 && level <= -30) {
      divider = 2;
      console.log("2nd", level);
    } else if (level > -50 && level <= -40) {
      divider = 4;
      console.log("3rd", level);
    } else {
      divider = 4;
      console.log("4th", level);
    }
  }
}

//-----------NOISE RECTANGLES----------
function noisefield() {
  let bwMode = level > -20;
  const startX = width / 2 - (numCols * size) / 2;
  const startY = height / 2 - (numRows * size) / 2;
  const pulseStrength = 1 + pulse * 0.6;
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
        fill(c, 20, 90);
      }
      if (newArt) {
        let pointX = startX + x * size + offsetX;
        let pointY = startY + y * size + offsetY;
        const centerX = width / 2;
        const centerY = height / 2;
        const dinstance = dist(pointX, pointY, centerX, centerY);
        let shift = map(dinstance, 0, (numCols * size) / 2, shuffel, 0);
        let angle = noise(x, y, counter) * TWO_PI * 2;
        let shiftY = cos(angle) * shift * 0.02;
        let shiftX = sin(angle) * shift * 0.02;
        fill(c, 40, 90);
        square(pointX + shiftX, pointY + shiftY, value);
      } else if (nextArt) {
        let pointX = startX + x * size + offsetX;
        let pointY = startY + y * size + offsetY;
        const centerX = width / 2;
        const centerY = height / 2;
        const dinstance = dist(pointX, pointY, centerX, centerY);
        let shift = map(dinstance, 0, (numCols * size) / 2, shuffel, 0);
        let angle = noise(x, y, counter) * TWO_PI * 2;
        let shiftY = cos(angle) * shift * 0.05;
        let shiftX = sin(angle) * shift * 0.05;
        fill(c, 65, 90);
        square(pointX + shiftX, pointY + shiftY, value);
      } else if (lastArt) {
        let pointX = startX + x * size + offsetX;
        let pointY = startY + y * size + offsetY;
        const centerX = width / 2;
        const centerY = height / 2;
        const dinstance = dist(pointX, pointY, centerX, centerY);
        let shift = map(dinstance, 0, (numCols * size) / 2, shuffel, 0);
        let angle = noise(x, y, counter) * TWO_PI * 2;
        let shiftY = cos(angle) * shift * 0.1;
        let shiftX = sin(angle) * shift * 0.1;
        fill(c, 80, 90);
        square(pointX + shiftX, pointY + shiftY, value);
      } else {
        square(startX + x * size + offsetX, startY + y * size + offsetY, value);
      }
    }
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

  pulse *= 0.6;
  counter += 0.05;
}
// --------DRAWING---------------
function draw() {
  background(0);
  noiseSeed(1);
  noStroke();
  fill(0);

  level = meter.getValue();
  soundChanges();
  sizeChanges();
  numCols = ceil((300 / size) * 2);
  numRows = ceil((300 / size) * 2);
  noisefield();
}
