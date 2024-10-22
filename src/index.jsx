import Age from "./components/Age";
import Banner from "./components/Banner";
import WebRing from "./components/webring/WebRing";
import { createPage } from "./app";

export default function IndexPage() {
  return (
    <div>
      <Banner>Welcome to qwook.io</Banner>
      <p>
        My name is Henry <a href="/blogs/name">Quoc</a> Tran. I am currently <Age /> years old. I grew up
        in Milpitas, California. I now live in San Francisco, California. I am{" "}
        <a href="/blogs/durians">Vietnamese</a> and Chinese. I have many <a href="/quests">QUESTS.</a>
      </p>
      <p>I am an indie game developer and creative technologist.</p>
      <p>
        I like to explore nostalgia, <a href="/anxiety">trauma</a>, and the deterioration of the
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
        <WebRing
          text={"violand"}
          image={
            "https://freight.cargo.site/t/original/i/00ad0e84c5db1b13ee35f3592172653b13393a6076fb5ee57ac3274f4cf7e1b8/yolk.ico"
          }
          link={"https://violand.xyz/"}
        />
        <WebRing
          text={"SHARON"}
          image={"https://sharonzheng.com/favicon.ico"}
          link={"https://sharonzheng.com/"}
        />
        <WebRing
          text={"anthony tesija"}
          image={"https://anthonytesija.com/static/media/face.00003743.png"}
          link={"https://anthonytesija.com/"}
        />
        <WebRing text={"t.i.a.t."} link={"https://tiat.place/"} />
      </div>
    </div>
  );
}

createPage(IndexPage);
