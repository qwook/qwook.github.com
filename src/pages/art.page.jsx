import Banner from "@/common/components/Banner";
import Carousel from "@/common/components/Carousel";

import Layout from "@/common/layout/Layout";
import art15Png from "./images/art/art15.png";
import art16Png from "./images/art/art16.png";
import place from "./images/art/place.png";
import computer from "./images/art/computer.png";
import caceros from "./images/art/caceros.jpg";
import suburbia from "./images/art/suburbia.jpg";
import art4Png from "./images/art/art4.png";
import art1Png from "./images/art/art1.png";
import art3Gif from "./images/art/art3.gif";
import coin from "./images/art/coin.gif";
import mrpoopiepants from "./images/art/mrpoopiepants.gif";
import keepedupObjects from "./images/art/keepedup_objects.gif";
import yeule from "./images/art/yeule.png";
import rick from "./images/art/rick.png";
import art14Jpg from "./images/art/art14.jpg";
import art13Jpg from "./images/art/art13.jpg";
import head from "./images/art/head.jpg";
import art5Png from "./images/art/art5.png";
import art2Png from "./images/art/art2.png";

function ArchivePage() {
  return (
    <div className="blog">
      <div className="pixel">
        <Banner>Art</Banner>
        <img src={art15Png} width="100%" />
        <img src={art16Png} width="100%" />
        <img src={place} width="100%" />
        <img src={computer} width="50%" />
        <img src={caceros} width="50%" />
        <img src={suburbia} width="100%" />
        <img src={art4Png} width="100%" />
        <img src={art1Png} width="100%" />
        <img src={art3Gif} width="100%" />
        <img src={coin} width="50%" />
        <img src={mrpoopiepants} width="50%" />
        <img src={keepedupObjects} width="100%" />
        <img src={yeule} width="100%" />
        <img src={rick} width="100%" />
        <img src={art14Jpg} width="100%" />
        <img src={art13Jpg} width="100%" />
        <img src={head} width="100%" />
        <img src={art5Png} width="100%" />
        <img src={art2Png} width="100%" />
      </div>
    </div>
  );
}

export default function Root() {
  return (
    <Layout>
      <ArchivePage />
    </Layout>
  );
}
