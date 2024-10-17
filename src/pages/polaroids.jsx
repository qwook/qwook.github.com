import Banner from "../components/Banner";
import Carousel from "../components/Carousel";
import Page from "../components/Page";
import { createPage } from "../app";
import HTMLFestCarousel from "../components/HTMLFestCarousel";
import "./polaroids.scss";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { TextureLoader } from "three";
import * as THREE from "three";
import PolaroidsUniverse from "../components/polaroids/PolaroidsUniverse";

function importAll(r) {
  return r.keys().map(r);
}
const images = importAll(
  require.context("./images/polaroids", false, /\.(png|jpe?g|svg)$/)
);
const backs = importAll(
  require.context("./images/polaroids_back", false, /\.(png|jpe?g|svg)$/)
);

export default function PolaroidsPage() {
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

createPage(PolaroidsPage, { showPets: false });
