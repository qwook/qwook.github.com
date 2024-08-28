import { useEffect, useState } from "react";

const nullObject = {
  __null: "__null",
};

export default function useLocalStorageState(name, def) {
  const [state, setState] = useState(def);

  useEffect(() => {
    const storedState = JSON.parse(localStorage.getItem(name));
    if (storedState !== null) {
      if (storedState?.__null === "__null") {
        setState(null);
      } else {
        setState(storedState);
      }
    }
  }, []);

  useEffect(() => {
    if (state === null) {
      localStorage.setItem(name, JSON.stringify(nullObject));
    } else {
      localStorage.setItem(name, JSON.stringify(state));
    }
  }, [state]);

  return [state, setState];
}
