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
          ["A Ah", "A"],
          ["Á Ahh", "Ă"],
          ["Â Uh", "Â"],
          ["Bê Bay", "B"],
          ["Xê Say", "C"],
          ["Dê Yay", "D"],
          ["Đê Day", "Đ"],
          ["E Eh", "E"],
          ["Ê Ay", "Ê"],
          ["Gờ Guh", "G"],
          ["Hát Hat", "H"],
          ["I Ee", "I"],
          ["Ca Kah", "K"],
          ["Lờ Luh", "L"],
          ["Mờ Muh", "M"],
          ["Nờ Nuh", "N"],
          ["O Aw", "O"],
          ["Ô Oh", "Ô"],
          ["Ơ Uh", "Ơ"],
          ["Pê Pay", "P"],
          ["Quy Kwee", "Q"],
          ["Rờ Ruh", "R"],
          ["Sờ Suh", "S"],
          ["Tê Tay", "T"],
          ["U Ooo", "U"],
          ["Ư Euh", "Ư"],
          ["Vê Vay", "V"],
          ["Xờ Suh", "X"],
          ["I dài Ee yai", "Y"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
