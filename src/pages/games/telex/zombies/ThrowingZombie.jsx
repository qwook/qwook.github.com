import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { GameContext } from "../telex";
import { useFrame, useGraph, useThree } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";
import { Typebox } from "../Typebox";
import * as THREE from "three";
import { ThrowingZombieProjectile } from "./ThrowingZombieProjectile";

export function ThrowingZombie({ position, onDeath, speed = 2 }) {
  const game = useContext(GameContext);
  const root = useRef();

  const projectileIdTracker = useRef(0);
  const [projectiles, setProjectiles] = useState([]);

  const [dead, setDead] = useState(false);
  const [text, setText] = useState("");

  const [showTypeBox, setShowTypeBox] = useState(false);

  useEffect(() => {
    const newText = game.generateWord();
    setText(newText);
    return () => {
      game.removeWord(newText);
    };
  }, []);

  const { scene, animations, materials } = useGLTF(
    require("../assets/long_zombie.glb"),
  );
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone);

  const { ref: animRef, actions, names } = useAnimations(animations);

  useEffect(() => {
    actions["attack"].reset();
    actions["attack"].play();
    actions["attack"].setLoop(THREE.LoopOnce);
    actions["attack"].timeScale = 0;
  }, [speed]);

  const shot = (shouldScore) => {
    if (shouldScore) {
      game.setScore((score) => score + 1);
    }

    onDeath && onDeath();
    setDead(true);

    const side = new THREE.Vector3(0, 1, 0).cross(
      state.camera.getWorldDirection(new THREE.Vector3()),
    );
    const pan = side.dot(
      root.current.position.clone().sub(state.camera.position).normalize(),
    );
    game.sounds["death"].stereo(-pan * 0.7);
    game.sounds["death"].play();
  };

  const state = useThree();
  // const [attacking, setAttacking] = useState(false);

  // const attacking = useRef(false);
  // const nextAttack = useRef(1);

  const queueAttack = useRef(3);
  const nextQueuedAttack = useRef(0.5 + Math.random() * 2);

  const inAttackAnimation = useRef();
  const inAttackAnimationTime = useRef();

  useFrame((state, deltaTime) => {
    if (!game.playing) {
      return;
    }
    if (dead) {
      return;
    }

    if (nextQueuedAttack.current > 0) {
      nextQueuedAttack.current -= deltaTime;
    }
    if (queueAttack.current > 0 && nextQueuedAttack.current <= 0) {
      actions["attack"].reset();
      actions["attack"].play();
      actions["attack"].timeScale = 1;

      inAttackAnimation.current = true;
      inAttackAnimationTime.current = 1;

      queueAttack.current--;
      nextQueuedAttack.current += 1 + Math.random() * 0.5;

      setShowTypeBox(false);
    }

    // Currently in an attack.
    if (inAttackAnimationTime.current > 0) {
      inAttackAnimationTime.current -= deltaTime;
    }
    if (inAttackAnimation.current && inAttackAnimationTime.current <= 0) {
      inAttackAnimation.current = false;
      setProjectiles((projectiles) => [
        ...projectiles,
        {
          id: ++projectileIdTracker.current,
          cameraOffset: [
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 2,
            0,
          ],
        },
      ]);
    }

    // if (queueAttack) nextAttack.current -= deltaTime;
    // if (nextAttack.current <= 0 && !attacking.current) {
    //   actions["attack"].reset();
    //   actions["attack"].play();
    //   actions["attack"].timeScale = 1;
    //   nextAttack.current = 2;
    //   attacking.current = true;
    //   setProjectiles((projectiles) => [
    //     ...projectiles,
    //     { id: ++projectileIdTracker.current, cameraOffset: [1, 0, 0] },
    //     { id: ++projectileIdTracker.current, cameraOffset: [-1, 0, 0] },
    //   ]);
    // }
    // const goal = state.camera.position.clone();
    // goal.y = -1;
    // if (root.current.position.distanceTo(state.camera.position) < 5) {
    //   if (!attacking) {
    //     actions["walking"].fadeOut(0.2);
    //     actions["attack"].play();
    //     attackingTimer.current = 0;
    //     setAttacking(true);
    //   } else {
    //     attackingTimer.current += deltaTime;
    //     if (attackingTimer.current > 2) {
    //       damage();
    //       shot(false);
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
    // root.current.position.y = -1;
    root.current.rotation.y = Math.atan2(
      state.camera.position.x - root.current.position.x,
      state.camera.position.z - root.current.position.z,
    );
  });

  useEffect(() => {
    if (
      projectiles.length === 0 &&
      !showTypeBox &&
      queueAttack.current === 0 &&
      nextQueuedAttack.current <= 0
    ) {
      setShowTypeBox(true);
      queueAttack.current = 2;
      nextQueuedAttack.current = 5 + Math.random() * 0.5;
    }
  }, [projectiles]);

  return (
    <>
      <group ref={root} position={position} dispose={null}>
        <group ref={animRef}>
          <group
            scale={[0.005, 0.005, 0.005]}
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
        </group>
        {!dead && showTypeBox && (
          <Typebox
            text={text}
            position={[0, -2, 0]}
            onHit={() => {
              game.sounds["shot"].play();
              state.hit = 1;
            }}
            onFinished={shot}
          />
        )}
      </group>

      {projectiles.map((projectile) => {
        return (
          <ThrowingZombieProjectile
            position={position}
            key={projectile.id}
            cameraOffset={projectile.cameraOffset}
            onDeath={() => {
              setProjectiles((projectiles) => {
                const clone = [...projectiles];
                const found = clone.find(
                  (toFind) => toFind.id === projectile.id,
                );
                if (found !== -1) {
                  clone.splice(clone.indexOf(found), 1);
                }
                return clone;
              });
            }}
          />
        );
      })}
    </>
  );
}
