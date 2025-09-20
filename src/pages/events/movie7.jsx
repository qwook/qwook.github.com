import { headTags } from "../../utils/headTags";

export const movieDetails = {
  title: "KPop Demon Hunters (2025)",
  description:
    "Okay, I swear we'll watch some avante-garde stuff soon, but somebody told me this was unironically good for no reason.",
  image: require("./images/kpop.gif"),
};

headTags({
  title: "Movies at Henry's - " + movieDetails.title,
  description: movieDetails.description,
  image: movieDetails.image,
});

// The things I do to get metatags to be exported.....
(async () => {
  const { createPage } = await import("../../app");
  const { Event } = await import("../../components/events/event");
  const { Genre } = await import("../../components/events/genre");

  const { movieDetails: movie3 } = await import("./movie3");
  const { movieDetails: movie5 } = await import("./movie5");
  const { movieDetails: movie6 } = await import("./movie6");

  function EventPage() {
    return (
      <Event
        title={movieDetails.title}
        start="September 22, 2025 7:30 PM"
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
          Genre: <Genre list={["Animation", "Action", "Musical"]} />
        </p>
        <p>🇺🇸 ENSUB ONLY</p>
        <p>{movieDetails.description}</p>
        <p>
          When K-pop superstars Rumi, Mira and Zoey aren't selling out stadiums
          or topping the Billboard charts, they're moonlighting as demon hunters
          to protect their fans from ever-present supernatural danger.
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
          <a href="/events/movie3" className="movie">
            <img src={movie3.image} />
            <p>{movie3.title}</p>
          </a>
          <a href="/events/movie5" className="movie">
            <img src={movie5.image} />
            <p>{movie5.title}</p>
          </a>
          <a href="/events/movie6" className="movie">
            <img src={movie6.image} />
            <p>{movie6.title}</p>
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
