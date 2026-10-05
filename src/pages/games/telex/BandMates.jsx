import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { GameContext } from "./telex";
import { useFrame, useGraph, useThree } from "@react-three/fiber";
import {
  PivotControls,
  useAnimations,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";
import { Typebox } from "./Typebox";
import * as THREE from "three";
import evawnZombie from "./assets/evawn_zombie.jpg";
import longZombie from "./assets/long_zombie.jpg";
import hannahZombie from "./assets/hannah_zombie.jpg";
import ngocZombie from "./assets/ngoc_zombie.jpg";
import thuZombie from "./assets/thu_zombie.jpg";
import longZombieV3 from "./assets/long_zombie_v3.glb";
import guitar from "./assets/guitar.glb";

export const ZOMBIES = [
  evawnZombie,
  longZombie,
  hannahZombie,
  ngocZombie,
  thuZombie,
];

export function BandMates({ position, rotation, animation }) {
  const game = useContext(GameContext);
  const root = useRef();

  const { scene, animations } = useGLTF(longZombieV3);

  const { sceneGuitar } = useGLTF(guitar);

  const map = useTexture(ZOMBIES[0]);
  map.flipY = false;
  map.magFilter = THREE.NearestFilter;
  map.minFilter = THREE.NearestFilter;
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ map: map, roughness: 1.0 }),
    [],
  );

  const clone = useMemo(() => {
    if (clone && cloneGuitar) {
      const clone = SkeletonUtils.clone(scene);
      const cloneGuitar = SkeletonUtils.clone(sceneGuitar);
      console.log(clone, sceneGuitar);
      clone.getObjectByName("mixamorig:LeftHand");
      return clone;
    }
  }, [scene, sceneGuitar]);
  const { nodes } = useGraph(clone);

  const { ref: animRef, actions, names } = useAnimations(animations);

  useEffect(() => {
    actions[animation].play();
    actions[animation].setLoop(THREE.LoopRepeat);
  }, []);

  return (
    <group ref={root} position={position} dispose={null}>
      <group ref={animRef}>
        <group
          scale={[0.005, 0.005, 0.005]}
          rotation={rotation}
          position={[0, -1.5, 0]}
        >
          <primitive object={nodes.mixamorigHips} />
          <skinnedMesh
            castShadow
            receiveShadow
            geometry={nodes.Human.geometry}
            skeleton={nodes.Human.skeleton}
            material={material}
          ></skinnedMesh>
          <primitive object={nodes.mixamorigHips} />
        </group>
      </group>
    </group>
  );
}
