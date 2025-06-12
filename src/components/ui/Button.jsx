import { useEffect, useState } from "react";
import "./button.scss";
import { useHotkey } from "./useHotkey";

export default function Button({
  children,
  onClick,
  correct,
  wrong,
  small,
  keyCode,
  href,
  style,
}) {
  const [active, setActive] = useState(false);

  useHotkey(keyCode, onClick, setActive);

  return (
    <>
      {href ? (
        <a
          href={href}
          className={[
            "button",
            correct ? "correct" : "",
            wrong ? "wrong" : "",
            small ? "small" : "",
            active ? "active" : "",
          ].join(" ")}
          style={style}
        >
          {children}
        </a>
      ) : (
        <div
          className={[
            "button",
            correct ? "correct" : "",
            wrong ? "wrong" : "",
            small ? "small" : "",
            active ? "active" : "",
          ].join(" ")}
          onClick={onClick}
          style={style}
        >
          {children}
        </div>
      )}
    </>
  );
}
