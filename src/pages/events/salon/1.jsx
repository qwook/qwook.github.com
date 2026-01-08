import { useEffect, useRef, useState } from "react";
import { createPage } from "../../../app";
import { EventSpecial } from "../../../components/events/event-special";
import { headTags } from "../../../utils/headTags";
import "./salon.scss";
import { TdWithPreview } from "./td";

headTags({
  title: "show&telex - 25/1/2026",
  description: "show and tell in sài gòn",
});

const TITLE = "show&telex - 25/1/2026";

export default function EventPage() {
  const [language, setLanguage] = useState("vn");

  return (
    <>
      <div>
        <EventSpecial
          title={TITLE}
          titleHtml={<>show&telex 1</>}
          start="January 25, 2026 3:30 PM"
          duration={[3, "hour"]}
          hosts={[
            {
              name: "Henry",
              url: "https://instagram.com/nohurryhen",
            },
            {
              name: "Spencer",
              url: "https://instagram.com/iamtheangrysons",
            },
            {
              name: "Quang-Anh",
              url: "https://instagram.com/boltself",
            },
            {
              name: "Jay",
              url: "https://instagram.com/eggreligion",
            },
          ]}
          location={{
            address: "Quận 1 (Chưa Biết / TBD)",
          }}
          language={language}
          setLanguage={setLanguage}
        >
          <a
            className="RSVP"
            href="https://docs.google.com/forms/d/e/1FAIpQLScdiy1DxcoGCXPqzHL2BF1rMOW6G-gX_uZbBX8icvLcpykTPQ/viewform"
            target="_blank"
          >
            {language === "vn" ? "Đăng Kí" : "RSVP"}
          </a>
          <br />
          <br />
          {language === "vn" ? (
            <>
              <div className="q">Cái gì đây?</div>
              <div className="a">
                Một buổi{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Salon_(gathering)"
                  target="_blank"
                >
                  salon
                </a>{" "}
                (gặp mặt) nơi mọi người giới thiệu, thử nghiệm và học hỏi về
                những dự án công nghệ sáng tạo ở khu vực trung tâm Sài Gòn. Phần
                Mềm + Phần Cứng + Nghệ Thuật + Vui Chơi!{" "}
                <a href="/events/salon/">Xem tất cả salon trước đây!</a>
              </div>
              <div className="q">Có ai?</div>
              <div className="a">
                <table className="salon-table">
                  <tr>
                    <TdWithPreview
                      preview={
                        "A keyboard with more than 300 buttons, for every possible vowel."
                      }
                    >
                      Bàn Phím
                    </TdWithPreview>
                    <td>Quang-Anh</td>
                  </tr>
                  <tr>
                    <TdWithPreview
                      preview={"A typing game with Vietnamese words."}
                    >
                      Telex of the Dead
                    </TdWithPreview>
                    <td>Henry Quoc Tran</td>
                  </tr>
                  <tr>
                    <TdWithPreview>??? ?? ??? ??</TdWithPreview>
                    <td>??? ?????</td>
                  </tr>
                  <tr>
                    <TdWithPreview>???????? ??? ????</TdWithPreview>
                    <td>????? ???</td>
                  </tr>
                </table>
              </div>
              <div className="q">Sao mình trình bày được?</div>
              <div className="a">
                Nhấn tin cho một host để giới thiệu dụ án của mình.
              </div>
              <div className="q">Lịch trình như thế nào?</div>
              <div className="a">
                <ul>
                  <li>15hr30 - Mở Của</li>
                  <li>16hr00 - Presentations</li>
                  <li>17hr00 - Hangout</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="q">What is this?</div>
              <div className="a">
                A casual{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Salon_(gathering)"
                  target="_blank"
                >
                  salon
                </a>{" "}
                where we present, demo, or educate about cool technological
                creative work in trung tâm Sài Gòn. Software + Hardware + Art +
                Play!{" "}
                <a href="/events/salon/">Check out our previous salons!</a>
              </div>
              <div className="q">Who's show and telling?</div>
              <div className="a">
                <table className="salon-table">
                  <tr>
                    <TdWithPreview
                      preview={
                        "A keyboard with more than 300 buttons, for every possible vowel."
                      }
                    >
                      Bàn Phím
                    </TdWithPreview>
                    <td>Quang-Anh</td>
                  </tr>
                  <tr>
                    <TdWithPreview
                      preview={"A typing game with Vietnamese words."}
                    >
                      Telex of the Dead
                    </TdWithPreview>
                    <td>Henry Quoc Tran</td>
                  </tr>
                  <tr>
                    <TdWithPreview>??? ?? ??? ??</TdWithPreview>
                    <td>??? ?????</td>
                  </tr>
                  <tr>
                    <TdWithPreview>???????? ??? ????</TdWithPreview>
                    <td>????? ???</td>
                  </tr>
                </table>
              </div>
              <div className="q">Can I show and tell?</div>
              <div className="a">Reach out to one of us with your project.</div>
              <div className="q">What's the schedule?</div>
              <div className="a">
                <ul>
                  <li>15hr30 - Doors Open</li>
                  <li>16hr00 - Presentations</li>
                  <li>17hr00 - Hangout</li>
                </ul>
              </div>
            </>
          )}
        </EventSpecial>
      </div>
    </>
  );
}

createPage(EventPage, {
  showPets: false,
  showNav: false,
  title: TITLE,
});
