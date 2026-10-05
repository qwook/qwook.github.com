import { Event } from "./event";
import Meta from "@/common/layout/Meta";
import Layout from "@/common/layout/Layout";
import departures from "./images/departures.gif";

const TITLE = "Departures (2008) - MONDAY night MOVIE!!";

export function Head() {
  return (
    <Meta
      title={TITLE}
      description="haha henry hosts another LAST MINUTE MOVIE NIGHT"
      image={departures}
    />
  );
}

function EventPage() {
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
      <img src={departures} />
      <p>haha henry hosts another LAST MINUTE MOVIE NIGHT</p>
      <p>film runtime: 2 hour 10 minutes</p>
      <p>engsub and vietsub available</p>
      <p>
        yeah, yeah, dé.. you do not have to tell me why you can't come, it's
        last minute!! just tell me you can't come, I understand :)
      </p>
      <p>bring snacks and beer if you want</p>
      <p>
        also if you have a ratchet strap, allen wrenches, and regular wrenches
        let me know, please help me carry my sofa up the stairs
      </p>
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

export default function Root() {
  return (
    <Layout>
      <EventPage />
    </Layout>
  );
}
