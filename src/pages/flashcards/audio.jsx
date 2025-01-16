import { createPage } from "../../app";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as _ from "lodash";
import ReactAudioPlayer from "react-audio-player";
import loadAsset from "load-asset";
import { Howl, Howler } from "howler";
import Button from "../../components/ui/Button";
import { Panel } from "../../components/ui/Panel";

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

export function AudioPage({ sound, soundDb, lol, onNextSound, onClose }) {
  const audioRef = useRef();
  const correctAudioRef = useRef();
  const incorrectAudioRef = useRef();
  const audioRefs = useRef({});
  const options = useMemo(() => {
    const deck = _.shuffle(
      Array.from(soundDb.keys()).filter((key) => key != sound)
    )
      .slice(0, 3)
      .concat([sound]);
    return _.shuffle(deck);
  }, [sound, lol]);

  const [correctSound, incorrectSound] = useMemo(() => [
    new Howl(
      {
        src: require("../../components/flashcards/assets/correct.mp3"),
        autoplay: false,
        volume: 1,
        html5: true,
      },
      []
    ),
    new Howl(
      {
        src: require("../../components/flashcards/assets/incorrect.mp3"),
        autoplay: false,
        volume: 1,
        html5: true,
      },
      []
    ),
  ]);

  const sounds = useMemo(
    () =>
      soundDb.map(
        (soundInDb) =>
          new Howl(
            {
              src: soundInDb.sound,
              autoplay: false,
              volume: 1,
              html5: true,
            },
            []
          )
      ),
    [soundDb]
  );

  const [showCorrect, setShowCorrect] = useState(false);

  useEffect(() => {
    sounds[sound].play();
    setShowCorrect(false);
  }, [sound, lol]);

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
          {options.map((i, idx) => {
            return (
              <Button
                key={i}
                keyCode={49 + idx}
                correct={i === sound && showCorrect}
                onClick={() => {
                  if (i === sound && !showCorrect) {
                    correctSound.play();
                  } else {
                    incorrectSound.play();
                  }
                  setShowCorrect(true);
                }}
              >
                {soundDb[i].name} [{idx + 1}]
              </Button>
            );
          })}
        </Panel>
        <Panel>
          <Button
            keyCode={82}
            onClick={() => {
              sounds[sound].play();
            }}
          >
            Replay [R]
          </Button>
          {showCorrect && (
            <Button
              keyCode={13}
              onClick={(e) => {
                setShowCorrect(false);
                onNextSound();
              }}
            >
              Next [Enter]
            </Button>
          )}
          <Button
            keyCode={27}
            onClick={() => {
              onClose();
            }}
            small
          >
            Close [Esc]
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
      <h1>Vietnamese Pronunciation</h1>
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
            "action" rather than the name of the vowel. Give a second for audio
            to load after you select which audio flashcards you want. I have yet
            to add a loading screen...
          </p>
        </Panel>
      )}
    </div>
  );
}

createPage(ZinePage, { showPets: false, showNav: true });
