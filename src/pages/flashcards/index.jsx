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
          <a href="/flashcards/misc">Misc</a>
        </li>
        <li>
          <a href="/flashcards/tet">Tết and Family</a>
        </li>
        <li>
          <a href="/flashcards/flavor-text">
            Flavor Text - Text to emphasize or to add quirkiness.
          </a>
        </li>
        <li>
          <a href="/flashcards/descriptors">Descriptors</a>
        </li>
        <li>
          <a href="/flashcards/feeling">Feeling</a>
        </li>
        <li>
          <a href="/flashcards/sick">Sick</a>
        </li>
        <li>
          <a href="/flashcards/colors">Colors</a>
        </li>
        <li>
          <a href="/flashcards/directions">Directions</a>
        </li>
        <li>
          <a href="/flashcards/temporal">Temporal</a>
        </li>
        <li>
          <a href="/flashcards/weekdays">Weekdays</a>
        </li>
        <li>
          <a href="/flashcards/core">Core words</a>
        </li>
        <li>
          <a href="/flashcards/sinhto">Sinh Tố / Smoothie Flavors</a>
        </li>
        <li>
          <a href="/flashcards/pho">Phở Options</a>
        </li>
        <li>
          <a href="/flashcards/jobs">Jobs (need to be double-checked)</a>
        </li>
        <li>
          <a href="/flashcards/sauces">Sauces (need to be double-checked)</a>
        </li>
        <li>
          <a href="/flashcards/alphabet">
            Alphabet (need to be double-checked)
          </a>
        </li>
        <li>
          <a href="/flashcards/symbols">
            Math and Address Symbols (/ @ . - +) (need to be double-checked)
          </a>
        </li>
        <li>
          <a href="/flashcards/math">Math Symbols Only</a>
        </li>
        <li>
          <a href="/flashcards/fried-chicken">Fried Chicken (Chicken Cuts)</a>
        </li>
      </ul>
      <h2>Audio Flashcards</h2>
      <ul>
        <li>
          <a href="/flashcards/audio">Vowels and Tones</a>
        </li>
      </ul>
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
