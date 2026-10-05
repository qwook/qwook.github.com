let x;
let y;
let xspeed = 3;
let yspeed = 3.5;
let xdirection = 1;
let ydirection = 1;
let d = 10;
let count = 0;

function setup() {
  createCanvas(600, 600);
  background(120);
  x = width / 2;
  y = height / 2;
}

function draw() {
  x = random(0, width);
  y = random(0, height);
  
  fill(0);
  d = random(10,50)
  
  let colorX = map(x, 0, width, 0, 255);
  let colorY = map(y, 0, height, 0, 255);
  
  stroke(0)
  fill(colorX, colorY, 0)
  rect(x, y, d, d);
 // translate(mouseX,mouseY)
 // rotate(PI/2)
 // stroke(colorX, colorY)
 // line(-10,0,10,0)
}