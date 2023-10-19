import { useEffect, useState } from "react";

const namePool = [
  "qwook",
  "Quoc",
  "Henry",
  "digihenry1",
  "theaznzombie",
  "Hentie",
  "kid64",
  "TheBlood",
  "hen",
];

export default function HenryName() {
  const [nameId, setNameId] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setNameId((nameId) => (nameId + 1) % namePool.length);
    }, 100);
    return () => {
      clearInterval(interval);
    };
  });

  return <>{namePool[nameId]}</>;
}
