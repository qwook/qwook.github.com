import { createPage } from "../../app";
import * as _ from "lodash";
import Banner from "../../components/Banner";

export default function Page() {
  return (
    <div>
      <Banner>Learning Vietnam Flashcards</Banner>
      <p>These are little apps I made to help me learn Vietnamese.</p>
      <h2>Flashcards</h2>
      <ul>
        <li>
          <a href="./misc">Misc</a>
        </li>
        <li>
          <a href="./tet">Tết and Family</a>
        </li>
        <li>
          <a href="./flavor-text">
            Flavor Text - Text to emphasize or to add quirkiness.
          </a>
        </li>
        <li>
          <a href="./descriptors">Descriptors</a>
        </li>
        <li>
          <a href="./feeling">Feeling</a>
        </li>
        <li>
          <a href="./sick">Feeling</a>
        </li>
        <li>
          <a href="./colors">Colors</a>
        </li>
        <li>
          <a href="./directions">Directions</a>
        </li>
        <li>
          <a href="./temporal">Temporal</a>
        </li>
        <li>
          <a href="./core">Core words</a>
        </li>
      </ul>
      <h2>Audio Flashcards</h2>
      <ul>
        <li>
          <a href="./audio">Vowels and Tones</a>
        </li>
      </ul>
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
