import { createPage } from "../../../app";
import * as _ from "lodash";
import { FlashCardDeck } from "../../../components/flashcards/FlashCardDeck";

export default function Page() {
  return (
    <div>
      <h1>Positional</h1>
      <FlashCardDeck
        name=""
        list={[
          ["đối diên", "opposite from each other"],
          ["đằng kia", "over there"],
          ["đối diên", "opposite from each other"],
          ["đằng kia", "over there"],
          ["vị trí", "positional"],
          ["góc", "corner"],
          ["sở thú", "zoo"],
          ["bưu đien", "post office"],
          ["về", "starting to go, before going back"],
          ["về đến", "going / arrived back"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
