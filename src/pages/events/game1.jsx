import { createPage } from "../../app";
import { Event } from "../../components/events/event";

export default function EventPage() {
  return (
    <Event
      title="🎮 games night!!"
      start="June 20, 2025 7:00 PM"
      duration={[4, "hour"]}
      host={{
        name: "Henry",
        url: "https://instagram.com/nohurryhen",
      }}
      location={{
        address: "235/1 Đ. Nam Kỳ Khởi Nghĩa, Phường 14, Quận 3",
        url: "https://maps.app.goo.gl/cRmTBGFojgXYbwNP9",
      }}
    >
      <img src={require("./images/boardgames.gif")} />
      <p>Hey friends :) I am hosting a game night!</p>
      <p>
        I'll be testing out my{" "}
        <a href="https://qwook.io/vinawolf">One Night Ultimate Werewolf</a> Viet
        translation.
      </p>
      <p>And Shifty-Eyed Spies.</p>
      <p>And Overcooked!</p>
      <p>bring snacks and beer if you want</p>
      <p>
        The above address is a restaurant near my house, please message me for
        my real address!
      </p>
      <b>This is not an open event, please ask me before bringing friends.</b>
    </Event>
  );
}

createPage(EventPage, { showPets: false });
