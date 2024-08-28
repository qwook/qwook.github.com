import Banner from "../components/Banner";
import Carousel from "../components/Carousel";
import Page from "../components/Page";
import { createPage } from "../app";

export default function ArchivePage() {
  return (
    <div className="blog">
      <Banner>Archive</Banner>
      <style>
        {`
      body {
        @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');
        background-color: #fff8d4;
        font-family: Comic Sans MS, Comic Sans, Comic Neue;
      }
      `}
      </style>
      <p>This is a digital archive of my own presence on the internet.</p>
      <p>
        In 2003, I played my first MMORPG, Toontown. My character was "JJ the
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
      <p>My Coke Music character:</p>
      <img src={require("./images/archive/cokemusic.png")} />
      <p>My habbo hotel character:</p>
      <img src={require("./images/archive/habbome.gif")} />
      <p>I don't remember how I made that GIF.</p>
      <p>
        I had a fancier avatar after my mom gave me $20 to buy Habbo Club. I
        owned a boardgame room that was super popular. I revisited it recently
        and some of the furni has been replaced. I also got scammed a while ago
        so half of the room is missing.
      </p>
      <img src={require("./images/archive/habbo.png")} />
      <p>
        There are photos on the wall!!! I wish I could see them but Habbo
        disabled them a while ago due to exploits.
      </p>
      <p>Luckily, the stickies are still there.</p>
      <Carousel>
        <img src={require("./images/archive/sticky1.png")} height="300px" />
        <img src={require("./images/archive/sticky2.png")} height="300px" />
        <img src={require("./images/archive/sticky3.png")} height="300px" />
        <img src={require("./images/archive/sticky4.png")} height="300px" />
        <img src={require("./images/archive/sticky5.png")} height="300px" />
      </Carousel>
      <p>I can't believe I was managing people haha!!</p>
      <p>
        For a very very long time, I played this game called Furcadia. It let
        you program and build your own worlds. People who made worlds were
        called "Dreamweavers."
      </p>
      <img src={require("./images/archive/furcscreeenshot.png")} />
      <p>My first internet girlfriend, Baby Mario:</p>
      <img src={require("./images/archive/thebloodinvasion.png")} />
      <p>
        A famed dreamweaver in Furcadia, "Carrie O' Kaye!" whom I learned years
        later was a Vietnamese college student who drew comics. I looked up to
        this person a lot, and they replied to one of my forum posts!
      </p>
      <img src={require("./images/archive/carrie_o_kaye.png")} />
      <p>
        I worked on my worlds and invited random friends to check out the
        progress. Here I'm trying to add drivable cars to the game.
      </p>
      <img src={require("./images/archive/furc.png")} />
      <p>Sonic me:</p>
      <img src={require("./images/archive/Sonicme.png")} />
      <p>A picture that I had on my Myspace:</p>
      <img src={require("./images/archive/ferktheworld.png")} />
      <p>I created my own neopets profile page:</p>
      <img src={require("./images/archive/neopets.gif")} />
      <p>Speaking of Neopets, my favorite pet is more than 20 years old now.</p>
      <img src={require("./images/archive/neopets.png")} />
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
        These lava dudes ended up being the background for a Pet Page on my
        neopets.
      </p>
      <p>
        Here's a screenshot of my second ever website. My first website's host
        disappeared and I never got to back the files up. This website embedded
        a Java chat app and allowed for people to talk about Yu-Gi-Oh and
        Toontown.
      </p>
      <img
        src={require("./images/archive/walpaper yugioh_zombieattack_chat.gif")}
      />
      <p>
        This is a screenshot of my Desktop, maybe around 2006. I was working on
        a game review site with my friend. I did the graphics design and web
        development. I was still using GIMP and Frontpage tables to do web
        design.
      </p>
      <p>
        I was also doing some primitive hacking using ArtMoney. I was probably
        hacking Maplestory or Gunbound.
      </p>
      <img src={require("./images/archive/screenshot.png")} />
      <p>
        In the same year, 2006, I started experimenting with Visual Basic to
        create chat bots for Furcadia.
      </p>
      <img src={require("./images/archive/vb6.png")} />
      <img src={require("./images/archive/vb6_2.png")} />
      <p>
        I had a lot of pictures that I posted that I'll never be able to see
        again.
      </p>
      <img src={require("./images/archive/broken images.png")} />
      <p>
        There was a lot of activity that I lost during this period of time, due
        to losing access to my old Yahoo email. Please tell me, what the hell
        child-Henry was thinking when he made this his security question??
      </p>
      <img src={require("./images/archive/honeymoon.png")} />
      <p>
        I lost access to my first Youtube channel that I made in 2007, but I can
        still see the videos that are public.
      </p>
      <p>
        On it, I can see that I was no longer using AIM and instead I am
        chatting through meebo.
      </p>
      <img src={require("./images/archive/meebo.png")} />
      <p>
        I made one of my videos private, an emo concert filmed in The Sims 2 –
        with Naruto music playing in the background. If I can figure out how to
        regain access to this channel, I'll be able to recover my music video.
      </p>
      <img src={require("./images/archive/youtube.png")} />
      <p>In 2009, I started experimenting with C++ and Lua.</p>
      <img src={require("./images/archive/2009.png")} />
      <p>I also discovered the Source Engine and Garry's Mod.</p>
      <img src={require("./images/archive/14.png")} />
      <p>
        I can't believe I wrote my age on so many different parts of the
        internet, different little versions of myself exist frozen in time.
      </p>
      <p>I created a paintball mod. This really got me into C++.</p>
      <img src={require("./images/archive/paintball.png")} />
      <p>
        Then my own Plants vs. Zombie gamemode in Garry's Mod for a competition.
      </p>
      <img src={require("./images/archive/props.png")} />
      <img src={require("./images/archive/props2.png")} />
      <img src={require("./images/archive/hudconcept.png")} />
      <p>
        Here's a gamemode I made named "Help! Zombies!" which is a spiritual
        successor to me and my friend Enzo's game.
      </p>
      <img src={require("./images/archive/hvz.png")} />
      <img src={require("./images/archive/hvz2.png")} />
      <img src={require("./images/archive/hvz3.png")} />
      <p>
        I started experimenting more with SFML, Irrlicht, Newton Physics, Bullet
        physics, Box2D. A lot of it was to build my own game engine. Here are a
        few forum posts I made asking for help.
      </p>
      <img src={require("./images/archive/engine1.png")} />
      <img src={require("./images/archive/engine2.png")} />
      <img src={require("./images/archive/engine3.png")} />
      <img src={require("./images/archive/engine4.png")} />
      <p>I got famous in high school from my animation tool on Garry's Mod.</p>
      <img src={require("./images/archive/hat3.png")} />
      <p>
        It was the first time I ever made super-official documentation for
        something.
      </p>
      <Carousel>
        <img src={require("./images/archive/hat.png")} height="500px" />
        <img src={require("./images/archive/hat2.png")} height="500px" />
      </Carousel>
      <p>I had a stint of posting random questions on Yahoo! Answers.</p>
      <img src={require("./images/archive/answers.png")} />
      <img src={require("./images/archive/answers2.png")} />
      <p>In my senior year of high school, I started a comic blog on tumblr.</p>
      <img src={require("./images/archive/college.png")} />
      <img src={require("./images/archive/awwright.jpg")} />
      <p>
        Here's my Desktop in 2011, showing all my games and hobbies at the time.
      </p>
      <img src={require("./images/archive/desktop2011.jpg")} />
      <p>And here's me complaining about some IDE error on Facebook, idk.</p>
      <img src={require("./images/archive/fb.jpg")} />
      <p>
        My web design skills started to improve. Here are a couple tumblr themes
        I made when I was 17.
      </p>
      <img src={require("./images/archive/henryisasocialburrito.png")} />
      <img src={require("./images/archive/aloneamongbillions.png")} />
      <p>In 2012, this website you're on now went live.</p>
      <img src={require("./images/archive/firstpage.png")} />
      <p>
        While in college, I took a huge break from the internet and started
        focusing on learning how to socialize IRL more. The world was changing
        too. People bridged their online identity with their real life identity.
        People showed their face and used their real names. I didn't know it
        yet, but my old WWW was dying. All the communities I belonged to saw a
        huge exodus of its members getting way too busy to log back on.
      </p>
      <p>
        My presence on the internet migrated off of forums and onto Snapchat and
        Instagram Stories. It is sad, but I no longer exist in the same way
        online.
      </p>
      <img src={require("./images/archive/visidyn.png")} />
      <img src={require("./images/archive/visidyn2.png")} />
      <img src={require("./images/archive/visidyn3.png")} />
    </div>
  );
}

createPage(ArchivePage);
