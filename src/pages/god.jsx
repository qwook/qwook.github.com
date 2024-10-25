import "../components/god/God";
import { createPage } from "../app";
import "./god.scss";
import { useEffect, useRef, useState } from "react";
import { GetNextGodWord } from "../components/god/God";

function Pillar() {
  return <span className="pillar">|</span>;
}

const keynames = {
  32: "SPACE",
  13: "ENTER",
  37: "LEFT",
  38: "UP",
  39: "RIGHT",
  40: "DOWN",
  91: "CMD",
  92: "CMD",
  17: "CTRL",
  18: "ALT",
  16: "SHIFT",
};

function useFPS() {
  const [fps, setFPS] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const calculateFPS = (time) => {
      frameCount++;
      const delta = time - lastTime;

      if (delta >= 1000) {
        // Update FPS every second
        setFPS(Math.round((frameCount / delta) * 1000));
        frameCount = 0;
        lastTime = time;
      }

      requestAnimationFrame(calculateFPS);
    };

    const frameId = requestAnimationFrame(calculateFPS);

    return () => cancelAnimationFrame(frameId);
  }, []);

  return fps;
}

// Formats date in the same format as TempleOS.
function formatDate(date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = days[date.getDay()];

  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const dayOfMonth = date.getDate().toString().padStart(2, "0");

  let hours = date.getHours();
  const ampm = hours >= 12 ? "p" : "a";
  hours = hours % 12;
  hours = hours ? hours : 12; // convert 0 to 12
  hours = hours.toString().padStart(2, "0");

  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${day} ${month}/${dayOfMonth} ${hours}:${minutes}:${seconds}${ampm}`;
}

// Example usage:
// console.log(formatDate(new Date())); // "Wed 03/27 02:11:36a"

function TopBar() {
  const fps = useFPS();
  const [date, setDate] = useState(formatDate(new Date()));
  useEffect(() => {
    const interval = setInterval(() => {
      setDate(formatDate(new Date()));
    });
    return () => clearInterval(interval);
  }, []);

  const [lastKey, setLastKey] = useState("");

  useEffect(() => {
    const keyDownFn = (e) => {
      if (keynames[e.keyCode]) {
        setLastKey(keynames[e.keyCode]);
      }
    };

    document.addEventListener("keydown", keyDownFn);

    return () => {
      document.removeEventListener("keydown", keyDownFn);
    };
  });

  return (
    <div className="topbar">
      {date} FPS: {fps} <Pillar />
      <Pillar />
      <Pillar />
      <Pillar />
      <Pillar />
      <Pillar />
      <Pillar /> <span style={{ color: "yellow" }}>{lastKey}</span>
    </div>
  );
}

export default function GodPage() {
  const [log, setLog] = useState([
    "Terry Davis (1969-2018) was a programmer who spent more than a decade developing TempleOS. Terry was diagnosed with schizophrenia, and believed that he could talk to God through his OS.",
    "There were two ways to talk with God. The first being word-by-word generation. The second would be for God to talk through passages from books and the Bible.",
    "Here, I've ported the word-by-word generation, preserving most of the logic.",
    "The implementation uses the timestamp to pick out a word from a list of words. I've always felt connected to the logic that Terry uses here, because to Terry, the timestamp is a divine number. Numerologists believe that the sequence of PI is a divine number. I personally believe that reading an atomic probability field will output a divine number.",
  ]);
  const [text, setText] = useState("");
  const [generate, setGenerate] = useState(0);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (generate > 0) {
      setTimeout(() => {
        setGenerate((generate) => generate - 1);
        setLog((log) => {
          const logCopy = [...log];
          logCopy[logCopy.length - 1] += GetNextGodWord() + " ";
          return logCopy;
        });
      }, 50);
    } else {
      setGenerating(false);
    }
  }, [generate]);

  const logEle = useRef();
  const endEle = useRef();
  const input = useRef();

  useEffect(() => {
    endEle.current.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  useEffect(() => {
    const keyDownFn = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      // Check if the textbox is not focused
      if (document.activeElement !== input.current) {
        // If it's a printable character or special keys like backspace/delete
        if (e.key.length === 1 || e.key === "Backspace" || e.key === "Delete") {
          e.preventDefault();

          if (e.key.length === 1) {
            // Add the character to the input
            setText((text) => text + e.key);
          } else if (e.key === "Backspace") {
            // Handle backspace
            setText((text) => text.slice(0, -1));
          }

          // Focus the input and move cursor to end
          input.current.focus();
          const len = input.current.value.length;
          input.current.setSelectionRange(len, len);
        }
      }
    };

    document.addEventListener("keydown", keyDownFn);

    return () => {
      document.removeEventListener("keydown", keyDownFn);
    };
  });

  return (
    <div className="god">
      <TopBar />
      <div ref={logEle} className="log">
        {log.map((entry, idx) => {
          return (
            <div className="entry">
              {entry}
              {idx === log.length - 1 && generating ? (
                <span className="carot"></span>
              ) : null}
            </div>
          );
        })}
        <span ref={endEle}></span>
      </div>
      <form
        style={{ position: "relative" }}
        onSubmit={(e) => {
          if (!text || generating) return e.preventDefault();
          log.push(text);
          log.push("");
          setText("");
          setGenerate(Math.random() * 20 + 9);
          setGenerating(true);
          e.preventDefault();
        }}
      >
        {!generating && !text && (
          <span
            className="carot"
            style={{
              position: "absolute",
              top: 6,
              left: -2,
            }}
          ></span>
        )}
        <input
          ref={input}
          autoFocus
          type="text"
          placeholder="Message God"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </form>
    </div>
  );
}
// GetNextGodWord

createPage(GodPage, { showPets: false });
