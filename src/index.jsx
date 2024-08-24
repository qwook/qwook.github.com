import Age from "./components/Age";
import Banner from "./components/Banner";
import { createPage } from "./app";

export default function IndexPage() {
  return (
    <div>
      <Banner>Welcome to qwook.io</Banner>
      <p>
        My name is Henry Quoc Tran. I am currently <Age /> years old. I grew up
        in Milpitas, California. I now live in San Francisco, California.
      </p>
      <p>I am an indie game developer and a creative technologist.</p>
      <p>
        I like to explore nostalgia, trauma, and the deterioration of the
        internet. I also like happy things too like matcha mochi donuts.
      </p>
      <p>
        I like living a simplified lifestyle, meditating, owning less, buying
        used.
      </p>
    </div>
  );
}

createPage(IndexPage);
