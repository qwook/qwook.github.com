import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { GameContext } from "../telex";
import { useFrame, useGraph, useThree } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";
import { Typebox } from "../Typebox";
import * as THREE from "three";

export function BossZombie({ position, onDeath, speed = 2 }) {
  const game = useContext(GameContext);
  const root = useRef();

  const [dead, setDead] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const newText = game.generateWord();
    setText(newText);
    return () => {
      game.removeWord(newText);
    };
  }, []);

  const { scene, animations, materials } = useGLTF(
    require("../assets/long_zombie.glb")
  );
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone);

  const { ref: animRef, actions, names } = useAnimations(animations);

  useEffect(() => {
    actions["idle"].play();
    actions["idle"].setLoop(THREE.LoopRepeat);

    if (actions.walking) {
      actions["idle"].stop();

      actions["walking"].play();
      actions["walking"].timeScale = speed;
      actions["walking"].startAt(Math.random() * -2);
      actions["walking"].setLoop(THREE.LoopRepeat);
    }
  }, [speed]);

  const damage = () => {
    game.setLife((life) => life - 1);
  };

  const shot = (shouldScore) => {
    if (shouldScore) {
      game.setScore((score) => score + 1);
    }

    onDeath && onDeath();
    setDead(true);

    const side = new THREE.Vector3(0, 1, 0).cross(
      state.camera.getWorldDirection(new THREE.Vector3())
    );
    const pan = side.dot(
      root.current.position.clone().sub(state.camera.position).normalize()
    );
    game.sounds["death"].stereo(-pan * 0.7);
    game.sounds["death"].play();
  };

  const state = useThree();
  const [attacking, setAttacking] = useState(false);
  const attackingTimer = useRef(0);
  const nextAttack = useRef(0);
  const leftArm = useRef();

  const [leftArmAlive, setLeftArmAlive] = useState(true);

  console.log(nodes);

  useFrame((state, deltaTime) => {
    nodes.mixamorigLeftArm.scale.set(0, 0, 0);
    // nodes.mixamorigLeftLeg.scale.set(0, 0, 0);
    // console.log(nodes.mixamorigLeftLeg.position);

    if (!leftArmAlive) {
      nodes.mixamorigLeftLeg.scale.set(0, 0, 0);
    } else {
      const world = nodes.mixamorigLeftLeg.localToWorld(
        new THREE.Vector3(0, 0, 0)
      );
      animRef.current.worldToLocal(world);
      leftArm.current.position.copy(world);
    }

    if (!game.playing) {
      return;
    }
    if (dead) {
      return;
    }
    const goal = state.camera.position.clone();
    goal.y = -1;
    // if (root.current.position.distanceTo(state.camera.position) < 5) {
    //   if (nextAttack.current > 0) {
    //     nextAttack.current -= deltaTime;
    //   }
    //   if (!attacking && nextAttack.current <= 0) {
    //     actions["walking"].fadeOut(0.2);
    //     actions["attack"].play();
    //     attackingTimer.current = 0;
    //     setAttacking(true);
    //   } else if (attacking) {
    //     attackingTimer.current += deltaTime;
    //     if (attackingTimer.current > 1.5) {
    //       damage();
    //       setAttacking(false);
    //       nextAttack.current = 1;
    //       attackingTimer.current = 0;
    //     }
    //   }
    // } else {
    //   root.current.position.add(
    //     goal
    //       .sub(root.current.position)
    //       .normalize()
    //       .multiplyScalar(deltaTime * speed)
    //   );
    // }
    root.current.position.y = -1;
    root.current.rotation.y = Math.atan2(
      state.camera.position.x - root.current.position.x,
      state.camera.position.z - root.current.position.z
    );
  });

  return (
    <group ref={root} position={position} dispose={null}>
      <group ref={animRef}>
        <group
          scale={[0.03, 0.03, 0.03]}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, -1.5, 0]}
        >
          <primitive object={nodes.mixamorigHips} />
          <skinnedMesh
            castShadow
            receiveShadow
            geometry={nodes.Human.geometry}
            skeleton={nodes.Human.skeleton}
            material={materials["Material.002"]}
            scale={[100, 100, 100]}
          ></skinnedMesh>
        </group>
        {leftArmAlive && (
          <group ref={leftArm}>
            <Typebox
              text={text}
              position={[0, 0, 0]}
              onHit={() => {
                game.sounds["shot"].play();
              }}
              onFinished={() => {
                setLeftArmAlive(false);
              }}
            />
          </group>
        )}
      </group>
      {/* {!dead && (
        <Typebox
          text={text}
          position={[0, -1.5, 0]}
          onHit={() => {
            game.sounds["shot"].play();
            state.hit = 1;
          }}
          onFinished={shot}
        />
      )} */}
    </group>
  );
}
