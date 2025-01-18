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
          ["sến", "cheesy"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
