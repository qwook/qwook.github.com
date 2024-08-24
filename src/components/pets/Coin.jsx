import { useContext, useEffect, useMemo, useState } from "react";

import { PetsContext } from "./PetsContext";
import { items } from "./data/items";

export default function Coin({ onEarn }) {
  const [value, setValue] = useState(1);
  const [position, setPosition] = useState([0, 0]);
  const { equipped } = useContext(PetsContext);

  const lucky = useMemo(() => {
    for (const itemPtr of Object.values(equipped)) {
      const item = items[itemPtr.type][itemPtr.id];
      if (item.special?.lucky) {
        return true;
      }
    }
    return false;
  }, [equipped]);

  useEffect(() => {
    setPosition([Math.random() * 100, -10]);
    const interval = setInterval(() => {
      setPosition((position) => {
        if (position[1] > 110) {
          return [Math.random() * 100, -10];
        } else {
          return [
            Math.max(
              Math.min(position[0] + Math.sin(Date.now() * 0.001) * 0.5, 110),
              -10
            ),
            position[1] + 0.5,
          ];
        }
      });
    }, 50);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const valueColor = {
    [1]: "#a26a1b",
    [5]: "silver",
    [20]: "yellow",
  };

  return (
    <div
      style={{
        position: "absolute",
        left: `${position[0]}%`,
        top: `${position[1]}%`,
        width: 50,
        height: 50,
        background: valueColor[value],
        borderRadius: 25,
        border: "2px solid black",
        cursor: "pointer",
        zIndex: 10000,
        textAlign: "center",
        fontSize: 40,
        userSelect: "none",
      }}
      onClick={() => {
        onEarn && onEarn(value);
        const probability = Math.random();
        if (probability < (lucky ? 0.15 : 0.05)) {
          setValue(20);
        } else if (probability < (lucky ? 0.3 : 0.2)) {
          setValue(5);
        } else {
          setValue(1);
        }
        setPosition([Math.random() * 100, -20]);
      }}
    >
      $
    </div>
  );
}
