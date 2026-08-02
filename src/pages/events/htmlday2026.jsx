import { Suspense, use, useEffect, useMemo, useRef, useState } from "react";
import { createPage } from "../../app";
import { EventSpecial } from "../../components/events/event-special";
import cub from "./htmlday2025/cub.txt";
import { headTags } from "../../utils/headTags";
import "./htmlday2026/style.scss";

headTags({
  title: "HTML Day 2026 - Sài Gòn",
  description: "a day of HTML freewrite",
  image: require("./htmlday2026/metadata.png"),
});

const TITLE = "HTML Day 2026 - Sài Gòn";

`❀
 m
ε*з
 ω
(つω｡)`;

const POT = `
===============
 "|8◦8◦8◦8◦8|"
  \\_________/
`;

const participantsFetch = (async () => {
  const response = await fetch(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRckA5hmW5HczSwZV7EqD8YSQ1XTxn0oVB3KSOwiPKGN21l05pZEkm9bWn1CeAISyGfgsKv-K2lNOqZ/pub?gid=1315090448&single=true&output=csv",
  );
  const csv = await response.text();
  return csv;
})();

function Flowers() {
  const xeMay = useRef();
  const xeMayX = useRef(0);
  const direction = useRef("right");

  const [anim, setAnim] = useState([]);

  const symbols = `|/-*-\\|/-\\|/-#-\\|/-\\|/-\\|/-\\|/-\\yad lmth/-\\|/-\\`;
  const symbol = useRef(0);
  const height = useRef(0);

  const nodes = useRef([]);
  const flowers = useRef([]);

  const [matrix, setMatrix] = useState(() => {
    const matrix = [];
    for (let y = 0; y < 30; y++) {
      const row = [];
      for (let x = 0; x < 50; x++) {
        row.push(" ");
      }
      matrix.push(row);
    }
    return matrix;
  });

  const setValueAtPosition = (x, y, value) => {
    if (x < 0 || y < 0 || y >= matrix.length || x >= matrix[y].length) return;
    setMatrix((matrix) => {
      const copy = [...matrix];
      copy[y][x] = value;
      return copy;
    });
  };

  const drawAsciiAtOffset = (x, y, ascii) => {
    const lines = ascii.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (let j = 0; j < line.length; j++) {
        setMatrix((matrix) => {
          const copy = [...matrix];
          if (
            y + i < 0 ||
            y + i >= copy.length ||
            x + j < 0 ||
            x + j >= copy[y + i].length
          ) {
            return copy;
          }
          copy[y + i][x + j] = line[j];
          return copy;
        });
      }
    }
  };

  useEffect(() => {
    drawAsciiAtOffset(18, 26, POT);
    nodes.current.push({
      x: 25,
      y: 26,
      life: 100,
      lastDir: "None",
      root: true,
    });
  }, []);

  const dyingLife = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let updated = false;
      for (let node of nodes.current) {
        if (node.life > 0) {
          updated = true;
          node.life--;

          if (node.y < 5) {
            node.life = 0;
          }

          let possible = [];
          if (node.lastDir === "None") {
            possible.push("North");
          } else {
            possible.push("NorthWest");
            possible.push("NorthEast");
          }
          if (node.lastDir === "NorthWest" || node.lastDir == "West") {
            // Lol.. making more chances that we have horizontal movement.
            possible.push("West");
            possible.push("West");
            possible.push("West");
            possible.push("West");
            possible.push("West");
            possible.push("West");
            possible.push("West");
            possible.push("West");
            if (!node.root) {
              for (let i = 0; i < 10; i++) {
                possible.push("West");
              }
            }
            possible.push("NorthWest");
          }
          if (node.lastDir === "NorthEast" || node.lastDir === "East") {
            possible.push("East");
            possible.push("East");
            possible.push("East");
            possible.push("East");
            possible.push("East");
            possible.push("East");
            possible.push("East");
            possible.push("East");
            if (!node.root) {
              for (let i = 0; i < 10; i++) {
                possible.push("East");
              }
            }
            possible.push("NorthEast");
          }
          if (node.x > 40) {
            possible = possible.filter(
              (value) => value !== "East" && value !== "NorthEast",
            );
          }
          if (node.x < 10) {
            possible = possible.filter(
              (value) => value !== "West" && value !== "NorthWest",
            );
          }
          const direction =
            possible[Math.floor(Math.random() * possible.length)];
          node.lastDir = direction;
          if (direction === "North") {
            // Up
            drawAsciiAtOffset(node.x, node.y, "|");
            node.y--;
          }
          if (direction === "NorthWest") {
            // NorthWest
            drawAsciiAtOffset(node.x, node.y, "\\");
            node.x--;
            node.y--;
          }
          if (direction === "NorthEast") {
            // NorthEast
            drawAsciiAtOffset(node.x, node.y, "/");
            node.x++;
            node.y--;
          }
          if (direction === "East") {
            drawAsciiAtOffset(node.x, node.y, "-");
            node.x++;
          }
          if (direction === "West") {
            // NorthEast
            drawAsciiAtOffset(node.x, node.y, "-");
            node.x--;
          }
          if (node.life > 5 && Math.random() > 0.9 && node.root) {
            nodes.current.push({
              x: node.x,
              y: node.y,
              lastDir: Math.random() > 0.5 ? "East" : "West",
              life: 15,
            });
          }
          if (node.life % 3 === 0 && !node.root) {
            flowers.current.push({
              x: node.x,
              y: node.y,
              life: 50,
            });
          }
        }
      }
      for (let flower of flowers.current) {
        if (flower.life > 0) {
          updated = true;
        }
        if (flower.life === 30) {
          setValueAtPosition(
            flower.x,
            flower.y,
            <span style={{ color: "limegreen" }}>*</span>,
          );
        }
        if (flower.life === 20) {
          setValueAtPosition(
            flower.x,
            flower.y + 1,
            <span style={{ color: "yellow" }}>ω</span>,
          );
        }
        if (flower.life === 15) {
          setValueAtPosition(
            flower.x,
            flower.y - 1,
            <span style={{ color: "yellow" }}>m</span>,
          );
        }
        if (flower.life === 10) {
          setValueAtPosition(
            flower.x - 1,
            flower.y,
            <span style={{ color: "yellow" }}>ε</span>,
          );
        }
        if (flower.life === 5) {
          setValueAtPosition(
            flower.x + 1,
            flower.y,
            <span style={{ color: "yellow" }}>з</span>,
          );
        }
        flower.life--;
      }
      if (!updated) {
        let flowerUpdated = false;
        dyingLife.current++;
        if (dyingLife.current > 25) {
          for (let i = 0; i < 50; i++) {
            setValueAtPosition(i, Math.max(0, dyingLife.current - 25), " ");
          }
        }
        for (let flower of flowers.current) {
          if (flower.y <= 30) {
            flowerUpdated = true;
          }
        }
        if (dyingLife.current % 2 === 0)
          for (let flower of flowers.current) {
            setValueAtPosition(flower.x, flower.y - 1, " ");
            setValueAtPosition(flower.x - 1, flower.y - 1, " ");
            setValueAtPosition(flower.x + 1, flower.y - 1, " ");
            flower.y++;
            setValueAtPosition(
              flower.x,
              flower.y,
              <span style={{ color: "limegreen" }}>*</span>,
            );
            setValueAtPosition(
              flower.x,
              flower.y + 1,
              <span style={{ color: "yellow" }}>ω</span>,
            );
            setValueAtPosition(
              flower.x,
              flower.y - 1,
              <span style={{ color: "yellow" }}>m</span>,
            );
            setValueAtPosition(
              flower.x - 1,
              flower.y,
              <span style={{ color: "yellow" }}>ε</span>,
            );
            setValueAtPosition(
              flower.x + 1,
              flower.y,
              <span style={{ color: "yellow" }}>з</span>,
            );
          }
        drawAsciiAtOffset(18, 26, POT);
        if (!flowerUpdated) {
          dyingLife.current = 0;
          flowers.current = [];
          nodes.current = [];
          nodes.current.push({
            x: 25,
            y: 26,
            life: 100,
            lastDir: "None",
            root: true,
          });
        }
      } else {
        dyingLife.current = 0;
      }
    }, 50);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <pre ref={xeMay} className="cub" style={{ width: 640, fontSize: 12 }}>
      {matrix.map((row, idx) => {
        return (
          <span key={idx}>
            {row.map((cell, idx2) => {
              return <span key={idx2}>{cell || " "}</span>;
            })}
            {"\n"}
          </span>
        );
      })}
    </pre>
  );
}

