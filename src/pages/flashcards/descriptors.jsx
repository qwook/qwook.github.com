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
          ["sến", "cheesy"],
          ["ngượng (ngùng)", "embarassment (awkward)"],
          ["lười", "lazy"],
          ["ngại", "shy"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
