import { createPage } from "../../app";
import * as _ from "lodash";
import { FlashCardDeck } from "../../components/flashcards/FlashCardDeck";
import { FlashCardImage } from "../../components/flashcards/FlashCardImage";

/*

Gà xối mỡ góc tư - Fried chicken, cut in quarters
Gà xối mỡ má đùi - 
Gà xối mỡ má
Gà xối mỡ đùi
Gà xối mỡ cánh

*/

export default function Page() {
  return (
    <div>
      <h1>Pho</h1>
      <FlashCardDeck
        name=""
        list={[
          [
            "Gà xối mỡ góc tư đùi",
            <FlashCardImage
              image={require("./images/fried-chicken/tu_dui.jpg")}
            >
              Fried chicken, Thigh + drumstick
            </FlashCardImage>,
          ],
          [
            "Gà xối mỡ góc tư ức",
            <FlashCardImage image={require("./images/fried-chicken/tu_uc.jpg")}>
              Fried chicken, wing + drumstick
            </FlashCardImage>,
          ],
          [
            "Gà xối mỡ má đùi, thăn đùi",
            <FlashCardImage
              image={require("./images/fried-chicken/ma_dui.jpg")}
            >
              Fried chicken, thigh + hip
            </FlashCardImage>,
          ],
          [
            "Gà xối mỡ đùi",
            <FlashCardImage image={require("./images/fried-chicken/dui.jpg")}>
              Fried chicken, drumstick + thigh
            </FlashCardImage>,
          ],
          [
            "Gà xối mỡ đùi tỏi",
            <FlashCardImage
              image={require("./images/fried-chicken/dui_toi.jpg")}
            >
              Fried chicken, just drumstick
            </FlashCardImage>,
          ],
          // [
          //   "Gà xối mỡ ức / mỡ lườn",
          //   <FlashCardImage image={require("./images/fried-chicken/tu_dui.jpg")}>Fried chicken, breast</FlashCardImage>,
          // ],
          [
            "Gà xối mỡ cánh",
            <FlashCardImage
              image={require("./images/fried-chicken/canh.jpg")}
            >
              Fried chicken, wing
            </FlashCardImage>,
          ],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
