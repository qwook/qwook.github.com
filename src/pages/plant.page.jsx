import { useEffect, useMemo, useState } from "react";

import Plant, { plantTime } from "@/common/components/plant/Plant";
import { numCrush, numDecrush } from "@/common/utils/numberCrusher";
import "./polaroids.css";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import Layout from "@/common/layout/Layout";

const randoPlant = numCrush(plantTime());
const initialTime = Date.now();

function PlantPage() {
  const [time, setTime] = useState(0);
  const birthday = window.location.hash || randoPlant;
  const birthdayNum = useMemo(() => {
    return numDecrush(birthday);
  }, [birthday]);

  useEffect(() => {
    const interval = setInterval(() => {
      const fasterTime = initialTime + (Date.now() - initialTime) * 1000;
      setTime(fasterTime);
      // setTime(Date.now());
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

export default function Root() {
  return (
    <Layout>
      <PlantPage />
    </Layout>
  );
}
