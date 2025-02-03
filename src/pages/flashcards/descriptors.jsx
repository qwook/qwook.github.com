import { createPage } from "../../app";
import * as _ from "lodash";
import { FlashCardDeck } from "../../components/flashcards/FlashCardDeck";

export default function Page() {
  return (
    <div>
      <h1>Descriptor Words</h1>
      <FlashCardDeck
        name=""
        list={[
          ["sến", "cheesy (actually might not be usable for humans)"],
          ["lười", "lazy"],
          ["ngại", "shy"],
          ["tốt", "kind"],
          ["thân thiện", "friendly"],
          ["xấu", "bad"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
