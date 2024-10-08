import Age from "../../components/Age";
import Banner from "../../components/Banner";
import { createPage } from "../../app";

export default function Blogs_CirclePage() {
  return (
    <div className="blog">
      <Banner>The Circle App</Banner>

      <h1>SJSU Arcade Launcher</h1>
      <p>
        A light-weight launcher for the SJSU arcade cabinets. Used to display,
        start, and monitor the games put on the arcade cabinets.
      </p>
      <div className="content">
        <div className="media">
          <img src={require("./arcade/arcadelauncher.gif")} />
        </div>
        <div className="media">
          <img src={require("./arcade/arcadelauncher2.gif")} />
        </div>

        <p>
          In the last couple years, the{" "}
          <a href="http://sjsugamedev.com/" target="_blank">
            Game Dev Club at San Jose State University
          </a>{" "}
          have created a few working arcade cabinets. The arcade cabinets are
          pretty much wooden shells that contain regular computers and monitors
          inside them. The joysticks are connected to the computer through a
          USB-interface.
        </p>
        <p>
          The purpose of the arcade cabinets is to showcase{" "}
          <em>student-made</em> games. All the games on the Game Dev Club arcade
          cabinets are developed, designed, and composed by students at SJSU.
        </p>

        <div className="media">
          <img src={require("./arcade/dscf7194.jpg")} />
          <div className="caption">
            Arcade Cabinet at Rockage 4.0 (
            <a href="https://rubaiyat.wordpress.com" target="_blank">
              Rubaiyat Shatner
            </a>
            )
          </div>
        </div>
        <p>
          Even a{" "}
          <a
            href="http://globalgamejam.org/2014/games/bako-ikimashou-lets-go-box"
            target="_blank"
          >
            game worked on by yours truly
          </a>{" "}
          is on the arcade cabinets.
        </p>
        <h2>The Arcade Launcher</h2>
        <p>
          The launcher is what glues all the games on the arcade cabinet
          together. It is the screen you see when you scroll through the games.
          It is the what you use to start a game up.
        </p>

        <p>
          The first launcher,{" "}
          <a href="https://github.com/KristopherWindsor/applesauce">
            applesauce
          </a>
          , was created by Kristopher Windsor and was written in Basic. It
          allowed the user to scroll through games and launch them. Although it
          fulfilled the basic needs of a launcher, it was a tad bit buggy, kept
          minimizing, and would often require the operator to restart the
          machine.
        </p>

        <p>
          The second launcher was created by{" "}
          <a href="http://luxeloperation.com">Matt Hoffman</a> using the Unity
          engine. It had 3D models of the arcade button controls, music, and an
          overall great interface. It was a well-crafted launcher, however it
          ran into a few problems of its own. Since the launcher was running on
          a game engine, other games suffered from framerate issues while the
          launcher was running. The launcher also had the issue of displaying on
          top of games.
        </p>

        <h2>The Third Launcher</h2>

        <p>
          In my sophomore year at SJSU, I was given the opportunity of
          developing the third iteration of the arcade launcher. The third
          launcher employs a monitoring method to determine if a game has been
          launched and then minimizes the launcher window. The launcher also has
          the extra abilities of collecting data and switching genres.
        </p>

        <h3>Collecting Data</h3>
        <p>
          By monitoring when a game has launched and when it has exited, the
          launcher is able to collect play-count and play-time data and output
          it into a JSON file. A static HTML page is supplied that loads the
          JSON file and displays it as a pi-chart.
        </p>
        <p>
          <a
            href="http://ruby-yacht.github.io/rockagesj2015/index.html"
            target="_blank"
          >
            Check out the data
          </a>{" "}
          that Rubaiyat Shatner collected at Rockage 4.0!
        </p>

        <div className="media">
          <img src={require("./arcade/screenshot.png")} />
          <div className="caption">
            Collected Arcade Cabinet Data (
            <a href="https://rubaiyat.wordpress.com" target="_blank">
              Rubaiyat Shatner
            </a>
            )
          </div>
        </div>

        <h3>Switching Genres</h3>
        <p>
          There are many different arcade cabinets that have been built with
          different themes. To reflect those themes, the games are grouped into
          matching genres. The launcher allows the operator of the arcade
          cabinets to select and define the genres they want for a specific
          cabinet.
        </p>

        <h3>Joy2Key</h3>
        <p>
          Games that aren't designed for the arcade cabinets or are using legacy
          controls have{" "}
          <a href="http://joytokey.net/en/" target="_blank">
            Joy2Key
          </a>{" "}
          bindings that remap the joystick keys. The launcher will activate
          those Joy2Key bindings based on what game has just launched.
        </p>

        <h3>Monitoring Games</h3>
        <p>
          The launcher monitors if a game executable has successfuly launched or
          if it has just closed. When it detects that a game has launched then
          it minimizes itself to allow the game to properly render. When the
          game has closed, the launcher opens back up.
        </p>
        <p>The launcher has two methods of monitoring processes.</p>
        <p>
          The <strong>first method</strong> of monitoring involves{" "}
          <em>polling</em>. It makes a request to the operating system for a
          list of all running executables, and matches it with the game
          executable name. It does this check every second. It is slow but is
          the most stable way of monitoring a game.
        </p>

        <p>
          The <strong>second method</strong> doesn't actually monitor the game
          at all. It launches the game as a subprocess. This is the fastest way
          of detecting when the process has started and when it has ended since
          it gets a message direct from the operating system.
        </p>
        <p>
          However, the second method doesn't work for certain games. Games using
          Game Maker create a helper executable that unzips its assets and
          launches a new process which has the actual game in it. The second
          method can only monitor the helper executable, which closes right
          after the actual game starts. This same problem creates a minor
          inconvenience for the first method, as the operator needs to specify
          that they want to monitor the actual game executable and not the
          helper executable.
        </p>

        <h3>The Technology</h3>
        <p>
          The CSS and animations are done using{" "}
          <a href="http://lesscss.org/" target="_blank">
            LESS
          </a>
        </p>
        <p>
          The launcher application itself uses{" "}
          <a href="http://nwjs.io/" target="_blank">
            node-webkit / NW.js
          </a>
          . NW.js allows developers to create standalone applications using web
          technologies. NW.js is a gutted web-browser. I call it a "gutted"
          web-browser because it's essentially still a web-browser but without
          extensions, address bars, and security.
        </p>
        <p>
          NW.js allows me to create a webpage for the display and use node.js
          modules to launch and manage processes. NW.js also allows me to read
          and write to any files I want, which I use to save data collected.
        </p>

        <h2>Conclusion</h2>
        <p>
          Developing the arcade launcher was a great way for me to learn how to
          use node-webkit and it even introduced me to CSS3 animations. It was
          my first time animating elements on a webpage.
        </p>

        <p>
          Even though the code is messy and was written while I was still in my
          self-taught programmer mindset, I can say that it is one of my coolest
          projects. I love going back to my old code and looking at all the
          different and unique methods I used for doing certain things, it
          reminds me of how much I've grown as a programmer.
        </p>

        <p>
          I was also able to get into a couple shows and festivals using the
          launcher as my ticket! As long as I'm available to do some quick
          maintanence on the launcher, I've been able to travel wherever the
          cabinets go.
        </p>

        <h2>A couple more pictures of the cabinet.</h2>

        <div className="media">
          <img src={require("./arcade/afklounge.jpg")} />
          <div className="caption">
            Arcade Cabinet at AFK Lounge (
            <a href="https://rubaiyat.wordpress.com" target="_blank">
              Rubaiyat Shatner
            </a>
            )
          </div>
        </div>

        <div className="media">
          <img src={require("./arcade/dscf7742.jpg")} />
          <div className="caption">
            Arcade Cabinet at Silicon Valley Pride (
            <a href="https://rubaiyat.wordpress.com" target="_blank">
              Rubaiyat Shatner
            </a>
            )
          </div>
        </div>
      </div>
    </div>
  );
}

createPage(Blogs_CirclePage);
