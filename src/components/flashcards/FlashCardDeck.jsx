import { useCallback, useEffect, useRef, useState } from "react";
import { Panel } from "../ui/Panel";
import Button from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import Progress from "../ui/Progress";

export function FlashCardGame({ list }) {
  const [flashCardsLeft, setFlashCardsLeft] = useState(() => list);
  const [showAnswer, setShowAnswer] = useState(false);
  const [flipAnswer, setFlipAnswer] = useState(false);

  useEffect(() => {
    setFlashCardsLeft(_.shuffle(list));
  }, [list]);

  const nextCard = useCallback(() => {
    setFlashCardsLeft((flashCardsLeft) => {
      if (flashCardsLeft.length === 1) {
        return _.shuffle(list);
      } else {
        return flashCardsLeft.slice(1);
      }
    });
    setShowAnswer(false);
  }, []);

  return (
    <>
      <Panel>
        {showAnswer ^ flipAnswer ? (
          <>
            <h2>{flashCardsLeft[0][0]}</h2>
          </>
        ) : (
          <>
            <h2>{flashCardsLeft[0][1]}</h2>
          </>
        )}
        <Button
          keyCode={32}
          onClick={() => setShowAnswer((showAnswer) => !showAnswer)}
        >
          Flip [Space]
        </Button>
        <Button keyCode={13} onClick={nextCard}>
          Next [Enter]
        </Button>
      </Panel>
      <br />
      <Panel>
        <Checkbox keyCode={82} value={flipAnswer} onChanged={setFlipAnswer}>
          Flip question / answers of cards [R]
        </Checkbox>
      </Panel>
    </>
  );
}

// Picks N random items from a list, using "probability" to weigh
// the randomness.
function pickN(indices, probability, n) {
  const picked = [];
  const clone = [...indices];
  for (let i = 0; i < n; i++) {
    // Get a random item from the array
    // using "probability" as a weight array.
    const randomQuestion = Math.random();
    const probabilitySum =
      _.sum(_.map(clone, (idx) => probability[idx])) * randomQuestion;
    let idx = 0;
    for (let p = 0; i < clone.length; idx++) {
      p += probability[clone[idx]];
      if (p >= probabilitySum) {
        break;
      }
    }
    picked.push(...clone.splice(idx, 1));
  }
  return picked;
}

// console.log(pickN([3, 5, 7], [0, 0, 0, 1, 0, 100, 0, 1], 2));
// console.log(pickN([3, 5, 7], [0, 0, 0, 1, 0, 100, 0, 1], 2));
// console.log(pickN([3, 5, 7], [0, 0, 0, 1, 0, 100, 0, 1], 2));
// console.log(pickN([3, 5, 7], [0, 0, 0, 1, 0, 100, 0, 1], 2));
// console.log(pickN([3, 5, 7], [0, 0, 0, 1, 0, 50, 0, 100], 3));
// console.log(pickN([3, 5, 7], [0, 0, 0, 1, 0, 50, 0, 100], 3));
// console.log(pickN([3, 5, 7], [0, 0, 0, 1, 0, 50, 0, 100], 3));

