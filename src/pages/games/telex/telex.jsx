import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { createPage } from "../../../app";
import Banner from "../../../components/Banner";
import { Html, useTexture } from "@react-three/drei";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "./telex.scss";
import Button from "../../../components/ui/Button";

/*

Build a map in blender3D
Go around in a circle.

Level 1:
3 zombies walking slowly, 1 at a time.

Level 2:
Chasing after human.
2 more zombies walking slowly

Level 3:
Zombie throwing barrels. (Small words)

Level 4:
Giant zombie.
Eveyr 3 words, throws barrels.


// Step 1
Have three zombies on screen, slowly walking back
"Kill" them if they walk too close (respawn)

// Step 2
Create a simple cube level.
Kill 1 zombie, kill 2 zombies, kill 3 zombies, go in a circle.
Select better words without the same starting letter.



// Telex stuff
If you type "ư" and then you type "o" it will
automatically turn into "ơ".

Typing in "w" will make an "ư"
Typing in "w" will turn any "o" or "u" into
ơ and ư.

Accents usually magnetize to the strongest vowels first.
"o"
"e"
"u"
"a"
"i"


*/

const KEY_TO_CHAR = {
  KeyA: "a",
  KeyB: "b",
  KeyC: "c",
  KeyD: "d",
  KeyE: "e",
  KeyG: "g",
  KeyH: "h",
  KeyI: "i",
  KeyK: "k",
  KeyL: "l",
  KeyM: "m",
  KeyN: "n",
  KeyO: "o",
  KeyP: "p",
  KeyQ: "q",
  KeyR: "r",
  KeyS: "s",
  KeyT: "t",
  KeyU: "u",
  KeyV: "v",
  KeyX: "x",
  KeyY: "y",
  Space: " ",
};

const ACCENT_DECODE_MAP = {
  ă: { letter: "a", variation: "U" },
  â: { letter: "a", variation: "^" },
  đ: { letter: "d", variation: "-" },
  ê: { letter: "e", variation: "^" },
  ô: { letter: "o", variation: "^" },
  ơ: { letter: "o", variation: "," },
  ư: { letter: "u", variation: "," },

  á: { letter: "a", accent: "/" },
  é: { letter: "e", accent: "/" },
  ý: { letter: "y", accent: "/" },
  í: { letter: "i", accent: "/" },
  ó: { letter: "o", accent: "/" },
  ú: { letter: "u", accent: "/" },

  à: { letter: "a", accent: "|" },
  è: { letter: "e", accent: "|" },
  ỳ: { letter: "y", accent: "|" },
  ì: { letter: "i", accent: "|" },
  ò: { letter: "o", accent: "|" },
  ù: { letter: "u", accent: "|" },

  ả: { letter: "a", accent: "?" },
  ẻ: { letter: "e", accent: "?" },
  ỷ: { letter: "y", accent: "?" },
  ỉ: { letter: "i", accent: "?" },
  ỏ: { letter: "o", accent: "?" },
  ủ: { letter: "u", accent: "?" },

  ã: { letter: "a", accent: "~" },
  ẽ: { letter: "e", accent: "~" },
  ỹ: { letter: "y", accent: "~" },
  ĩ: { letter: "i", accent: "~" },
  õ: { letter: "o", accent: "~" },
  ũ: { letter: "u", accent: "~" },

  ạ: { letter: "a", accent: "." },
  ẹ: { letter: "e", accent: "." },
  ỵ: { letter: "y", accent: "." },
  ị: { letter: "i", accent: "." },
  ọ: { letter: "o", accent: "." },
  ụ: { letter: "u", accent: "." },

  ắ: { letter: "a", variation: "U", accent: "/" },
  ấ: { letter: "a", variation: "^", accent: "/" },
  ế: { letter: "e", variation: "^", accent: "/" },
  ố: { letter: "o", variation: "^", accent: "/" },
  ớ: { letter: "o", variation: ",", accent: "/" },
  ứ: { letter: "u", variation: ",", accent: "/" },

  ằ: { letter: "a", variation: "U", accent: "|" },
  ầ: { letter: "a", variation: "^", accent: "|" },
  ề: { letter: "e", variation: "^", accent: "|" },
  ồ: { letter: "o", variation: "^", accent: "|" },
  ờ: { letter: "o", variation: ",", accent: "|" },
  ừ: { letter: "u", variation: ",", accent: "|" },

  ẳ: { letter: "a", variation: "U", accent: "?" },
  ẩ: { letter: "a", variation: "^", accent: "?" },
  ể: { letter: "e", variation: "^", accent: "?" },
  ổ: { letter: "o", variation: "^", accent: "?" },
  ở: { letter: "o", variation: ",", accent: "?" },
  ử: { letter: "u", variation: ",", accent: "?" },

  ẵ: { letter: "a", variation: "U", accent: "~" },
  ẫ: { letter: "a", variation: "^", accent: "~" },
  ễ: { letter: "e", variation: "^", accent: "~" },
  ỗ: { letter: "o", variation: "^", accent: "~" },
  ỡ: { letter: "o", variation: ",", accent: "~" },
  ữ: { letter: "u", variation: ",", accent: "~" },

  ặ: { letter: "a", variation: "U", accent: "." },
  ậ: { letter: "a", variation: "^", accent: "." },
  ệ: { letter: "e", variation: "^", accent: "." },
  ộ: { letter: "o", variation: "^", accent: "." },
  ợ: { letter: "o", variation: ",", accent: "." },
  ự: { letter: "u", variation: ",", accent: "." },
};

