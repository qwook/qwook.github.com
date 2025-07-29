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

function CodeWithFrame({ src }) {
  return (
    <div className="code-with-frames">
      <h4>Code</h4>
      <SyntaxHighlighter language="html">{src}</SyntaxHighlighter>
      <h4>Preview</h4>
      <iframe srcdoc={src}></iframe>
    </div>
  );
}

function BlogPage() {
  return (
    <div className="blog">
      <Banner>Learning HTML.</Banner>
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
      <p>
        <strong>{new Date(1753346585922).toDateString()}</strong>
      </p>
      <p>
        This tutorial is meant for absolute beginners who have never touched
        HTML before.
      </p>
      <h1>Your first HTML page.</h1>
      <h2>Option 1: CodePen</h2>
      <p>
        This isn't my recommended way but it's good for those who are
        particularly lazy.
      </p>
      <p>
        If you don't mind keeping your HTML page on the cloud, you can get
        started immediately at <a href="https://codepen.io/pen/">codepen.</a>{" "}
      </p>
      <p>The rest of the tutorial will follow Option 2.</p>
      <h2>Option 2: Visual Studio Code</h2>
      <p>
        This option has more steps, but gives you full ownership over your HTML
        page.
      </p>
      <p>
        First, download{" "}
        <a href="https://code.visualstudio.com/Download">Visual Studio Code</a>.
      </p>
      <p>Upon opening Visual Studio Code, you should get the screen below.</p>
      <img className="ss" src={require("./tutorial/1.png")} />
      <p>Click on New File!</p>
      <img className="ss" src={require("./tutorial/2.png")} />
      <p>
        Type in <code>index.html</code> and save this file to an easily
        accessible folder. (Desktop, or Documents.)
      </p>
      <p>
        Copy and paste the following into the text editor, and then press save.
        (CMD + S on Mac or CTRL + S on Windows)
      </p>
      <SyntaxHighlighter language="html">Hello, World!</SyntaxHighlighter>
      <p>
        Now, right click on the name of the file on top and click on{" "}
        <code>Reveal in Finder</code> on Mac or <code>Reveal in Explorer</code>{" "}
        in Windows.
      </p>
      <img className="ss" src={require("./tutorial/3.png")} />
      <img className="ss" src={require("./tutorial/4.png")} />
      <p>
        Double click on <code>index.html</code> and your default browser should
        open up.
      </p>
      <img className="ss" src={require("./tutorial/5.png")} />
      <p>
        Congratulations! <Smiley id={36} /> You've got your first HTML page{" "}
        <Smiley id={41} />
        <Smiley id={41} />
      </p>
      <h2>Making changes.</h2>
      <p>In your, text editor, copy and paste the following text:</p>
      <CodeWithFrame
        src={`
<html>
  <body>
    <h1>Hello, World!</h1>
    <p>I am programmed to love.</p>
  </body>
</html>
        `}
      ></CodeWithFrame>
      <p>Save the file, then switch back to the webpage and hit refresh.</p>
      <p>You should see your updated changes :)</p>
      <h1>What is HTML?</h1>
      <p>HTML means Hypertext Markup Language... Which feels pretty sci-fi.</p>
      <p>
        Think about Microsoft Word Docs or Google Docs. Originally HTML was
        created as a language to write those kinds of documents, for viewing on
        the internet. Years later, HTML has transformed and evolved into a
        magical language that hosts almost all of the internet.
      </p>
      <h1>Baking a cake out of HTML</h1>
      <img className="ss" src={require("./tutorial/cake.png")} />
      <p>
        HTML is very much like a layered cake, but you are looking from the top
        down. Below is what we're going to be making. Don't spend too much time
        on it, we'll look at this together!
      </p>
      <CodeWithFrame
        src={`
<style>
  layer-white, layer-brown {
    display: block;
    padding: 10px;
  }
  layer-brown {
    background: brown;
  }
  layer-white {
    background: white;
  }
</style>
<layer-brown>
  Layer 1 Begin
  <layer-white>
    Layer 2 Begin
    <layer-brown>
      Layer 3 Begin
      <layer-white>
        Layer 4
      </layer-white>
      Layer 3 End
    </layer-brown>
    Layer 2 End
  </layer-white>
  Layer 1 End
</layer-brown>
        `}
      ></CodeWithFrame>
      <p>
        You see, a single layer in HTML can be written simply like{" "}
        <code>{"<layer> </layer>"}</code> where the <code>{"<layer>"}</code> is
        telling the computer, "this is where my layer starts," and where{" "}
        <code>{"</layer>"}</code> is telling the computer, "this is where my
        layer ends." These layers are called <strong>elements</strong>.
      </p>
      <p>You can put an element over another element, like so.</p>
      <SyntaxHighlighter language="html">
        {`
<layer>
  <inner-layer></inner-layer>
</layer>
        `}
      </SyntaxHighlighter>
      <p>You can put elements next to each other in sequence too.</p>
      <SyntaxHighlighter language="html">
        {`
<layer>
  <inner-layer></inner-layer>
  <inner-layer2></inner-layer2>
</layer>
        `}
      </SyntaxHighlighter>
      <p>Within elements, you can add text.</p>
      <SyntaxHighlighter language="html">
        {`
<layer>
  This is text!
</layer>
        `}
      </SyntaxHighlighter>
      <p>
        Above, we've been making elements named "layer", "inner-layer", or
        "inner-layer2". The name of the element, officially known as the{" "}
        <strong>tag name</strong>, can be anything – however there's official
        tags that have their own quirks. Such as <code>{"<b></b>"}</code> or{" "}
        <code>{"<p></p>"}</code>.
      </p>

      <CodeWithFrame
        src={`
<h1>This is really big text</h1>
<p>
  This is a paragraph. In this paragraph,
  we have a lot of smaller formats for text.
  Such as <b>bold</b> text. Or <i>italicized text.</i>
  Or maybe we want to <u>underline</u> something.
</p>
<p>This is another <b>paragraph!</b></p>          
        `}
      ></CodeWithFrame>
      <p>
        You can see above how HTML took it's first baby steps as a way of making
        documents.
      </p>
      <h1>Personalizing with CSS</h1>
      <p>
        So now that I have some HTML written, how do I personalize it? Using
        CSS! You can think of CSS as paint.
      </p>
      <p>
        You can use CSS by creating a <code>{"<style></style>"}</code> tag all
        the way at the top of your document and specifying which elements you
        want to style and what attributes you want to style.
      </p>
      <CodeWithFrame
        src={`
<style>
  /*
    This is a comment.

    I can write anything I want and the computer
    will ignore it.

    Below we will look for every element with the tag
    "h1" and we will make the text blue.
  */
  h1 {
    color: blue;
  }
  
  /*
    Below we will look for every element with the tag
    "b" and we will make the text white and background
    black.
  */
  b {
    color: white;
    background: black;
  }
</style>
<h1>This is really big text</h1>
<p>
  This is a paragraph. In this paragraph,
  we have a lot of smaller formats for text.
  Such as <b>bold</b> text. Or <i>italicized text.</i>
  Or maybe we want to <u>underline</u> something.
</p>
<p>This is another <b>paragraph!</b></p>          
        `}
      ></CodeWithFrame>
      <p>
        If you only want to edit one specific element, you can use add a{" "}
        <code>style</code> attribute to a tag.
      </p>
      <CodeWithFrame
        src={`
<h1>This is really big text</h1>
<p style="color: red;">
  This is a paragraph. In this paragraph,
  we have a lot of smaller formats for text.
  Such as <b>bold</b> text. Or <i>italicized text.</i>
  Or maybe we want to <u>underline</u> something.
</p>
<p>This is another <b>paragraph!</b></p>          
        `}
      ></CodeWithFrame>
      <h1>Back to the cake!</h1>
      <p>Let's create our first layer of the cake.</p>

      <CodeWithFrame
        src={`
<style>
  /* for every "layer-brown" element */
  layer-brown {
    /* draw this element like a rectangle: */
    display: block;
    /* inflate this rectangle by
       about 10px:
    */
    padding: 10px;

    background: brown;
  }
</style>
<layer-brown></layer-brown>
        `}
      />
      <p>Now let's add a second white layer</p>
      <CodeWithFrame
        src={`
<style>
  /* for every "layer-brown" or "layer-white element */
  layer-brown, layer-white {
    /* draw this element like a rectangle: */
    display: block;
    /* inflate this rectangle by
       about 10px:
    */
    padding: 10px;
  }
  
  /* for every "layer-brown" element */
  layer-brown {
    /* color the background brown */
    background: brown;
  }
  
  /* for every "layer-white" element */
  layer-white {
    /* color the background white */
    background: white;
  }
</style>
<layer-brown>
  <layer-white></layer-white>
</layer-brown>
        `}
      />
      <p>Now we can keep adding more and more layers.</p>
      <CodeWithFrame
        src={`
<style>
  /* for every "layer-brown" or "layer-white element */
  layer-brown, layer-white {
    /* draw this element like a rectangle: */
    display: block;
    /* inflate this rectangle by
       about 10px:
    */
    padding: 10px;
  }
  
  /* for every "layer-brown" element */
  layer-brown {
    /* color the background brown */
    background: brown;
  }
  
  /* for every "layer-white" element */
  layer-white {
    /* color the background white */
    background: white;
  }
</style>
<layer-brown>
  <layer-white>
    <layer-brown>
      <layer-white>
        <layer-brown>
          <layer-white>
          </layer-white>
        </layer-brown>
      </layer-white>
    </layer-brown>
  </layer-white>
</layer-brown>
        `}
      />
      <p>We can keep getting more advanced by adding candles!</p>
      <CodeWithFrame
        src={`
<style>
  /* for every "layer-brown" or "layer-white element */
  layer-brown, layer-white {
    /* draw this element like a rectangle: */
    display: block;
    /* inflate this rectangle by
       about 10px:
    */
    padding: 10px;
  }
  
  /* for every "layer-brown" element */
  layer-brown {
    /* color the background brown */
    background: brown;
  }
  
  /* for every "layer-white" element */
  layer-white {
    /* color the background white */
    background: white;
  }

  /* for every "candle" element */
  candle {
    /* draw this element like a block, but */
    /* allow it to stack horizontally */
    display: inline-block;
  }

  /* for every "fire" element */
  fire {
    display: block;
    background: yellow;
    width: 20px;
    height: 20px;
    /* Hack to draw a circle */
    border-radius: 10px;
  }

  /* for every "stick" element */
  stick {
    display: block;
    background: pink;
    width: 20px;
    height: 100px;
  }
</style>
<layer-brown>
  <layer-white>
    <layer-brown>
      <layer-white>
        <layer-brown>
          <layer-white>
            <candle><fire></fire><stick></stick></candle>
            <candle><fire></fire><stick></stick></candle>
            <candle><fire></fire><stick></stick></candle>
            <candle><fire></fire><stick></stick></candle>
            <candle><fire></fire><stick></stick></candle>
          </layer-white>
        </layer-brown>
      </layer-white>
    </layer-brown>
  </layer-white>
</layer-brown>
        `}
      />
      <p>Finally, you can blow out the candles if you hover over them..</p>
      <CodeWithFrame
        src={`
<style>
  /* for every "layer-brown" or "layer-white element */
  layer-brown, layer-white {
    /* draw this element like a rectangle: */
    display: block;
    /* inflate this rectangle by
       about 10px:
    */
    padding: 10px;
  }
  
  /* for every "layer-brown" element */
  layer-brown {
    /* color the background brown */
    background: brown;
  }
  
  /* for every "layer-white" element */
  layer-white {
    /* color the background white */
    background: white;
  }

  /* for every "candle" element */
  candle {
    /* draw this element like a block, but */
    /* allow it to stack horizontally */
    display: inline-block;
  }

  /* for every "fire" element */
  fire {
    display: block;
    background: yellow;
    width: 20px;
    height: 20px;
    border-radius: 10px;
  }

  /* for every "stick" element */
  stick {
    display: block;
    background: pink;
    width: 20px;
    height: 100px;
  }

  /* for when the candle is hovered,
     find a "fire" inside the candle */
  candle:hover fire {
    /* draw the fire as transparent. */
    background: transparent;
  }
</style>
<layer-brown>
  <layer-white>
    <layer-brown>
      <layer-white>
        <layer-brown>
          <layer-white>
            <candle><fire></fire><stick></stick></candle>
            <candle><fire></fire><stick></stick></candle>
            <candle><fire></fire><stick></stick></candle>
            <candle><fire></fire><stick></stick></candle>
            <candle><fire></fire><stick></stick></candle>
          </layer-white>
        </layer-brown>
      </layer-white>
    </layer-brown>
  </layer-white>
</layer-brown>
        `}
      />
      <p>Alright let's go nuts and super advanced.</p>
            <CodeWithFrame
        src={`
<style>
  /* for every "layer-brown" or "layer-white element */
  layer-brown, layer-white {
    /* draw this element like a rectangle, */
    /* inline-block will make it so the rectangle shrinks */
    /* to it's contents */
    display: inline-block;
    /* inflate this rectangle by
       about 10px:
    */
    padding: 10px;
    padding-bottom: 20px;
    border-radius: 100px;
  }
  
  /* for every "layer-brown" element */
  layer-brown {
    /* color the background brown */
    background: brown;
  }
  
  /* for every "layer-white" element */
  layer-white {
    /* color the background white */
    background: white;
  }

  /* for every "candle" element */
  candle {
    /* draw this element like a block, but */
    /* allow it to stack horizontally */
    display: inline-block;
    position: absolute;
  }

  /* for every "fire" element */
  fire {
    display: block;
    background: yellow;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    /* make it so changes the background color */
    /* smoothly changes over half a second */
    transition: background 0.5s;
  }

  /* for every "stick" element */
  stick {
    display: block;
    background: pink;
    width: 20px;
    height: 50px;
  }

  final-layer {
    /* defines a reference point for "position: absolute;" */
    position: relative;
    display: block;
    width: 200px;
    height: 50px;
  }

  /* for when the candle is hovered,
     find a "fire" inside the candle */
  candle:hover fire {
    /* draw the fire as transparent. */
    background: transparent;
  }
</style>
<layer-brown>
  <layer-white>
    <layer-brown>
      <layer-white>
        <layer-brown>
          <layer-white>
            <final-layer>
              <candle style="top: -10px; left: 0px;"><fire></fire><stick></stick></candle>
              <candle style="top: -20px; left: 50px;"><fire></fire><stick></stick></candle>
              <candle style="top: -5px; left: 100px;"><fire></fire><stick></stick></candle>
              <candle style="top: -15px; left: 150px;"><fire></fire><stick></stick></candle>
              <candle style="top: -25px; left: 200px;"><fire></fire><stick></stick></candle>
            </final-layer>
          </layer-white>
        </layer-brown>
      </layer-white>
    </layer-brown>
  </layer-white>
</layer-brown>
        `}
      />
      <p>If you've gotten this far then you've become a master at HTML and CSS! Now try your own thing :)</p>
    </div>
  );
}

createPage(BlogPage, { showPets: false });
