import { headTags } from "../../utils/headTags";

headTags({
  title: "Movies at Henry's - Before Sunset (2004)",
  description: "What if you had a second chance with the one that got away?",
  image: require("./images/beforesunset.gif"),
});

import { createPage } from "../../app";
import { Event } from "../../components/events/event";
import { Genre } from "../../components/events/genre";

const TITLE = "KPop Demon Hunters (2025)";

export default function EventPage() {
  return (
    <Event
      title={TITLE}
      start="September 22, 2025 7:30 PM"
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
      <img src={require("./images/kpop.gif")} />
      <p>Runtime: 1 hour 35 minutes</p>
      <p>
        Genre: <Genre list={["Animation", "Action", "Musical"]} />
      </p>
      <p>🇺🇸 ENSUB ONLY</p>
      <p>
        Okay, I swear we'll watch some avante-garde stuff soon, but somebody
        told me this was unironically good for no reason.
      </p>
      <p>
        When K-pop superstars Rumi, Mira and Zoey aren't selling out stadiums or
        topping the Billboard charts, they're moonlighting as demon hunters to
        protect their fans from ever-present supernatural danger.
      </p>
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
