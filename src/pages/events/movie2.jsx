import { createPage } from "../../app";
import { Event } from "../../components/events/event";

const TITLE = "Past Lives (2008) - VIETSUB ENSUB!!";

export default function EventPage() {
  return (
    <Event
      title={TITLE}
      start="June 23, 2025 7:00 PM"
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
      <img src={require("./images/pastlives.gif")} />
      <meta
        name="og:image"
        property="og:image"
        content={require("./images/pastlives.gif")}
      />
      <meta
        name="og:description"
        property="og:description"
        content="haha henry hosts another LAST MINUTE MOVIE NIGHT"
      />
      <p>film runtime: 1 hour 46 minutes</p>
      <p>engsub and vietsub available</p>
      <p>
        Nora and Hae Sung, two deeply connected childhood friends, are wrest
        apart after Nora's family emigrates from South Korea. Decades later,
        they are reunited for one fateful week as they confront destiny, love
        and the choices that make a life.
      </p>
      <p>bring snacks and beer if you want</p>
      <p>
        <strong>The above address is a restaurant near my house, please message me for
        my real address!</strong>
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
