import { createPage } from "../../app";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as _ from "lodash";

function FlashCardDeck({ list }) {
  const [flashCardsLeft, setFlashCardsLeft] = useState(() => list);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setFlashCardsLeft(_.shuffle(list));
  }, [list]);

  const nextCard = useCallback(() => {
    setShowAnswer((showAnswer) => !showAnswer);
    if (showAnswer) {
      setFlashCardsLeft((flashCardsLeft) => {
        if (flashCardsLeft.length === 1) {
          return _.shuffle(list);
        } else {
          return flashCardsLeft.slice(1);
        }
      });
    }
  }, [showAnswer]);

  useEffect(() => {
    const onSpace = (e) => {
      if (e.keyCode === 32) {
        nextCard();
      }
    };
    document.addEventListener("keypress", onSpace);

    return () => document.removeEventListener("keypress", onSpace);
  }, [nextCard]);

  return (
    <>
      <div>
        {!showAnswer ? (
          <>
            <h4>Question</h4>
            <h1>{flashCardsLeft[0][0]}</h1>
          </>
        ) : (
          <>
            <h4>Answer</h4>
            <h1>{flashCardsLeft[0][1]}</h1>
          </>
        )}
      </div>
    </>
  );
}

export default function ZinePage() {
  return (
    <div>
      <FlashCardDeck
        name=""
        list={[
          ["Định cư", "settlement"],
          ["Công nghệ thông tin", "IT"],
          ["Tùm lum tùm la", "mix together"],
          ["Chú trọng/tập trung", "focus on"],
          ["Khá", "good"],
          [
            "Hệ điều hành là người Việt Nam",
            "The operating system is Vietnamese",
          ],
          ["phổ biến", "Popular"],
          ["Hòa lẫn", "mix"],
          ["Cảm nhận hương vị rõ hơn", "feel clearly taste"],
          ["Bị đau họng", "have sore throat"],
          ["Anh là người ăn tạp", "You can eat everything"],
          ["Anh là người hảo ăn", "You can eat a lot"],
          ["Ý nghĩa", "meaningful"],
          ["Em đang cố gắng làm việc / Em đang cố gắng cày", "I'm trying to work."],
          ["Tốt nghiệp đại học", "graduated from the university"],
          ["Không ổn định", "not stable"],
          ["Phần mềm", "software"],
          ["Ứng dụng", "application"],
          ["Năm rồi", "last year"],
          ["Năm sau", "next year"],
          ["Bạn trai", "boyfriend"],
          ["Bạn gái", "girlfriend"],
          ["Bồ", "girlfriend/boyfriend"],
          ["Hươu cao cổ", "giraffe"],
          ["Hoa sen", "lotus"],
          ["Biểu tượng", "symbol"],
          ["Cổ kính", "ancient"],
          ["Cung điện", "palace"],
          ["Nguồn gốc", "origin"],
          ["Du học", "study abroad"],
          ["Mẹ em lớn hơn mẹ chị ấy", "My mom is older than her mom"],
          [
            "Mặc dù chị ấy lớn tuổi hơn em nhưng gọi em bằng chị",
            "Although she is older than me, she calls me 'older sister'",
          ],
          ["Thạc sĩ", "masters"],
          ["Tiến sĩ", "doctorate"],
          ["SAO CHÉP", "COPY"],
          ["xác sống", "Zombie"],
          ["Kết hôn", "marriage"],
          ["Khác múi giờ", "different time zone"],
          ["Yên bình", "peaceful"],
          [
            "Cô ấy luôn ủng hộ những gì anh làm",
            "She always supports what you do",
          ],
          ["Anh có công ty riêng ở Mỹ", "You have your own company in the USA"],
          ["Thân thiện", "friendly"],
          ["Xúc động", "emotion"],
          ["chơi trò chơi điện tử", "Play video game"],
          ["Đã", "great"],
          ["Nước thanh hơn và ngọt hơn", "Water is clearer and sweeter"],
          ["Cuộc đời", "life"],
        ]}
      />
    </div>
  );
}

createPage(ZinePage, { showPets: false, showNav: false });