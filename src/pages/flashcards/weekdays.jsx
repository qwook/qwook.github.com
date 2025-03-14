import { createPage } from "../../app";
import * as _ from "lodash";
import { FlashCardDeck } from "../../components/flashcards/FlashCardDeck";

export default function Page() {
  return (
    <div>
      <h1>Weekdays</h1>
      <FlashCardDeck
        name=""
        list={[
          ["thứ hai", "Monday"],
          ["thứ ba", "Tuesday"],
          ["thứ tư", "Wednesday"],
          ["thứ năm", "Thursday"],
          ["thứ sáu", "Friday"],
          ["thứ bảy", "Saturday"],
          ["chủ nhật", "Sunday"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
