import { Event } from "./event";
import { Genre } from "./genre";
import Meta from "@/common/layout/Meta";
import Layout from "@/common/layout/Layout";
import monster from "./images/monster.gif";

export const movieDetails = {
  title: "RERUN: Monster (2023)",
  description:
    "A single mother demands answers from a school teacher when her son begins acting strangely. A fight at school causes even more trouble.",
  image: monster,
};

const TITLE = "RERUN: Monster (2023)";

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
      start="August 24, 2026 7:00 PM"
      duration={[2, "hour", 7, "minutes"]}
      host={{
        name: "Henry",
        url: "https://instagram.com/nohurryhen",
      }}
      location={{
        address: "Near Kingfoodmart Bình Thạnh (DM me)",
        url: "https://maps.app.goo.gl/hstnt7HVsf153gKe7",
      }}
    >
      <img src={monster} />
      <p>Runtime: 2 hours 7 minutes</p>
      <p>
        Genre: <Genre list={["Drama", "Thriller", "Suspense"]} />
      </p>
      <p>🇺🇸 ENSUB</p>
      <p>
        A single mother demands answers from a school teacher when her son
        begins acting strangely. A fight at school causes even more trouble.
      </p>
      <p>bring snacks and drinks if you want</p>
      <p>
        <strong>
          The above address is near my house, please message me for
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
