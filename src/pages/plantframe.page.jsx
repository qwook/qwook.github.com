import Plant from "@/common/components/plant/Plant";
import "./plantframe.css";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import Layout from "@/common/layout/Layout";

function PlantFramePage() {
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

export default function Root() {
  return (
    <Layout showNav={false}>
      <PlantFramePage />
    </Layout>
  );
}
