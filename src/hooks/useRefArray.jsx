import { useRef } from "react";

// This hook is useful for when there is an array of values that are going to be mapped.
export default function useRefArray(arrayToMap) {
  const refArray = useRef([]);

  // Ensure the refs array has the same length as the arrayToMap array
  if (refArray.current.length !== arrayToMap.length) {
    refArray.current = Array(arrayToMap.length)
      .fill()
      .map((_, i) => refArray.current[i] || React.createRef());
  }

  return refArray.current;
}
