import { createPage } from "../../../app";
import * as _ from "lodash";
import { FlashCardDeck } from "../../../components/flashcards/FlashCardDeck";

export default function Page() {
  return (
    <div>
      <h1>Accidents are happening.</h1>
      <FlashCardDeck
        name=""
        list={[
          ["tai nạn chết người", "fatal accident"],
          ["xấu xí", "so ugly"],
          ["hậu đậu", "clumsy"],
          ["hoan hô", "yay!"],
          ["Án binh bất động", "stand still strategy"],
          ["có kiêng có lành", "better safe than sorry"],
          ["nhặt", "pick up"],
          ["đồ lừa bịp", "(thing) that is a scammer"],
          ["láo toét", "liar / disrespectful"],
          ["cút ngay", "get away (cussing)"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
