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

const VOWEL_PRIORITY = ["e", "o", "u", "a", "i", "y"];

console.log(ACCESS_ENCODE_MAP);

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
  "bún bò huế",
  "phở đạc biệt",
  "bánh xèo",
  "xôi thập cẩm",
  "cà phê sữa đá",
  "hủ tiếu khô",
  "phở trộn",
];

const GameContext = createContext();

function Zombie({ position }) {
  const game = useContext(GameContext);
  const root = useRef();
  const materialRef = useRef();

  const [text, setText] = useState(() => {
    return convertToDecoded(
      DICTIONARY_LEVEL_1[Math.floor(Math.random() * DICTIONARY_LEVEL_1.length)]
    );
  });
  const [focused, setFocused] = useState(false);
  const [typed, setTyped] = useState([]);

  useEffect(() => {
    return () => {
      // Oh nooo I am dead!
      // I don't want the focus anymore!!
      if (focused && game.focused.current) {
        game.focused.current = false;
      }
    };
  }, []);

  const damage = () => {
    game.setLife((life) => life - 1);
  };

  const shot = () => {
    game.setScore((score) => score + 1);
  };

  const respawn = () => {
    root.current.position.x = position[0];
    root.current.position.y = position[1];
    root.current.position.z = -10;

    if (focused && game.focused.current) {
      game.focused.current = false;
      setFocused(false);
      setText(
        convertToDecoded(
          DICTIONARY_LEVEL_1[
            Math.floor(Math.random() * DICTIONARY_LEVEL_1.length)
          ]
        )
      );
      setTyped([]);
    }
  };

  const state = useThree();

  useFrame((state, deltaTime) => {
    if (!game.playing) {
      return;
    }
    root.current.position.add(
      new THREE.Vector3(0, 0, 5)
        .sub(root.current.position)
        .normalize()
        .multiplyScalar(deltaTime)
    );
    root.current.position.y = -1;
    if (root.current.position.z > 0) {
      damage();
      respawn();
    }
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
      console.log(e.code);
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
            console.log(proposal[i].letter);
            if (proposal[i].letter == "u" || proposal[i].letter == "o") {
              proposal[i].variation = ",";
            }
          }
        } else if (haveA) {
          for (let i = proposal.length - 1; i >= 0; i--) {
            if (proposal[i].letter == " ") {
              break;
            }
            console.log(proposal[i].letter);
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

      console.log(text);
      console.log(proposal);
      console.log(telexComparison(text, proposal));

      const comparison = telexComparison(text, proposal);

      if (comparison > 0) {
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
          shot();
          respawn();
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
      <Html position={[0, -2, 0]} transform>
        <div className="type-box-stopper">
          <div className={["type-box", focused && "focused"].join(" ")}>
            <div className="expected">{decodedToText(text)}</div>
            <div className="typed">{decodedToText(typed) || <>&nbsp;</>}</div>
          </div>
        </div>
      </Html>
    </object3D>
  );
}

export default function TelexGamePage() {
  const focused = useRef();
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [life, setLife] = useState(3);

  useEffect(() => {
    if (life <= 0) {
      setPlaying(false);
    }
  }, [life]);

  return (
    <>
      <Banner>Telex of The Dead</Banner>
      {!playing && (
        <Button
          onClick={() => {
            setScore(0);
            setLife(3);
            setPlaying(true);
          }}
        >
          Play
        </Button>
      )}
      <p>Score: {score}</p>
      <p>Life: {life}</p>
      <div style={{ height: 500 }}>
        <GameContext.Provider
          value={{
            focused,
            score,
            setScore,
            life,
            setLife,
            playing,
            setPlaying,
          }}
        >
          <Canvas>
            <ambientLight />
            <pointLight position={[0, 20, 10]} intensity={1.5} />
            {playing && (
              <>
                <Zombie position={[2, -3, -5]} />
                <Zombie position={[9, -3, -10]} />
                <Zombie position={[-8, -3, -8]} />
              </>
            )}
          </Canvas>
        </GameContext.Provider>
      </div>
    </>
  );
}

createPage(TelexGamePage, { showPets: false });
