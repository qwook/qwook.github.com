import { createPage } from "../../app";
import * as _ from "lodash";
import { FlashCardDeck } from "../../components/flashcards/FlashCardDeck";

export default function Page() {
  return (
    <div>
      <h1>Core Words</h1>
      <FlashCardDeck
        name=""
        list={[
          ["đến", "to / arrive at"],
          ["điều", "things"],
          ["rằng", "formal là"],
          ["vẫn", "still"],
          ["vào", "enter, incoming, on"],
          ["như", "like so"],
          ["cố gắng", "try"],
          ["vạy", "so, the reason, right? (used at the end.)"],
          ["thay vào đó", "instead / replace that with"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
