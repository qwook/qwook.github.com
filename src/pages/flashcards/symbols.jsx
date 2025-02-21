import { createPage } from "../../app";
import * as _ from "lodash";
import { FlashCardDeck } from "../../components/flashcards/FlashCardDeck";

export default function Page() {
  return (
    <div>
      <h1>Math and Address Symbols</h1>
      <FlashCardDeck
        name=""
        list={[
          ["Một triệu năm trăm nghìn đồng", "1.500.000 VND"],
          [
            "Không chín không gạch ngang một hai ba gạch ngang bốn năm sáu bảy",
            "090-123-4567",
          ],
          [
            "Một phần hai cộng một phần ba bằng năm phần sáu",
            "1/2 + 1/3 = 5/6",
          ],
          ["Mười hai xuyệt ba Nguyễn Văn Trỗi", "12/3 Nguyễn Văn Trỗi"],
          ["Phường hai, Quận ba, Thành phố Hồ Chí Minh", "P. 2, Q. 3, TP. HCM"],
          [
            'H T T P S (hai chấm) xuyệt xuyệt example chấm com xuyệt login (Usually the ":" is left out in speech)',
            "https://example.com/login",
          ],
          ["A B C a còng example chấm com", "abc@example.com"],
          ["Mười giờ rưỡi sáng", "10:30 AM"],
          ["Tổng cộng: năm trăm ngàn đồng", "Tổng cộng: 500.000 VND"],
          ["Mật khẩu: A B C D gạch dưới một hai ba bốn", "Mật khẩu: abcd_1234"],
          ["A còng username", "@username"],
          ["Dấu thăng ẩm thực", "#ẩmthực"],
          ["Năm nhân ba bằng mười lăm", "5 * 3 = 15"],
          ["Tám trừ ba bằng năm", "8 - 3 = 5"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
