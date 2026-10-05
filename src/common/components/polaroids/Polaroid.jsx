import { useFrame, useLoader } from "@react-three/fiber";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { PolaroidsContext } from "./PolaroidsUniverse";
import * as THREE from "three";

export function useSimpleTexture(path) {
  const texture = useLoader(THREE.TextureLoader, path);
  useEffect(() => {
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.transparent = true;
    texture.needsUpdate = true;
  }, [texture]);

  return texture;
}

let globIndex = Math.random() * 100000;
function incrementGlob() {
  return globIndex++;
}

export default function Polaroid({ idx }) {
  const { fronts, backs } = useContext(PolaroidsContext);

  const meshRef = useRef();
  const [random, setRandom] = useState(() => incrementGlob());
  const frontTexture = useSimpleTexture(
    fronts[Math.floor(random * 100000) % fronts.length]
  );
  const backTexture = useSimpleTexture(
    backs[Math.floor(random * 100000) % backs.length]
  );

  const falling = useRef(false);
  const alreadyReset = useRef(false);

  const front = useFrame((state, delta) => {
    const now = performance.now() * 0.5 + 100000;
    if (falling.current) {
      meshRef.current.position.y = ((idx * 1.0 - now / 1000) % 15) + 7;
    } else {
      // meshRef.current.rotation.x += delta * 0.5;
      // meshRef.current.rotation.y += delta * 2.0;
      // console.log(now);
      meshRef.current.rotation.y =
        Math.cos((idx * 1.0 - now / 2000 + 10) % (Math.PI * 2)) * Math.PI +
        Math.PI +
        Math.cos(random * 10) / 4;
      meshRef.current.rotation.z =
        ((idx * 0.3 - now / 2000) % (Math.PI * 4)) + Math.PI / 2;
      meshRef.current.position.x = Math.sin(meshRef.current.rotation.y) * 2.5;
      meshRef.current.position.z =
        Math.cos(meshRef.current.rotation.y) *
          (0.5 + Math.abs(Math.cos(idx * 1.0 - now / 2000 - 10)) * 2) -
        1.5;
      meshRef.current.position.y = ((idx * 1.0 - now / 1000) % 15) + 7;
    }

    if (meshRef.current.position.y > 0) {
      alreadyReset.current = false;
    }

    if (meshRef.current.position.y < -7) {
      if (!alreadyReset.current) {
        alreadyReset.current = true;
        setRandom(incrementGlob());
        falling.current = false;
      }
    }
  });

  return (
    <>
      <object3D
        ref={meshRef}
        scale={[1, 1003 / 630, 1]}
        onClick={(e) => {
          falling.current = true;
          console.log("Falling!");
        }}
      >
        <mesh>
          <planeGeometry args={[2, 2]} />
          <meshPhongMaterial
            map={frontTexture}
            specular={0x995555}
            shininess={100}
          />
        </mesh>
        <mesh rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2, 2]} />
          <meshPhongMaterial
            map={backTexture}
            specular={0x995555}
            shininess={100}
          />
        </mesh>
      </object3D>
    </>
  );
}
