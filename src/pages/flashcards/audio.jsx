import { createPage } from "../../app";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as _ from "lodash";
import ReactAudioPlayer from "react-audio-player";
import loadAsset from "load-asset";

function FlashCardDeck({ list }) {
  const [flashCardsLeft, setFlashCardsLeft] = useState(() => list);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setFlashCardsLeft(_.shuffle(list));
  }, [list]);

  const nextCard = useCallback(() => {
    setShowAnswer((showAnswer) => !showAnswer);
    if (showAnswer) {
      setFlashCardsLeft((flashCardsLeft) => {
        if (flashCardsLeft.length === 1) {
          return _.shuffle(list);
        } else {
          return flashCardsLeft.slice(1);
        }
      });
    }
  }, [showAnswer]);

  useEffect(() => {
    const onSpace = (e) => {
      if (e.keyCode === 32) {
        nextCard();
      }
    };
    document.addEventListener("keypress", onSpace);

    return () => document.removeEventListener("keypress", onSpace);
  }, [nextCard]);

  return (
    <>
      <div>
        {!showAnswer ? (
          <>
            <h4>Question</h4>
            <h1>{flashCardsLeft[0][0]}</h1>
          </>
        ) : (
          <>
            <h4>Answer</h4>
            <h1>{flashCardsLeft[0][1]}</h1>
          </>
        )}
      </div>
    </>
  );
}

const SOUNDS = [
  {
    name: "ơn",
    sound: require("../../components/flashcards/assets/ơn.mp3"),
  },
  {
    name: "an",
    sound: require("../../components/flashcards/assets/an.mp3"),
  },
  {
    name: "ăn",
    sound: require("../../components/flashcards/assets/ăn.mp3"),
  },
  {
    name: "ân",
    sound: require("../../components/flashcards/assets/ân.mp3"),
  },
  {
    name: "un",
    sound: require("../../components/flashcards/assets/un.mp3"),
  },
  {
    name: "ôn",
    sound: require("../../components/flashcards/assets/ôn.mp3"),
  },
  {
    name: "on",
    sound: require("../../components/flashcards/assets/on.mp3"),
  },
  {
    name: "ên",
    sound: require("../../components/flashcards/assets/ên.mp3"),
  },
  {
    name: "en",
    sound: require("../../components/flashcards/assets/en.mp3"),
  },
  // {
  //   name: "au",
  //   sound: require("../../components/flashcards/assets/aun.mp3"),
  // },
  {
    name: "ươn",
    sound: require("../../components/flashcards/assets/ươn.mp3"),
  },
  {
    name: "uôn",
    sound: require("../../components/flashcards/assets/uôn.mp3"),
  },
  {
    name: "ưn",
    sound: require("../../components/flashcards/assets/ưn.mp3"),
  },
];

const ACCENTS = [
  {
    name: "tán",
    sound: require("../../components/flashcards/assets/tán.mp3"),
  },
  {
    name: "tàn",
    sound: require("../../components/flashcards/assets/tàn.mp3"),
  },
  {
    name: "tãn",
    sound: require("../../components/flashcards/assets/tãn.mp3"),
  },
  {
    name: "tản",
    sound: require("../../components/flashcards/assets/tản.mp3"),
  },
  {
    name: "tạn",
    sound: require("../../components/flashcards/assets/tạn.mp3"),
  },
  {
    name: "tan",
    sound: require("../../components/flashcards/assets/tan.mp3"),
  },
];

export function Panel({ children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#f1f1f1",
        padding: 20,
        // width: "100%",
        // maxWidth: "100%",
        borderRadius: 10,
        gap: 10,
      }}
    >
      {children}
    </div>
  );
}

