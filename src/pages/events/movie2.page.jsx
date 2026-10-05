import { Event } from "./event";
import Meta from "@/common/layout/Meta";
import Layout from "@/common/layout/Layout";
import pastlives from "./images/pastlives.gif";

const TITLE = "Past Lives (2008) - VIETSUB ENSUB!!";

export function Head() {
  return (
    <Meta
      title={TITLE}
      description="haha henry hosts another LAST MINUTE MOVIE NIGHT"
      image={pastlives}
    />
  );
}

function EventPage() {
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
      <img src={pastlives} />
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

export default function Root() {
  return (
    <Layout>
      <EventPage />
    </Layout>
  );
}
