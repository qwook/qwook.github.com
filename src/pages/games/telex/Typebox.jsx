import { useContext, useEffect, useMemo, useState } from "react";
import { GameContext } from "./telex";
import { Html } from "@react-three/drei";
import {
  DICTIONARY_LEVEL_1,
  DICTIONARY_LEVEL_2,
  DICTIONARY_LEVEL_3,
} from "./dictionary";

/*

Build a map in blender3D
Go around in a circle.

Level 1:
3 zombies walking slowly, 1 at a time.

Level 2:
Chasing after human.
2 more zombies walking slowly

Level 3:
Zombie throwing barrels. (Small words, Letters)

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

let locked = false;

export function convertToDecoded(text) {
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

export function decodedToText(array) {
  return array
    .map(
      (decoded) =>
        ACCESS_ENCODE_MAP[
          decoded.letter + (decoded.variation || "") + (decoded.accent || "")
        ] || decoded.letter
    )
    .join("");
}

export function generateWordNotInArray(score, wordsUsed) {
  const dictionary = [
    ...DICTIONARY_LEVEL_1,
    ...(score > 20 ? DICTIONARY_LEVEL_2 : []),
    ...(score > 30 ? DICTIONARY_LEVEL_3 : []),
  ];
  if (wordsUsed && wordsUsed.length > 0) {
    console.log(wordsUsed);
    const charsUsed = new Set(
      wordsUsed.map(
        (word) => ACCENT_DECODE_MAP[word.charAt(0)]?.letter || word.charAt(0)
      )
    );
    const filteredDict = dictionary.filter(
      (word) =>
        !charsUsed.has(
          ACCENT_DECODE_MAP[word.charAt(0)]?.letter || word.charAt(0)
        )
    );
    console.log(charsUsed);
    console.log(filteredDict);
    console.log(dictionary);

    if (filteredDict.length > 0) {
      const randomWord =
        filteredDict[Math.floor(filteredDict.length * Math.random())];
      return randomWord;
    }
  }

  const randomWord = dictionary[Math.floor(dictionary.length * Math.random())];
  return randomWord;
}

export function telexComparison(left, right) {
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

function UnderlineLastLetter({ text }) {
  return (
    <>
      {text.substring(0, text.length - 1)}
      <span style={{ borderBottom: "3px solid white" }}>
        {text.substring(text.length - 1)}
      </span>
    </>
  );
}

export function Typebox({
  text,
  onFinished = () => {},
  onFocusChange = () => {},
  onHit = () => {},
  ...props
}) {
  const game = useContext(GameContext);

  const [focused, setFocused] = useState(false);
  const [typed, setTyped] = useState([]);
  const decoded = useMemo(() => convertToDecoded(text), [text]);

  useEffect(() => {
    onFocusChange && onFocusChange(focused);
  }, [focused, onFocusChange]);

  useEffect(() => {
    return () => {
      // Oh nooo I am dead!
      // I don't want the focus anymore!!
      if (game && game.focused === decodedToText(decoded)) {
        game.setFocused();
        setFocused(false);
      }
    };
  }, [game.focused]);

  useEffect(() => {
    const keyPress = (e) => {
      if (locked) return;

      if (game.focused && !focused) {
        return;
      }

      // This is a letter!
      const proposal = _.cloneDeep(typed);
      if (KEY_TO_CHAR[e.code]) {
        proposal.push({ letter: KEY_TO_CHAR[e.code] });
      }

      // W key or , accent mark or U accent mark
      if (e.code === "KeyW" || e.code === "Digit7") {
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
        } else if (haveA && e.code === "KeyW") {
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
        e.code === "KeyJ" ||
        e.code === "KeyZ" ||
        e.code === "Digit0" ||
        e.code === "Digit1" ||
        e.code === "Digit2" ||
        e.code === "Digit3" ||
        e.code === "Digit4" ||
        e.code === "Digit5"
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
          if (e.code === "KeyR" || e.code === "Digit3") {
            proposal[vowelsFound[0].vowelIndex].accent = "?";
          } else if (e.code === "KeyS" || e.code === "Digit1") {
            proposal[vowelsFound[0].vowelIndex].accent = "/";
          } else if (e.code === "KeyF" || e.code === "Digit2") {
            proposal[vowelsFound[0].vowelIndex].accent = "|";
          } else if (e.code === "KeyX" || e.code === "Digit4") {
            proposal[vowelsFound[0].vowelIndex].accent = "~";
          } else if (e.code === "KeyJ" || e.code === "Digit5") {
            proposal[vowelsFound[0].vowelIndex].accent = ".";
          } else if (e.code === "KeyZ" || e.code === "Digit0") {
            proposal[vowelsFound[0].vowelIndex].accent = null;
          }

          if (
            e.code !== "KeyF" &&
            e.code !== "KeyJ" &&
            e.code !== "Digit0" &&
            e.code !== "Digit1" &&
            e.code !== "Digit2" &&
            e.code !== "Digit3" &&
            e.code !== "Digit4" &&
            e.code !== "Digit5"
          ) {
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

      // Add ^ hat for VNI
      if (e.code === "Digit6") {
        for (let i = proposal.length - 1; i >= 0; i--) {
          if (proposal[i].letter == " ") {
            break;
          }

          console.log(proposal[i].letter);
          if (["a", "o", "e"].indexOf(proposal[i].letter) !== -1) {
            proposal[i].variation = "^";
            break;
          }
        }
      }

      // Add u hat for a
      if (e.code === "Digit8") {
        for (let i = proposal.length - 1; i >= 0; i--) {
          if (proposal[i].letter == " ") {
            break;
          }

          if (proposal[i].letter === "a") {
            proposal[i].variation = "U";
            break;
          }
        }
      }

      // Add - for d
      if (e.code === "Digit9") {
        for (let i = proposal.length - 1; i >= 0; i--) {
          if (proposal[i].letter == " ") {
            break;
          }

          if (proposal[i].letter === "d") {
            proposal[i].variation = "-";
            break;
          }
        }
      }

      const comparison = telexComparison(decoded, proposal);

      if (comparison > 0 && proposal.length > 0) {
        if (focused) {
          setTyped(proposal);
          game.sounds["shot"].play();
          onHit();
        } else {
          if (!game.focused) {
            // One letter...
            if (proposal.length === decoded.length && comparison === 2) {
              onHit();
              onFinished(true);
            } else {
              locked = true;
              game.setFocused(decodedToText(decoded));
              setFocused(true);
              setTyped(proposal);
              onHit();
              setTimeout(() => {
                locked = false;
              }, 0);
            }
          }
        }
        if (
          focused &&
          proposal.length === decoded.length &&
          comparison === 2 &&
          game.focused
        ) {
          onFinished(true);
        }
      }
    };
    window.addEventListener("keypress", keyPress);
    return () => {
      window.removeEventListener("keypress", keyPress);
    };
  }, [typed, decoded, focused, game, game.focused]);

  const [blurred, setBlurred] = useState(false);
  useEffect(() => {
    setBlurred(
      game.focused && game.focused !== decodedToText(decoded) && !focused
    );
  }, [game.focused, text, focused]);

  return (
    <Html {...props}>
      <div className="type-box-stopper">
        <div
          className={[
            "type-box",
            focused && "focused",
            blurred && "blurred",
          ].join(" ")}
        >
          <div className="expected">{decodedToText(decoded)}</div>
          <div className="typed">
            <UnderlineLastLetter text={decodedToText(typed)} />
          </div>
        </div>
      </div>
    </Html>
  );
}
