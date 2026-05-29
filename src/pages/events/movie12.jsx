import { headTags } from "../../utils/headTags";

export const movieDetails = {
  title: "Remoir [ルノワール] (2025)",
  description:
    "In 1987 Tokyo, a quirky and sensitive 11-year-old girl copes with a terminally ill father and stressed-out working mother while encountering various adults dealing with their own struggles.",
  image: require("./images/renoir.gif"),
};

headTags({
  title: "Henry's Movie Nights - " + movieDetails.title,
  description: movieDetails.description,
  image: movieDetails.image,
});

// The things I do to get metatags to be exported.....
(async () => {
  if (global.lol) return;
  global.lol = true;

  const { createPage } = await import("../../app");
  const { Event } = await import("../../components/events/event");
  const { Genre } = await import("../../components/events/genre");

  const { movieDetails: movie9 } = await import("./movie9");
  const { movieDetails: movie11 } = await import("./movie11");
  const { movieDetails: movie10 } = await import("./movie10");

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

  createPage(EventPage, {
    showPets: false,
    title: movieDetails.title,
  });
})();
