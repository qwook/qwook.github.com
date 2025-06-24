import { createPage } from "../../app";
import * as _ from "lodash";
import { FlashCardDeck } from "../../components/flashcards/FlashCardDeck";

export default function Page() {
  return (
    <div>
      <h1>Miscellaneous</h1>
      <FlashCardDeck
        name=""
        list={[
          ["theo phản ứng", "go by reaction"],
          ["khả năng tự quyết định", "agency"],
          ["ích kỷ", "selfish (narcissist?)"],
          ["đối thủ", "competition"],
          ["người thân", "close person in family"],
          ["yêu đơn phương", "one-sided love"],
          ["cảm cúm", "flu (nạng hơn)"],
          ["ngộ độc thực phẩm", "food poisoning"],
          ["trúng thực", "win (slang) food poisoning"],
          ["ú ớ ấm ớ", "uncertain attitude, unclear, not hearing me"],
          ["đơ đơ", "stiff or frozen"],
          ["phức tạp", "complicated"],
          ["tội đồ", "sinner"],
          ["cái bang", "begger"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
