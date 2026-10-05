import { useEffect, useRef } from "react";

export default function useInterval(callback, timeMs, deps = []) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback, ...deps]);

  const resetInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      callbackRef.current();
    }, timeMs);
  };

  const intervalRef = useRef();
  useEffect(() => {
    resetInterval();
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [timeMs]);

  return {
    resetInterval,
  };
}
