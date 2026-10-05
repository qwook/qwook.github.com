import Meta from "@/common/layout/Meta";
import Layout from "@/common/layout/Layout";
import homealone from "./images/homealone.gif";
import { Event } from "./event";
import { Genre } from "./genre";
import { movieDetails as movie9 } from "./movie9.page";
import { movieDetails as movie8 } from "./movie8.page";
import { movieDetails as movie7 } from "./movie7.page";

export const movieDetails = {
  title: "Home Alone (1990)",
  description:
    "Eight-year-old Kevin is accidentally left behind when his family leaves for France. At first, he's happy to be in charge; but when thieves try to break into his home, he puts up a fight like no other.",
  image: homealone,
};

export function Head() {
  return (
    <Meta
      title={"Henry's Movie Nights - " + movieDetails.title}
      description={movieDetails.description}
      image={movieDetails.image}
    />
  );
}

function EventPage() {
  return (
    <Event
      title={movieDetails.title}
      start="December 22, 2025 7:30 PM"
      duration={[1, "hour", 45, "minutes"]}
      host={{
        name: "Henry",
        url: "https://instagram.com/nohurryhen",
      }}
      location={{
        address: "DM me for address. Here is approx location.",
        url: "https://maps.app.goo.gl/cRmTBGFojgXYbwNP9",
      }}
    >
      <img src={movieDetails.image} />
      <p>Runtime: 1 hour 35 minutes</p>
      <p>
        Genre: <Genre list={["Anime", "Tragicomedy"]} />
      </p>
      <p>🇻🇳 VN-SUB ON REQUEST 🇺🇸 EN-SUB</p>
      <p>{movieDetails.description}</p>
      <p>I had this movie on VHS and played it over and over again even if it wasn't Christmas.</p>
      <p>
        Maybe more hot chocolate tasting? Depends on how many people come!
      </p>
      <p>
        <strong>Who usually goes to this?</strong> Each movie night gets
        roughly 2-4 people attending and the crowd is different every time.
        Artists, game devs, rock climbing friends, or people I vibe with.
      </p>
      <p>
        <strong>
          The above address is a restaurant near my house, please message me
          for my real address!
        </strong>
      </p>
      <b>My room is small, please ask me before bringing friends.</b>
      <hr />
      <h1>Previous Nights:</h1>
      <div className="previous-nights">
        <a href="/events/movie9" className="movie">
          <img src={movie9.image} />
          <p>{movie9.title}</p>
        </a>
        <a href="/events/movie8" className="movie">
          <img src={movie8.image} />
          <p>{movie8.title}</p>
        </a>
        <a href="/events/movie7" className="movie">
          <img src={movie7.image} />
          <p>{movie7.title}</p>
        </a>
      </div>
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
