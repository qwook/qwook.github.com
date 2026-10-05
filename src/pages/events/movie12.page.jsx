import Meta from "@/common/layout/Meta";
import Layout from "@/common/layout/Layout";
import renoir from "./images/renoir.gif";
import { Event } from "./event";
import { Genre } from "./genre";
import { movieDetails as movie9 } from "./movie9.page";
import { movieDetails as movie11 } from "./movie11.page";
import { movieDetails as movie10 } from "./movie10.page";

export const movieDetails = {
  title: "Remoir [ルノワール] (2025)",
  description:
    "In 1987 Tokyo, a quirky and sensitive 11-year-old girl copes with a terminally ill father and stressed-out working mother while encountering various adults dealing with their own struggles.",
  image: renoir,
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
      start="June 1, 2026 7:00 PM"
      duration={[1, "hour", 59, "minutes"]}
      host={{
        name: "Henry",
        url: "https://instagram.com/nohurryhen",
      }}
      location={{
        address: "Near Kingfoodmart Bình Thạnh (DM me)",
        url: "https://maps.app.goo.gl/hstnt7HVsf153gKe7",
      }}
    >
      <img src={movieDetails.image} />
      <p>Runtime: 1 hour 59 minutes</p>
      <p>
        Genre: <Genre list={["Coming of Age", "Drama"]} />
      </p>
      <p>🇻🇳 VN-SUB ON REQUEST 🇺🇸 EN-SUB</p>
      <p>{movieDetails.description}</p>
      <b>My room is small, please ask me before bringing friends.</b>
      <hr />
      <h1>Previous Nights:</h1>
      <div className="previous-nights">
        <a href="/events/movie9" className="movie">
          <img src={movie9.image} />
          <p>{movie9.title}</p>
        </a>
        <a href="/events/movie11" className="movie">
          <img src={movie11.image} />
          <p>{movie11.title}</p>
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
