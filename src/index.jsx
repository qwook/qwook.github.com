import Age from "./components/Age";
import Banner from "./components/Banner";
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
    </div>
  );
}

createPage(IndexPage);
