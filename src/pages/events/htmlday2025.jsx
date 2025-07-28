import { useEffect, useRef } from "react";
import { createPage } from "../../app";
import { EventSpecial } from "../../components/events/event-special";
import cub from "./htmlday2025/cub.txt";

const TITLE = "HTML Day 2025 - Sài Gòn";

export default function EventPage() {
  const xeMay = useRef();
  const xeMayX = useRef(0);
  const direction = useRef("right");

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
      console.log(xeMayX.current);
      xeMay.current.style.transform = `translate(${
        xeMayX.current - 25
      }%, 0) scale(${direction.current === "right" ? 1 : -1}, 1) translateX(${
        direction.current === "left" ? 250 : 0
      }px)`;
    }, 100);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
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
      duration={[2, "hour"]}
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
      <div className="q">What is this?</div>
      <div className="a">a yearly event where we write HTML together</div>
      <div className="q">What should I bring?</div>
      <div className="a">
        a charged computer, friends, good energy, and some basic html skills.
      </div>
      <div className="q">Where exactly?</div>
      <div className="a">
        it'll most likely rain, so a coffee shop in District 1 or an apartment
        :) specific location announced in instagram group. please RSVP.
      </div>
      <div className="q">I'm not in Sài Gòn, is there an event in my city?</div>
      <div className="a">
        check out the{" "}
        <a href="https://html.energy/events.html">html energy events page</a>.
        If your city isn't listed, feel free to organize your own!
      </div>
      <p>🛵🏙️🇻🇳</p>
    </EventSpecial>
  );
}

createPage(EventPage, {
  showPets: false,
  showNav: false,
  title: TITLE,
});
