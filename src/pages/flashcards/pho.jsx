import { createPage } from "../../app";
import * as _ from "lodash";
import { FlashCardDeck } from "../../components/flashcards/FlashCardDeck";

export default function Page() {
  return (
    <div>
      <h1>Pho</h1>
      <FlashCardDeck
        name=""
        list={[
          ["Tái", "Rare beef"],
          ["Chín", "Well-done beef"],
          ["Nạm", "Flank"],
          ["Gầu", "Fatty brisket"],
          ["Gân", "Tendon"],
          ["Sách", "Tripe"],
          ["Bò viên", "Beef meatballs"],
          ["Gà", "Chicken"],
          ["Gà xé", "Shredded chicken"],
          ["Lòng gà", "Chicken giblets (organs, egg yolks)"],
          ["Đặc biệt", "Special combo (all meats included)"],
          ["Tái nạm", "Rare beef & flank"],
          ["Tái gân", "Rare beef & tendon"],
          ["Tái gầu", "Rare beef & fatty brisket"],
          ["Tái sách", "Rare beef & tripe"],
          ["Không hành", "No green onions"],
          ["Không rau", "No herbs"],
          ["Không nước béo", "No fatty broth"],
          ["Ít bánh", "Less noodles"],
          ["Thêm bánh", "Extra noodles"],
          ["Thêm thịt", "Extra meat"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
