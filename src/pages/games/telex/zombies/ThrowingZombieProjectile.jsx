import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { GameContext } from "../telex";
import { useFrame, useGraph, useThree } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";
import { Typebox } from "../Typebox";
import * as THREE from "three";

function easeOutExpo(x) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export function ThrowingZombieProjectile({
  position,
  onDeath,
  speed = 1,
  cameraOffset,
}) {
  const game = useContext(GameContext);
  const root = useRef();

  const [dead, setDead] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const newText = game.generateWord(1);
    setText(newText);
    return () => {
      game.removeWord(newText);
    };
  }, []);

  const { scene, animations, materials } = useGLTF(
    require("../assets/bottle.glb"),
  );
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone);

  const { ref: animRef, actions, names } = useAnimations(animations);

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
      state.camera.getWorldDirection(new THREE.Vector3()),
    );
    const pan = side.dot(
      root.current.position.clone().sub(state.camera.position).normalize(),
    );
    game.sounds["death"].stereo(-pan * 0.7);
    game.sounds["death"].play();
  };

  const state = useThree();
  const [attacking, setAttacking] = useState(false);
  const attackingTimer = useRef(0);
  const existenceTimer = useRef(0);

  useFrame((state, deltaTime) => {
    if (!game.playing) {
      return;
    }
    if (dead) {
      return;
    }

    animRef.current.rotateX(deltaTime * 2);
    animRef.current.rotateZ(deltaTime * 3);

    existenceTimer.current += deltaTime / 3;

    root.current.position.copy(
      new THREE.Vector3(...position).lerp(
        state.camera.position
          .clone()
          .add(
            state.camera
              .getWorldDirection(new THREE.Vector3())
              .multiplyScalar(1),
          )
          .add(
            new THREE.Vector3(...cameraOffset).applyQuaternion(
              state.camera.quaternion,
            ),
          ),
        easeOutExpo(existenceTimer.current),
      ),
    );

    if (existenceTimer.current > 1) {
      damage();
      shot(false);
    }

    // const goal = state.camera.position.clone();
    // console.log(root.current.position);
    // if (root.current.position.distanceTo(state.camera.position) < 5) {
    //   damage();
    //   shot(false);
    // } else {
    //   root.current.position.add(
    //     goal
    //       .sub(root.current.position)
    //       .normalize()
    //       .multiplyScalar(deltaTime * speed)
    //   );
    // }
    root.current.rotation.y = Math.atan2(
      state.camera.position.x - root.current.position.x,
      state.camera.position.z - root.current.position.z,
    );
  });

  console.log(nodes);

  return (
    <group ref={root} position={position} dispose={null}>
      <group ref={animRef}>
        <group
          scale={[0.2, 0.2, 0.2]}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
        >
          <primitive object={nodes.Scene} />
        </group>
      </group>
      {!dead && (
        <Typebox
          text={text}
          position={[0, 0, 0]}
          scale={[0.5, 0.5, 0.5]}
          onHit={() => {
            game.sounds["shot"].play();
            state.hit = 1;
          }}
          onFinished={shot}
        />
      )}
    </group>
  );
}
