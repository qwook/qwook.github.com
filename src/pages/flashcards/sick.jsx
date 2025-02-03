import { createPage } from "../../app";
import * as _ from "lodash";
import { FlashCardDeck } from "../../components/flashcards/FlashCardDeck";

export default function Page() {
  return (
    <div>
      <h1>Sickness</h1>
      <FlashCardDeck
        name=""
        list={[
          ["dị ứng", "allergy"],
          ["sổ mũi", "runny nose"],
          ["bệnh suyễn", "asthma"],
          ["huyết áp cao", "high blood pressure"],
          ["cảm cúm", "flu or cold"],
          ["bệnh tiểu đường", "diabetes"],
          ["thuốc giảm đau", "painkiller"],
          ["viên ngậm trị viêm họng", "throat lozenges"],
          ["bị sốt", "have a fever"],
          ["bị ho", "have a cough"],
          ["bị nhức đầu", "have a headache"],
          ["bị nghẹt mũi", "have a stuffy nose"],
          ["bị đau họng", "have a sore throat"],
          ["bị đau bụng", "have a stomach ache"],
          ["cảm thấy lạnh", "have chills"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
