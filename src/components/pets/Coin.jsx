import { useContext, useEffect, useMemo, useState } from "react";

import { PetsContext } from "./PetsContext";
import { items } from "./data/items";
import useInterval from "../../hooks/useInterval";

export default function Coin({ onEarn, earnGoalEle }) {
  const [value, setValue] = useState(1);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState([0, 0]);
  const [initialPos, setInitialPos] = useState([0, 0]);
  const { equipped } = useContext(PetsContext);

  const [collecting, setCollecting] = useState(0);

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
  }, []);

  useInterval(
    () => {
      if (collecting) {
        if (earnGoalEle.current) {
          const rect = earnGoalEle.current.getBoundingClientRect();
          const ratioLeft = (rect.left / window.innerWidth) * 100;
          const ratioTop = Math.max((rect.top / window.innerHeight) * 100, 0);
          const progress = (Date.now() - collecting) / 500;
          const distance = Math.sqrt(
            Math.pow(ratioLeft - position[0], 2) +
              Math.pow(ratioTop - position[1], 2)
          );
          setScale(
            1 +
              (0.5 + Math.sin(progress * Math.PI * 1.9 - Math.PI / 2) * 0.5) *
                2.0
          );
          setOpacity(1 - progress);
          if (progress > 1.0) {
            onEarn && onEarn(value);
            setOpacity(1);
            setScale(1);
            setCollecting(false);
            setPosition([Math.random() * 100, -20]);
            const probability = Math.random();
            if (probability < (lucky ? 0.15 : 0.05)) {
              setValue(20);
            } else if (probability < (lucky ? 0.3 : 0.2)) {
              setValue(5);
            } else {
              setValue(1);
            }
          } else {
            setPosition([
              initialPos[0] +
                (ratioLeft - initialPos[0]) *
                  progress *
                  Math.sin(progress * Math.PI * 0.5),
              initialPos[1] + (ratioTop - initialPos[1]) * progress,
            ]);
          }
        }
      } else {
        setPosition((position) => {
          if (position[1] > 110) {
            return [Math.random() * 100, -10];
          } else {
            return [
              Math.max(
                Math.min(position[0] + Math.sin(Date.now() * 0.001) * 0.5, 100),
                0
              ),
              position[1] + 0.5,
            ];
          }
        });
      }
    },
    collecting ? 25 : 50,
    [setPosition, earnGoalEle, onEarn, collecting, position]
  );

  const valueColor = {
    [1]: "#a26a1b",
    [5]: "silver",
    [20]: "yellow",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 20000,
      }}
    >
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
          textAlign: "center",
          fontSize: 40,
          userSelect: "none",
          pointerEvents: "auto",
          opacity: opacity,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
        onClick={(e) => {
          if (collecting) return false;
          setCollecting(Date.now());
          setInitialPos([...position]);
          // setPosition([Math.random() * 100, -20]);
          e.stopPropagation();
          e.preventDefault();
          return false;
        }}
        onMouseDown={(e) => {
          if (collecting) return false;
          setCollecting(Date.now());
          setInitialPos([...position]);
          // setPosition([Math.random() * 100, -20]);
          e.stopPropagation();
          e.preventDefault();
          return false;
        }}
      >
        $
      </div>
    </div>
  );
}
