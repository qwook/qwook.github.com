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
    name: "ơ",
    sound: require("../../components/flashcards/assets/ơn.mp3"),
  },
  {
    name: "a",
    sound: require("../../components/flashcards/assets/an.mp3"),
  },
  {
    name: "ă",
    sound: require("../../components/flashcards/assets/ăn.mp3"),
  },
  {
    name: "â",
    sound: require("../../components/flashcards/assets/ân.mp3"),
  },
  {
    name: "u",
    sound: require("../../components/flashcards/assets/un.mp3"),
  },
  {
    name: "ô",
    sound: require("../../components/flashcards/assets/ôn.mp3"),
  },
  {
    name: "o",
    sound: require("../../components/flashcards/assets/on.mp3"),
  },
  {
    name: "ê",
    sound: require("../../components/flashcards/assets/ên.mp3"),
  },
  {
    name: "e",
    sound: require("../../components/flashcards/assets/en.mp3"),
  },
  {
    name: "au",
    sound: require("../../components/flashcards/assets/aun.mp3"),
  },
  {
    name: "ươ",
    sound: require("../../components/flashcards/assets/ươn.mp3"),
  },
  {
    name: "uô",
    sound: require("../../components/flashcards/assets/uôn.mp3"),
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
        width: 400,
        maxWidth: "100%",
        borderRadius: 10,
        gap: 10,
      }}
    >
      {children}
    </div>
  );
}

export function Button({ children, onClick, correct }) {
  return (
    <div
      className={["button", correct ? "correct" : ""].join(" ")}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function AudioPage({ sound, onNextSound }) {
  const audioRef = useRef();
  const options = useMemo(() => {
    const deck = _.shuffle(
      Array.from(SOUNDS.keys()).filter((key) => key != sound)
    )
      .slice(0, 3)
      .concat([sound]);
    return _.shuffle(deck);
  }, [sound]);

  useEffect(() => {
    setShowCorrect(false);
  }, [sound]);

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
                onClick={() => setShowCorrect(true)}
              >
                {SOUNDS[i].name}
              </Button>
            );
          })}
        </Panel>
        <Panel>
          <div style={{ display: "none" }}>
            <ReactAudioPlayer
              ref={audioRef}
              src={SOUNDS[sound].sound}
              autoPlay
              controls
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
        </Panel>
      </div>
    </>
  );
}

export default function ZinePage() {
  const [playing, setPlaying] = useState(false);

  const [soundsLeft, setSetSoundsLeft] = useState(() =>
    Array.from(SOUNDS.keys())
  );
  const [currentSound, setCurrentSound] = useState(0);

  useEffect(() => {
    const soundsLeft = _.shuffle(Array.from(SOUNDS.keys()));
    setCurrentSound(
      soundsLeft.splice(Math.floor(Math.random() * soundsLeft.length), 1)
    );
    setSetSoundsLeft(soundsLeft);

    (async () => {
      const soundAssets = {};
      for (const sound of SOUNDS) {
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
          onNextSound={() => {
            let newSoundsLeft = [...soundsLeft];
            if (newSoundsLeft.length === 0) {
              newSoundsLeft = _.shuffle(Array.from(SOUNDS.keys()));
            }
            console.log(newSoundsLeft);
            setCurrentSound(newSoundsLeft.splice(0, 1));
            setSetSoundsLeft(newSoundsLeft);
          }}
        />
      ) : (
        <Panel>
          <Button onClick={(e) => setPlaying(true)}>Start</Button>
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
