
var images = [
	"./cute/IMG_0240.jpg",
	"./cute/IMG_0460.jpg",
	"./cute/IMG_0916.jpg",
	"./cute/IMG_1045.jpg"
];

function cute() {
	var img = document.createElement("img");
	img.src = images[Math.floor(Math.random()*images.length)];
	img.width = 200;
	img.style.position = "absolute";
	var x = Math.floor(Math.random() * (window.innerWidth-200));
	var y = Math.floor(Math.random() * window.innerHeight);
	img.style.left = x + "px";
	img.style.top = y + "px";
	document.body.appendChild(img);
}
