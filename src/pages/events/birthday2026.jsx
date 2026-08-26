import { createPage } from "../../app";
import { Event } from "../../components/events/event";
import { Genre } from "../../components/events/genre";

export const eventDetails = {
  title: "Hen's Birthday Trash Cleanup - 2026",
  description: "It's my birthday, so we're gonna clean up some trash.",
  image: require("./images/birthday/trash.gif"),
};

export default function EventPage() {
  return (
    <Event
      title={eventDetails.title}
      start="August 30, 2026 6:30 AM"
      duration={[4, "hour"]}
      host={{
        name: "Henry",
        url: "https://instagram.com/nohurryhen",
      }}
      location={{
        address: "2 đường 36, Tân Hưng, Hồ Chí Minh",
        url: "https://maps.app.goo.gl/yF2bymgwTSwFmNij8",
      }}
    >
      <img src={eventDetails.image} />
      <p>{eventDetails.description}</p>
      <p>
        I know I know I know!! It's so freaken' early! But it will be fun and
        traumatizing lol. Come!
      </p>
      <p>
        Download the{" "}
        <a
          href="https://h3vru.app.link/e/DownloadSGXApp
"
          target="_blank"
        >
          Saigon Xanh App here to register.
        </a>{" "}
        Or call their hotline: 032 9595995
      </p>
      <style>
        {`
        li {
          padding-left: 1.5em;
          text-indent: -1.5em;
        }

        .time {
          color: lime;
        }
        `}
      </style>
      <h2>Presents</h2>
      <p>
        Do not bring me any presents unless they are snacks, consumables (like
        candles.) or written letters. Actually a tiny drawing of anything would
        be cute, I'll put it in my digital scrapbook. If too lazy, your presence is a present~~!!
      </p>
      <h2>What To Bring</h2>
      <ul>
        <li>🧢 Hat for Sun.</li>
        <li>🧥 Sun protective Jacket / Longsleeve.</li>
        <li>
          🩳 Clean clothes to change into. (Sometimes there's a shower, not all
          the time. No soap guaranteed.)
        </li>
        <li>
          😎 Sunglasses or Protective glasses (Not necessary, but recommended.)
        </li>
        <li>🧤 Gloves. (Normally provided.)</li>
        <li>A green spirit! 💚</li>
      </ul>
      <h2>Schedule</h2>
      <ul>
        <li>
          <span className="time">06:00</span>: Gather
        </li>
        <li>
          <span className="time">06:15 - 06:30</span>: Breakfst
        </li>
        <li>
          <span className="time">06:45</span>: Kickoff / Distribute Protective
          Gear
        </li>
        <li>
          <span className="time">07:00</span>: Cleanup
        </li>
        <li>
          <span className="time">11:00</span>: Rest
        </li>
        <li>
          <span className="time">13:30 - 17:00</span>: Continue cleanup. (You
          can go home earlier.)
        </li>
      </ul>
      <p>
        When you arrive, there will be a QR code to scan to get points. There
        are fun prizes like shirts and stuff if you get enough points.
      </p>
      <p>
        <a
          style={{
            display: "block",
            padding: 10,
            background: "red",
            border: "10px outset rgb(255, 70, 70)",
          }}
          href="https://h3vru.app.link/e/DownloadSGXApp
"
          target="_blank"
        >
          Register On App Now
        </a>
      </p>
      <p>Screenshots of the app below.</p>
      <hr />
      <img src={require("./images/birthday/1.png")} />
      <img src={require("./images/birthday/2.png")} />
      <img src={require("./images/birthday/3.png")} />
    </Event>
  );
}

createPage(EventPage, {
  showPets: false,
  title: eventDetails.title,
});
