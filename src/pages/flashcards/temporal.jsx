import { createPage } from "../../app";
import * as _ from "lodash";
import { FlashCardDeck } from "../../components/flashcards/FlashCardDeck";

export default function Page() {
  return (
    <div>
      <h1>Temporal Words</h1>
      <FlashCardDeck
        name=""
        list={[
          ["(lát) nữa", "later"],
          ["ngày mai", "tomorrow"],
          ["hôm nay", "as of today"],
          ["ngày nay", "these days / nowadays"],
          ["tuần trước", "last week"],
          ["tôi sẽ", "I'm about to"],
          ["cho năm tới", "for the coming year"],
          ["trong năm tới", "in the coming year"],
          ["trong ba tuần", "in three weeks"],
          ["trong vài phút", "in a few minutes"],
          ["năm sau", "For next year"],
          ["vào tuần sau tuần tới", "In the week after next week"],
          ["thứ năm tuần tới", "Next thursday"],
          ["thứ năm này", "This thursday"],
          ["thứ hai", "Monday"],
          ["thứ ba", "Tuesday"],
          ["thứ tư", "Wednesday"],
          ["thứ năm", "Thursday"],
          ["thứ sáu", "Friday"],
          ["thứ bảy", "Saturday"],
          ["chủ nhật", "Sunday"],
          ["trong tương lai", "in the future"],
          ["trong quá khứ", "in the past"],
          ["cuộc sống", "in all life (past and present)"],
          ["cuộc đời", "in my life (past)"],
          ["suốt", "throughout"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
