import Carousel from "./Carousel";
import img9 from "../../pages/images/htmlfest/9.gif";
import img8 from "../../pages/images/htmlfest/8.gif";
import img7 from "../../pages/images/htmlfest/7.gif";
import img1 from "../../pages/images/htmlfest/1.gif";
import img2 from "../../pages/images/htmlfest/2.gif";
import img3 from "../../pages/images/htmlfest/3.gif";
import img4 from "../../pages/images/htmlfest/4.gif";
import img5 from "../../pages/images/htmlfest/5.gif";
import img6 from "../../pages/images/htmlfest/6.gif";

export default function HTMLFestCarousel() {
  return (
    <Carousel>
      <img
        src={img9}
        alt="project preview"
      />
      <img
        src={img8}
        alt="project preview"
      />
      <img
        src={img7}
        alt="project preview"
      />
      <img
        src={img1}
        alt="project preview"
      />
      <img
        src={img2}
        alt="project preview"
      />
      <img
        src={img3}
        alt="project preview"
      />
      <img
        src={img4}
        alt="project preview"
      />
      <img
        src={img5}
        alt="project preview"
      />
      <img
        src={img6}
        alt="project preview"
      />
    </Carousel>
  );
}
