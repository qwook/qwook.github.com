import { createPage } from "../app";
import Plant from "../components/plant/Plant";
import "./plantframe.scss";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";

export default function PlantFramePage() {
  return (
    <div className="plant">
      <a href="/plant" target="_blank">
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
          <Canvas invalidateFrameloop camera={{ position: [0, 0, 5] }} gl>
            <Plant birthday={window.location.hash} />
          </Canvas>
        </div>
      </a>
    </div>
  );
}

createPage(PlantFramePage, { showPets: false, showNav: false });
