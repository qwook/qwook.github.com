import { useEffect, useState } from "react";
import "./button.scss";

export default function Button({
  children,
  onClick,
  correct,
  small,
  keyCode,
  href,
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (keyCode) {
      const onKeyDown = (e) => {
        if (e.keyCode === keyCode) {
          onClick();
          setActive(true);
        }
      };
      document.addEventListener("keydown", onKeyDown);

      const onKeyUp = (e) => {
        if (e.keyCode === keyCode) {
          setActive(false);
        }
      };
      document.addEventListener("keyup", onKeyUp);

      return () => {
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);
      };
    }
  }, [keyCode, onClick]);

  return (
    <>
      {href ? (
        <a
          href={href}
          className={[
            "button",
            correct ? "correct" : "",
            small ? "small" : "",
            active ? "active" : "",
          ].join(" ")}
        >
          {children}
        </a>
      ) : (
        <div
          className={[
            "button",
            correct ? "correct" : "",
            small ? "small" : "",
            active ? "active" : "",
          ].join(" ")}
          onClick={onClick}
        >
          {children}
        </div>
      )}
    </>
  );
}
