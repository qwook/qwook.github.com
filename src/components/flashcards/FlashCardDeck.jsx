import { useCallback, useEffect, useState } from "react";
import { Panel } from "../ui/Panel";
import Button from "../ui/Button";

export function FlashCardDeck({ list }) {
  const [flashCardsLeft, setFlashCardsLeft] = useState(() => list);
  const [showAnswer, setShowAnswer] = useState(false);

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
        {showAnswer ? (
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
    </>
  );
}
