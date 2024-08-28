import { useEffect, useRef } from "react";

export default function useInterval(callback, timeMs, deps = []) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback, ...deps]);

  useEffect(() => {
    const interval = setInterval(() => {
      callbackRef.current();
    }, timeMs);
    return () => {
      clearInterval(interval);
    };
  }, [timeMs]);
}