const ACCESS_ENCODE_MAP = {};
for (let key of Object.keys(ACCENT_DECODE_MAP)) {
  const val = ACCENT_DECODE_MAP[key];
  ACCESS_ENCODE_MAP[val.letter + (val.variation || "") + (val.accent || "")] =
    key;
}

const VOWEL_PRIORITY = ["e", "a", "o", "u", "i", "y"];

function convertToDecoded(text) {
  const codes = [];
  for (let letter of text) {
    if (ACCENT_DECODE_MAP[letter]) {
      codes.push(ACCENT_DECODE_MAP[letter]);
    } else {
      codes.push({ letter: letter, original: letter });
    }
  }
  return codes;
}

function decodedToText(array) {
  return array
    .map(
      (decoded) =>
        ACCESS_ENCODE_MAP[
          decoded.letter + (decoded.variation || "") + (decoded.accent || "")
        ] || decoded.letter
    )
    .join("");
}

function telexComparison(left, right) {
  // 0 = wrong
  // 1 = right path
  // 2 = fully correct

  let partial = false;

  for (let i = 0; i < right.length; i++) {
    if (!left[i]) {
      return 0;
    }

    if (left[i].letter !== right[i].letter) {
      return 0;
    }

    if (right[i].variation && left[i].variation !== right[i].variation) {
      return 0;
    }

    if (right[i].accent && left[i].accent !== right[i].accent) {
      return 0;
    }

    if (left[i].variation !== right[i].variation) {
      partial = true;
    }

    if (left[i].accent !== right[i].accent) {
      partial = true;
    }

    // Cannot move on until all accent marks are added.
    if (left[i].letter === " ") {
      if (partial) {
        return 0;
      }
    }
  }

  if (partial) {
    return 1;
  } else {
    return 2;
  }
}

const DICTIONARY_LEVEL_1 = [
  "giờ",
  "lịch",
  "một",
  "đi",
  "xa",
  "nhỏ",
  "đẹp",
  "dễ",
  "bạn",
  "ngon",
  "vâng",
  "thứ",
  "xe",
  "máy",
  "hai",
  "ba",
  "năm",
  "trà",
];

const DICTIONARY_LEVEL_2 = [
  // "bún bò huế",
  "bún bò",
  // "phở đạc biệt",
  "phở gà",
  "bánh xèo",
  // "xôi thập cẩm",
  // "cà phê sữa đá",
  "cà phê",
  "hủ tiếu",
  "phở trộn",
  "đạc biệt",
  "vui qúa",
];

const GameContext = createContext();

