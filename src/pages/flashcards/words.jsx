import { createPage } from "../../app";
import * as _ from "lodash";
import { FlashCardDeck } from "../../components/flashcards/FlashCardDeck";

export default function Page() {
  return (
    <div>
      <h1>Alphabet</h1>
      <FlashCardDeck
        name=""
        list={[
          ["danh từ", "noun"],
          ["động từ", "verb"],
          ["tính từ", "adjective"],
          ["trạng từ", "adverb"],
          ["đại từ", "pronoun"],
          ["sắc", "/"],
          ["huyền", "\\"],
          ["hỏi", "?"],
          ["ngã", "~"],
          ["nặng", "."],
          ["dấu á", "ă"],
          ["móc", "ư, ơ"],
          ["mũ", "^"],
          ["ngang", "đ"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
