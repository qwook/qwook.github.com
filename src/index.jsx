import Age from "./components/Age";
import Banner from "./components/Banner";
import WebRing from "./components/webring/WebRing";
import { createPage } from "./app";

export default function IndexPage() {
  return (
    <div>
      <Banner>Welcome to qwook.io</Banner>
      <p>
        My name is Henry Quoc Tran. I am currently <Age /> years old. I grew up
        in Milpitas, California. I now live in San Francisco, California. I am
        Vietnamese and Chinese.
      </p>
      <p>I am an indie game developer and a creative technologist.</p>
      <p>
        I like to explore nostalgia, trauma, and the deterioration of the
        internet. I also like happy things too like matcha mochi donuts.
      </p>
      <ul>
        <li>
          <a href="https://x.com/henryqtran" target="_blank">
            https://x.com/henryqtran
          </a>
        </li>
        <li>
          <a href="https://instagram.com/nohurryhen" target="_blank">
            https://instagram.com/nohurryhen
          </a>
        </li>
      </ul>
      <a href="https://www.youtube.com/watch?v=6YMJm-_sivE" target="_new">
        <img
          style={{
            maxWidth: "100%",
            width: 400,
          }}
          src={require("./pages/images/furcadia.gif")}
          alt="furcadia"
        />
      </a>
      <hr />
      <p>
        These are links to some cool people that I added without their
        permission. Please message me if you want your link removed.
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <WebRing
          text={"･ﾟ✧ chia"}
          image={"https://chia.design/favicon.ico"}
          link={"https://chia.design"}
        />
        <WebRing
          text={"kevin's garden"}
          image={"https://kevin.garden/favicon.png"}
          link={"https://kevin.garden"}
        />
        <WebRing
          text={"empowa"}
          image={"https://ashleyherr.com/favicon.ico"}
          link={"https://ashleyherr.com"}
        />
        <WebRing
          text={"the intersection of art and technology"}
          link={"https://tiat.place/"}
        />
        <WebRing
          text={"leia"}
          image={"https://leiac.me/favicon.ico"}
          link={"https://leiac.me/"}
        />
        <WebRing
          text={"isabel li"}
          image={"https://isabel.li/assets/YUE.png"}
          link={"https://isabel.li/"}
        />
        <WebRing
          text={"dan dog"}
          image={"https://dan.dog/doggo.gif"}
          link={"https://dan.dog/"}
        />
        <WebRing
          text={"weird salmon"}
          image={"https://simons.dev/static/icon.png"}
          link={"https://simons.dev/"}
        />
      </div>
    </div>
  );
}

createPage(IndexPage);
