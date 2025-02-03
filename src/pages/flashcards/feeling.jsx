import { createPage } from "../../app";
import * as _ from "lodash";
import { FlashCardDeck } from "../../components/flashcards/FlashCardDeck";

export default function Page() {
  return (
    <div>
      <h1>Direction Words</h1>
      <FlashCardDeck
        name=""
        list={[
          ["Tôi đang cảm thấy ___", "i am feeling ___"],
          ["Bạn cảm thấy thế nào", "how are you feeling?"],
          ["Buồn", "sad"],
          ["Thất vọng", "disappointed"],
          ["Tự ti", "unconfident"],
          ["Ghê tởm", "disgusted"],
          ["Kiệt sức", "exhausted"],
          ["Chán (nản)", "bored"],
          ["Tức (giận)", "angry"],
          ["Cô đơn", "lonely"],
          ["U ám", "gloomy / grey"],
          ["Lo (lắng)", "nervous / worried"],
          ["Ngạc nhiên", "shocked"],
          ["Căng thẳng", "stressed"],
          ["Mệt (mỏi)", "Tired"],
          ["Ngại (ngùng)", "Shy"],
          ["Khó chịu", "annoyed"],
          ["ngượng (ngùng)", "embarassment (awkward)"],
          ["lộn", "confused"],
          ["Bực (bội)", "frustrated"],
          ["Ghen tị", "jealous"],
          ["ổn (định)", "stable / fine / ok"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
