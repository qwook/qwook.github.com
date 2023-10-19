import {
  AdditiveBlending,
  CubeTextureLoader,
  Euler,
  PerspectiveCamera,
  Quaternion,
  TextureLoader,
  Vector3,
} from "three";
import { BokehPass, UnrealBloomPass } from "three-stdlib";
import {
  Canvas,
  Object3DNode,
  extend,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import { Effects, useCubeTexture } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";

import Matter from "matter-js";
import _ from "lodash";
import cubeNZJpg from "./cube/nz.jpg";
import cubePZJpg from "./cube/pz.jpg";
import screenGlowPng from "./screenglow.png";

// import televisionPng from "./television.png";

extend({ BokehPass });
extend({ UnrealBloomPass });

declare module "@react-three/fiber" {
  interface ThreeElements {
    unrealBloomPass: Object3DNode<UnrealBloomPass, typeof UnrealBloomPass>;
    bokehPass: Object3DNode<BokehPass, typeof BokehPass>;
  }
}

function Box(props: { engine: Matter.Engine; start: [number, number] }) {
  const [body, setBody] = useState(
    Matter.Bodies.rectangle(props.start[0], props.start[1], 50, 50, {})
  );
  const lastClick = useRef(0);
  const cubeTexture = useCubeTexture(
    [cubePZJpg, cubePZJpg, cubePZJpg, cubePZJpg, cubeNZJpg, cubeNZJpg],
    { path: "" }
  );
  // const colorMap = useLoader(TextureLoader, televisionPng);
  const screenGlowMap = useLoader(TextureLoader, screenGlowPng);
  useEffect(() => {
    setBody(
      Matter.Bodies.rectangle(props.start[0], props.start[1], 50, 50, {
        friction: 0.01,
        mass: 2,
      })
    );
  }, []); //, [props.start]);

  useEffect(() => {
    const world = props.engine.world;
    Matter.World.add(world, [body]);

    return () => {
      Matter.World.remove(world, [body]);
    };
  }, [props.engine, body]);
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<any>();
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    // (ref.current as THREE.Mesh).rotation.z = -body.angle;
    // (ref.current as THREE.Mesh).rotation.x = body.angle * 0.01;
    if (clicked) {
      (ref.current as THREE.Mesh).position.lerp(new Vector3(0, 0, 4), 0.1);
      (ref.current as THREE.Mesh).quaternion.slerp(
        new Quaternion().setFromEuler(new Euler(0, 0, 0)),
        0.2
      );
    } else {
      // (ref.current as THREE.Mesh).position.x = (body.position.x / 50) * 1.5;
      // (ref.current as THREE.Mesh).position.y = (-body.position.y / 50) * 1.5;
      (ref.current as THREE.Mesh).position.lerp(
        new Vector3(
          (body.position.x / 50) * 1.5,
          (-body.position.y / 50) * 1.5,
          0
        ),
        Date.now() - lastClick.current < 500 ? 0.2 : 1
      );
      (ref.current as THREE.Mesh).quaternion.slerp(
        new Quaternion().setFromEuler(
          new Euler(body.angle * 0.01, 0, -body.angle)
        ),
        Date.now() - lastClick.current < 500 ? 0.2 : 1
      );
    }
  });
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      // scale={clicked ? 1.5 : 1}
      onPointerDown={(event) => {
        lastClick.current = Date.now();
        click(!clicked);
        event.stopPropagation();
      }}
      onPointerOver={(event) => {
        hover(true);
        event.stopPropagation();
      }}
      onPointerOut={(event) => hover(false)}
      castShadow={true}
      receiveShadow={true}
      scale={[1.5, 1.5, 1.5]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        // map={colorMap}
        // color={hovered ? "hotpink" : "rgb(180, 180, 180)"}
        color={"rgb(180, 180, 180)"}
        metalness={0.9}
        roughness={0.4}
        envMap={cubeTexture}
      />
      <mesh position={[0.3, -0.4, 0.48]} scale={[1, 1, 1]}>
        <boxGeometry args={[0.1, 0.05, 0.1]} />
        <meshStandardMaterial
          color={"rgb(180, 180, 180)"}
          metalness={0.9}
          roughness={0.4}
          envMap={cubeTexture}
        />
      </mesh>
      <mesh position={[0, 0.05, 0.5]} scale={[1, 1, 0.2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.7]} />
        <meshStandardMaterial
          metalness={1.0}
          roughness={0.15}
          color={hovered ? [1, 1, 1] : [0.2, 0.9, 1]}
          envMap={cubeTexture}
          emissive={"white"}
          emissiveIntensity={hovered ? 0.8 : 0.04}
        />
      </mesh>
      <mesh position={[0, 0.1, 0.6]} scale={[1.5, 1.5, 1]}>
        <planeGeometry args={[0.9, 0.9]} />
        <meshStandardMaterial
          map={screenGlowMap}
          transparent={true}
          visible={hovered}
          opacity={0.5}
          blending={AdditiveBlending}
        />
      </mesh>
    </mesh>
  );
}

