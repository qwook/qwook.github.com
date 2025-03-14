import { createPage } from "../../app";
import * as _ from "lodash";
import { FlashCardDeck } from "../../components/flashcards/FlashCardDeck";

export default function Page() {
  return (
    <div>
      <h1>Math and Address Symbols</h1>
      <FlashCardDeck
        name=""
        list={[
          ["phần", "divide"],
          ["bằng", "equals"],
          ["nhân", "multiply"],
          ["trừ", "minus"],
          ["cộng", "plus"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
