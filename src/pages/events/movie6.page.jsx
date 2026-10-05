import Meta from "@/common/layout/Meta";
import Layout from "@/common/layout/Layout";
import beforesunset from "./images/beforesunset.gif";
import { Event } from "./event";
import { Genre } from "./genre";

export const movieDetails = {
  title: "Before Sunset (2004)",
  description: "What if you had a second chance with the one that got away?",
  image: beforesunset,
};

export function Head() {
  return (
    <Meta
      title={"Movies at Henry's - " + movieDetails.title}
      description={movieDetails.description}
      image={movieDetails.image}
    />
  );
}

const TITLE = "Before Sunset (2004)";

function EventPage() {
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
      <img src={beforesunset} />
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
        book he wrote about the night he spent in Vienna with Celine. After
        his reading in Paris, Celine finds him, and they spend part of the day
        together before Jesse has to again leave for a flight. They are both
        in relationships now, and Jesse has a son, but as their strong
        feelings for each other start to return, both confess a longing for
        more.
      </p>
      <p>bring snacks and beer if you want</p>
      <p>
        <strong>
          The above address is a restaurant near my house, please message me
          for my real address!
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