export function Button({ children, onClick, correct, small }) {
  return (
    <div
      className={[
        "button",
        correct ? "correct" : "",
        small ? "small" : "",
      ].join(" ")}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function AudioPage({ sound, soundDb, lol, onNextSound, onClose }) {
  const audioRef = useRef();
  const correctAudioRef = useRef();
  const incorrectAudioRef = useRef();
  const options = useMemo(() => {
    const deck = _.shuffle(
      Array.from(soundDb.keys()).filter((key) => key != sound)
    )
      .slice(0, 3)
      .concat([sound]);
    return _.shuffle(deck);
  }, [sound, lol]);

  useEffect(() => {
    setShowCorrect(false);
  }, [sound, lol]);

  const [showCorrect, setShowCorrect] = useState(false);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <Panel>
          {options.map((i) => {
            return (
              <Button
                key={i}
                correct={i === sound && showCorrect}
                onClick={() => {
                  if (i === sound && !showCorrect) {
                    correctAudioRef.current.audioEl.current.pause();
                    correctAudioRef.current.audioEl.current.currentTime = 0;
                    correctAudioRef.current.audioEl.current.play();
                  } else {
                    incorrectAudioRef.current.audioEl.current.pause();
                    incorrectAudioRef.current.audioEl.current.currentTime = 0;
                    incorrectAudioRef.current.audioEl.current.play();
                  }
                  setShowCorrect(true);
                }}
              >
                {soundDb[i].name}
              </Button>
            );
          })}
        </Panel>
        <Panel>
          <div style={{ display: "none" }}>
            <ReactAudioPlayer
              ref={audioRef}
              src={soundDb[sound].sound}
              autoPlay
              controls
            />
            <ReactAudioPlayer
              ref={correctAudioRef}
              src={require("../../components/flashcards/assets/correct.mp3")}
            />
            <ReactAudioPlayer
              ref={incorrectAudioRef}
              src={require("../../components/flashcards/assets/incorrect.mp3")}
            />
          </div>
          <Button
            onClick={() => {
              audioRef.current.audioEl.current.currentTime = 0;
              audioRef.current.audioEl.current.play();
            }}
          >
            Replay
          </Button>
          {showCorrect && <Button onClick={(e) => onNextSound()}>Next</Button>}
          <Button
            onClick={() => {
              onClose();
            }}
            small
          >
            Close
          </Button>
        </Panel>
      </div>
    </>
  );
}

export default function ZinePage() {
  const [soundDb, setSoundDb] = useState(SOUNDS);
  const [playing, setPlaying] = useState(false);

  const [soundsLeft, setSetSoundsLeft] = useState(() =>
    Array.from(soundDb.keys())
  );
  const [currentSound, setCurrentSound] = useState(0);
  const [lol, setLol] = useState(0);

  const calculateSoundsLeft = useCallback((soundDb) => {
    const soundsLeft = _.shuffle(Array.from(soundDb.keys()));
    setCurrentSound(
      soundsLeft.splice(Math.floor(Math.random() * soundsLeft.length), 1)
    );
    setSetSoundsLeft(soundsLeft);

    (async () => {
      const soundAssets = {};
      for (const sound of soundDb) {
        soundAssets[sound.name] = { url: sound.sound, muted: true };
      }

      await loadAsset.any(soundAssets);
    })();
  }, []);

  return (
    <div>
      <style>
        {`
          .button {
            display: flex;
            background: white;
            padding: 10px;
            border: 1px solid rgba(0,0,0,0.3);
            border-radius: 10px;
            justify-content: center;
            // transition: background 0.1s;
            user-select: none;
            box-shadow: 1px 1px 5px rgba(0,0,0,0.5);
            align-items: center;
          }

          .button.small {
            background: rgb(255, 255, 255, 0.1);
            font-size: 0.7em;
            box-shadow: 1px 1px 2px rgba(0,0,0,0.4);
          }
          .button:hover {
            color: black;
            background: #ddf;
            box-shadow: 1px 2px 5px rgba(0,0,0,0.5);
          }

          .button:active {
            color: black;
            background: #ddd;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.5) inset;
          }

          .button.correct {
            color: white;
            background: #0a0;
          }

          `}
      </style>
      <h1>Vietnamese Vowels</h1>
      {playing ? (
        <AudioPage
          sound={currentSound}
          soundDb={soundDb}
          lol={lol}
          onNextSound={() => {
            let newSoundsLeft = [...soundsLeft];
            if (newSoundsLeft.length === 0) {
              newSoundsLeft = _.shuffle(Array.from(soundDb.keys()));
            }
            setCurrentSound(newSoundsLeft.splice(0, 1));
            setLol((lol) => (lol += 1));
            setSetSoundsLeft(newSoundsLeft);
          }}
          onClose={() => {
            setPlaying(false);
          }}
        />
      ) : (
        <Panel>
          <Button
            onClick={(e) => {
              setPlaying(true);
              calculateSoundsLeft(SOUNDS);
              setSoundDb(SOUNDS);
            }}
          >
            Vowels
          </Button>
          <Button
            onClick={(e) => {
              setPlaying(true);
              calculateSoundsLeft(ACCENTS);
              setSoundDb(ACCENTS);
            }}
          >
            Tones
          </Button>
          <p>
            Most of these vowels end with an "n" since it's the vowels in
            "action" rather than the name of the vowel.
          </p>
        </Panel>
      )}
    </div>
  );
}

createPage(ZinePage, { showPets: false, showNav: false });
