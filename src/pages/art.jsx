import Banner from "../components/Banner";
import Carousel from "../components/Carousel";
import Page from "../components/Page";
import { createPage } from "../app";

export default function ArchivePage() {
  return (
    <div className="blog">
      <div className="pixel">
        <Banner>Art</Banner>
        <img src={require("./images/art/art15.png")} width="100%" />
        <img src={require("./images/art/art16.png")} width="100%" />
        <img src={require("./images/art/place.png")} width="100%" />
        <img src={require("./images/art/computer.png")} width="50%" />
        <img src={require("./images/art/caceros.jpg")} width="50%" />
        <img src={require("./images/art/suburbia.jpg")} width="100%" />
        <img src={require("./images/art/art4.png")} width="100%" />
        <img src={require("./images/art/art1.png")} width="100%" />
        <img src={require("./images/art/art3.gif")} width="100%" />
        <img src={require("./images/art/coin.gif")} width="50%" />
        <img src={require("./images/art/mrpoopiepants.gif")} width="50%" />
        <img src={require("./images/art/keepedup_objects.gif")} width="100%" />
        <img src={require("./images/art/yeule.png")} width="100%" />
        <img src={require("./images/art/rick.png")} width="100%" />
        <img src={require("./images/art/art14.jpg")} width="100%" />
        <img src={require("./images/art/art13.jpg")} width="100%" />
        <img src={require("./images/art/head.jpg")} width="100%" />
        <img src={require("./images/art/art5.png")} width="100%" />
        <img src={require("./images/art/art2.png")} width="100%" />
      </div>
    </div>
  );
}

createPage(ArchivePage);