function Zombie({ position, onDeath, speed = 2 }) {
  const game = useContext(GameContext);
  const root = useRef();
  const materialRef = useRef();

  const [text, setText] = useState(() => {
    return [];
  });
  const [focused, setFocused] = useState(false);
  const [typed, setTyped] = useState([]);
  const [dead, setDead] = useState(false);

  useEffect(() => {
    respawn();

    return () => {
      // Oh nooo I am dead!
      // I don't want the focus anymore!!
      if (game && focused && game.focused.current) {
        game.focused.current = false;
        game.removeWord(decodedToText(text));
      }
    };
  }, []);

  const damage = () => {
    game.setLife((life) => life - 1);
  };

  const shot = (shouldScore) => {
    if (shouldScore) {
      game.setScore((score) => score + 1);
    }

    onDeath && onDeath();
    setDead(true);

    if (focused) {
      game.removeWord(decodedToText(text));

      if (focused && game.focused.current) {
        game.focused.current = false;
        setFocused(false);
      }
    }
  };

  const respawn = () => {
    root.current.position.x = position[0];
    root.current.position.y = position[1];
    root.current.position.z = position[2];
    console.log(root.current.position);

    if (!game) return;

    if (focused) {
      game.removeWord(decodedToText(text));

      if (focused && game.focused.current) {
        game.focused.current = false;
        setFocused(false);
      }
    }

    setText(convertToDecoded(game.generateWord()));
    setTyped([]);
  };

  const state = useThree();

  useFrame((state, deltaTime) => {
    if (!game.playing) {
      return;
    }
    if (dead) {
      return;
    }
    const goal = state.camera.position.clone();
    goal.y = -1;
    root.current.position.add(
      goal
        .sub(root.current.position)
        .normalize()
        .multiplyScalar(deltaTime * speed)
    );
    root.current.position.y = -1;
    if (root.current.position.distanceTo(state.camera.position) < 4) {
      damage();
      shot(false);
    }
    root.current.rotation.y = Math.atan2(
      state.camera.position.x - root.current.position.x,
      state.camera.position.z - root.current.position.z
    );
    if (focused) {
      state.hit = state.hit || 0;
      if (state.hit > 0) {
        state.hit -= deltaTime * 10;
        materialRef.current.color = new THREE.Color(10, 1, 1);
      }
      if (state.hit < 0) {
        state.hit = 0;
        materialRef.current.color = new THREE.Color(1, 1, 1);
      }
    } else {
      materialRef.current.color = new THREE.Color(1, 1, 1);
    }
  });

  useEffect(() => {
    const keyPress = (e) => {
      // This is a letter!
      const proposal = _.cloneDeep(typed);
      if (KEY_TO_CHAR[e.code]) {
        proposal.push({ letter: KEY_TO_CHAR[e.code] });
      }

      // W key or , accent mark or U accent mark
      if (e.code === "KeyW") {
        // Search for U or O.
        let haveUorO = false;
        let haveA = false;
        for (let i = proposal.length - 1; i >= 0; i--) {
          if (proposal[i].letter == " ") {
            break;
          }
          if (proposal[i].letter === "u" || proposal[i].letter === "o") {
            haveUorO = true;
          }
          if (proposal[i].letter === "a") {
            haveA = true;
          }
        }
        if (haveUorO) {
          for (let i = proposal.length - 1; i >= 0; i--) {
            if (proposal[i].letter == " ") {
              break;
            }
            if (proposal[i].letter == "u" || proposal[i].letter == "o") {
              proposal[i].variation = ",";
            }
          }
        } else if (haveA) {
          for (let i = proposal.length - 1; i >= 0; i--) {
            if (proposal[i].letter == " ") {
              break;
            }
            if (proposal[i].letter == "a") {
              proposal[i].variation = "U";
            }
          }
        } else {
          proposal.push({ letter: "u", variation: "," });
        }
      }
      // Did we already have a "," mark?
      // Let's follow that.
      if (e.code === "KeyO") {
        let haveMark = false;
        for (let i = proposal.length - 1; i >= 0; i--) {
          if (proposal[i].letter == " ") {
            break;
          }
          if (proposal[i].letter === "u" && proposal[i].variation === ",") {
            haveMark = true;
          }
        }
        if (haveMark) {
          for (let i = proposal.length - 1; i >= 0; i--) {
            if (proposal[i].letter == " ") {
              break;
            }
            if (proposal[i].letter == "u" || proposal[i].letter == "o") {
              proposal[i].variation = ",";
            }
          }
        }
      }

      if (
        e.code === "KeyR" ||
        e.code === "KeyS" ||
        e.code === "KeyF" ||
        e.code === "KeyX" ||
        e.code === "KeyJ"
      ) {
        let vowelsFound = [];
        let vowelIndex;
        for (vowelIndex = proposal.length - 1; vowelIndex >= 0; vowelIndex--) {
          if (proposal[vowelIndex].letter == " ") {
            break;
          }

          const priority = VOWEL_PRIORITY.indexOf(proposal[vowelIndex].letter);
          if (priority !== -1) {
            vowelsFound.push({ vowelIndex, priority });
          }
        }
        vowelsFound.sort((a, b) => a.priority - b.priority);
        if (vowelsFound.length > 0) {
          if (e.code === "KeyR") {
            proposal[vowelsFound[0].vowelIndex].accent = "?";
          } else if (e.code === "KeyS") {
            proposal[vowelsFound[0].vowelIndex].accent = "/";
          } else if (e.code === "KeyF") {
            proposal[vowelsFound[0].vowelIndex].accent = "|";
          } else if (e.code === "KeyX") {
            proposal[vowelsFound[0].vowelIndex].accent = "~";
          } else if (e.code === "KeyJ") {
            proposal[vowelsFound[0].vowelIndex].accent = ".";
          }
          if (e.code !== "KeyF" && e.code !== "KeyJ") {
            proposal.pop();
          }
        }
      }

      // Double Letter Marks (e o a d)
      let doubleLetterToFind;
      if (e.code === "KeyE") {
        doubleLetterToFind = "e";
      }
      if (e.code === "KeyO") {
        doubleLetterToFind = "o";
      }
      if (e.code === "KeyA") {
        doubleLetterToFind = "a";
      }
      if (e.code === "KeyD") {
        doubleLetterToFind = "d";
      }
      if (doubleLetterToFind) {
        for (let i = proposal.length - 2; i >= 0; i--) {
          if (proposal[i].letter == " ") {
            break;
          }

          if (proposal[i].letter === doubleLetterToFind) {
            if (doubleLetterToFind === "d") {
              proposal[i].variation = "-";
            } else {
              proposal[i].variation = "^";
            }
            proposal.pop();
            break;
          }
        }
      }

      // console.log(text);
      // console.log(proposal);
      // console.log(telexComparison(text, proposal));

      const comparison = telexComparison(text, proposal);

      console.log(game.focused.current);

      if (comparison > 0 && proposal.length > 0) {
        if (focused) {
          setTyped(proposal);
          state.hit = 1;
        } else {
          if (!game.focused.current) {
            game.focused.current = true;
            setFocused(true);
            setTyped(proposal);
            state.hit = 1;
          }
        }
        if (
          focused &&
          proposal.length === text.length &&
          comparison === 2 &&
          game.focused.current
        ) {
          shot(true);
          // respawn();
        }
      }
    };
    window.addEventListener("keypress", keyPress);
    return () => {
      window.removeEventListener("keypress", keyPress);
    };
  }, [typed, focused, game]);

  const map = useTexture(require("./assets/zombie.png"));

  return (
    <object3D ref={root} position={position}>
      <mesh scale={[2, 4, 2]}>
        <planeGeometry attach="geometry" args={[1, 1, 1]} />
        {/* <boxGeometry attach="geometry" args={[1, 1, 1]} /> */}
        <meshStandardMaterial
          ref={materialRef}
          attach="material"
          color="white"
          transparent
          map={map}
        />
      </mesh>
      {!dead && (
        <Html position={[0, -2, 0]} transform>
          <div className="type-box-stopper">
            <div className={["type-box", focused && "focused"].join(" ")}>
              <div className="expected">{decodedToText(text)}</div>
              <div className="typed">{decodedToText(typed)}</div>
            </div>
          </div>
        </Html>
      )}
    </object3D>
  );
}

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
      { type: "zombie", position: [3, 0, 20] },
      { type: "zombie", position: [-15, 0, 0] },
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

