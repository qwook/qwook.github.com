import Banner from "../components/Banner";
import Carousel from "../components/Carousel";
import Page from "../components/Page";
import { createPage } from "../app";

export default function QuestsPage() {
  return (
    <div className="blog">
      <Banner>Henry's Quests</Banner>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap');
        @font-face {
          font-family: '8bitlim';
          src: url('${require("./quests/images/8-bit-limit/8bitlim.ttf")}') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'Lowres Pixel';
          src: url('${require("./quests/images/lower-pixel/LowresPixel-Regular.otf")}') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        body {
          background-color: rgb(230, 230, 230);
          color: black;
          font-family: "Lowres Pixel";
        }
        h1, h2 {
          font-family: '8bitlim';
          color: black;
        }
      `}
      </style>
      <p>These are the list of goals I've made every year on my birthday.</p>
      <p>
        They range from very doable to extremely cool goals, and they help me
        figure out what to do next!
      </p>
      <h2>Level 30</h2>
      <h2>Level 29</h2>
      <h2>Level 28</h2>
    </div>
  );
}

createPage(QuestsPage);
