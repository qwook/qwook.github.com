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
          <a href="/flashcards/core">Core words</a>
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
