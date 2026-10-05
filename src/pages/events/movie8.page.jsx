import Meta from "@/common/layout/Meta";
import Layout from "@/common/layout/Layout";
import crowsarewhite from "./images/crowsarewhite.gif";
import { Event } from "./event";
import { Genre } from "./genre";
import { movieDetails as movie6 } from "./movie6.page";
import { movieDetails as movie5 } from "./movie5.page";
import { movieDetails as movie7 } from "./movie7.page";

export const movieDetails = {
  title: "Crows are White (2022)",
  description:
    "A documentary director going through a life crisis meets a monk who likes heavy metal.",
  image: crowsarewhite,
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

function EventPage() {
  return (
    <Event
      title={movieDetails.title}
      start="September 29, 2025 7:30 PM"
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
      <img src={movieDetails.image} />
      <p>Runtime: 1 hour 35 minutes</p>
      <p>
        Genre: <Genre list={["Documentary"]} />
      </p>
      <p>🇺🇸 ENSUB ONLY</p>
      <p>{movieDetails.description}</p>
      <p>
        "Men will make a whole ass documentary to avoid dealing with their
        problems." - Bobby Harris
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
        <a href="/events/movie6" className="movie">
          <img src={movie6.image} />
          <p>{movie6.title}</p>
        </a>
        <a href="/events/movie5" className="movie">
          <img src={movie5.image} />
          <p>{movie5.title}</p>
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
