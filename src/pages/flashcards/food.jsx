import { createPage } from "../../app";
import * as _ from "lodash";
import { FlashCardDeck } from "../../components/flashcards/FlashCardDeck";

export default function Page() {
  return (
    <div>
      <h1>Tết and Family</h1>
      <FlashCardDeck
        name=""
        list={[
          ["hải sản", "seafood"],
          ["dị ứng", "allergy"],
          ["ốc", "snail"],
          ["hải sản", "seafood"],
          ["chua lè", "sour"],
          ["mặn chát", "salty"],
          ["lạt nhách", "tasteless"],
          ["ngọt ngay", "too sweet"],
          ["bột ngọt", "MSG"],
          ["ngon", "savory"],
          ["đang nghét", "bitter"],
          ["cay xé lưỡi", "spicy, tears tongue"],
          ["cay xè", "too spicy"],
          ["hương vị", "flavor"],
          ["vị", "taste"],
          ["rau sống", "raw vegetables"],
          ["rau luộc", "boiled vegetables"],
          ["ổ", "load of bread"],
          ["nĩa", "fork"],
          ["muỗng", "spoon"],
          ["dao", "knife"],
          ["đun nước", "boil water"],
          ["vào", "heat up"],
          ["đò lót ly", "thing to carry cup (coaster)"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
