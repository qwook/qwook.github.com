'use strict'

var $ = require('jquery');
var hslToRgb = require('./color');

var context;
// var cdn = "http://ec2-54-71-44-200.us-west-2.compute.amazonaws.com/";
var cdn = "/";

var soundCache = {};

var slideShow = [
  "porter.png",
  "banana.png",
  "giraffage.gif",
  "dancing.gif",
  "macintosh.jpg",
  "freestyle.png",
  "peanutbutter.png",
  "hitbananas.png",
  "trailmix.png",
  "uBo8A1I.gif",
  "bread.png",
  "uE4UJ8F.gif",
  "david.png",
  "wbI9j1G.gif",
  "8HGuMw6.gif",
  "9CIVS9l.gif",
  "sadboys.png",
  "9HePqOH.gif",
  "ddH7kJw.gif",
  "elBRKTV.gif",
  "oQ1ddgw.gif",
]

function loadImage(img) {
  return new Promise((resolve, reject) => {
    var request = new XMLHttpRequest();
    request.open('GET', cdn + "slideshow/" + img, true);
    request.onload = function() {
      resolve();
    }
    request.send();
  })
}

function loadSound(sound) {
  return new Promise((resolve, reject) => {

    var request = new XMLHttpRequest();
    request.open('GET', cdn + sound, true);
    request.responseType = 'arraybuffer';

    // Decode asynchronously
    request.onload = function() {
      context.decodeAudioData(request.response, function(buffer) {
        soundCache[sound] = buffer;
        resolve();
      }, function(e) {
        reject(e);
      });
    }
    request.send();

  });
}

$(document).ready(() => {

  window.AudioContext = window.AudioContext||window.webkitAudioContext;
  context = new AudioContext();

  Promise.all(
    [loadSound("1.mp3"),
    loadSound("2.mp3"),
    loadSound("3.mp3"),
    loadSound("4.mp3"),
    loadSound("5.mp3"),
    loadSound("6.mp3"),
    loadSound("david.mp3")]
  )
  .then(() => {
    return Promise.all(slideShow.map((x) => { return loadImage(x) }))
  })
  .then(() => {

    $("#loading").css({"display": "none"})

    // create the voices

    var voices = {
      "65": "1.mp3",
      "83": "2.mp3",
      "68": "3.mp3",
      "70": "4.mp3",
      "71": "5.mp3",
      "72": "6.mp3",
    }

    // solve();

    var addedClicker = false;

    function solve() {
      $("#lol").css({display: "none"});
      $("#bubbles").css({display: "block"});
      $(".bubble").css({display: "block"});

      function randBgColor() {

        var rgb = hslToRgb(Math.random(), 0.5, 0.5);
        $("body").css({
          "background": "rgb(" + rgb.join(",") + ")"
        })

      }

      var slide = 0;
      var yup = true;
      function nextSlide() {
        slide = (slide + 1) % slideShow.length;
        if (yup) {
          $("#yup").css({display: "block"});
          $("#yup2").attr("src", cdn + "slideshow/" + slideShow[slide]).css({display: "none"});
        } else {
          $("#yup2").css({display: "block"});
          $("#yup").attr("src", cdn + "slideshow/" + slideShow[slide]).css({display: "none"});
        }

        yup = !yup;
      }

      randBgColor();
      // nextSlide();

      var int1 = setInterval(randBgColor, 60000 / 120 * 2);
      var int2 = setInterval(nextSlide, 60000 / 120 * 2);

      var source = context.createBufferSource();
      source.buffer = soundCache["david.mp3"];
      source.connect(context.destination);
      source.onended = function() {
        $("body").css({
          "background": "black"
        });

        $("img").css({"display": "none"})

        $("#lol").css({"display": "block"}).text("You probably know who I am now. I like visual arts, music and engineering. Click here to play again!")

        if (!addedClicker) {
          addedClicker = true;
          $("#lol").click(() => {
            solve();
          })
        }


        $("#bubbles").css({display: "none"});

        clearInterval(int1);
        clearInterval(int2);
      }

      source.start(0);
    }

    var passwordDudes = [];
    var password = [65, 65, 65, 70, 68, 70, 68, 83, 65, 65, 65];
    var solving = true;

    class PasswordDude {
      constructor() {
        this.pw = password.slice(0);
      }

      hitKey(which) {
        if (!solving) {
          return;
        }

        if (this.pw[0] != which) {
          this.pw = [100,100,100,100]; // just in case
          // console.log(passwordDudes)
          passwordDudes.splice(passwordDudes.indexOf(this), 1);
          // console.log(passwordDudes)
        } else {
          this.pw.splice(0, 1);

          if (this.pw.length == 0) {
            solving = false;
            solve();
          }
        }
      }
    }

    var keys = {}

    $("body").keydown((e) => {
      console.log(e.which);
      if (!keys[e.which] && voices[e.which]) {

        $(".bubble").each((i, bubble) => {
          console.log("AH");
          bubble.vel = {x: (Math.random()-0.5)*2, y: -Math.random()}
        })

        var source = context.createBufferSource();
        source.buffer = soundCache[voices[e.which]];
        source.connect(context.destination);
        source.start(0);

        if (solving) {
          for (var pds of passwordDudes) {
            pds.hitKey(e.which);
          }

          var pd = new PasswordDude();
          passwordDudes.push(pd);
          pd.hitKey(e.which);
        }
 
      }
      keys[e.which] = true;
    });

    $("body").keyup((e) => {
      keys[e.which] = false;
    });

    // bubbles
    setInterval(() => {
      $(".bubble").each((i, bubble) => {
        if (!bubble.pos) {
          bubble.pos = {x: Math.random() * 100, y: 100};
          bubble.vel = {x: (Math.random()-0.5)*2, y: -Math.random()}
        }

        bubble.pos.x += bubble.vel.x/2
        bubble.pos.y += bubble.vel.y/2

        if (bubble.pos.y <= -100 || bubble.pos.x <= -100 || bubble.pos.x >= 100) {
          bubble.pos.y = 100;
          bubble.pos.x = Math.random()*100;
          bubble.vel = {x: (Math.random()-0.5)*2, y: -Math.random()}
        }

        $(bubble).css({
          "top": bubble.pos.y + "%",
          "left": bubble.pos.x + "%"
        })

      })
    }, 10)


  })
  console.log(cdn + "1.mp3");

});
