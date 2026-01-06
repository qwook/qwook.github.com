import { useEffect, useRef, useState } from "react";
import { createPage } from "../../../app";
import { EventSpecial } from "../../../components/events/event-special";
import { headTags } from "../../../utils/headTags";
import "./salon.scss";

headTags({
  title: "HTML Day 2025 - Sài Gòn",
  description: "a day of HTML freewrite",
});

const TITLE = "HTML Day 2025 - Sài Gòn";

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
            href="https://forms.gle/31JmpEmPM9DykuJU6"
            target="_blank"
          >
            RSVP
          </a>
          <br />
          <br />
          {language === "vn" ? (
            <>
              <div className="q">Ngày hội HTML là gì?</div>
              <div className="a">
                Là một sự kiện/meet up hàng năm, tụi mình sẽ hội tụ và sử dụng
                HTML cùng nhau
              </div>
              <div className="q">Mình cần chuẩn bị gì?</div>
              <div className="a">
                Bạn chỉ cần mang laptop (sạc đủ pin), rủ thêm bạn bè, good
                energy và một ít kiến thức cơ bản về html (cứ thoải mái hỏi han
                nếu bạn gặp vấn đề nhé!)
              </div>
              <div className="q">Tụi mình sẽ gặp nhau ở đâu?</div>
              <div className="a">
                Vì thời tiết gần đây hơi bất ổn nên tụi mình sẽ tụ họp tại một
                quán cà phê ở Quận 1, hoặc tại một chung cư? Bạn hãy đăng ký qua
                link Google Forms và tụi mình sẽ add vô một group Instagram rồi
                cập nhật địa chỉ sau nhé!
              </div>
              <div className="q">
                Mình không ở Sài Gòn, liệu mình có thể tham gia được không?
              </div>
              <div className="a">
                Bạn coi thử website của{" "}
                <a href="https://html.energy/events.html">HTML Energy</a> nhé.
                Nếu ko có sự kiện tại nơi bạn đang sinh sống thì bạn có thể tự
                host hoặc tổ chức!
              </div>
            </>
          ) : (
            <>
              <div className="q">What is this?</div>
              <div className="a">
                A casual show and tell of cool technological creative work in
                trung tâm Sài Gòn. Software + Hardware + Art + Play!
              </div>
              <div className="q">Can I demo?</div>
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
