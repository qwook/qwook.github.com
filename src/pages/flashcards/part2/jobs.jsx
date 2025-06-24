import { createPage } from "../../app";
import * as _ from "lodash";
import { FlashCardDeck } from "../../components/flashcards/FlashCardDeck";

export default function Page() {
  return (
    <div>
      <h1>Jobs Part 2</h1>
      <FlashCardDeck
        name=""
        list={[
          ["nhân viên văn phòng", "office worker"],
          ["hớt tóc", "barber"],
          ["đầu bếp", "chef"],
          ["thợ", "job involving hands or feet"],
          ["tạp vụ", "generalist / janitor"],
          ["kinh doanh", "business / sales"],
          ["phòng kinh doanh", "sales department"],
          ["giám đốc", "director / ceo"],
          ["dự án", "project"],
          ["về hưu", "retire"],
          ["hội nghị", "conference"],
          ["cuộc họp", "meeting"],
          ["đối tác", "business partner"],
          ["hợp đồng", "contract"],
          ["tổng", "general"],
          ["công tác", "business travel"],
          ["giảng viên", "teacher in college"],
          ["giáo sư", "professor"],
          ["tốt nghiệp", "graduate"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
