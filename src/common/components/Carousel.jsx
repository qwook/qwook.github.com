import { useRef, useState } from "react";

import useInterval from "../hooks/useInterval";

export default function Carousel({ children }) {
  const [idx, setIdx] = useState(0);
  const lastInteraction = useRef(0);

  if (!children.length) {
    return <div className="carousel">{children}</div>;
  }

  useInterval(
    () => {
      if (Date.now() - lastInteraction.current > 3000) {
        setIdx((idx) => (idx - 1 + children.length) % children.length);
      }
    },
    3000,
    [setIdx]
  );

  return (
    <div className="carousel">
      <div>{children[idx % children.length]}</div>
      <div
        style={{
          display: "flex",
          gap: 30,
          justifyContent: "center",
        }}
      >
        <div
          className="fake-link"
          onClick={(e) => {
            setIdx((idx) => (idx - 1 + children.length) % children.length);
            lastInteraction.current = Date.now();
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          &lt;
        </div>
        <div>
          {idx + 1} / {children.length}
        </div>
        <div
          className="fake-link"
          onClick={(e) => {
            setIdx((idx) => (idx + 1) % children.length);
            lastInteraction.current = Date.now();
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          &gt;
        </div>
      </div>
    </div>
  );
}
