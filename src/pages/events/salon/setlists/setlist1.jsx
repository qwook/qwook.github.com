import { TdWithPreview } from "../td";

export function Setlist1({ language = "en" }) {
  return (
    <table className="salon-table">
      <tr>
        <TdWithPreview
          preview={
            "A keyboard with more than 300 buttons, for every possible vowel."
          }
        >
          Keyboard with All Vietnamese Characters
        </TdWithPreview>
        <td>Quang-Anh</td>
      </tr>
      <tr>
        <TdWithPreview preview={<><a target="_blank" href="https://www.instagram.com/reels/DQSD1CaE6TY/">https://www.instagram.com/reels/DQSD1CaE6TY/</a></>}>
          Work in progess short film
        </TdWithPreview>
        <td>Nai</td>
      </tr>
      <tr>
        <TdWithPreview
          preview={
            language === "vn"
              ? "Một dự án triển lãm tương tác tái hiện lại quá trình xuống cấp của các công trình kiến trúc cũ tại Sài Gòn thông qua hành động nhấn của người xem. Tác phẩm gợi mở mối liên hệ giữa sinh hoạt thường nhật của con người và sự biến mất dần của các công trình mang giá trị lịch sử."
              : "An interactive installation that explores the decomposition of Saigon’s old architectural structures through the physical act of pressing. The work reflects on the relationship between everyday human actions and the gradual disappearance of historical urban forms."
          }
        >
          Architecture Interactive Installation
        </TdWithPreview>
        <td>_dmqqq_, nkann13 dn_baochau</td>
      </tr>
      <tr>
        <TdWithPreview
          preview={
            "Video game! While diving into fashion, do be aware of hanky thieves trying to steal your style!!!"
          }
        >
          Thrifting 101
        </TdWithPreview>
        <td>ciiverix, pandabeo04</td>
      </tr>
      <tr>
        <TdWithPreview preview={"A typing game with Vietnamese words."}>
          Telex of the Dead
        </TdWithPreview>
        <td>Henry Quoc Tran</td>
      </tr>
      <tr>
        <TdWithPreview
          preview={
            language === "vn" ? (
              <>
                Ái” trong tiếng Việt mang nghĩa là tình yêu — một sự gắn kết
                chân thành giữa hai con người, được tin rằng nối liền bởi sợi
                chỉ định mệnh trong văn hóa Á Đông. Sợi chỉ ấy vốn tượng trưng
                cho cảm xúc thuần khiết, cho sự kết nối khởi sinh từ nội tâm con
                người.
                <br />
                <br />
                Nhưng trong thế giới hiện đại hiện nay, sợi chỉ bị ô uế bởi
                những yếu tố bên ngoài như mạng xã hội, các hệ thống so sánh, và
                những nhận thức bề mặt. Liệu kết nối hiện đại có còn mang tính
                chân thật đến từ chính cảm xúc bên trong của mỗi con người?
              </>
            ) : (
              <>
                Ái” in Vietnamese means love — a sincere bond between two
                people, believed to be tied together by a thread of destiny
                within Sinosphere culture. Traditionally, this thread symbolizes
                authentic emotion, a connection born from inner truth.
                <br />
                <br />
                Yet in the modern world, that thread has become tainted by
                external forces: social media, distorted perceptions, and
                meaningless metrics. In an age shaped by algorithms and
                appearances, can modern connections still be genuinely rooted in
                our inner
              </>
            )
          }
        >
          VR/AR project on love.
        </TdWithPreview>
        <td>eve</td>
      </tr>
    </table>
  );
}
