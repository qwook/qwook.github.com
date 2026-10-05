import Banner from "@/common/components/Banner";
import Carousel from "@/common/components/Carousel";

import HTMLFestCarousel from "@/common/components/HTMLFestCarousel";
import "./polaroids.css";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { TextureLoader } from "three";
import * as THREE from "three";
import PolaroidsUniverse from "@/common/components/polaroids/PolaroidsUniverse";
import Layout from "@/common/layout/Layout";

const images = Object.values(
  import.meta.glob("./images/polaroids/*.{png,jpg,jpeg,svg}", {
    eager: true,
    import: "default",
  }),
);
const backs = Object.values(
  import.meta.glob("./images/polaroids_back/*.{png,jpg,jpeg,svg}", {
    eager: true,
    import: "default",
  }),
);

function PolaroidsPage() {
  return (
    <div className="polaroids">
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
          <PolaroidsUniverse fronts={images} backs={backs} />
        </Canvas>
      </div>
    </div>
  );
}

export default function Root() {
  return (
    <Layout>
      <PolaroidsPage />
    </Layout>
  );
}
