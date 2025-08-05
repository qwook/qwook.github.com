const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const text = document.getElementById("text");
const hintBtn = document.getElementById("hintBtn");
const resetBtn = document.getElementById("resetBtn");

const color = new Set();

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const width = canvas.width;
const height = canvas.height;

const blockSize = 20; // each blob of color is 20x20 pixels

const xBlocks = Math.floor(canvas.width / blockSize);
const yBlocks = Math.floor(canvas.height / blockSize);

let buttonX = Math.floor(Math.random() * xBlocks) * blockSize;
let buttonY = Math.floor(Math.random() * yBlocks) * blockSize;

let winningColor = "black";

draw();

function draw() {
  for (let i = 0; i < width; i += blockSize) {
    for (let j = 0; j < height; j += blockSize) {
      const color = generateNewColorRGB();
      if (i === buttonX && j === buttonY) {
        winningColor = color;
        console.log("Button position: X: ", buttonX, " Y:", buttonY);
        console.log("Color at button position: ", color);
      }
      ctx.fillStyle = color;
      ctx.fillRect(i, j, blockSize, blockSize);
    }
  }
}

//color in HSL format, generally the color pallete becomes more blacky compared to RGB
function generateNewColorHSL() {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 100);
  const l = Math.floor(Math.random() * 100);
  const hslColor = `hsl(${h}, ${s}%, ${l}%)`;
  if (color.has(hslColor)) {
    return generateNewColorHSL();
  } else {
    color.add(hslColor);
    return hslColor;
  }
}

function generateNewColorRGB() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  const rgbColor = `rgb(${r}, ${g}, ${b})`;
  if (color.has(rgbColor)) {
    return generateNewColorRGB();
  } else {
    color.add(rgbColor);
    return rgbColor;
  }
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / blockSize) * blockSize;
  const y = Math.floor((event.clientY - rect.top) / blockSize) * blockSize;

  console.log("Clicked at: X:", x, " Y:", y);

  if (x === buttonX && y === buttonY) {
    ctx.fillStyle = "black";
    ctx.fillRect(buttonX, buttonY, blockSize, blockSize);
    alert("🎉 You found the button!");
  } else {
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, blockSize, blockSize);
    console.log("Filled red at: X:", x, " Y:", y);
  }
});

text.style.backgroundColor = winningColor;

hintBtn.addEventListener("click", () => {
  for (let i = 0; i < width; i += blockSize) {
    for (let j = 0; j < height; j += blockSize) {
      if (i === buttonX && j === buttonY) {
        // Keep the winning color
        ctx.fillStyle = winningColor;
      } else {
        // Black out everything else
        ctx.fillStyle = "black";
      }
      ctx.fillRect(i, j, blockSize, blockSize);
    }
  }
});

resetBtn.addEventListener("click", () => {
  draw();
});
