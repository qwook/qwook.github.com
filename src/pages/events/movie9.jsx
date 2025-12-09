import { headTags } from "../../utils/headTags";

export const movieDetails = {
  title: "Tokyo Godfathers (2003)",
  description:
    "On Christmas Eve, three misfits find an abandoned baby in Tokyo.",
  image: require("./images/tokyogodfathers.gif"),
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

  const { movieDetails: movie6 } = await import("./movie6");
  const { movieDetails: movie8 } = await import("./movie8");
  const { movieDetails: movie7 } = await import("./movie7");

  function EventPage() {
    return (
      <Event
        title={movieDetails.title}
        start="December 15, 2025 7:30 PM"
        duration={[1, "hour", 32, "minutes"]}
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
        <p>Wow I finally fixed my room up for a movie night!</p>
        <p>
          From the director of Paprika and Perfect blue. "With its rich
          characters, moments of comedy, drama, and pure action, Tokyo
          Godfathers is arguably both superior to and more relatable than Kon’s
          other films."
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

  createPage(EventPage, {
    showPets: false,
    title: movieDetails.title,
  });
})();
