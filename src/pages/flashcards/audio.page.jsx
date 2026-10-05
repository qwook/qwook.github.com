import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as _ from "lodash";
import ReactAudioPlayer from "react-audio-player";
import loadAsset from "load-asset";
import { Howl, Howler } from "howler";
import Button from "@/common/components/ui/Button";
import { Panel } from "@/common/components/ui/Panel";
import Layout from "@/common/layout/Layout";
import n from "./assets/ơn.mp3";
import an from "./assets/an.mp3";
import anMp3 from "./assets/ăn.mp3";
import n4 from "./assets/ân.mp3";
import un from "./assets/un.mp3";
import onMp3 from "./assets/ôn.mp3";
import on from "./assets/on.mp3";
import enMp3 from "./assets/ên.mp3";
import en from "./assets/en.mp3";
import uonMp3 from "./assets/ươn.mp3";
import uN from "./assets/uôn.mp3";
import unMp3 from "./assets/ưn.mp3";
import tN from "./assets/tán.mp3";
import tanMp3 from "./assets/tàn.mp3";
import tN3 from "./assets/tãn.mp3";
import tN4 from "./assets/tản.mp3";
import tN5 from "./assets/tạn.mp3";
import tan from "./assets/tan.mp3";
import correct from "./assets/correct.mp3";
import incorrect from "./assets/incorrect.mp3";

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
    sound: n,
  },
  {
    name: "an",
    sound: an,
  },
  {
    name: "ăn",
    sound: anMp3,
  },
  {
    name: "ân",
    sound: n4,
  },
  {
    name: "un",
    sound: un,
  },
  {
    name: "ôn",
    sound: onMp3,
  },
  {
    name: "on",
    sound: on,
  },
  {
    name: "ên",
    sound: enMp3,
  },
  {
    name: "en",
    sound: en,
  },
  // {
  //   name: "au",
  //   sound: require("../../components/flashcards/assets/aun.mp3"),
  // },
  {
    name: "ươn",
    sound: uonMp3,
  },
  {
    name: "uôn",
    sound: uN,
  },
  {
    name: "ưn",
    sound: unMp3,
  },
];

const ACCENTS = [
  {
    name: "tán",
    sound: tN,
  },
  {
    name: "tàn",
    sound: tanMp3,
  },
  {
    name: "tãn",
    sound: tN3,
  },
  {
    name: "tản",
    sound: tN4,
  },
  {
    name: "tạn",
    sound: tN5,
  },
  {
    name: "tan",
    sound: tan,
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
        src: correct,
        autoplay: false,
        volume: 1,
        html5: true,
      },
      []
    ),
    new Howl(
      {
        src: incorrect,
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

function ZinePage() {
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

export default function Root() {
  return (
    <Layout>
      <ZinePage />
    </Layout>
  );
}
