import { headTags } from "../../utils/headTags";

export const movieDetails = {
  title: "Crows are White (2022)",
  description:
    "A documentary director going through a life crisis meets a monk who likes heavy metal.",
  image: require("./images/crowsarewhite.gif"),
};

headTags({
  title: "Movies at Henry's - " + movieDetails.title,
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
  const { movieDetails: movie5 } = await import("./movie5");
  const { movieDetails: movie7 } = await import("./movie7");

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

  createPage(EventPage, {
    showPets: false,
    title: movieDetails.title,
  });
})();
