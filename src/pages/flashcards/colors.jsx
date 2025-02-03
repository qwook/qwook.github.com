import { createPage } from "../../app";
import * as _ from "lodash";
import { FlashCardDeck } from "../../components/flashcards/FlashCardDeck";

export default function Page() {
  return (
    <div>
      <h1>Colors</h1>
      <FlashCardDeck
        name=""
        list={[
          ["đen", "black"],
          ["xanh (đại) dương", "blue (blue of the ocean)"],
          ["xanh da trời", "light blue (blue of the sky)"],
          ["nâu", "brown"],
          ["xám", "grey"],
          ["xanh lá cây", "green (blue of the grass and trees)"],
          ["xanh lá cây", "green"],
          ["cam", "orange"],
          ["màu", "color"],
          ["tím", "purple"],
          ["đỏ", "red"],
          ["trắng", "white"],
          ["vàng", "yellow (also means gold metal)"],
          ["hồng", "pink"],
          ["bạc", "silver"],
          ["đồng", "gold (also means copper metal)"],
          ["đồng", "gold (also means copper metal)"],
          ["sẫm", "dark"],
          ["nhạt", "light"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
