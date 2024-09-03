import Banner from "../components/Banner";
import Carousel from "../components/Carousel";
import Page from "../components/Page";
import { createPage } from "../app";
import { useEffect, useRef, useState } from "react";

import "../style/quests.scss";
import HTMLFestCarousel from "../components/HTMLFestCarousel";
import ReactPlayer from "react-player";
import { InstagramEmbed } from "react-social-media-embed";

function Quest({ name, completed, children }) {
  const [showDescription, setShowDescription] = useState(false);
  const [height, setHeight] = useState("0px");
  const contentRef = useRef(null);

  useEffect(() => {
    if (showDescription) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [showDescription]);

  return (
    <li
      className={completed ? "quest-item quest-item-completed" : "quest-item"}
    >
      <div
        className="quest-name"
        onClick={(e) => setShowDescription(!showDescription)}
      >
        <span className="chevron">
          {children ? showDescription ? <>&#9660;</> : <>&#9658;</> : <>-</>}
        </span>
        {name}
      </div>
      <div
        style={{ height: height }}
        ref={contentRef}
        className={
          showDescription ? "quest-description expanded" : "quest-description"
        }
      >
        {children}
      </div>
    </li>
  );
}

export default function QuestsPage() {
  return (
    <div className="blog">
      <Banner>Henry's Quests</Banner>
      <p>
        These are the list of goals I've made every year around my birthday.
        Looking back, a lot of the items are so cringe. Like... my first ever
        list is soooo cringe =_= ... but that just means I'm continuing to grow.
        It's very interesting to see what desires changed and what desired
        stayed the same!
      </p>
      <div style={{ textAlign: "center" }}>
        <img
          src={require("./quests/images/angeling-ragnarok.gif")}
          className="pixel"
        />
        <img
          src={require("./quests/images/angeling-ragnarok.gif")}
          className="pixel"
        />
        <img
          src={require("./quests/images/angeling-ragnarok.gif")}
          className="pixel"
        />
      </div>
      <p>
        I mix some main and side-quests in here so I feel consistent
        progression. I don't put too much pressure on myself to finish
        everything, it's all for fun!! Even the serious-sounding stuff :)
      </p>
      <p className="legend">
        <div className="legend-not-done">■ - Not Done</div>
        <div className="legend-finished">■ - Completed</div>
      </p>
      <div className="quest-scroll-bar">
        <div className="quest-scroll-left"></div>
        <div className="quest-scroll-bg"></div>
        <div className="quest-scroll-right"></div>
      </div>
      <div className="quest">
        <h2>Level 30 - Vietnam DLC</h2>
        <ul className="quests">
          <Quest name="Move to Vietnam">
            I am planning to be in Vietnam either mid or end of November!
          </Quest>
          <Quest name="Quit smoking">
            I want to see how well I can socialize while avoiding the most
            common social device.
          </Quest>
          <Quest name="Host an artist event in Vietnam"></Quest>
          <Quest name="Host a dinner party in Vietnam"></Quest>
          <Quest name="Spend 7 non-consecutive days speaking only Vietnamese"></Quest>
          <Quest name="Get a tattoo in Vietnam"></Quest>
          <Quest name="Drive a moped or motorcycle Vietnam"></Quest>
          <Quest name="Do volunteer work in Vietnam"></Quest>
          <Quest name="Eat/meditate at a buddhist monstery"></Quest>
          <Quest name="Convince 3 different friends to film TikTok dance videos"></Quest>
          <Quest name="Release two video games (0/2)"></Quest>
          <Quest name="Release a short film"></Quest>
          <Quest name="Playtest Last Seen Online 2"></Quest>
          <Quest name="Do a live performance"></Quest>
          <Quest name="Finish playing Half-Life 2 + Episode 1 + Episode 2"></Quest>
          <Quest name="Pay off one month of rent using money earned from video games"></Quest>
          <Quest name="Learn 5 Vietnamese songs on guitar, and post them"></Quest>
          <Quest name="Log 60 days of food that I ate (0/60)">
            I want to figure out what foods make my stomach hurt!
          </Quest>
          <Quest name="Log 40 days of yoga (1/40)"></Quest>
          <Quest name="Log 90 days of meditation (0/90)"></Quest>
          <Quest name="Log 5 days of trash cleanup (2/5)"></Quest>
          <Quest name="Log 10 days of calling my long distance friends (0/10)">
            Hey Will, Juan, Dustin, Kevin, and Chloe! I wanna call you {">:)"}
          </Quest>
          <Quest name="Do a standing forward fold"></Quest>
          <Quest name="Bench 135 lbs"></Quest>
          <Quest name="Climb a V7"></Quest>
        </ul>
        <h2>Level 29 - Game Dev Arc</h2>
        <ul className="quests">
          <Quest completed name="Learn to cook 5 Vietnamese dishes">
            <Carousel>
              <div>
                <img
                  style={{ height: "500px" }}
                  src={require("./quests/images/viet_dishes/1.jpg")}
                />
                <div>1. Cha Ca (Tumeric Fish)</div>
              </div>

              <div>
                <img
                  style={{ height: "500px" }}
                  src={require("./quests/images/viet_dishes/2.jpg")}
                />
                <div>2. Goi Cuon (Spring Rolls)</div>
              </div>

              <div>
                <img
                  style={{ height: "500px" }}
                  src={require("./quests/images/viet_dishes/3.jpg")}
                />
                <div>3. Pho Bo (Beef Pho)</div>
              </div>

              <div>
                <img
                  style={{ height: "500px" }}
                  src={require("./quests/images/viet_dishes/4.jpg")}
                />
                <div>4. Banh Xeo</div>
              </div>

              <div>
                <img
                  style={{ height: "500px" }}
                  src={require("./quests/images/viet_dishes/5.jpg")}
                />
                <div>5. Ga Xao (Lemongrass Chicken)</div>
              </div>
            </Carousel>
          </Quest>
          <Quest completed name="Launch a product with 20 users">
            I made a game called{" "}
            <a
              href="https://store.steampowered.com/app/2824230/last_seen_online/"
              target="_blank"
            >
              Last Seen Online.
            </a>
            <p>Here were my first 6 players!</p>
            <Carousel>
              <img
                style={{ height: "400px" }}
                src={require("./quests/images/launch_product/1.jpg")}
              />
              <img
                style={{ height: "400px" }}
                src={require("./quests/images/launch_product/2.jpg")}
              />
              <img
                style={{ height: "400px" }}
                src={require("./quests/images/launch_product/3.jpg")}
              />
              <img
                style={{ height: "400px" }}
                src={require("./quests/images/launch_product/4.jpg")}
              />
              <img
                style={{ height: "400px" }}
                src={require("./quests/images/launch_product/5.jpg")}
              />
              <img
                style={{ height: "400px" }}
                src={require("./quests/images/launch_product/6.jpg")}
              />
            </Carousel>
            <p>Then I hit 66 players right after my launch...</p>
            <div style={{ textAlign: "center" }}>
              <img
                style={{ height: "600px" }}
                src={require("./quests/images/launch_product/IMG_3763.jpg")}
              />
            </div>
            <p>And suddenly...</p>
            <Carousel>
              <img
                style={{ height: "400px" }}
                src={require("./quests/images/launch_product/IMG_3872.jpg")}
              />
              <img
                style={{ height: "400px" }}
                src={require("./quests/images/launch_product/IMG_3802.jpg")}
              />
              <img
                style={{ height: "400px" }}
                src={require("./quests/images/launch_product/IMG_3818.jpg")}
              />
              <img
                style={{ height: "400px" }}
                src={require("./quests/images/launch_product/IMG_3767.jpg")}
              />
            </Carousel>
          </Quest>
          <Quest name="Benchpress 200 lbs">
            Perhaps this goal was a bit too ambitious. HOWEVER... I can bench 90
            lbs now which is incredible because I started my weightlifting
            journey in 2022, only able to bench the bar.
          </Quest>
          <Quest name="Climb a V7"></Quest>
          <Quest completed name="Run to the top of Bernal Heights">
            Completed: September 6, 2024.
            <div style={{ textAlign: "center" }}>
              <img
                style={{ width: "75%" }}
                src={require("./quests/images/bernal_sept_6.jpg")}
              />
            </div>
          </Quest>
          <Quest completed name="Do a half-marathon">
            <ReactPlayer
              controls
              width={"100%"}
              url={require("./quests/images/halfmarathon/halfmarathon.mp4")}
            />
            <div style={{ textAlign: "center" }}>
              <img
                style={{ width: "75%" }}
                src={require("./quests/images/halfmarathon/IMG_9725.jpg")}
              />
            </div>
          </Quest>
          <Quest
            completed
            name="Have a full conversation in Vietnamese with a waiter"
          >
            Weirdly enough, this was done in Montreal where the waiter only
            spoke Vietnamese and French!
          </Quest>
          <Quest completed name="Exhibit my art in a museum or gallery">
            <p>
              I created the game, "And You'll Miss It" for Fruitsbase at
              Wazmokai Gallery!
            </p>
            <div style={{ textAlign: "center" }}>
              <img
                style={{ width: "75%" }}
                src={require("./quests/images/gallery/gallery.jpg")}
              />
            </div>
            <ReactPlayer
              controls
              width={"100%"}
              url={require("./quests/images/gallery/IMG_9782.mp4")}
            />
            <ReactPlayer
              controls
              width={"100%"}
              url={require("./quests/images/gallery/IMG_9785.mp4")}
            />
          </Quest>
          <Quest
            completed
            name="Post 5 videos of me playing guitar / singing (5/5)"
          >
            <InstagramEmbed url="https://www.instagram.com/p/CxhcMMzL0TW/" />
            <InstagramEmbed url="https://www.instagram.com/p/Cyw7VUTLx8E/" />
            <InstagramEmbed url="https://www.instagram.com/p/C8BcmMwuQtj/" />
            <InstagramEmbed url="https://www.instagram.com/p/C-W4ereuHNq/" />
            <InstagramEmbed url="https://www.instagram.com/p/C_QuYXJP16J/" />
          </Quest>
          <Quest name="Take 1 improv class">
            It pains me that I almost could have done this but was late by 2
            hours.
          </Quest>
          <Quest completed name="Take 1 dance class"></Quest>
          <Quest completed name="Visit my friends in Canada">
            <ReactPlayer
              controls
              width={"100%"}
              url={require("./quests/images/canadians/breakdance.mp4")}
            />
            <div style={{ textAlign: "center" }}>
              <img
                style={{ width: "75%" }}
                src={require("./quests/images/canadians/IMG_0272.jpg")}
              />
            </div>
          </Quest>
          <Quest completed name="Do live coding at a show">
            Completed: August 10, 2023.
            <div style={{ textAlign: "center" }}>
              <img
                style={{ width: "75%" }}
                src={require("./quests/images/live_coding_aug_10.jpg")}
              />
            </div>
          </Quest>
          <Quest completed name="Host an intimate concert">
            Originally written as: Set up an intimate concert for SF indie rock
            musicians / moonlighters to meet each other.{" "}
            <p>
              I ended up hosting <a href="https://htmlfest.com/">HTMLFest</a>,
              which did have SF indie rock musicians but instead we had
              performers of the Weird Wide Web!
            </p>
            <HTMLFestCarousel />
          </Quest>
          <Quest
            completed
            name="Host a dinner party for my friends (with candles)"
          >
            <Carousel>
              <img
                style={{ height: "500px" }}
                src={require("./quests/images/dinner/IMG_0276.jpg")}
              />
              <img
                style={{ height: "500px" }}
                src={require("./quests/images/dinner/IMG_0277.jpg")}
              />
              <img
                style={{ height: "500px" }}
                src={require("./quests/images/dinner/IMG_0278.jpg")}
              />
              <img
                style={{ height: "500px" }}
                src={require("./quests/images/dinner/IMG_0279.jpg")}
              />
              <img
                style={{ height: "500px" }}
                src={require("./quests/images/dinner/IMG_0275.jpg")}
              />
            </Carousel>
            <p>I want to host more!!!</p>
          </Quest>
          <Quest
            completed
            name="Live in Vietnam for 1 month and do a motorcycle tour"
          >
            <ReactPlayer
              controls
              width={"100%"}
              url={require("./quests/images/vietnam/IMG_6430.mp4")}
            />
            <Carousel>
              <img
                style={{ height: "400px" }}
                src={require("./quests/images/vietnam/1.jpg")}
              />
              <img
                style={{ height: "400px" }}
                src={require("./quests/images/vietnam/2.jpg")}
              />
              <img
                style={{ height: "400px" }}
                src={require("./quests/images/vietnam/3.jpg")}
              />
              <img
                style={{ height: "400px" }}
                src={require("./quests/images/vietnam/4.jpg")}
              />
              <img
                style={{ height: "400px" }}
                src={require("./quests/images/vietnam/5.jpg")}
              />
              <img
                style={{ height: "400px" }}
                src={require("./quests/images/vietnam/6.jpg")}
              />
              <img
                style={{ height: "400px" }}
                src={require("./quests/images/vietnam/7.jpg")}
              />
              <img
                style={{ height: "400px" }}
                src={require("./quests/images/vietnam/8.jpg")}
              />
              <img
                style={{ height: "400px" }}
                src={require("./quests/images/vietnam/9.jpg")}
              />
            </Carousel>
          </Quest>
          <Quest
            completed
            name="DJ at a show and play my old SoundCloud music live"
          >
            I actually DJ'ed three times, and played my{" "}
            <a
              href="https://soundcloud.com/kid64/you-made-it-complicated"
              target="_blank"
            >
              Avril Lavigne remix
            </a>
            !<p>Here's me playing Viet music:</p>
            <ReactPlayer
              controls
              width={"100%"}
              url={require("./quests/images/vietdj.mp4")}
            />
          </Quest>
          <Quest completed name="Start a company">
            Originally written as: Start a company with 4-day work weeks and an
            emphasis on moving slowly and responsibly. I want to rebel furiously
            against the SF hivemind.
            <p>
              I started <a href="https://sochinstudio.com/">Sochin Studio.</a>{" "}
              It's an official LLC, and I really don't work that much.
            </p>
            <p>
              Pretty sure I wrote the rest because I am tired of San Francisco
              tech culture.
            </p>
          </Quest>
        </ul>
        <h2>Level 28 - Unmeasurable Optimism</h2>
        <ul className="quests">
          <Quest name="No longer be a person that seeks approval of others">
            This is probably never going away, instead I've become more
            accepting of the fact that I love making art and sharing things with
            people because it reaffirms my own identity.
          </Quest>
          <Quest completed name="Cut off contact from my parents">
            I did not talk to my parents for a year. It gave me a lot of
            confidence to do things on my own.
            <p>
              I backtracked this at 29 and decided to set better boundaries with
              them instead of cutting them off completely.
            </p>
          </Quest>
          <Quest completed name="Set up a turbotax account">
            I did my own taxes for the first time this year!
          </Quest>
          <Quest name="Figure out what a Backdoor Roth IRA means">
            :shrug:
          </Quest>
          <Quest name="Have healthy spending habits">
            This was kind of unmeasurable.
          </Quest>
          <Quest completed name="Be able to cook 3 dishes well">
            Once upon a time I was eating only the food at Google cafe's, and I
            really wanted to get good at cooking! I learned:
            <ul>
              <li>Chicken, broccoli, and rice.</li>
              <li>Teriyaki baked salmon, broccolini, and rice.</li>
              <li>Chicken porrige. - This inspired me to cook Pho :)</li>
            </ul>
          </Quest>
          <Quest name="Clean the bathroom every week">
            Lol sorry to my roommate Mark. Very unmeasurable. I was a very
            unclean person before but I did slowly develop habits to improve.
          </Quest>
          <Quest completed name="Make my bed everyday">
            I don't have any metrics to prove this but please just give me this.
            This habit is what I've kept up the most. Most of these goals are so
            unmeasurable, it inspired me to replace them with "Log 50 instances
            of ..."
          </Quest>
          <Quest name="Get out of bed immediately instead of scrolling endlessly on my phone"></Quest>
          <Quest name="Live in 3 different cities, all more than 8 hours apart"></Quest>
          <Quest name="Organize 10 events (?/10)"></Quest>
          <Quest name="Plan a New Years party"></Quest>
          <Quest name="Give a thoughtful gift to my cousins for one Christmas">
            I celebrated Christmas alone when I cut off contact with my parents
            :(
          </Quest>
          <Quest name="Climb a V7"></Quest>
          <Quest name="Snowboard a diamond"></Quest>
          <Quest name="Ollie on a skateboard"></Quest>
          <Quest completed name="Wear contact lenses">
            I got laser eye surgery! No glasses nor contacts :)
          </Quest>
          <Quest completed name="Develop a closer relationship with my sister">
            I attempted to have a deeper talk with my sister. It did not go
            completely well but it did bring us closer together.
          </Quest>
          <Quest name="Release my dream album">
            I lost all the original project files for my music...
          </Quest>
          <Quest name="Create an NFT">fucking cringe</Quest>
          <Quest name="Release at least 3 large bodies of work">
            I managed to do this over the 3 years instead of 1! Two video games
            and a short story :)
          </Quest>
          <Quest completed name="Stop wearing all black"></Quest>
          <Quest completed name="Use the right pronouns for people">
            Unmeasurable, but hopefully is completed ?
          </Quest>
          <Quest name="Become a clean person"></Quest>
          <Quest name="Be able to meditate easily"></Quest>
          <Quest completed name="Be a better listener">
            This year was when I journeyed into better communication and
            listening! I remember watching Snapchat stories where I can overhear
            myself in conversations with other people, and it was painful to
            listen to. I kept ignoring the other person and never replying
            completely to what they said.
            <p>
              I read a book called "You're Not Listening" which I felt improved
              my listening skills by a lot. I'm putting completed since I am
              probably a better listener even if it's just by 1%.
            </p>
          </Quest>
          <Quest name="Speak directly and not in code">
            This is still very much ongoing and will never be complete, probably
            :)
          </Quest>
          <Quest name="Be able to respond instead of react"></Quest>
          <Quest name="Accept all my imperfections"></Quest>
          <Quest name="Accept help from others"></Quest>
          <Quest name="Become a content creator"></Quest>
          <Quest completed name="Ask a girl out">
            This was hard! I threw my phone across the room when I sent her the
            text.
          </Quest>
          <Quest completed name="Go to Coachella"></Quest>
          <Quest completed name="Get a flu-shot"></Quest>
          <Quest completed name="Get a COVID booster"></Quest>
          <Quest completed name="Get my blood tested"></Quest>
          <Quest completed name="Get my first STD test">
            Is this TMI?
          </Quest>
          <Quest completed name="Get my first tattoo">
            All the previous quests were in preparation for this. Needles! Yay.
          </Quest>
        </ul>
        <h2>Level 27 - New Beginnings</h2>
        <ul className="quests">
          <Quest completed name="Move to San Francisco">
            <div style={{ textAlign: "center" }}>
              <img
                style={{ width: "75%" }}
                src={require("./quests/images/IMG_6728.jpg")}
              />
            </div>
          </Quest>
        </ul>
      </div>

      <div className="quest-scroll-bar">
        <div className="quest-scroll-left"></div>
        <div className="quest-scroll-bg"></div>
        <div className="quest-scroll-right"></div>
      </div>
      <br />
      <div style={{ textAlign: "center" }}>
        <img src={require("./quests/images/Flame2.gif")} className="pixel" />
        <img src={require("./quests/images/Flame2.gif")} className="pixel" />
        <img src={require("./quests/images/Flame2.gif")} className="pixel" />
      </div>
      <br />
      <div style={{ textAlign: "center" }}>
        <img
          src={require("./quests/images/skull-smoke.gif")}
          width="20%"
          className="pixel"
        />
      </div>
      <p>
        If you haven't noticed already, the list is so much more beautifully
        green when the goals are realistic and measurabel!!!
      </p>
    </div>
  );
}

createPage(QuestsPage);
