import "./WordBackground.css";

import { useEffect, useRef, useState } from "react";

let id = 0;

const sentences = [
  "who is my digital self?",
  "who is my irl self?",
  "are they any different?",
  "where does community driven content go when the community dies",
  "virtual reality promised eternity but we know now that even bits decay",
  "what happens to the online neighborhoods that we never took a screenshot of?",
  "what happens to our content when we die?",
  "what do i look like online?",
  "last seen online: 53812 days ago",
  "number of players online: 0",
  "does my feed reflect myself?",
  "is the algorithm an extension of myself?",
  "Download Macromedia Flash Player to See This Content",
  "This website is only supported on Netscape Navigator 4.0 or higher.",
  "Created using Microsoft Frontpage 2000.",
  "Flash Is No Longer Supported.",
  "This website is best viewed in Internet Explorer 6.",
  "Failed to load resource: net::ERR_CONNECTION_REFUSED",
  "404 Not Found",
  "Email daemon: This email address does not exist.",
  "If you do not log in within 30 days, your account will be deleted.",
  "We're sorry, we can not recover your account because you did not provide security questions.",
  "This program is not supported by your operating system. Upgrade to Windows XP to use this.",
];

export function WordBackground() {
  const [spawnedSentences, setSpawnedSentences] = useState<
    { id: number; sentence: string; y: number; scale: number }[]
  >([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpawnedSentences((spawnedSentences) => {
        return spawnedSentences
          .concat([
            {
              sentence: sentences[Math.floor(id) % sentences.length],
              id: ++id,
              y: Math.floor(Math.random() * 20),
              scale: Math.random() * 0.5 + 1,
            },
          ])
          .slice(-10);
      });
    }, 1500);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        display: "block",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        opacity: 0.5,
        zIndex: -1,
        background: "black",
      }}
    >
      {spawnedSentences.map((spawnedSentence) => (
        <div
          className="spawnedWord"
          style={{
            top: `${spawnedSentence.y * 5}%`,
            transform: `scale(${spawnedSentence.scale})`,
          }}
          key={spawnedSentence.id}
        >
          {spawnedSentence.sentence}
        </div>
      ))}
      {/* {wordState.map((word) => (
        <div
          style={{
            display: "inline-block",
            position: "absolute",
            width: "200%",
            top: `${word.y}%`,
            left: `${word.x}%`,
            color: "white",
            fontSize: "2em",
            fontFamily: "sans-serif",
            fontWeight: "bold",
            textShadow: "0px 0px 10px black",
            transition: word.teleport ? "all 0s" : "all 1s",
          }}
        >
          {word.sentence}{" "}
        </div>
      ))} */}
    </div>
  );
}
