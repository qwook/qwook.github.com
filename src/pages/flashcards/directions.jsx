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
          ["đi thẳng", "go straight"],
          ["quay lại / đi ngược lại", "turn around"],
          ["quẹo trái", "turn left"],
          ["quẹo phải", "turn right"],
          ["đường cao tốc", "highway"],
          ["đường", "road"],
          ["cuối đường", "end of road"],
          ["(hàng) xóm", "neighborhood"],
          ["thành phố", "city"],
          ["(miền) quê", "countryside"],
          ["ở đó", "there"],
          ["đây", "here"],
          ["hướng", "direction (forward, backward, left or right)"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
