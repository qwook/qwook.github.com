import { useEffect, useRef, useState } from "react";

import { EventSpecial } from "../event-special";
import cub from "./cub.txt?raw";

import "./style.css";
import Meta from "@/common/layout/Meta";
import Layout from "@/common/layout/Layout";
import metadata from "./metadata.png";
import file from "./file.gif";

// This page nests <div>s inside <p>s, which the browser's HTML parser
// rearranges, so its server-rendered markup can't be hydrated. It's still
// served pre-rendered, then rendered fresh in the browser.
export const hydrate = false;

export function Head() {
  return (
    <Meta
      title={"HTML Day 2025 - Sài Gòn"}
      description={"a day of HTML freewrite"}
      image={metadata}
    />
  );
}

const TITLE = "HTML Day 2025 - Sài Gòn";

function EventPage() {
  const xeMay = useRef();
  const xeMayX = useRef(0);
  const direction = useRef("right");
  const [language, setLanguage] = useState("vn");

  const [anim, setAnim] = useState([]);

  const symbols = `|/-*-\\|/-\\|/-#-\\|/-\\|/-\\|/-\\|/-\\yad lmth/-\\|/-\\`;
  const symbol = useRef(0);
  const height = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (direction.current === "right") {
        xeMayX.current += 3;
        if (xeMayX.current > 100) {
          direction.current = "left";
        }
      } else {
        xeMayX.current -= 3;
        if (xeMayX.current < 0) {
          direction.current = "right";
        }
      }
      xeMay.current.style.transform = `translate(${
        xeMayX.current - 25
      }%, 0) scale(${direction.current === "right" ? 1 : -1}, 1) translateX(${
        direction.current === "left" ? 250 : 0
      }px)`;

      setAnim((anim) => {
        const copy = [...anim];
        copy.splice(
          0,
          0,
          new Array(Math.floor((Math.sin(height.current / 3) + 1.8) * 3)).join(
            symbols[symbol.current]
          )
        );
        if (copy.length > 9) {
          copy.splice(9, 1);
        }
        return copy;
      });

      height.current += 1;
      symbol.current = (symbol.current + 1) % symbols.length;
    }, 100);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="archive">
        <div className="archive-body">
          Thanks so much for attending! Here is an archive of the websites that
          were created:
          <br />
          <br />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              "~monicachauhuynh",
              "~hatrangtraan",
              "~mikeyokei",
              "~nohurryhen",
              "~___duc_hai",
              "~rabi",
              "~scarlett",
              "~tiff_nguyennn",
              "~viveevyviev",
              "~la",
            ].map((url, idx) => {
              return (
                <div className="row" key={url}>
                  <div
                    className="icon"
                    style={{
                      width: 14,
                      height: 16,
                      flex: "0 0 14px",
                      backgroundImage: `url(${file})`,
                    }}
                  />
                  <div>
                    <a
                      href={"/events/htmlday2025/" + url + "/"}
                      target="_blank"
                      style={{}}
                    >
                      {url}
                    </a>
                  </div>
                  <div className="dots" style={{ flexGrow: 1 }}></div>
                  <div>{anim[idx]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="archive-under">
        <EventSpecial
          title={TITLE}
          titleHtml={
            <>
              HTML Day 2025
              <br />
              Sài Gòn
            </>
          }
          start="August 2, 2025 1:30 PM"
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
          <pre ref={xeMay} className="cub" style={{ width: 640, fontSize: 12 }}>
            {cub}
          </pre>
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
                a yearly event where we write HTML together
              </div>
              <div className="q">What should I bring?</div>
              <div className="a">
                a charged computer, friends, good energy, and some basic html
                skills.
              </div>
              <div className="q">Where exactly?</div>
              <div className="a">
                it'll most likely rain, so a coffee shop in District 1 or an
                apartment :) specific location announced in instagram group.
                please RSVP.
              </div>
              <div className="q">
                I'm not in Sài Gòn, is there an event in my city?
              </div>
              <div className="a">
                check out the{" "}
                <a href="https://html.energy/events.html">
                  html energy events page
                </a>
                . If your city isn't listed, feel free to organize your own!
              </div>
            </>
          )}
          <p>🛵🏙️🇻🇳</p>
        </EventSpecial>
      </div>
    </>
  );
}

export default function Root() {
  return (
    <Layout showNav={false}>
      <EventPage />
    </Layout>
  );
}