function Scene({ stage, onCameraEnded }) {
  const map = useTexture(require("./assets/concrete.jpg"));
  const skybox = useTexture(require("./assets/sky.jpg"));

  const state = useThree();
  const { camera } = state;

  const cameraState = useRef({}).current;

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
      {/* <mesh scale={[60, 50, 1]} position={[0, 5, -20]}>
        <planeGeometry attach="geometry" args={[1, 1, 1]} />
        <meshStandardMaterial attach="material" map={skybox} />
      </mesh> */}
      <mesh scale={[40, 1, 40]} position={[0, -3, 0]}>
        <boxGeometry attach="geometry" args={[1, 1, 1]} />
        <meshStandardMaterial attach="material" map={map} />
      </mesh>
      <mesh scale={[5, 5, 5]} position={[0, 0, 0]}>
        <boxGeometry attach="geometry" args={[1, 1, 1]} />
        <meshStandardMaterial attach="material" map={map} />
      </mesh>
    </>
  );
}

let GLOBAL_ENTITY_TRACKER = 0;
let DEBUG_STAGE = null;

export default function TelexGamePage() {
  const focused = useRef();
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [life, setLife] = useState(3);
  const wordsUsed = useRef([]);

  // Idk man...
  // Idk how to handle entities in react cleanly.
  const [entities, setEntities] = useState([]);

  const generateWord = () => {
    if (wordsUsed.current) {
      for (let i = 0; i < 10; i++) {
        const dictionary = [
          ...DICTIONARY_LEVEL_1,
          ...(score > 10 ? DICTIONARY_LEVEL_2 : []),
        ];
        const randomWord =
          dictionary[Math.floor(dictionary.length * Math.random())];
        if (
          wordsUsed.current
            .map(
              (word) =>
                ACCENT_DECODE_MAP[word.charAt(0)]?.letter || word.charAt(0)
            )
            .indexOf(
              ACCENT_DECODE_MAP[randomWord.charAt(0)]?.letter ||
                randomWord.charAt(0)
            ) === -1
        ) {
          wordsUsed.current.push(randomWord);
          return randomWord;
        }
      }

      const randomWord =
        dictionary[Math.floor(dictionary.length * Math.random())];
      wordsUsed.current.push(randomWord);
      return randomWord;
    }
  };

  const removeWord = (word) => {
    console.log("remove " + word);

    if (wordsUsed.current.indexOf(word) !== -1) {
      wordsUsed.current.splice(wordsUsed.current.indexOf(word), 1);
    }
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

  return (
    <>
      <Banner>Telex of The Dead</Banner>
      {!playing && (
        <Button
          onClick={() => {
            setScore(0);
            setLife(3);
            setPlaying(true);
            startRound(0);
            wordsUsed.current = [];
            focused.current = false;
          }}
        >
          Play
        </Button>
      )}
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
            focused: focused,
            score,
            setScore,
            life,
            setLife,
            playing,
            setPlaying,
            generateWord,
            removeWord,
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
                  if (entity.type === "zombie") {
                    console.log(entity.key);
                    return (
                      <Zombie
                        position={entity.position}
                        speed={entity.speed}
                        key={entity.key}
                        onDeath={() => {
                          const index = zombiesToTrack.current.indexOf(
                            entity.key
                          );
                          if (index !== -1) {
                            zombiesToTrack.current.splice(index, 1);
                            setEntities((entities) => {
                              const clone = [...entities];
                              const found = clone.find(
                                (toFind) => toFind.key === entity.key
                              );
                              console.log(found);
                              console.log(found);
                              if (found !== -1) {
                                clone.splice(clone.indexOf(found), 1);
                              }
                              return clone;
                            });
                          }
                          if (zombiesToTrack.current.length === 0) {
                            startRound((round + 1) % KEY_POINTS.length);
                          }
                        }}
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
            <Scene stage={round} />
          </Canvas>
        </GameContext.Provider>
      </div>
    </>
  );
}

createPage(TelexGamePage, { showPets: false });
