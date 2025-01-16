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
          ["vào dịp tết", "day of Lunar New Years"],
          ["ngày tết", "day of Lunar New Years"],
          ["họ hàng", "relative"],
          ["Mạnh khoẻ", "Strong health"],
          ["Nhiều sức khoẻ", "Lots of strength / health"],
          ["xinh đẹp", "beautiful (girl)"],
          ["luôn", "always"],
          ["lớn lên xinh đẹp", "grow up beautiful"],
          ["đẹp lão", "beautiful (age)"],
          ["trong cuộc sống", "in your life"],
          ["trăm năm hạnh phúc", "100 years of happiness (married)"],
          ["nghe lời ba mẹ", "listen to your parents"],
          ["vâng lời ba mẹ", "listen to your parents"],
          ["ăn mau chóng lớn", "eat fast, fast growth"],
          ["phát tài", "wealth"],
          ["học giỏi", "study well"],
          ["sống lâu trăm tuổi", "live a long life / to a hundred"],
          ["hạnh phúc", "happiness"],
          ["thành công trong công việc", "successful in your work"],
          ["dì", "aunt on mom's side"],
          ["cô", "aunt on dad's side"],
          ["cậu", "uncle on mom's side"],
          ["chú", "uncle on dad's side"],
          ["cháu", "kids of cousins"],
          ["lịch dương", "solar calendar"],
          ["lịch âm", "lunar calendar"],
          ["mùng", "day (in lunar calendar)"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
