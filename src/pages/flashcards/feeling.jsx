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
          ["tự tin", "confident"],
          ["Ghê tởm", "disgusted"],
          ["Kiệt sức", "really exhausted"],
          ["Chán (nản) / ngán", "bored"],
          ["Tức (giận)", "angry"],
          ["Cô đơn", "lonely"],
          ["U ám", "gloomy / grey"],
          ["Lo (lắng)", "nervous / worried"],
          ["Ngạc nhiên", "shocked"],
          ["Căng thẳng", "stressed"],
          ["Mệt (mỏi)", "Tired"],
          ["Ngại (ngùng)", "Shy"],
          ["Khó chịu", "annoyed"],
          ["Ngượng (ngùng)", "embarassment (awkward)"],
          ["lộn", "confused"],
          ["Bực (bội)", "frustrated"],
          ["Ghen tị", "jealous"],
          ["thoải mái", "comfortable"],
          ["ổn (định)", "stable / fine / ok"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
