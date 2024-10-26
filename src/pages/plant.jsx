import { useEffect, useMemo, useState } from "react";
import { createPage } from "../app";
import Plant, { plantTime } from "../components/plant/Plant";
import { numCrush, numDecrush } from "../utils/numberCrusher";
import "./polaroids.scss";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";

const randoPlant = numCrush(plantTime());
export default function PlantPage() {
  const [time, setTime] = useState(0);
  const birthday = window.location.hash || randoPlant;
  const birthdayNum = useMemo(() => {
    return numDecrush(birthday);
  }, [birthday]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now() * 1000);
    }, 10);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="plant">
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
      >
        <div>test</div>
        <Canvas invalidateFrameloop camera={{ position: [0, 0, 5] }} gl>
          <Plant birthday={window.location.hash || randoPlant} now={time} />
        </Canvas>
      </div>
    </div>
  );
}

createPage(PlantPage, { showPets: false });
