import { Html, Hud, OrthographicCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import _ from "lodash";
import { useEffect, useMemo, useRef } from "react";

function easeOutBounce(x) {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}

export function HeartSpinning() {
  const heart = useRef();
  const fires = useRef([]);
  const random = useMemo(() => Math.random());
  const start = useMemo(() => Date.now(), []);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      for (let i = 0; i < fires.current.length; i++) {
        const fire = fires.current[i];
        const time = Date.now() + random * 10500 + i * 100;
        fire.style.left = Math.sin(time / 100) * 20 + 25 + "%";
        fire.style.bottom = Math.sin((time / 100) * 0.5) * 20 + 25 + "%";
        fire.style.zIndex = Math.floor(Math.cos(time / 100)) + 1;
        fire.style.opacity = Math.min(elapsed / 500, 1);
      }
      const time = Date.now() + random * 10500;
      if (elapsed < 1000) {
        heart.current.style.transform = `scale(${easeOutBounce(elapsed / 1000) * 100}%)`;
      } else {
        heart.current.style.transform = `scale(${Math.pow((Math.sin(time / 100) + 1) / 2, 4) * 10 + 100}%)`;
      }
    }, 50);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "20%", height: "100%" }}>
      <img
        ref={heart}
        src={require("./assets/heart.gif")}
        style={{ position: "absolute", width: "100%", bottom: 0, zIndex: 1 }}
      />
      {_.range(3).map((i) => (
        <img
          key={i}
          ref={(ref) => (fires.current[i] = ref)}
          src={require("./assets/fire.gif")}
          style={{
            position: "absolute",
            width: "50%",
            left: 0,
            bottom: 0,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

export function HeartDying() {
  const heart = useRef();
  const heartWhite = useRef();
  const fires = useRef([]);
  const start = useMemo(() => Date.now(), []);
  console.log(start);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      if (elapsed < 2000) {
        for (let i = 0; i < fires.current.length; i++) {
          const fire = fires.current[i];
          const time = Date.now() + start * 10500 + i * 100;
          const ang = (i * Math.PI * 2) / 3;
          fire.style.left = (Math.sin(ang) * elapsed) / 10 + 25 + "%";
          fire.style.bottom = (Math.cos(ang) * elapsed) / 10 + 25 + "%";
          fire.style.opacity = (1 - (elapsed - 500)) / 200;
        }
      }
      const time = Date.now() + start * 10500;
      heart.current.style.transform = `scale(${Math.pow((Math.sin((time / 100) * 100) + 1) / 2, 4) * 10 + 100}%)`;
      heartWhite.current.style.display =
        Math.sin(time / 5) > 0 && elapsed < 250 ? "" : "none";
      heart.current.style.display = elapsed < 500 ? "" : "none";
      heart.current.style.opacity = (1 - (elapsed - 500)) / 200;
    }, 50);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "20%", height: "100%" }}>
      <img
        ref={heart}
        src={require("./assets/heart.gif")}
        style={{ position: "absolute", width: "100%", bottom: 0, zIndex: 1 }}
      />
      <img
        ref={heartWhite}
        src={require("./assets/heart-white.gif")}
        style={{ position: "absolute", width: "100%", bottom: 0, zIndex: 1 }}
      />
      {_.range(3).map((i) => (
        <img
          key={i}
          ref={(ref) => (fires.current[i] = ref)}
          src={require("./assets/fire.gif")}
          style={{
            position: "absolute",
            width: "50%",
            left: 0,
            bottom: 0,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

export function HealthViz({ lives = 6 }) {
  useEffect(() => {}, []);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        width: "50%",
        height: "20%",
        left: 0,
        display: "flex",
        overflow: "hidden",
        padding: "2%",
        zIndex: 100000,
      }}
    >
      {_.range(6).map((i) => {
        return i < lives ? <HeartSpinning key={i} /> : <HeartDying key={i} />;
      })}
    </div>
  );
}
