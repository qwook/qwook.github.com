import Age from "@/common/components/Age";
import Banner from "@/common/components/Banner";

import ReactPlayer from "@/common/components/ReactPlayer";
import Layout from "@/common/layout/Layout";
import parents from "./parents/parents.mp4";
import robertScan from "./parents/robert scan.png";
import robertParents from "./parents/robert parents.png";

function Blogs_Parents() {
  return (
    <div className="blog">
      <Banner>Supportive Parents</Banner>
      <ReactPlayer
        width={"100%"}
        controls
        loop
        url={parents}
      />
      <h2>Step 1. Scan</h2>
      <img src={robertScan} />
      <h2>Step 2. Love</h2>
      <img src={robertParents} />
    </div>
  );
}

export default function Root() {
  return (
    <Layout>
      <Blogs_Parents />
    </Layout>
  );
}
