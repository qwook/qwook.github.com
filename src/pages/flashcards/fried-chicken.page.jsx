import * as _ from "lodash";
import { FlashCardDeck } from "./FlashCardDeck";
import { FlashCardImage } from "./FlashCardImage";
import Layout from "@/common/layout/Layout";
import tuDui from "./images/fried-chicken/tu_dui.jpg";
import tuUc from "./images/fried-chicken/tu_uc.jpg";
import maDui from "./images/fried-chicken/ma_dui.jpg";
import dui from "./images/fried-chicken/dui.jpg";
import duiToi from "./images/fried-chicken/dui_toi.jpg";
import canh from "./images/fried-chicken/canh.jpg";

/*

Gà xối mỡ góc tư - Fried chicken, cut in quarters
Gà xối mỡ má đùi - 
Gà xối mỡ má
Gà xối mỡ đùi
Gà xối mỡ cánh

*/

function Page() {
  return (
    <div>
      <h1>Pho</h1>
      <FlashCardDeck
        name=""
        list={[
          [
            "Gà xối mỡ góc tư đùi",
            <FlashCardImage
              image={tuDui}
            >
              Fried chicken, Thigh + drumstick
            </FlashCardImage>,
          ],
          [
            "Gà xối mỡ góc tư ức",
            <FlashCardImage image={tuUc}>
              Fried chicken, wing + drumstick
            </FlashCardImage>,
          ],
          [
            "Gà xối mỡ má đùi, thăn đùi",
            <FlashCardImage
              image={maDui}
            >
              Fried chicken, thigh + hip
            </FlashCardImage>,
          ],
          [
            "Gà xối mỡ đùi",
            <FlashCardImage image={dui}>
              Fried chicken, drumstick + thigh
            </FlashCardImage>,
          ],
          [
            "Gà xối mỡ đùi tỏi",
            <FlashCardImage
              image={duiToi}
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
              image={canh}
            >
              Fried chicken, wing
            </FlashCardImage>,
          ],
        ]}
      />
    </div>
  );
}

export default function Root() {
  return (
    <Layout>
      <Page />
    </Layout>
  );
}