function TelevisionRoomInternal() {

  const [engine] = useState(Matter.Engine.create({}));
  useEffect(() => {
    const world = engine.world;
    const floor = 200;
    const ground = [
      Matter.Bodies.rectangle(0, floor, 1000, 100, {
        isStatic: true,
        friction: 0.9,
      }),
      Matter.Bodies.rectangle(-110 - 150, 0, 300, 1000, {
        isStatic: true,
        friction: 0.9,
      }),
      Matter.Bodies.rectangle(110 + 150, 0, 300, 1000, {
        isStatic: true,
        friction: 0.9,
      }),
    ];
    Matter.World.add(world, ground);
    return () => {
      Matter.World.remove(world, ground);
    };
  }, [engine]);

  const { scene, gl, size, camera } = useThree();

  useFrame((state, delta) => {
    Matter.Engine.update(engine, Math.min(delta * 1000, 20));
    let pcam = camera as PerspectiveCamera;
    if (window.innerWidth/window.innerHeight < 0.7) {
      const hFOV = 80; // desired horizontal fov, in degrees
      pcam.fov =
        (Math.atan(Math.tan((hFOV * Math.PI) / 360) / pcam.aspect) * 360) /
        Math.PI; // degrees
      pcam.updateProjectionMatrix();
    } else {
      pcam.fov = 100;
      pcam.updateProjectionMatrix();
    }
  });

  return (
    <>
      <ambientLight />
      <directionalLight position={[0, 10, 5]} intensity={5} castShadow={true} />
      <Box engine={engine} start={[0, -200]} />
      <Box engine={engine} start={[15, -260]} />
      <Box engine={engine} start={[-25, -300]} />
      <Box engine={engine} start={[-35, -360]} />
      <Box engine={engine} start={[15, -400]} />
      <Box engine={engine} start={[-15, -460]} />
      <Box engine={engine} start={[25, -470]} />
      <Box engine={engine} start={[35, -500]} />
      <Box engine={engine} start={[-25, -600]} />
      <Box engine={engine} start={[-20, -600]} />
      <Box engine={engine} start={[-15, -610]} />
      <Box engine={engine} start={[-30, -620]} />
      {/* <Effects disableGamma={true}>
        <unrealBloomPass threshold={0.8} />
        <bokehPass
          args={[
            scene,
            camera as PerspectiveCamera,
            {
              focus: 0,
              aperture: 0.005,
              maxblur: 0.018,
            },
          ]}
        />
      </Effects> */}
    </>
  );
}

export default function TelevisionRoom() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    const resizeFn = _.debounce(() => {
      setSize([window.innerWidth, window.innerHeight]);
    }, 50);

    window.addEventListener("resize", resizeFn);
    return () => window.removeEventListener("resize", resizeFn);
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        // width: "100%",
        // height: "100%",
        width: size[0] + "px",
        height: size[1] + "px",
      }}
    >
      <Canvas shadows={"soft"}>
        <TelevisionRoomInternal />
      </Canvas>
    </div>
  );
}
