import { createPage } from "../../app";
import { Event } from "../../components/events/event";

const TITLE = "Departures (2008) - MONDAY night MOVIE!!";

export default function EventPage() {
  return (
    <Event
      title={TITLE}
      start="June 16, 2025 7:00 PM"
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
      <img src={require("./images/departures.gif")} />
      <meta
        name="og:image"
        property="og:image"
        content={require("./images/departures.gif")}
      />
      <meta
        name="og:description"
        property="og:description"
        content="haha henry hosts another LAST MINUTE MOVIE NIGHT"
      />
      <p>haha henry hosts another LAST MINUTE MOVIE NIGHT</p>
      <p>film runtime: 2 hour 10 minutes</p>
      <p>engsub and vietsub available</p>
      <p>
        yeah, yeah, dé.. you do not have to tell me why you can't come, it's
        last minute!! just tell me you can't come, I understand :)
      </p>
      <p>bring snacks and beer if you want</p>
      <p>
        The above address is a restaurant near my house, please message me for
        my real address!
      </p>
      <b>
        This is not an open event, my room is small, please ask me before
        bringing friends.
      </b>
    </Event>
  );
}

createPage(EventPage, {
  showPets: false,
  title: TITLE,
});
