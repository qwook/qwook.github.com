import { createPage } from "../../../app";
import * as _ from "lodash";
import { FlashCardDeck } from "../../../components/flashcards/FlashCardDeck";

export default function Page() {
  return (
    <div>
      <h1>Great-grandson explains</h1>
      <FlashCardDeck
        name=""
        list={[
          ["biến mất tăm", "disappeared"],
          ["tính xấu", "bad personality traits"],
          ["cụ cố / cụ", "great grandfather"],
          ["thậm chí", "even… (beginning of sentence)"],
          ["thực ra", "actually…"],
          ["vài tật xấu", "some bad habits"],
          ["tóm lại", "in short…"],
          ["cận kề", "near"],
          ["oằn tù tì", "rock paper scissors"],
          ["chắt", "great grandson"],
          ["giải thích", "explain"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
