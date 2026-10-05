import { useEffect } from "react";

export function useHotkey(keyCode, onHotkey, onActive) {
  useEffect(() => {
    if (keyCode) {
      const onKeyDown = (e) => {
        if (e.keyCode === keyCode) {
          onHotkey();
          onActive && onActive(true);
        }
      };
      document.addEventListener("keydown", onKeyDown);

      const onKeyUp = (e) => {
        if (e.keyCode === keyCode) {
          onActive && onActive(false);
        }
      };
      document.addEventListener("keyup", onKeyUp);

      return () => {
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);
      };
    }
  }, [keyCode, onHotkey, onActive]);
}
