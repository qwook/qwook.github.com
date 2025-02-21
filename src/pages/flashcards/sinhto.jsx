import { createPage } from "../../app";
import * as _ from "lodash";
import { FlashCardDeck } from "../../components/flashcards/FlashCardDeck";

export default function Page() {
  return (
    <div>
      <h1>Food</h1>
      <FlashCardDeck
        name=""
        list={[
          ["Cam", "Orange"],
          ["Cà chua", "Tomato"],
          ["Cà rốt", "Carrot"],
          ["Chanh dây", "Passion fruit"],
          ["Sữa chua", "Yogurt"],
          ["Dưa gang", "Cantaloupe"],
          ["Dừa", "Coconut"],
          ["Sabô / Sapôchê", "Sapodilla"],
          ["Khóm / Dứa", "Pineapple"],
          ["Mãng cầu", "Soursop"],
          ["Mít", "Jackfruit"],
          ["Xoài", "Mango"],
          ["Táo", "Apple"],
          ["Rau má", "Pennywort"],
          ["Chuối", "Banana"],
          ["Dâu", "Strawberry"],
          ["Nho", "Grape"],
          ["Dâu tằm", "Mulberry"],
          ["Đào", "Peach"],
          ["Khoai môn", "Taro"],
          ["Việt quất", "Blueberry"],
          ["Phúc bồn tử", "Raspberry"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
