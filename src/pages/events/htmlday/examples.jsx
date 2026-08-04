import { headTags } from "../../../utils/headTags";

headTags({
  title: "Custom cursors in Javascript and CSS.",
  description: "Adding custom cursors in my game!",
});

import { createPage } from "../../../app";
import Banner from "../../../components/Banner";
import SyntaxHighlighter from "react-syntax-highlighter";
import { VideoPlayer } from "../../../components/ui/VideoPlayer";
import { Smiley } from "../../../components/smiley/Smiley";
import { useEffect, useRef } from "react";
import { CodeWithFrame } from "../../../components/CodeWithFrame";

function BlogPage() {
  return (
    <div className="blog">
      <Banner>Examples of HTML</Banner>
      <style>
        {`
        img.ss {
          // border: 10px solid #ccc;
          box-shadow: 5px 5px 15px lime;
          outline: 2px solid lime;
          max-width: 100%;
          width: 75%;
          margin: 2em 0.8em;
        }

        .code-with-frames {
          box-shadow: 5px 5px 15px lime;
          outline: 2px solid lime;
          padding: 20px;
          margin-bottom: 20px;
        }

        .code-with-frames h4 {

          margin: 0px;
        }

        iframe {
          width: 100%;
          height: 14em;
        }
        `}
      </style>
      <CodeWithFrame
        src={`
<p>I am a simple <b>person</b>
<p>with simple <b>habits</b></p>
<ul>
  <li>i <b>thread</b> the <i>needle</i></li>
  <li>and <b>brush</b> my <i>teeth</i></li>
  <li>i <b>go</b> to <i>work</i></li>
  <li>and <b>eat</b> my <i>lunch</i></li>
  <ol>
    <li>a <b>spider</b> repeating a <i>pattern</i></li>
    <li>a habit <b>tangled</b> like <i>web</i></li>
    <ol>
      <li>over and over again</li>
    </ol>
    <li><i>until</i> <b><i>infinity</i></b></li>
  </ol>
<ul>
`}
      />
      <CodeWithFrame
        src={`
<style>
  body {
    font-family: Comic Sans MS;
  }
  h1 {
    color: purple;
  }
</style>
<h1>I Love Dogs!</h1>
<p>I wonder,</p>
<h3>do they love me too?</h3>
`}
      />
      <CodeWithFrame
        src={`
<h1 id="header">Click on the Button to change the colors.</h1>
<p id="paragraph">And I will tell you a story.</p>
<button onClick="onButtonClick()">Click here to Change Colors</button>
<script>
const stories = [
  {
    color: "pink",
    storyHeader: "The Pink Power Ranger",
    storyParagraph: "When I was young my parents bought a power rangers costume for me, but it was pink instead of red. So I spent the entire day with a red marker coloring it red."
  },
  {
    color: "blue",
    storyHeader: "The Blue Skies",
    storyParagraph: "Sometimes at 5PM the sky would get cloudy as if it were going to rain, but it never rained. Instead the whole neighborhood turned blue."
  },
  {
    color: "turquoise",
    storyHeader: "The Turquoise Rooftops",
    storyParagraph: "The rooftops of our schools were turqoise. At the time, I thought it was ugly, but now the color reminds me of childhood."
  }
]
// We start off at -1 because when we click the button, we go to the next story.
// By starting at -1, our "next" story will be 0, or the first story.
let currentStory = -1;
function onButtonClick() {
  currentStory = (currentStory + 1) % stories.length; // Go to the next story.

  // Our HTML elements have an id="name" attribute, which helps us
  // access it in javascript.
  const header = document.getElementById("header");
  const paragraph = document.getElementById("paragraph");

  // Changes the text of the HTML to one of the stories.
  header.innerText = stories[currentStory].storyHeader;
  paragraph.innerText = stories[currentStory].storyParagraph;

  // Changes the background color of the header.
  header.style.backgroundColor = stories[currentStory].color;
}
</script>
`}
      />
      <CodeWithFrame
        src={`
<div id="falling1">
  leaves
</div>
<div id="falling2">
  snow
</div>
<div id="falling3">
  rain
</div>
<div id="falling4">
  fruit
</div>
<div id="falling5">
  time
</div>
<style>
  html, body {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
</style>
<script>
function makeThisFall(fallingElement) {
    let x = Math.random() * document.body.scrollWidth;
    let y = Math.random() * document.body.scrollHeight;
    let sinOffset = Math.random() * Math.PI * 2;

    fallingElement.style.position = "absolute";
    fallingElement.style.left = 0;
    fallingElement.style.top = 0;

    function runFunctionOverAndOverAgain() {
      const widthOfPage = document.body.scrollWidth;
      const heightOfPage = document.body.scrollHeight;

      y = y + 1;
      if (y > heightOfPage) {
        x = Math.random() * widthOfPage;
        y = 0;
        sinOffset = Math.random() * Math.PI * 2;
      }

      fallingElement.style.left = (x + Math.sin(Date.now() / 2000 + sinOffset) * 50) + "px";
      fallingElement.style.top = y + "px";
    }

    // Every 100ms, run "runFunctionOverAndOverAgain".
    setInterval(runFunctionOverAndOverAgain, 100);
}
makeThisFall(document.getElementById("falling1"))
makeThisFall(document.getElementById("falling2"))
makeThisFall(document.getElementById("falling3"))
makeThisFall(document.getElementById("falling4"))
makeThisFall(document.getElementById("falling5"))
</script>
`}
      />
      <CodeWithFrame
        src={`
<div id="following1">
  tip
</div>
<div id="following2">
  toe
</div>
<div id="following3">
  step
</div>
<div id="following4">
  walk
</div>
<div id="following5">
  run
</div>
<style>
  html, body {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
</style>
<script>
const trail = [
  document.getElementById("following1"),
  document.getElementById("following2"),
  document.getElementById("following3"),
  document.getElementById("following4"),
  document.getElementById("following5"),
  ];

function onMouseMove(event) {
    
}
makeThisFall(document.getElementById("following1"))
makeThisFall(document.getElementById("following2"))
makeThisFall(document.getElementById("following3"))
makeThisFall(document.getElementById("following4"))
makeThisFall(document.getElementById("following5"))
</script>
`}
      />
      <CodeWithFrame
        src={`
<!-- Using the pre tag lets us display ascii art. --!>
<pre id="frame1">


  <(^-^<)
</pre>
<pre id="frame2">
    yey!

 \\( ^-^ )/
</pre>
<pre id="frame3">


  (>^-^)>
</pre>
<pre id="frame4">
    woo!

 \\( ^-^ )/
</pre>
<script>
  const frame1 = document.getElementById("frame1");
  const frame2 = document.getElementById("frame2");
  const frame3 = document.getElementById("frame3");
  const frame4 = document.getElementById("frame4");

  // Hide everything.
  frame1.style.display = "none";
  frame2.style.display = "none";
  frame3.style.display = "none";
  frame4.style.display = "none";

  // List of all frames to display.
  const frames = [frame1, frame2, frame3, frame4];
  let currentFrame = frames.length-1;

  function runEveryNowAndThen() {
    // Hide current frame.
    frames[currentFrame].style.display = "none";
    // Go to the next frame.
    currentFrame = (currentFrame + 1) % frames.length;
    // Show the next frame.
    frames[currentFrame].style.display = "block";
  }
  // Change frames every 500 milliseconds.
  setInterval(runEveryNowAndThen, 500);
</script>
`}
      />
      <CodeWithFrame
        src={`
<style>
  light-area {
    display: block;
    padding: 5px;
    background: white;
    transition: background 1s;
  }

  light-area:hover {
    background: black;
  }

  dark-text {
    display: block;
    color: black;
  }

  light-text {
    display: block;
    color: white;
  }
</style>
<light-area>
    <dark-text>
      if darkness is your fear, <br />
      &nbsp; then face it
    </dark-text>
    <light-text>
      some things only reveal themselves <br />
      &nbsp; in the dark
    </light-text>
</light-area>
use your mouse to turn off the lights.
`}
      />
      <CodeWithFrame
        src={`
<input id="inputButton1" type="button"></input>
<input id="inputButton2" type="button"></input>
<input id="inputButton3" type="button"></input>

<script>
  let button1Index = 0;
  let button1Text = ["who", "where", "what", "when", "how"];
  inputButton1.value = button1Text[0];
  inputButton1.addEventListener("click", () => {
    button1Index = (button1Index + 1) % button1Text.length;
    inputButton1.value = button1Text[button1Index];
  });

  let button2Index = 0;
  let button2Text = ["am I", "will I", "have I", "can I"];
  inputButton2.value = button2Text[0];
  inputButton2.addEventListener("click", () => {
    button2Index = (button2Index + 1) % button2Text.length;
    inputButton2.value = button2Text[button2Index];
  });

  let button3Index = 0;
  let button3Text = ["to become", "to belong", "to find", "to lose"];
  inputButton3.value = button3Text[0];
  inputButton3.addEventListener("click", () => {
    button3Index = (button3Index + 1) % button3Text.length;
    inputButton3.value = button3Text[button3Index];
  });
</script>
`}
      />
      <CodeWithFrame
        src={`
<input id="loveButton" type="button" value="I Love You"></input>
<love-area id="loveArea" style="display: block; position: relative;">
  
</love-area>

<script>
  const loveArray = ["i can't compare you to anyone else", "i respect you", "i'm inspired by you", "i find peace with your presence", "you give me safety", "i can't explain how i feel", "i am myself with you", "i feel understood by you"];
  const hateArray = ["i feel suffocated", "you make me anxious", "i can't stand parts of you", "i will never understand this", "you seem so distant sometimes"];

  loveButton.addEventListener("click", () => {
    if (loveButton.value === "I Love You") {
      loveButton.value = "I Hate You";

      let i = 0;
      const interval = setInterval(() => {
        i++;
        if (i > 100) {
          clearInterval(interval);
          return;
        }

        const element = document.createElement("love");
        element.innerText = loveArray[Math.floor(Math.random() * loveArray.length)];
        element.style.display = "block";
        element.style.position = "absolute";
        element.style.top =  Math.random() * 200 + "px";
        element.style.left = Math.random() * 200 + "px";
        element.style.color = "black";
        loveArea.appendChild(element);
        setTimeout(() => {
          loveArea.removeChild(element);
        }, 10000);

      }, 10);
    } else {
      loveButton.value = "I Love You";

      let i = 0;
      const interval = setInterval(() => {
        i++;
        if (i > 100) {
          clearInterval(interval);
          return;
        }

        const element = document.createElement("love");
        element.innerText = hateArray[Math.floor(Math.random() * hateArray.length)];
        element.style.display = "block";
        element.style.position = "absolute";
        element.style.top =  Math.random() * 300 + "px";
        element.style.left = Math.random() * 300 + "px";
        element.style.color = "white";
        loveArea.appendChild(element);
        setTimeout(() => {
          loveArea.removeChild(element);
        }, 10000);
      }, 100);

     }
  });
</script>
`}
      />
    </div>
  );
}

createPage(BlogPage, { showPets: false });
