import { createPage } from "../../../app";
import * as _ from "lodash";
import { FlashCardDeck } from "../../../components/flashcards/FlashCardDeck";

export default function Page() {
  return (
    <div>
      <h1>Doraemon appears with a warning.</h1>
      <FlashCardDeck
        name=""
        list={[
          ["tránh", "avoid"],
          ["rủi ro xui xẻo", "risk / bad luck"],
          ["vộ lý", "absurd"],
          ["mạnh giỏi", "healthy"],
          ["thầy bói", "fortune teller"],
          ["rất tiếc", "sorry"],
          ["vọng năm nay", "hope this year"],
          ["tai nạn suýt chết", "near-fatal accident"],
          ["nếm", "taste"],
          ["ngon quá xá là", "so delicious"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
