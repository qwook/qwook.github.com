import { Event } from "./event";
import { Genre } from "./genre";
import Meta from "@/common/layout/Meta";
import Layout from "@/common/layout/Layout";
import monster from "./images/monster.gif";

export const movieDetails = {
  title: "Monster (2023)",
  description:
    "A single mother demands answers from a school teacher when her son begins acting strangely. A fight at school causes even more trouble.",
  image: monster,
};

const TITLE = "Monster (2023)";

export function Head() {
  return (
    <Meta
      title={TITLE}
      description="haha henry hosts another LAST MINUTE MOVIE NIGHT"
      image={monster}
    />
  );
}

function EventPage() {
  return (
    <Event
      title={TITLE}
      start="June 30, 2025 7:00 PM"
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
      <img src={monster} />
      <p>Runtime: 2 hours 7 minutes</p>
      <p>
        Genre: <Genre list={["Drama", "Thriller", "Suspense"]} />
      </p>
      <p>🇺🇸 ENSUB + 🇻🇳 VIETSUB</p>
      <p>
        A single mother demands answers from a school teacher when her son
        begins acting strangely. A fight at school causes even more trouble.
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
