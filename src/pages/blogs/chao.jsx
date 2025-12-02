import Banner from "../../components/Banner";
import { createPage } from "../../app";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import Carousel from "../../components/Carousel";
import { Smiley } from "../../components/smiley/Smiley";

export default function Blogs_Chao() {
  return (
    <div className="blog">
      <Banner>Chào Tạm Biệt</Banner>
      <p>
        Chào Tạm Biệt (Goodbye) was a going-away party I threw in my backyard
        with the help of my friends.
      </p>
      <p>
        I wanted to mash up Việt Nam with early 2000's San Francisco aesthetics,
        which I felt represented the two worlds I was crossing between.
      </p>
      <img src={require("./chao/chao_tam_biet_poster.jpg")} />
      <p>
        I made a <a href="/chao">website</a> and flyer for the event.
      </p>
      <p>
        At this time I was getting pretty tired of all the electronic techno
        shows that people were throwing. They were cool but I wanted something
        that connected to San Francisco's DIY and indie / punk roots.
      </p>
      <img src={require("./chao/IMG_1646.jpg")} />
      <p>
        Nothing more DIY and indie than a backyard rock party right? I cut up
        some cardboard boxes to cover up my window and partially taped up the
        vents with garbage bags. You'll see later why I did that.
      </p>
      <p>
        These are my friends J. R. and Andrea from Nun-Fiction doing sound
        check.
      </p>
      <img src={require("./chao/IMG_1645.jpg")} />
      <p>
        My friend Mark was the head chef, leading roomate Chaya and friend Dai
        in making Yakitori.
      </p>
      <img src={require("./chao/IMG_CONNIE.jpg")} />
      <p>
        Connie helped me so much with all the halloween decorations. Most of
        these decorations were borrowed from an algorave event for halloween.
      </p>
      <img src={require("./chao/IMG_1649.jpg")} />
      <p>
        People were rolling in pretty early during sound check. I did some
        projector tests here too.
      </p>
      <p>
        Chris was our first performer, and unfortunately had to deal with all
        the technical issues we faced. There was tons of feedback because the
        sound was bouncing off of the giant building behind ours.
      </p>
      <ReactPlayer
        width={"100%"}
        height={"100%"}
        controls
        loop
        url={require("./chao/video6.mp4")}
      />
      <p>
        But he did so great and brought the energy! If you look in the back, I
        created the visuals for Chris' performance.
      </p>
      <Carousel>
        <img src={require("./chao/kail_table.jpg")} alt="project preview" />
        <img src={require("./chao/kyla_table.jpg")} alt="project preview" />
        <img src={require("./chao/food_table.jpg")} alt="project preview" />
        <img src={require("./chao/toilet.jpg")} alt="project preview" />
      </Carousel>
      <p>
        My friend{" "}
        <a href="https://www.instagram.com/robots3xdoll/" target="_blank">
          Kyla
        </a>{" "}
        and{" "}
        <a href="https://www.instagram.com/kailgrown/" target="_blank">
          Kail
        </a>{" "}
        were invited to sell their clothes at the party. We made a few signs for
        them, as well as for the toilet and food table.
      </p>
      <img src={require("./chao/IMG_1682.jpg")} />
      <p>Chris actually bought this jacket from Kyla!!</p>
      <img src={require("./chao/IMG_1009.jpg")} />
      <p>
        I installed my game,{" "}
        <a href="/miss" target="_blank">
          "And You'll Miss It"
        </a>{" "}
        in the back for people to play. People kept coming up to me and saying,
        "Henry I hate you for making me cry at your party!"
      </p>
      <p>
        <a href="https://www.instagram.com/joesshoestore/" target="_blank">
          Joe Baker
        </a>{" "}
        installed the lights and decorations above.
      </p>
      <img src={require("./chao/IMG_1651.jpg")} />
      <p>Mark's Yakitori was a total hit!!</p>
      <img src={require("./chao/IMG_1003.jpg")} />
      <p>
        I told everyone it was a late halloween party, but only Melody came in
        with a costume on. Thanks for committing, Melody!
      </p>
      <ReactPlayer
        width={"100%"}
        height={"100%"}
        controls
        loop
        url={require("./chao/video2.mp4")}
      />
      <p>
        I'd been trying to convince Kenny for such a long time to perform. Kenny
        has suuuuch a nice voice. Actually, Kenny, Ben and me were supposed to
        form a band named "Squidlips." It never happened, but since we had one
        member from Squidlips perform I decided to call it "Squidlip$" with the
        S crossed out.
      </p>
      <ReactPlayer
        width={"100%"}
        height={"100%"}
        controls
        loop
        url={require("./chao/video3.mp4")}
      />
      <p>
        Entropics and Anthony Tesija performed live visuals and rapping for the
        show. Since they were the only ones with computers, we totally screwed
        up their setup by not having desks for their laptops. They were able to
        come up with a quick solution which was to use the wooden blocks we set
        aside for seating. Hell yeah to them for being able to come up with this
        on the spot.
      </p>
      <ReactPlayer
        width={"100%"}
        height={"100%"}
        controls
        loop
        url={require("./chao/video5.mp4")}
      />
      <p>
        <a href="https://www.youtube.com/watch?v=ZxchfArdgZY">Alex Togashi</a>{" "}
        put on such an amazing performance! Alex is a multi-talented artist with
        the most experience in live performances than any of us this night. He
        also didn't know anyone in the crowd except for me, which probably made
        it harder for him. He pulled through though and I got chills from his
        performance. I think Alex's music is very quintessentially everything
        cool about the Bay Area and I was so honored to have him perform for us
        that night.
      </p>
      <p>
        For this show, I created interactive visuals that people can control
        with on their phone.
      </p>
      <img src={require("./chao/screenshot_1.png")} />
      <p>
        The idea is an extension of an app that I made for my previous parties.
        Since we don't have a doorbell, we needed a way for people to alert us
        that they're at the gate.
      </p>
      <p>
        For one of my parties, I had a website with a button people can press to
        play a doorbell sound on speakers in the background.
      </p>
      <p>
        I then realized that I could add more things people can do after they've
        rang the doorbell, such as upload a picture of themselves!
      </p>
      <img src={require("./chao/screenshot_3.png")} />
      <p>
        I applied the pictures they uploaded onto butterflies on the screen.
      </p>
      <img src={require("./chao/screenshot_2.png")} />
      <p>
        And then I added a controller tab for people to control their
        butterflies.
      </p>
      <ReactPlayer
        width={"100%"}
        height={"100%"}
        controls
        loop
        url={require("./chao/video7.mp4")}
      />
      <p>Then we can have a virtual moshpit!</p>
      <p>
        I feel like a lot of live coding and new media work has mainly been
        connected to electronic music... But I think there's so much potential
        for it to be incorporated into indie and punk rock. These were my
        efforts to do something I wasn't seeing too much of.
      </p>
      <ReactPlayer
        width={"100%"}
        height={"100%"}
        controls
        loop
        url={require("./chao/video1.mp4")}
      />
      <p>And it turned out fucking dope!</p>
      <p>
        The headline of the show, Nun Fiction, freakin' killed it! I still have
        chills from how well they performed while rewatching these videos.
      </p>

      <ReactPlayer
        width={"100%"}
        height={"100%"}
        controls
        loop
        url={require("./chao/video4.mp4")}
      />
      <p>Dude yeah... Chills.</p>
      <br />
      <img src={require("./chao/IMG_1654.jpg")} />
      <img src={require("./chao/IMG_1004.jpg")} />
      <br />
      <Smiley id={8} />
      <br />
      <br />
      <p>
        At the end of the event I gave a speech and played for all of them this
        video.
      </p>
      <ReactPlayer
        width={"100%"}
        controls
        loop
        url={"https://www.youtube.com/watch?v=0dLfitczG9c"}
      />
      <p>It's officially been one year since I've moved to Việt Nam.</p>
      <p>
        There are times when I do feel homesick and I miss the city. I miss
        riding my bike through the parks and having coffee dates with my
        friends. The decision to move to Việt Nam wasn't because I felt the need
        to run away from something, but instead to embark on a new adventure
        while I still have the time and energy to do so.
      </p>
      <p>
        My year in Việt Nam has led me to grow in crazy and incredible ways.
        I've ridden the up-and-down rollercoaster of San Francisco and now I'm
        riding the up-and-down rollercoaster of Sài Gòn. I've met a ton of
        beautiful, talented, and compassionate people in Việt Nam. I love life.
        I love Việt Nam. I hope to pay tribute to you some day.
      </p>
      <p>...But I can't forget any of the people who brought me here.</p>
      <p>I carry you all with me.</p>
      <img src={require("./chao/IMG_8996.jpg")} />
    </div>
  );
}

createPage(Blogs_Chao);
