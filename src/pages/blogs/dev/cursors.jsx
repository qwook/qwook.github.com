import { headTags } from "../../../utils/headTags";

headTags({
  title: "Custom cursors in Javascript and CSS.",
  description: "Adding custom cursors in my game!",
});

import { createPage } from "../../../app";
import Banner from "../../../components/Banner";
import SyntaxHighlighter from "react-syntax-highlighter";
import { VideoPlayer } from "../../../components/ui/VideoPlayer";

function BlogPage() {
  return (
    <div className="blog">
      <style>
        {`document, html, body {
          cursor: url(${require("./images/cursor.png")}) 0 0, auto;
        }`}
      </style>
      <Banner>Custom cursors in Javascript and CSS.</Banner>
      <p>
        <strong>{new Date(1753346585922).toDateString()}</strong>
      </p>
      <p>
        I'm working on adding custom cursors in my newest game, which seemed
        like a very simple task at first.
      </p>
      <p>
        I wanted to write this because this was such a fun feature to add that's
        almost useless. I also want to showcase just how hard and
        nonstraightforward things are when you're a developer.
      </p>
      <p>
        My games are all written in Javascript, CSS, and HTML – so they're
        basically websites! In CSS there's a very simple property you can set{" "}
        <code>cursor</code> which will switch the cursor for the element you
        hover over.
      </p>
      <SyntaxHighlighter>
        {`body {
  cursor: move;
}

.blob {
  cursor: pointer;
}

.blob-2 {
  cursor: url(./cool-cursor.gif) 10 10, auto;
  /* Adding ", auto" is required for a cursor fallback. */
}
`}
      </SyntaxHighlighter>
      <p>
        Now this works great if your cursor is a reasonable size. However, for
        my game, I wanted a cursor that's twice as large to emphasize the old
        pixel art aesthetic of older computers. (You know, CRT monitors were 14"
        but early machines were optimized for 800x600!)
      </p>
      <p>
        For these super-large cursors, Chrome has a security policy that
        prevents them from rendering off the browser window. If you're on a PC
        and can see the cursor I set on my website, try moving it off the right
        and bottom of the window.
      </p>
      <VideoPlayer src={require("./images/IMG_8093.webm")} />
      <p>
        Why have this security policy in the first place? Well, hackers were
        abusing the cursor to render convincing fake error windows that appeared
        outside of the browser window. But I'm not a hacker!! :( And this switch
        from the game cursor to the tiny system cursor is super jarring and not
        too polished.
      </p>
      <p>
        My first approach was hiding the system cursor and drawing my own
        cursor. The issue is that <code>pointermove</code> and{" "}
        <code>mousemove</code> events on the browser have a very noticable
        latency, which is much much more noticable when there is any load
        (perhaps, when rendering 3D graphics?). From what I've read, the system
        has it's own layer for drawing the mouse cursor so that no process can
        interrupt it's drawing, which is why when you drag a window around on
        MacOS you can see the window lag a tiny bit behind the cursor. This
        means I won't be able to compete with the system cursor unless I get
        access to a low level mouse interface.
      </p>
      <p>
        I don't have a video of the cursor lagging because it's kind of hard to
        depict on video.
      </p>
      <p>So, what to do...</p>
      <p>Why not both?</p>
      <VideoPlayer src={require("./images/IMG_8092.webm")} />
      <p>
        When the cursor moves to the right or bottom of the screen, I turn off
        the system cursor and turn on the fake cursor rendered inside the
        browser.
      </p>
      <p>
        It's just the bottom left and right corner that are going to be laggy!
        That's okay, as long as 90% of the screen has a buttery smooth cursor.
      </p>
      <p>
        But there's a problem with using custom cursors like this! While
        hovering over links or buttons, I want the cursor to change to a
        pointer, and this functionality doesn't come out of the box.
      </p>
      <p>
        Now if you remember, you can change the system cursor based on elements
        you hover over, using CSS. For the fake cursor, we have no idea what the
        cursor should be based on the element we are hovering over. We'll need
        to manually traverse – starting from the element the mouse is hovering
        over – all the way up the tree to find the closest element with a
        "cursor" computed style property, then map it to a cursor image. I can
        write a function to manually dig upwards, but I got lazy. So I just used{" "}
        <code>.closest()</code> to dig for me, which utilizes the CSS selector
        syntax to match an element.
      </p>
      <p>
        Instead of setting <code>cursor: pointer</code> I add a class to
        interactable elements called <code>.cursor-pointer</code> which solves
        issues such as deep child elements stealing control over the cursor.
      </p>
      <SyntaxHighlighter language="javascript">
        {`return target.closest(
  ".cursor-pointer, .cursor-move, .cursor-none, input[type='text'], input[type='password']"
);`}
      </SyntaxHighlighter>
      <p>
        I've considered another option which is <code>getComputedStyle()</code>{" "}
        but after reading that it literally forces a reflow / layout, I decided
        against it since we'd be calling it on almost every mouse movement
        event.
      </p>
      <p>
        A big negative of using system cursors is applications like Photoshop or
        Quicktime hijacking the cursor even if the program isn't on the screen.
        Not cool, but whatever. If the user gets a tiny cursor who cares -_-
      </p>
      <p>
        Finally, now that I have a fake cursor, I can do something really cool!
        On mobile devices, I force-draw the cursor and then move it based on
        where the user touches on the screen (with some linear interpolation to
        make it a smooth movement). WOW a cursor for the phone??
      </p>
      <VideoPlayer src={require("./images/fakecursor.webm")} />
      <p>
        If you're a game developer, you really have to embrace these moments and
        love solving these kinds of issues because there's going to be a lot of
        them. Trust me. You know the feature in Last Seen Online where if you
        resize the window then everything in the game resizes with the window?
        Or how when you go full-screen everything is scaled up and doesn't stay
        small? Like, the feature that's available in every single game ever?
        Yeah, that was also incredibly hard to implement.
      </p>
      <p>
        P.S. I programmed in cursor trails but it was just so buggy I decided
        not to include it in this write-up.
      </p>
      <a href="/blogs/dev">&lt; Go back to Dev Blogs</a>
    </div>
  );
}

createPage(BlogPage, { showPets: false });
