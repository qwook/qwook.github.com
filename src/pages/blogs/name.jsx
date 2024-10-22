import Banner from "../../components/Banner";
import { createPage } from "../../app";

export default function Blogs_Name() {
  return (
    <div className="blog">
      <Banner>qwook</Banner>
      <p>
        On April 30, 1975, the nation of South Vietnam in which my parents lived
        in falls, leading to the reunification of Vietnam. My mother and father
        flee to America.
      </p>
      <p>
        20 years later, I am born in San Jose, a city with the highest
        Vietnamese population outside of Vietnam. My parents name me "Quốc"
        which means nation.
      </p>
      <p>
        Years later, before understanding the meaning of my name, I stumble onto
        an article that describes a practice called S.E.O. or Search Engine
        Optimization. It gives tips on how to improve traffic by showing up on
        top of Google searches.
      </p>
      <p>
        I look up my middle name "Quốc" and find too many search results. I
        change the spelling to "Qwook" and find no search results. So I take
        on the name "Qwook."
      </p>
      <p>In an effort to be found, I corrupted my name.</p>
      <p>
        "Qwook" is a Vietnamese name, born out of longing, changed to be
        recognized and respected by western technology.
      </p>
    </div>
  );
}

createPage(Blogs_Name);
