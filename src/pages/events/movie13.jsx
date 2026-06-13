import { headTags } from "../../utils/headTags";

export const movieDetails = {
  title: "Only Yesterday [おもひでぽろぽろ] (1992)",
  description:
    'From Studio Ghibli. A 27 year old city girl goes to the countryside. Described as a "plotless" movie and more just a slow collection of incidents. A love-letter to everyday life and childhood.',
  image: require("./images/onlyyesterday.gif"),
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

  const { movieDetails: movie12 } = await import("./movie12");
  const { movieDetails: movie11 } = await import("./movie11");
  const { movieDetails: movie10 } = await import("./movie10");

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

  createPage(EventPage, {
    showPets: false,
    title: movieDetails.title,
  });
})();