export function MultipleChoiceGame({ list }) {
  // const [flashCardsLeft, setFlashCardsLeft] = useState(() => list);
  const [showAnswer, setShowAnswer] = useState(false);
  const [chosen, setChosen] = useState(-1);

  const [question, setQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [probability, setProbability] = useState([]);
  const [timer, setTimer] = useState(1000000);

  // Settings
  const [fasterTimeout, setFasterTimeout] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // If the list has changed... We need to reset the probabilities.
  useEffect(() => {
    setProbability(_.fill(_.range(0, list.length), 1));
  }, [list]);

  // Clear timeout on exit.
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((timer) => Math.max(0, timer - 1));
    }, 500);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (timer === 0 && chosen === -1) {
      adjustProbability(question, false);
      setChosen(1000);
      setShowAnswer(true);
    }
  }, [timer, chosen]);

  // Calculate and show the first answer.
  const [showFirstAnswer, setShowFirstAnswer] = useState(false);
  useEffect(() => {
    if (showFirstAnswer) return;
    if (probability.length === 0) return;

    setShowFirstAnswer(true);
    nextQuestion();
  }, [probability, showFirstAnswer]);

  const nextQuestion = useCallback(() => {
    if (probability.length === 0) return;

    setShowAnswer(false);
    setChosen(-1);
    setTimer(fasterTimeout ? 5 : 10);

    const randomQuestion = Math.random();
    const probabilitySum = _.sum(probability) * randomQuestion;
    let i = 0;
    for (let p = 0; i < list.length; i++) {
      p += probability[i];
      if (p >= probabilitySum) {
        break;
      }
    }
    let choices = _.range(0, list.length);
    choices.splice(i, 1); // Remove the answer from possible choices
    choices = pickN(choices, probability, 3); // Pick 3 random possible choices
    choices.splice(0, 0, i); // Push answer to choices
    choices = _.shuffle(choices); // Shuffle again

    setQuestion(i);
    setChoices(choices);
  }, [probability]);

  const adjustProbability = useCallback((question, correct) => {
    setProbability((probability) => {
      const clone = [...probability];
      if (correct) {
        clone[question] = Math.max(clone[question] - 0.25, 1);
      } else {
        clone[question] = Math.min(clone[question] + 1, probability.length);
      }
      // Normalize. This is if too many things are wrong!
      const min = _.min(clone);
      for (let i = 0; i < clone.length; i++) {
        clone[i] /= min;
      }
      return clone;
    });
  }, []);

  return (
    <>
      <Panel>
        {showFirstAnswer && <>{list[question][1]}</>}
        {chosen === -1 ? (
          <>
            <Progress minValue={0} maxValue={fasterTimeout ? 5 : 10} value={timer} />
          </>
        ) : (
          <>
            <Progress minValue={0} maxValue={fasterTimeout ? 5 : 10} value={0} />
          </>
        )}
        {choices.map((choiceIdx, idx) => {
          let correct = choiceIdx === question;
          let wrong = choiceIdx === chosen && !correct;
          return (
            <Button
              correct={showAnswer && choiceIdx === question}
              wrong={showAnswer && wrong}
              keyCode={49 + idx}
              onClick={() => {
                if (chosen === -1) {
                  adjustProbability(question, correct);
                  setChosen(choiceIdx);
                  setShowAnswer(true);
                }
              }}
              key={idx}
            >
              {list[choiceIdx][0]} [{idx + 1}]
            </Button>
          );
        })}
        {chosen !== -1 && (
          <Button keyCode={13} onClick={nextQuestion}>
            Next [Enter]
          </Button>
        )}
      </Panel>
      <br />
      <Panel>
        <Checkbox value={fasterTimeout} onChanged={setFasterTimeout}>
          Faster Timeout
        </Checkbox>
        <Checkbox value={showDebugInfo} onChanged={setShowDebugInfo}>
          Show Debug Info
        </Checkbox>
      </Panel>
      {showDebugInfo && (
        <>
          <br />
          <Panel outie>
            <h4>Debug Info:</h4>
            <ul>
              {probability.map((p, idx) => (
                <li key={idx}>
                  {list[idx][0]} - {p}
                </li>
              ))}
            </ul>
          </Panel>
        </>
      )}
    </>
  );
}

export function FlashCardDeck({ list }) {
  const [game, setGame] = useState("multiple");

  return (
    <>
      {(() => {
        switch (game) {
          default:
            return (
              <Panel outie>
                <Button onClick={() => setGame("flashcards")}>
                  Play Flash Cards
                </Button>
                <Button onClick={() => setGame("multiple")}>
                  Play Multiple Choice
                </Button>
              </Panel>
            );
          case "flashcards":
            return <FlashCardGame list={list} />;
          case "multiple":
            return <MultipleChoiceGame list={list} />;
        }
      })()}
    </>
  );
}
