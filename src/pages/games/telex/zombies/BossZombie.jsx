import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { GameContext } from "../telex";
import { useFrame, useGraph, useThree } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";
import { Typebox } from "../Typebox";
import * as THREE from "three";
import { ThrowingZombieProjectile } from "./ThrowingZombieProjectile";
import { BossZombieProjectile } from "./BossZombieProjectile";
import { DICTIONARY_LEVEL_2, DICTIONARY_LEVEL_3 } from "../dictionary";

function WordZombie({ scoreOverride, ...props }) {
  const game = useContext(GameContext);

  const [text, setText] = useState("");

  useEffect(() => {
    const newText = game.generateWord(scoreOverride);
    setText(newText);
    return () => {
      game.removeWord(newText);
    };
  }, [scoreOverride]);

  return <Typebox text={text} {...props}></Typebox>;
}

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

  const projectileIdTracker = useRef(0);
  const [projectiles, setProjectiles] = useState([]);

  const leftLeg = useRef();
  const [leftLegHealth, setLeftLegHealth] = useState(3);
  const leftArm = useRef();
  const [leftArmHealth, setLeftArmHealth] = useState(3);
  const rightArm = useRef();
  const [rightArmHealth, setRightArmHealth] = useState(3);
  const head = useRef();
  const [headHealth, setHeadHealth] = useState(3);

  console.log(nodes);

  useFrame((state, deltaTime) => {
    if (!leftLegHealth > 0) {
      nodes.mixamorigLeftLeg.scale.set(0, 0, 0);
    } else {
      const world = nodes.mixamorigLeftLeg.localToWorld(
        new THREE.Vector3(0, 0, 0)
      );
      animRef.current.worldToLocal(world);
      leftLeg.current.position.copy(world);
    }

    if (!leftArmHealth > 0) {
      nodes.mixamorigLeftArm.scale.set(0, 0, 0);
    } else {
      const world = nodes.mixamorigLeftHand.localToWorld(
        new THREE.Vector3(0, 0, 0)
      );
      animRef.current.worldToLocal(world);
      leftArm.current.position.copy(world);
    }

    if (!rightArmHealth > 0) {
      nodes.mixamorigRightArm.scale.set(0, 0, 0);
    } else {
      const world = nodes.mixamorigRightHand.localToWorld(
        new THREE.Vector3(0, 0, 0)
      );
      animRef.current.worldToLocal(world);
      rightArm.current.position.copy(world);
    }

    if (!headHealth > 0) {
      nodes.mixamorigNeck.scale.set(0, 0, 0);
    } else {
      const world = nodes.mixamorigHead.localToWorld(
        new THREE.Vector3(0, 0, 0)
      );
      animRef.current.worldToLocal(world);
      head.current.position.copy(world);
    }

    if (!game.playing) {
      return;
    }
    if (dead) {
      return;
    }
    const goal = state.camera.position.clone();
    goal.y = -1;
    if (root.current.position.distanceTo(state.camera.position) < 7) {
      if (nextAttack.current > 0) {
        nextAttack.current -= deltaTime;
      }
      if (!attacking && nextAttack.current <= 0) {
        actions["walking"].fadeOut(0.2);
        actions["attack"].play();
        actions["attack"].timeScale = 0.5;
        attackingTimer.current = 0;
        setAttacking(true);
      } else if (attacking) {
        attackingTimer.current += deltaTime;
        if (attackingTimer.current > 3) {
          damage();
          setAttacking(false);
          nextAttack.current = 5;
          attackingTimer.current = 0;
        }
      }
    } else {
      root.current.position.add(
        goal
          .sub(root.current.position)
          .normalize()
          .multiplyScalar(deltaTime * speed)
      );
    }
    root.current.position.y = -1;
    root.current.rotation.y = Math.atan2(
      state.camera.position.x - root.current.position.x,
      state.camera.position.z - root.current.position.z
    );
  });

  const spawnProjectile = (parent) => {
    setProjectiles((projectiles) => [
      ...projectiles,
      {
        id: ++projectileIdTracker.current,
        parent: parent,
        cameraOffset: [
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 0.5,
          0,
        ],
      },
    ]);
  };

  return (
    <>
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
          {leftLegHealth > 0 && (
            <group ref={leftLeg}>
              <WordZombie
                key={leftLegHealth}
                scoreOverride={
                  leftLegHealth === 1 ? DICTIONARY_LEVEL_3 : DICTIONARY_LEVEL_2
                }
                position={[0, 0, 0]}
                onHit={() => {
                  game.sounds["shot"].play();
                }}
                onFinished={() => {
                  setLeftLegHealth((health) => health - 1);
                  if (leftLegHealth === 1) {
                    spawnProjectile(nodes.mixamorigLeftLeg);
                    spawnProjectile(nodes.mixamorigLeftLeg);
                    spawnProjectile(nodes.mixamorigLeftLeg);
                  }
                }}
              />
            </group>
          )}
          {leftArmHealth > 0 && (
            <group ref={leftArm}>
              {[
                <WordZombie
                  key={leftArmHealth}
                  scoreOverride={
                    leftArmHealth === 1
                      ? DICTIONARY_LEVEL_3
                      : DICTIONARY_LEVEL_2
                  }
                  position={[0, 0, 0]}
                  onHit={() => {
                    game.sounds["shot"].play();
                  }}
                  onFinished={() => {
                    setLeftArmHealth((health) => health - 1);
                    if (leftArmHealth === 1) {
                      spawnProjectile(nodes.mixamorigLeftHand);
                      spawnProjectile(nodes.mixamorigLeftHand);
                      spawnProjectile(nodes.mixamorigLeftHand);
                    }
                  }}
                />,
              ]}
            </group>
          )}
          {rightArmHealth > 0 && (
            <group ref={rightArm}>
              {[
                <WordZombie
                  key={rightArmHealth}
                  scoreOverride={
                    rightArmHealth === 1
                      ? DICTIONARY_LEVEL_3
                      : DICTIONARY_LEVEL_2
                  }
                  position={[0, 0, 0]}
                  onHit={() => {
                    game.sounds["shot"].play();
                  }}
                  onFinished={() => {
                    setRightArmHealth((health) => health - 1);
                    if (rightArmHealth === 1) {
                      spawnProjectile(nodes.mixamorigRightHand);
                      spawnProjectile(nodes.mixamorigRightHand);
                      spawnProjectile(nodes.mixamorigRightHand);
                    }
                  }}
                />,
              ]}
            </group>
          )}
          <group ref={head}>
            {headHealth > 0 &&
              leftArmHealth <= 0 &&
              rightArmHealth <= 0 &&
              leftLegHealth <= 0 &&
              projectiles.length === 0 && [
                <WordZombie
                  key={headHealth}
                  scoreOverride={DICTIONARY_LEVEL_3}
                  position={[0, 0, 0]}
                  onHit={() => {
                    game.sounds["shot"].play();
                  }}
                  onFinished={() => {
                    setHeadHealth((health) => health - 1);
                    if (headHealth === 1) {
                      onDeath();
                    }
                  }}
                />,
              ]}
          </group>
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
        {projectiles.map((projectile) => {
          return (
            <BossZombieProjectile
              parent={projectile.parent}
              key={projectile.id}
              id={projectile.id}
              cameraOffset={projectile.cameraOffset}
              onDeath={() => {
                setProjectiles((projectiles) => {
                  const clone = [...projectiles];
                  const found = clone.find(
                    (toFind) => toFind.id === projectile.id
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
      </group>
    </>
  );
}
