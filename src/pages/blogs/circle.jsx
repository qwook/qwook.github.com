import Age from "../../components/Age";
import Banner from "../../components/Banner";
import { createPage } from "../../app";

export default function Blogs_CirclePage() {
  return (
    <div className="blog">
      <Banner>The Circle App</Banner>
      <p>
        The Circle was an interactive theatrical production of the Dave Egger's
        book of the same name. The production took place at San Jose State
        University on November 18th–21st, 2015.
      </p>
      <div class="media">
        <img src={require("./circle/image1.jpg")} />
      </div>

      <p>
        <a href="http://wsimons.com/" target="_blank">
          Will Simons
        </a>{" "}
        and I worked on developing the iOS and Android app for the SJSU
        Production of{" "}
        <a
          href="http://www.amazon.com/The-Circle-Dave-Eggers/dp/0345807294"
          target="_blank"
        >
          The Circle
        </a>
        .
      </p>
      <p>
        The SJSU Production of The Circle allowed the audience to roam around a
        building and interact with actors of the play. The audience could choose
        their own adventure and to see different sides to the story.
      </p>

      <p>
        Due to the scale of the play, actors would not be able to keep track of
        all the players and send messages or give points manually to them.
      </p>

      <p>
        The purpose of The Circle App was to monitor the position of the user as
        they traversed through the building. Automatic push notifications were
        sent to users if they were in a certain room during an event, giving the
        user the illusion that they were being messaged and given points by the
        actors.
      </p>

      <div class="media">
        <img src={require("./circle/screen3.png")} />
      </div>

      <p>
        As the user interacted with the actors and perform tasks, they scored
        points. A leaderboard was added so that users could see how well they
        are performing compared to other audience members. The leaderboard ranks
        started at high numbers to give the impression that the user was part of
        a large company.
      </p>

      <div class="media">
        <img src={require("./circle/screen2.png")} />
      </div>

      <h2>Technology</h2>
      <h3>Meteor</h3>
      <p>
        We decided on using{" "}
        <a href="https://www.meteor.com/" target="_blank">
          Meteor
        </a>{" "}
        to develop our app. Meteor is a full-stack web development framework.
        This means it handles the database, the front-end, the back-end, and
        almost everything in between. Meteor is also built on top of Cordova, so
        it has the ability to be deployed onto mobile devices.
      </p>
      <p>
        We chose Meteor because Will and I both were more acquainted in web
        development than in app development. Using Meteor, we were able to jump
        into development immediately.
      </p>

      <div class="media">
        <img src={require("./circle/meteor.png")} />
      </div>

      <p>
        When the user first logs in, they download a pre-defined list of events
        that occur at different times.
      </p>
      <p>
        Rather than keeping track of the user on a server, we programmed all the
        logic to happen <em>on the client.</em> Push notifications are all local
        and fired from within the app.
      </p>
      <p>
        As the user traverses through the building, the app keeps track of the
        users location and fires off events when it thinks the user has
        triggered one.
      </p>
      <div class="media">
        <img src={require("./circle/screen5.png")} />
      </div>
      <h3>iBeacons</h3>
      <p>
        To keep track of user locations, we used iBeacons. iBeacons are tiny
        physical objects that emit a bluetooth signal that can be detected by
        most smartphones. Using a modified{" "}
        <a
          href="https://github.com/petermetz/cordova-plugin-ibeacon"
          target="_blank"
        >
          iBeacon Cordova plugin
        </a>
        , we are able to detect the proximity between a person's smart phone and
        an iBeacon.
      </p>
      <p>iBeacons were placed all over the building and on actors.</p>
      <p>
        Based on which iBeacons the user is closest to, we can deduce which room
        the user is in. We are also able to deduce if the user is right next to
        an actor.
      </p>
      <div class="media">
        <img src={require("./circle/ibeacons.jpg")} />
      </div>

      <h2>Problems...</h2>
      <h3>iBeacon Gotchas</h3>
      <p>
        iBeacons are fine when the app is open, as they give fairly decent range
        values in the form of a <em>float</em>. However, if the app is in the
        background, then the iBeacons can only give discrete values of proximity
        such as <em>Near, Far,</em> and <em>Unknown.</em> These discrete values
        are very finicky and because of that, users were accidentally sent
        messages that weren't meant for them. We figured that there wasn't much
        we can do but to just roll with it.
      </p>
      <h3>"Am I going to have to pay for that bandwidth?"</h3>
      <p>
        We initially designed the app so that all information, including
        positional data, were sent to the server in an interval. This proved to
        be an extremely substantial load when we did a test run with 50
        concurrent users. The server would hit maximum capacity within the first
        minute.
      </p>
      <p>
        By this time, the app was nearing completion and we had a week left to
        develop. We made the decision to move as much server logic to the client
        as possible, and to not send location data to the server. This
        transition was made easier by the fact that Meteor shares a common API
        on the server and the client. We were able to finish the app on time.
      </p>
      <p>
        Due to eventual technological malfunctions, actors were told to blame a
        fictional character named "Trevor" whenever there was a bug. Will and I
        later registered our names as Trevor when we attended the official runs
        of the play.
      </p>
      <div class="media">
        <img src={require("./circle/image6.jpeg")} />
      </div>
      <h1>Conclusion</h1>
      <p>
        This was definitely one of the biggest projects Will and I have ever
        taken on. I am glad I was able to play around with a lot of cool
        technologies, as well as meet a lot of cool people in theater. If I
        could, I would totally do this again. Even with all the problems, I had
        a great learning experience.
      </p>
      <p>
        The most satisfying part of this experience was hearing an audience
        member say, "How did it know where I was?"
      </p>
    </div>
  );
}

createPage(Blogs_CirclePage);
