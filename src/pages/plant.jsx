import { createPage } from "../app";
import Plant from "../components/plant/Plant";
import "./polaroids.scss";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";

export default function PlantPage() {
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
        <Canvas camera={{ position: [0, 0, 5] }} gl>
          <Plant />
        </Canvas>
      </div>
    </div>
  );
}

createPage(PlantPage, { showPets: false });
