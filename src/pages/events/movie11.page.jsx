import Meta from "@/common/layout/Meta";
import Layout from "@/common/layout/Layout";
import bugonia from "./images/bugonia.gif";
import { Event } from "./event";
import { Genre } from "./genre";
import { movieDetails as movie9 } from "./movie9.page";
import { movieDetails as movie8 } from "./movie8.page";
import { movieDetails as movie10 } from "./movie10.page";

export const movieDetails = {
  title: "Bugonia (2025)",
  description:
    "A CEO gets kidnapped by alien conspiracist weirdos from the internet.",
  image: bugonia,
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
      start="February 3, 2025 7:30 PM"
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
      <p>Runtime: 1 hour 59 minutes</p>
      <p>
        Genre:{" "}
        <Genre list={["Weird", "Thriller", "Mystery", "Black Comedy"]} />
      </p>
      <p>🇻🇳 VN-SUB ON REQUEST 🇺🇸 EN-SUB</p>
      <p>{movieDetails.description}</p>
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
          <img src={movie10.image} />
          <p>{movie10.title}</p>
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