function Character({ name }) {
  const root = useRef();
  const avatar = useRef();
  const action = useRef("move-right");
  const facing = useRef("left");
  const position = useRef({ x: Math.random() * 100, y: 0 });
  const velocity = useRef(0);

  useEffect(() => {
    let timeOut;
    const queue = () => {
      timeOut = setTimeout(timeOutFn, Math.random() * 500);
    };
    const timeOutFn = () => {
      const actions = ["move-right", "move-left", "jump"];
      action.current = actions[Math.floor(Math.random() * actions.length)];
      queue();
    };
    queue();

    return () => {
      clearTimeout(timeOut);
    };
  });

  const lastTime = useRef(Date.now() / 1000);
  useEffect(() => {
    let frame;
    const fn = () => {
      const now = Date.now() / 1000;
      const deltaTime = now - lastTime.current;
      lastTime.current = now;

      if (action.current === "move-right") {
        position.current.x += deltaTime * 20;
        facing.current = "right";
      } else if (action.current === "move-left") {
        position.current.x -= deltaTime * 20;
        facing.current = "left";
      } else if (action.current === "jump") {
        if (position.current.y === 0) {
          position.current.y = 1;
          velocity.current = 50 + 200 * Math.random();
        }
      }

      if (position.current.x < 0) {
        position.current.x = 0;
      }
      if (position.current.x > 80) {
        position.current.x = 80;
      }
      if (position.current.y <= 0) {
        position.current.y = 0;
        velocity.current = 0;
      } else {
        position.current.y += velocity.current * deltaTime;
        if (position.current.y > 100) {
          position.current.y = 100;
        }
        velocity.current -= deltaTime * 500;
      }

      if (facing.current === "left") {
        avatar.current.style.transform = "scaleX(-100%)";
      } else {
        avatar.current.style.transform = "scaleX(100%)";
      }

      root.current.style.left = position.current.x + "%";
      root.current.style.top = -position.current.y + "px";

      frame = requestAnimationFrame(fn);
    };
    frame = requestAnimationFrame(fn);

    return () => {
      cancelAnimationFrame(frame);
    };
  });

  return (
    <div
      ref={root}
      style={{
        position: "relative",
        top: position.x + "%",
        left: -position.y + "px",
      }}
    >
      <div
        ref={avatar}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 150,
          width: 150,
          backgroundOrigin: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${require("./htmlday2026/char1.png")})`,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          height: 100,
          width: 150,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(0,0,0,0.8)",
            color: "white",
            fontFamily: "arial",
            padding: "0px 5px",
            borderRadius: 4,
            outline: "1px solid rgb(185, 185, 185)",
            boxShadow: "0 0 5px 2px black",
            maxWidth: 100,
            fontSize: 14,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </div>
      </div>
    </div>
  );
}

function MapleStory() {
  const participantsCsv = use(participantsFetch);
  const participants = useMemo(
    () => participantsCsv.split("\n").filter((name) => name && name !== ""),
    [participantsCsv],
  );

  return (
    <Suspense>
      <div
        style={{
          pointerEvents: "none",
          position: "fixed",
          bottom: "0",
          left: "0",
          right: "0",
          height: "150px",
        }}
      >
        {participants.map((name, idx) => {
          return <Character key={idx} name={name} />;
        })}
      </div>
    </Suspense>
  );
}

export default function EventPage() {
  const [language, setLanguage] = useState("vn");

  return (
    <>
      <div className="archive-under">
        <EventSpecial
          title={TITLE}
          titleHtml={
            <>
              HTML Day 2026
              <br />
              Sài Gòn
            </>
          }
          start="August 8, 2026 1:00 PM"
          duration={[3, "hour"]}
          hosts={[
            {
              name: "Tàu Hủ Ky Collective",
              url: "https://www.instagram.com/tauhuky.hotpot/",
            },
          ]}
          location={{
            address: "Bình Thạnh(Chưa Biết / TBD)",
          }}
          language={language}
          setLanguage={setLanguage}
        >
          <a
            className="RSVP"
            href="https://docs.google.com/forms/d/e/1FAIpQLScdiy1DxcoGCXPqzHL2BF1rMOW6G-gX_uZbBX8icvLcpykTPQ/viewform?usp=header"
            target="_blank"
          >
            {language === "vn" ? "ĐĂNG KÝ" : "REGISTER"}
          </a>
          <br />
          <br />
          <Flowers />
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
                apartment :) specific location announced in email. please RSVP.
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
        <MapleStory />
      </div>
    </>
  );
}

createPage(EventPage, {
  showPets: false,
  showNav: false,
  title: TITLE,
});
