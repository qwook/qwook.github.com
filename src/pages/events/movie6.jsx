import { headTags } from "../../utils/headTags";

headTags({
  title: "Movies at Henry's - Before Sunset (2004)",
  description: "What if you had a second chance with the one that got away?",
  image: require("./images/beforesunset.gif"),
});

import { createPage } from "../../app";
import { Event } from "../../components/events/event";
import { Genre } from "../../components/events/genre";

const TITLE = "Before Sunset (2004)";

export default function EventPage() {
  return (
    <Event
      title={TITLE}
      start="August 26, 2025 7:30 PM"
      duration={[2, "hour"]}
      host={{
        name: "Henry",
        url: "https://instagram.com/nohurryhen",
      }}
      location={{
        address: "DM me for address. Here is approx location.",
        url: "https://maps.app.goo.gl/cRmTBGFojgXYbwNP9",
      }}
    >
      <img src={require("./images/beforesunset.gif")} />
      <p>Runtime: 1 hour 20 minutes</p>
      <p>
        Genre: <Genre list={["Drama", "Romance"]} />
      </p>
      <p>🇺🇸 ENSUB + 🇻🇳 VIETSUB</p>
      <p>
        We finished Before Sunrise in one of the last movie nights, so we're
        continuing with that series.
      </p>
      <p>
        Nine years later, Jesse travels across Europe giving readings from a
        book he wrote about the night he spent in Vienna with Celine. After his
        reading in Paris, Celine finds him, and they spend part of the day
        together before Jesse has to again leave for a flight. They are both in
        relationships now, and Jesse has a son, but as their strong feelings for
        each other start to return, both confess a longing for more.
      </p>
      <p>bring snacks and beer if you want</p>
      <p>
        <strong>
          The above address is a restaurant near my house, please message me for
          my real address!
        </strong>
      </p>
      <b>My room is small, please ask me before bringing friends.</b>
    </Event>
  );
}

createPage(EventPage, {
  showPets: false,
  title: TITLE,
});
