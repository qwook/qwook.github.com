import { createPage } from "../../app";
import * as _ from "lodash";
import { FlashCardDeck } from "../../components/flashcards/FlashCardDeck";

export default function Page() {
  return (
    <div>
      <h1>Sauces</h1>
      <FlashCardDeck
        name=""
        list={[
          ["nước mắm", "fish sauce, the most essential Vietnamese condiment"],
          ["nước tương", "soy sauce, commonly used in vegetarian dishes"],
          [
            "mắm tôm",
            "fermented shrimp paste, strong-smelling and used in bún đậu mắm tôm",
          ],
          [
            "mắm nêm",
            "fermented anchovy sauce, popular in central and southern Vietnam",
          ],
          ["tương đen", "hoisin sauce, used in dipping and pho"],
          ["tương ớt", "chili sauce, spicy and often used with street food"],
          ["sốt me", "tamarind sauce, sweet and tangy"],
          [
            "sốt bơ đậu phộng",
            "peanut sauce, often served with fresh spring rolls",
          ],
          ["sốt chua ngọt", "sweet and sour sauce, used in stir-fried dishes"],
          [
            "sốt mayonnaise",
            "mayonnaise, often mixed with chili sauce for banh mi",
          ],
          [
            "sốt BBQ",
            "Vietnamese-style barbecue sauce, usually sweet and smoky",
          ],
          ["sốt cà chua", "tomato sauce, used in bò kho and other stews"],
          ["sốt tiêu", "pepper sauce, often served with grilled meats"],
          [
            "sốt sữa đặc",
            "condensed milk sauce, used for desserts and bánh mì",
          ],
          ["sốt bơ tỏi", "butter garlic sauce, popular for seafood"],
          ["sốt gừng", "ginger sauce, commonly paired with duck and chicken"],
          [
            "sốt mù tạt",
            "mustard sauce, sometimes mixed with soy sauce for dipping",
          ],
          ["sốt dầu hào", "oyster sauce, used in stir-fries"],
          ["sốt sả ớt", "lemongrass chili sauce, often used for grilled meats"],
          ["sốt mắm ruốc", "fermented shrimp sauce, popular in Huế cuisine"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
