import Age from "../../components/Age";
import Banner from "../../components/Banner";
import { createPage } from "../../app";

export default function Blogs_Parents() {
  return (
    <div className="blog">
      <Banner>Supportive Parents</Banner>
      <video
        src={require("./parents/parents.mp4")}
        autoPlay
        loop
        width={"100%"}
      />
      <h2>Step 1. Scan</h2>
      <img src={require("./parents/robert scan.png")} />
      <h2>Step 2. Love</h2>
      <img src={require("./parents/robert parents.png")} />
    </div>
  );
}

createPage(Blogs_Parents);
