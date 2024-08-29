import useInterval from "../../hooks/useInterval";
import { useState } from "react";

const fonts = ["cursive", "monospace", "sans-serif", "serif"];
export default function WebRing({ image, text, font, link }) {
  const [rand, setRand] = useState(() => Math.random());
  useInterval(() => {
    setRand(Math.random());
  }, 1000);
  return (
    <a
      className="web-ring"
      href={link}
      target="_blank"
      style={{
        ...(image && { backgroundImage: `url(${image})` }),
        backgroundSize: `${rand * 5}px ${rand * 5}px`,
      }}
    >
      {image && (
        <img
          className="pixel"
          src={image}
          alt="favicon"
          style={{
            animationDelay: `${rand * -10000}s`,
          }}
        />
      )}
      <span
        className="filler"
        style={{
          fontFamily: "monospace",
          fontSize: "26",
        }}
      >
        {text}
        <span
          className="floating"
          style={{
            fontFamily: fonts[Math.floor(rand * fonts.length) % fonts.length],
            fontSize: "22px",
          }}
        >
          {text}
        </span>
      </span>
    </a>
  );
}
