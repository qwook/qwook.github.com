import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { PetsContext } from "./PetsContext";
import { items } from "./data/items";
import useInterval from "../../hooks/useInterval";

const FLOWER_IMAGES = [
  require("./images/flower.gif"),
  require("./images/flower2.gif"),
  require("./images/flower3.gif"),
  require("./images/flower4.gif"),
];

const FlowerImage = forwardRef(({ offsetX, offsetY, animationDelay }, ref) => {
  const playRustle = () => {
    // Reset the animation by removing the class and forcing reflow
    flowerEle.current.style.animation = "none";
    flowerEle.current.offsetHeight; // Trigger reflow to apply the reset

    // Reapply the animation
    flowerEle.current.style.animation = "bushRustle 1s ease-in-out forwards";
  };

  const playRustleBackwards = () => {
    // Reset the animation by removing the class and forcing reflow
    flowerEle.current.style.animation = "none";
    flowerEle.current.offsetHeight; // Trigger reflow to apply the reset

    // Reapply the animation
    flowerEle.current.style.animation =
      "bushRustle 0.5s ease-in-out reverse forwards";
  };

  const playRustleNoFade = () => {
    // Reset the animation by removing the class and forcing reflow
    flowerEle.current.style.animation = "none";
    flowerEle.current.offsetHeight; // Trigger reflow to apply the reset

    // Reapply the animation
    flowerEle.current.style.animation =
      "bushRustleNoFade 0.5s ease-in-out forwards";
  };

  useImperativeHandle(ref, {
    playRustle,
    playRustleBackwards,
    playRustleNoFade,
  });

  const flowerEle = useRef();

  return (
    <div
      style={{
        position: "absolute",
        width: 128,
        height: 128,
        backgroundImage: `url(${flowerImage})`,
        backgroundPosition: "center",
      }}
    ></div>
  );
});

export default function Flower({ onEarn, earnGoalEle }) {
  const [value, setValue] = useState(1);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState([0, 0]);
  const [initialPos, setInitialPos] = useState([0, 0]);
  const [flowerImage, setFlowerImage] = useState(
    () => FLOWER_IMAGES[Math.floor(Math.random() * FLOWER_IMAGES.length)]
  );
  const fadingOut = useRef(false);
  const { equipped } = useContext(PetsContext);

  const flowerEle = useRef();

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

  const playRustle = () => {
    // Reset the animation by removing the class and forcing reflow
    flowerEle.current.style.animation = "none";
    flowerEle.current.offsetHeight; // Trigger reflow to apply the reset

    // Reapply the animation
    flowerEle.current.style.animation = "bushRustle 1s ease-in-out forwards";
  };

  const playRustleBackwards = () => {
    // Reset the animation by removing the class and forcing reflow
    flowerEle.current.style.animation = "none";
    flowerEle.current.offsetHeight; // Trigger reflow to apply the reset

    // Reapply the animation
    flowerEle.current.style.animation =
      "bushRustle 0.5s ease-in-out reverse forwards";
  };

  const playRustleNoFade = () => {
    // Reset the animation by removing the class and forcing reflow
    flowerEle.current.style.animation = "none";
    flowerEle.current.offsetHeight; // Trigger reflow to apply the reset

    // Reapply the animation
    flowerEle.current.style.animation =
      "bushRustleNoFade 0.5s ease-in-out forwards";
  };

  const respawn = () => {
    const padding = 40;
    setFlowerImage(
      FLOWER_IMAGES[Math.floor(Math.random() * FLOWER_IMAGES.length)]
    );
    setPosition([
      window.scrollX +
        padding +
        Math.random() * (window.innerWidth - 2 * padding),
      window.scrollY +
        padding +
        Math.random() * (window.innerHeight - 2 * padding),
    ]);
    playRustle();
  };

  useInterval(() => {
    if (collecting) return false;
    playRustleBackwards();
    fadingOut.current = true;
    setTimeout(() => {
      fadingOut.current = false;
      if (collecting) return false;
      respawn();
    }, 500);
  }, 5000);

  useEffect(() => {
    // if (flowerEle.current) {
    respawn();
    // }
  }, []);

  useInterval(
    () => {
      if (collecting) {
        // This is the animation that plays when you click on the flower!
        if (earnGoalEle.current) {
          const rect = earnGoalEle.current.getBoundingClientRect();
          const petWindowX = rect.left;
          const petWindowY = Math.max(rect.top, window.scrollY);
          const progress = (Date.now() - collecting) / 500;
          const distance = Math.sqrt(
            Math.pow(petWindowX - position[0], 2) +
              Math.pow(petWindowY - position[1], 2)
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
            respawn();
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
                (petWindowX - initialPos[0]) *
                  progress *
                  Math.sin(progress * Math.PI * 0.5),
              initialPos[1] + (petWindowY - initialPos[1]) * progress,
            ]);
          }
        }
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
        position: "absolute",
        left: position[0],
        top: position[1],
        width: 128,
        height: 128,
        backgroundImage: `url(${flowerImage})`,
        backgroundPosition: "center",
        cursor: "pointer",
        textAlign: "center",
        fontSize: 40,
        userSelect: "none",
        pointerEvents: "auto",
        opacity: opacity,
        transform: `translate(-50%, -50%) scale(${scale})`,
        zIndex: 20000,
      }}
      ref={flowerEle}
      onClick={(e) => {
        if (collecting) return false;
        setCollecting(Date.now());
        setInitialPos([...position]);
        e.stopPropagation();
        e.preventDefault();
        return false;
      }}
      onMouseEnter={(e) => {
        if (!fadingOut.current) {
          playRustleNoFade();
        }
      }}
      onMouseDown={(e) => {
        if (collecting) return false;
        setCollecting(Date.now());
        setInitialPos([...position]);
        e.stopPropagation();
        e.preventDefault();
        return false;
      }}
    >
      <div
        style={{
          position: "relative",
        }}
      ></div>
    </div>
  );
}
