import Meta from "@/common/layout/Meta";
import Layout from "@/common/layout/Layout";
import onlyyesterday from "./images/onlyyesterday.gif";
import { Event } from "./event";
import { Genre } from "./genre";
import { movieDetails as movie12 } from "./movie12.page";
import { movieDetails as movie11 } from "./movie11.page";
import { movieDetails as movie10 } from "./movie10.page";

export const movieDetails = {
  title: "Only Yesterday [おもひでぽろぽろ] (1992)",
  description:
    "From Studio Ghibli. A 27 year old city girl goes on holidy in the countryside. A movie about memory, childhood, and growing into adulthood. A love-letter to everyday life.",
  image: onlyyesterday,
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
      start="June 16, 2026 7:00 PM"
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
        Genre: <Genre list={["Coming of Age", "Anime", "Melodrama"]} />
      </p>
      <p>🇻🇳 VN-SUB ON REQUEST 🇺🇸 EN-SUB</p>
      <p>{movieDetails.description}</p>
      <b>My room is small, please ask me before bringing friends.</b>
      <hr />
      <h1>Previous Nights:</h1>
      <div className="previous-nights">
        <a href="/events/movie12" className="movie">
          <img src={movie12.image} />
          <p>{movie12.title}</p>
        </a>
        <a href="/events/movie11" className="movie">
          <img src={movie11.image} />
          <p>{movie11.title}</p>
        </a>
        <a href="/events/movie10" className="movie">
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
