import { Event } from "./event";
import { Genre } from "./genre";
import Meta from "@/common/layout/Meta";
import Layout from "@/common/layout/Layout";
import anora from "./images/anora.gif";

export function Head() {
  return (
    <Meta
      title={"Anora (2024)"}
      description={"welcome to anora!"}
      image={anora}
    />
  );
}

const TITLE = "Anora (2024)";

function EventPage() {
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
      <img src={anora} />
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

export default function Root() {
  return (
    <Layout>
      <EventPage />
    </Layout>
  );
}
