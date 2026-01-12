import { Canvas, useFrame, useGraph, useThree } from "@react-three/fiber";
import { createPage } from "../../../app";
import Banner from "../../../components/Banner";
import {
  Clone,
  Fbx,
  Gltf,
  Html,
  Loader,
  useAnimations,
  useFBX,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import {
  createContext,
  forwardRef,
  Suspense,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import "./telex.scss";
import Button from "../../../components/ui/Button";
import { Howl, Howler } from "howler";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";
import { generateWordNotInArray, Typebox } from "./Typebox";
import { WalkingZombie } from "./zombies/WalkingZombie";
import { ThrowingZombie } from "./zombies/ThrowingZombie";

export const GameContext = createContext();

const KEY_POINTS = [
  {
    entities: [
      { type: "zombie", position: [3, -3, -10] },
      { type: "zombie", position: [9, -3, -20] },
      { type: "zombie", position: [15, -3, -8] },
    ],
    track: [
      { position: [1, 0, 6], rotation: [0, -Math.PI / 2, 0], duration: 1 },
      { position: [6, 0, 6], rotation: [0, 0, 0], duration: 1 },
    ],
  },
  {
    entities: [
      { type: "throwing_zombie", position: [3, -1, 20] },
      { type: "throwing_zombie", position: [-15, -1, 0] },
    ],
    track: [
      { position: [6, 0, -1], rotation: [0, 0, 0], duration: 1 },
      {
        position: [6, 0, -6],
        rotation: [0, Math.PI / 2 + 0.2, 0],
        duration: 0.5,
      },
      {
        position: [5, 0, -6],
        rotation: [0.2, Math.PI / 2 + 0.8, 0],
        duration: 1,
      },
    ],
  },
  {
    entities: [
      { type: "zombie", position: [-2, 0, 10] },
      { type: "zombie", position: [-6, 0, 15] },
      { type: "zombie", position: [-15, 0, 9] },
      { type: "zombie", position: [-20, 0, 9] },
    ],
    track: [
      { position: [-1, 0, -6], rotation: [0, Math.PI / 2, 0], duration: 1 },
      { position: [-6, 0, -6], rotation: [0, Math.PI, 0], duration: 1 },
    ],
  },
  {
    entities: [
      { type: "zombie", position: [20, 0, 10], speed: 7 },
      { type: "zombie", position: [30, 0, 7], speed: 7 },
      { type: "zombie", position: [40, 0, 15], speed: 7 },
      { type: "zombie", position: [60, 0, 15], speed: 10 },
      { type: "zombie", position: [70, 0, 15], speed: 10 },
    ],
    track: [
      { position: [-6, 0, 1], rotation: [0, Math.PI, 0], duration: 1 },
      { position: [-6, 0, 6], rotation: [0, -Math.PI / 2, 0], duration: 1 },
    ],
  },
];

/*

playCameraAnimation();

*/

const Scene = forwardRef(({ stage, onCameraEnded }, ref) => {
  const map = useTexture(require("./assets/concrete.jpg"));
  const skybox = useTexture(require("./assets/sky.gif"));
  const cabin = useTexture(require("./assets/cabin.jpg"));

  const state = useThree();
  const { camera, scene } = state;

  scene.background = skybox;

  const cameraState = useRef({}).current;

  useImperativeHandle(
    ref,
    () => {
      return {
        jumpToBeginning(round) {
          cameraState.cameraAnimId = round || cameraState.cameraAnimId;
          if (cameraState.cameraAnimId !== -1) {
            cameraState.cameraAnimSubId =
              KEY_POINTS[cameraState.cameraAnimId]?.track.length - 1;
            cameraState.cameraAnimTime = 0;
            const goal =
              KEY_POINTS[cameraState.cameraAnimId]?.track[
                cameraState.cameraAnimSubId
              ];
            if (goal) {
              cameraState.cameraAnimTime = goal.duration;
              const goalPos = new THREE.Vector3(...goal.position);
              const goalAng = new THREE.Quaternion().setFromEuler(
                new THREE.Euler(...goal.rotation, "ZYX")
              );
              camera.position.copy(goalPos);
              camera.quaternion.copy(goalAng);
              cameraState.cameraStartPos = camera.position.clone();
              cameraState.cameraStartAng = camera.quaternion.clone();
            }
          }
        },
      };
    },
    []
  );

  const playCameraAnimation = (id) => {
    cameraState.cameraAnimId = id;
    cameraState.cameraAnimSubId = 0;
    cameraState.cameraAnimTime = 0;
    cameraState.cameraStartPos = camera.position.clone();
    cameraState.cameraStartAng = camera.quaternion.clone();
  };

  const onCameraAnimEnded = (id) => {
    // setTimeout(() => {
    //   playCameraAnimation((id + 1) % KEY_POINTS.length);
    // }, 1000);
  };

  useEffect(() => {
    playCameraAnimation(stage);
  }, [stage]);

  useEffect(() => {
    camera.position.set(0, 0, 0);
  }, []);

  useFrame((state, delta) => {
    if (state.size.height > state.size.width) {
      state.camera.fov = 120;
      state.camera.updateProjectionMatrix();
    }
    if (cameraState.cameraAnimId !== -1) {
      const goal =
        KEY_POINTS[cameraState.cameraAnimId]?.track[
          cameraState.cameraAnimSubId
        ];
      if (goal) {
        const goalPos = new THREE.Vector3(...goal.position);
        const goalAng = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(...goal.rotation, "ZYX")
        );
        cameraState.cameraAnimTime = cameraState.cameraAnimTime + delta;
        if (DEBUG_STAGE !== null) {
          cameraState.cameraAnimTime = cameraState.cameraAnimTime + delta * 100;
        }
        const progress = Math.min(
          cameraState.cameraAnimTime / goal.duration,
          1
        );
        camera.quaternion.slerpQuaternions(
          camera.quaternion,
          goalAng,
          progress
        );
        camera.position.lerpVectors(
          cameraState.cameraStartPos,
          goalPos,
          progress
        );
        if (cameraState.cameraAnimTime >= goal.duration) {
          cameraState.cameraStartPos = goalPos;
          cameraState.cameraAnimTime = 0;
          cameraState.cameraAnimSubId++;
          if (
            cameraState.cameraAnimSubId >=
            KEY_POINTS[cameraState.cameraAnimId].track.length
          ) {
            onCameraAnimEnded(cameraState.cameraAnimId);
          }
        }
      }
    }
  });

  return (
    <>
      <mesh scale={[40, 1, 40]} position={[0, -3, 0]}>
        <boxGeometry attach="geometry" args={[1, 1, 1]} />
        <meshStandardMaterial attach="material" map={map} />
      </mesh>
      <mesh scale={[5, 5, 5]} position={[0, 0, 0]}>
        <boxGeometry attach="geometry" args={[1, 1, 1]} />
        <meshStandardMaterial attach="material" map={cabin} />
      </mesh>
    </>
  );
});

let GLOBAL_ENTITY_TRACKER = 0;
let DEBUG_STAGE = null;

export default function TelexGamePage() {
  const [focused, setFocused] = useState();
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [life, setLife] = useState(3);
  const wordsUsed = useRef([]);
  const scene = useRef();

  // Idk man...
  // Idk how to handle entities in react cleanly.
  const [entities, setEntities] = useState([]);

  const generateWord = (scoreOverride) => {
    const newWord = generateWordNotInArray(
      scoreOverride || score,
      wordsUsed.current
    );
    wordsUsed.current.push(newWord);
    return newWord;
  };

  const removeWord = (word) => {
    console.log("removed", word);
    console.log(wordsUsed.current);
    if (wordsUsed.current.indexOf(word) !== -1) {
      wordsUsed.current.splice(wordsUsed.current.indexOf(word), 1);
    }
    console.log(wordsUsed.current);
  };

  useEffect(() => {
    if (life <= 0) {
      setPlaying(false);
    }
  }, [life]);

  const [round, setRound] = useState(0);
  const zombiesToTrack = useRef([]);
  const startRound = (round) => {
    console.log(round);
    setRound(round);
    setEntities((entities) => {
      const clone = [...entities];
      for (let toSpawn of KEY_POINTS[round].entities) {
        const id = GLOBAL_ENTITY_TRACKER++;
        clone.push({
          key: id,
          ...toSpawn,
        });
        zombiesToTrack.current.push(id);
      }
      return clone;
    });
  };

  useEffect(() => {
    if (DEBUG_STAGE !== null) {
      startRound(DEBUG_STAGE);
      setPlaying(true);
    }
  }, []);

  const floatingInput = useRef();
  useEffect(() => {
    const floatingInputFocus = () => {
      floatingInput.current.focus();
    };
    window.addEventListener("click", floatingInputFocus);
    return () => {
      window.removeEventListener("click", floatingInputFocus);
    };
  }, []);

  useEffect(() => {
    if (playing) {
      sounds["music"].play();
      sounds["deathMusic"].stop();
    } else {
      sounds["music"].stop();
      sounds["deathMusic"].play();
      sounds["deathMusic"].fade(0, 1, 5);
    }
  }, [playing]);

  const sounds = useMemo(
    () => ({
      shot: new Howl(
        {
          src: require("./assets/shot.mp3"),
          autoplay: false,
          volume: 1,
          // html5: true,
        },
        []
      ),
      death: new Howl(
        {
          src: require("./assets/death1.mp3"),
          autoplay: false,
          volume: 1,
          // html5: true,
        },
        []
      ),
      music: new Howl(
        {
          src: require("./assets/4our.mp3"),
          autoplay: false,
          volume: 1,
          loop: true,
          pool: 1,
          html5: true,
        },
        []
      ),
      deathMusic: new Howl(
        {
          src: require("./assets/death_music.mp3"),
          autoplay: false,
          volume: 1,
          loop: true,
          pool: 1,
          html5: true,
        },
        []
      ),
    }),
    []
  );

  useEffect(() => {
    return () => {
      Howler.stop();
      for (const sound of Object.values(sounds)) {
        sound.stop();
        sound.unload();
      }
    };
  }, []);

  return (
    <>
      <Banner>Telex of The Dead</Banner>
      {!playing && (
        <Button
          onClick={() => {
            setFocused();
            setScore(0);
            setLife(3);
            setPlaying(true);
            setEntities([]);
            startRound(0);
            scene.current.jumpToBeginning(round);
            zombiesToTrack.current = [];
            wordsUsed.current = [];
          }}
        >
          Play
        </Button>
      )}
      <p>Song: Phút Cuối Cùng by 4our</p>
      {playing ? "Playing" : "Not Playing"}
      <p>Score: {score}</p>
      <p>Life: {life}</p>
      <div style={{ height: 500, position: "relative" }}>
        <input
          ref={floatingInput}
          type="text"
          className="floating-input"
          value={""}
        ></input>
        <GameContext.Provider
          value={{
            focused,
            setFocused,
            score,
            setScore,
            life,
            setLife,
            playing,
            setPlaying,
            generateWord,
            removeWord,
            sounds,
          }}
        >
          <Canvas scene={{ background: "black" }}>
            <fog attach="fog" args={["black", 1, 30]} />
            <ambientLight />
            <directionalLight
              position={[1.3, 1.0, 4.4]}
              castShadow
              intensity={Math.PI * 0.5}
            />
            {/* <pointLight position={[0, 20, 10]} intensity={1.5} /> */}
            {
              playing &&
                entities.map((entity) => {
                  const onDeath = () => {
                    const index = zombiesToTrack.current.indexOf(entity.key);
                    if (index !== -1) {
                      zombiesToTrack.current.splice(index, 1);
                      setEntities((entities) => {
                        const clone = [...entities];
                        const found = clone.find(
                          (toFind) => toFind.key === entity.key
                        );
                        if (found !== -1) {
                          clone.splice(clone.indexOf(found), 1);
                        }
                        return clone;
                      });
                    }
                    if (zombiesToTrack.current.length === 0) {
                      startRound((round + 1) % KEY_POINTS.length);
                    }
                  };

                  if (entity.type === "zombie") {
                    return (
                      <WalkingZombie
                        position={entity.position}
                        speed={entity.speed}
                        key={entity.key}
                        onDeath={onDeath}
                      />
                    );
                  } else if (entity.type === "throwing_zombie") {
                    return (
                      <ThrowingZombie
                        position={entity.position}
                        speed={entity.speed}
                        key={entity.key}
                        onDeath={onDeath}
                      />
                    );
                  }
                })
              // <>
              //   <Zombie position={[2, -3, -5]} />
              //   <Zombie position={[9, -3, -10]} />
              //   <Zombie position={[-8, -3, -8]} />
              // </>
            }
            <Scene ref={scene} stage={round} />
          </Canvas>
          <h1>How to play:</h1>
          <p>
            This game implements two ways of typing Vietnamese characters, Telex
            and VNI.
          </p>
          <p>
            With telex, you can modify any vowel by typing a modifier letter
            directly after the vowel. Ex: uow becomes ươ
          </p>
          <p>The same can be done with other letters:</p>
          <table>
            <thead>
              <tr>
                <th>Typed</th>
                <th>Output</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  a<strong>s</strong>
                </td>
                <td>á</td>
              </tr>
              <tr>
                <td>
                  a<strong>f</strong>
                </td>
                <td>à</td>
              </tr>
              <tr>
                <td>
                  o<strong>j</strong>
                </td>
                <td>ọ</td>
              </tr>
              <tr>
                <td>
                  o<strong>x</strong>
                </td>
                <td>õ</td>
              </tr>
              <tr>
                <td>
                  o<strong>r</strong>
                </td>
                <td>ỏ</td>
              </tr>
              <tr>
                <td>
                  o<strong>w</strong>
                </td>
                <td>ơ</td>
              </tr>
              <tr>
                <td>
                  u<strong>w</strong>
                </td>
                <td>ư</td>
              </tr>
              <tr>
                <td>
                  uo<strong>w</strong>
                </td>
                <td>ươ</td>
              </tr>
              <tr>
                <td>
                  a<strong>w</strong>
                </td>
                <td>ă</td>
              </tr>
              <tr>
                <td colSpan={2}>
                  Typing o,e,a vowels twice modifies it with a ^ hat.
                </td>
              </tr>
              <tr>
                <td>
                  o<strong>o</strong>
                </td>
                <td>ô</td>
              </tr>
              <tr>
                <td>
                  e<strong>e</strong>
                </td>
                <td>ê</td>
              </tr>
              <tr>
                <td>
                  a<strong>a</strong>
                </td>
                <td>â</td>
              </tr>
              <tr>
                <td colSpan={2}>
                  You can use multiple modifiers on a character.
                </td>
              </tr>
              <tr>
                <td>
                  a<strong>as</strong>
                </td>
                <td>ấ</td>
              </tr>
            </tbody>
          </table>
          <p>
            The other way of writing vietnamese, using numbers instead, is
            implemented. I'm too lazy to write about it now.
          </p>
        </GameContext.Provider>
      </div>
    </>
  );
}
