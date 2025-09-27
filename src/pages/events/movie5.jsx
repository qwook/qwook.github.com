import { headTags } from "../../utils/headTags";

export const movieDetails = {
  title: "After Life (1998)",
  description:
    "After souls leave their bodies on Earth, they go through a process before entering their personal heaven, a single special memory they want to live for eternity.",
  image: require("./images/afterlife.gif"),
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

  const TITLE = "After Life (1998)";

  function EventPage() {
    return (
      <Event
        title={TITLE}
        start="July 28, 2025 7:00 PM"
        duration={[2, "hour"]}
        host={{
          name: "Henry",
          url: "https://instagram.com/nohurryhen",
        }}
        location={{
          address: "235/1 Đ. Nam Kỳ Khởi Nghĩa, Phường 14, Quận 3",
          url: "https://maps.app.goo.gl/cRmTBGFojgXYbwNP9",
        }}
      >
        <img src={require("./images/afterlife.gif")} />
        <p>Runtime: 1 hours 59 minutes</p>
        <p>
          Genre: <Genre list={["Tragicomedy", "Fantasy", "Drama"]} />
        </p>
        <p>🇺🇸 ENSUB + 🇻🇳 VIETSUB</p>
        <p>
          After souls leave their bodies on Earth, they go through a process
          before entering their personal heaven, a single special memory they
          want to live for eternity.
        </p>
        <p>What is the one memory you would take with you?</p>
        <p>bring snacks and beer if you want</p>
        <p>
          <strong>
            The above address is a restaurant near my house, please message me
            for my real address!
          </strong>
        </p>
        <b>My room is small, please ask me before bringing friends.</b>
      </Event>
    );
  }

  createPage(EventPage, {
    showPets: false,
    title: TITLE,
  });
})();
