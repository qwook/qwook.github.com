import { useCallback } from "react";
import "./checkbox.scss";
import { useHotkey } from "./useHotkey";

export function Checkbox({ children, value, onChanged, keyCode, ...props }) {
  const toggle = useCallback(() => {
    onChanged(!value);
  }, [value, onChanged]);

  useHotkey(keyCode, toggle);

  return (
    <div
      {...props}
      className="checkbox"
      onClick={(e) => {
        onChanged && onChanged(!value);
        e.preventDefault();
      }}
    >
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChanged && onChanged(e.target.value)}
      />
      <div
        className="fake-checkbox"
        style={{ color: value ? "black" : "white" }}
      >
        &#x2713;
      </div>
      {children}
    </div>
  );
}
