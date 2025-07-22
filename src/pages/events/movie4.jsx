import { headTags } from "../../utils/headTags";

headTags({
  title: "Anora (2024)",
  description: "welcome to anora!",
  image: require("./images/anora.gif"),
});

import { createPage } from "../../app";
import { Event } from "../../components/events/event";
import { Genre } from "../../components/events/genre";

const TITLE = "Anora (2024)";

export default function EventPage() {
  return (
    <Event
      title={TITLE}
      start="July 7, 2025 7:00 PM"
      duration={[4, "hour"]}
      host={{
        name: "Henry",
        url: "https://instagram.com/nohurryhen",
      }}
      location={{
        address: "235/1 Đ. Nam Kỳ Khởi Nghĩa, Phường 14, Quận 3",
        url: "https://maps.app.goo.gl/cRmTBGFojgXYbwNP9",
      }}
    >
      <img src={require("./images/anora.gif")} />
      <meta
        name="og:image"
        property="og:image"
        content={require("./images/anora.gif")}
      />
      <meta
        name="og:description"
        property="og:description"
        content="haha henry hosts another LAST MINUTE MOVIE NIGHT"
      />
      <p>Runtime: 2 hours 19 minutes</p>
      <p>
        Genre: <Genre list={["Romance", "Comedy", "Drama"]} />
      </p>
      <p>🇺🇸 ENSUB + 🇻🇳 VIETSUB</p>
      <p>
        Anora, a young woman from Brooklyn, gets her chance at a Cinderella
        story when she meets and marries the son of an oligarch. Once the news
        reaches Russia, her fairytale is threatened as the parents set out for
        New York to get the marriage annulled.
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
