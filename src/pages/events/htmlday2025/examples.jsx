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
