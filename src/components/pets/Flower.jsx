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
import useRefArray from "../../hooks/useRefArray";
import _ from "lodash";

const FLOWER_IMAGES = [
  require("./images/flower.gif"),
  require("./images/flower2.gif"),
  require("./images/flower3.gif"),
  require("./images/flower4.gif"),
];

const FlowerImage = forwardRef(({ animationDelay, visible }, ref) => {
  const [flowerImage, setFlowerImage] = useState(
    () => FLOWER_IMAGES[Math.floor(Math.random() * FLOWER_IMAGES.length)]
  );
  const [offsetX, setOffsetX] = useState(() => (Math.random() - 0.5) * 80);
  const [offsetY, setOffsetY] = useState(() => (Math.random() - 0.5) * 80);

  const flowerEle = useRef();

  const respawn = () => {
    setFlowerImage(
      FLOWER_IMAGES[Math.floor(Math.random() * FLOWER_IMAGES.length)]
    );
    setOffsetX((Math.random() - 0.5) * 80);
    setOffsetY((Math.random() - 0.5) * 80);
  };

  const playRustle = () => {
    // setTimeout(() => {
    // Reset the animation by removing the class and forcing reflow
    flowerEle.current.style.animation = "none";
    flowerEle.current.offsetHeight; // Trigger reflow to apply the reset

    // Reapply the animation
    flowerEle.current.style.animation = `bushRustle 1s ease-in-out ${animationDelay}s forwards`;
    flowerEle.current.style.transition = "opacity 0s";
    flowerEle.current.style.opacity = 0;
    setTimeout(() => {
      if (flowerEle.current) {
        flowerEle.current.style.transition = "opacity 0.5s";
        flowerEle.current.style.opacity = 1;
      }
    }, animationDelay * 1000);
    // }, animationDelay * 1000);
  };

  const playRustleBackwards = () => {
    // Reset the animation by removing the class and forcing reflow
    flowerEle.current.style.animation = "none";
    flowerEle.current.offsetHeight; // Trigger reflow to apply the reset

    // Reapply the animation
    flowerEle.current.style.animation = `bushRustle 0.5s ease-in-out ${animationDelay}s reverse forwards`;
    flowerEle.current.style.opacity = 0;
  };

  const playRustleNoFade = () => {
    // Reset the animation by removing the class and forcing reflow
    flowerEle.current.style.animation = "none";
    flowerEle.current.offsetHeight; // Trigger reflow to apply the reset

    // Reapply the animation
    flowerEle.current.style.animation = `bushRustleNoFade 0.5s ease-in-out ${animationDelay}s forwards`;
  };

  useImperativeHandle(ref, () => ({
    playRustle,
    playRustleBackwards,
    playRustleNoFade,
    respawn,
  }));

  return (
    <div
      style={{
        display: visible ? null : "none",
        position: "absolute",
        opacity: 0,
        left: offsetX,
        top: offsetY,
        width: 128,
        height: 128,
        backgroundImage: `url(${flowerImage})`,
        backgroundPosition: "center",
        transition: "opacity 0.5s",
      }}
      ref={flowerEle}
    ></div>
  );
});

export default function Flower({ onEarn, earnGoalEle }) {
  const [value, setValue] = useState(1);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState([0, 0]);
  const [initialPos, setInitialPos] = useState([0, 0]);
  const [flowerImageCount, setFlowerImageCount] = useState(1);
  const flowerImages = useRefArray(_.range(0, 5));
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
    for (const flowerImage of flowerImages) {
      flowerImage.current.playRustle();
    }
  };

  const playRustleBackwards = () => {
    for (const flowerImage of flowerImages) {
      flowerImage.current.playRustleBackwards();
    }
  };

  const playRustleNoFade = () => {
    for (const flowerImage of flowerImages) {
      flowerImage.current.playRustleNoFade();
    }
  };

  const respawn = () => {
    const padding = (128 + 80) / 2;
    for (const flowerImage of flowerImages) {
      flowerImage.current.respawn();
    }
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

  const { resetInterval: resetRespawnInterval } = useInterval(() => {
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
                1.0
          );
          setOpacity(1 - progress);
          if (progress > 1.0) {
            onEarn && onEarn(value);
            setOpacity(1);
            setScale(1);
            setCollecting(false);
            const probability = Math.random();
            if (probability < (lucky ? 0.15 : 0.05)) {
              setValue(20);
              setFlowerImageCount(5);
            } else if (probability < (lucky ? 0.3 : 0.2)) {
              setValue(5);
              setFlowerImageCount(3);
            } else {
              setValue(1);
              setFlowerImageCount(1);
            }
            respawn();
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

  console.log(window.innerWidth - position[0]);

  return (
    <div
      style={{
        position: "absolute",
        left: position[0],
        top: position[1],
        // maxHeight: 800,
        // width: 128,
        // height: 128,
        // backgroundImage: `url(${flowerImage})`,
        // backgroundPosition: "center",
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
        resetRespawnInterval();
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
        resetRespawnInterval();
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
          transform: "translate(-50%, -50%)",
        }}
      >
        {flowerImages.map((ref, idx) => (
          <FlowerImage
            key={idx}
            visible={idx < flowerImageCount}
            ref={ref}
            animationDelay={0.2 * idx}
          />
        ))}
      </div>
    </div>
  );
}
