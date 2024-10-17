import { createContext, useMemo } from "react";
import Polaroid, { useSimpleTexture } from "./Polaroid";
import { useThree } from "@react-three/fiber";

export const PolaroidsContext = createContext({ fronts: [], backs: [] });

export default function PolaroidsUniverse({ fronts, backs }) {
  const pool = useMemo(() => [...Array(20).keys()]);

  const { scene } = useThree();
  scene.background = useSimpleTexture(require("../../pages/images/polaroid_skybox.jpg"));

  return (
    <>
      <PolaroidsContext.Provider value={{ fronts, backs }}>
        <ambientLight color={0xffffff} intensity={1.0} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.5}
          // castShadow
          // shadow-mapSize-width={1024}
          // shadow-mapSize-height={1024}
        />
        <directionalLight
          position={[-5, -5, 5]}
          intensity={0.1}
          color="#ffffff"
        />
        {/* <pointLight position={[10, 10, 10]} /> */}
        {pool.map((idx) => (
          <Polaroid key={idx} idx={idx} />
        ))}
      </PolaroidsContext.Provider>
    </>
  );
}
