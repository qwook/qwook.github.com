import { createPage } from "../../app";
import * as _ from "lodash";
import { FlashCardDeck } from "../../components/flashcards/FlashCardDeck";

export default function Page() {
  return (
    <div>
      <h1>Flavor Text</h1>
      <FlashCardDeck
        name=""
        list={[
          ["quả là", "indeed"],
          ["thật", "really / truly (northern)"],
          ["thiệt", "really / truly (southern)"],
          ["nhỉ", "right? (added at end)"],
          ["cực kỳ", "extremely"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
