import Banner from "../components/Banner";
import Page from "../components/Page";
import { createPage } from "../app";

export default function ArchivePage() {
  return (
    <div className="blog">
      <Banner>Archive</Banner>
      <p>This is a digital archive of my own presence on the internet.</p>
      <p>
        In 2003, I played my first MMORPG toontown. My character was "JJ the
        Duck Girl."
      </p>
      <img src={require("./images/archive/JJ_2T.jpg")} />
      <p>My first ever forum post on the internet:</p>
      <img src={require("./images/archive/post1.png")} />
      <p>
        I was really interested in making movies in Toontown. I pirated a
        program called FRAPS to create recordings.
      </p>
      <img src={require("./images/archive/post2.png")} />
      <img src={require("./images/archive/post3.png")} />
      <img src={require("./images/archive/post4.png")} />
      <p>A glimpse into an offended 8-year old Henry.</p>
      <img src={require("./images/archive/post5.png")} />
      <p>
        I started designing my own forum signatures as I got older and was more
        interested in shooters like Soldier Front and game emulations.
      </p>
      <img src={require("./images/archive/emulater-1.png")} />
      <img src={require("./images/archive/deltaforce.png")} />
      <p>
        This is a screenshot of my Desktop, maybe around 2008. I was working on
        a game review site with my friend. I did the graphics design and web
        development. I was still using GIMP and Frontpage tables to do web
        design.
      </p>
      <p>
        I was also doing some primitive hacking using ArtMoney. I was probably
        hacking Maplestory or Gunbound.
      </p>
      <img src={require("./images/archive/screenshot.png")} />
      <p>My habbo hotel character:</p>
      <img src={require("./images/archive/habbome.gif")} />
      <p>Sonic me:</p>
      <img src={require("./images/archive/Sonicme.png")} />
      <p>A picture that I had on my Myspace:</p>
      <img src={require("./images/archive/ferktheworld.png")} />
      <p>I created my own neopets profile page:</p>
      <img src={require("./images/archive/neopets.gif")} />
      <p>
        Below is a CSS file that I wrote in 2004. It was for a website I called
        "multi-player games." I was 10 years old and was ambitiously working on
        a multiplayer game with my friend Enzo.
      </p>
      <code>{require("./images/archive/DONTFREAKINSTEALME.txt")}</code>
      <p>
        Enzo and I spent a considerable amount of time trying to create a game
        called Zombie Attack. The below 3D work is from a day where Enzo and I
        made 3D meshes. This was on my birthday if I can remember.
      </p>
      <img src={require("./images/archive/3d.png")} />
      <p>
        Here's a screenshot of what I think is my second ever website. The first
        website, I actually made with the help of my mom, and it's completely
        lost forever. This website embedded a Java chat app and allowed for
        people to talk about Yu-Gi-Oh and Toontown.
      </p>
      <img
        src={require("./images/archive/walpaper yugioh_zombieattack_chat.gif")}
      />
    </div>
  );
}

createPage(ArchivePage);
