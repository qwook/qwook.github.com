import { useEffect, useState } from "react";

// this was very fun to write
export function TypingList({ list, shouldTypo = true }) {
  const [sentence, setSentence] = useState(0);
  const [letter, setLetter] = useState(0);
  const [backwards, setBackwards] = useState(false);
  const [typo, setTypo] = useState("");
  const [typoBackwards, setTypoBackwards] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (backwards) {
        if (letter > 0) {
          setLetter((letter) => letter - 1);
        } else {
          setBackwards(false);
          setSentence((sentence) => (sentence + 1) % list.length);
        }
      } else {
        if (typo.length > 0) {
          setTypo((typo) => {
            if (Math.random() <= 0.05) {
              return (
                typo + String.fromCharCode(Math.random() * (122 - 97) + 97)
              );
            } else {
              if (typoBackwards) {
                return typo.substring(0, typo.length - 1);
              } else {
                return (
                  typo +
                  list[sentence].substring(
                    letter + typo.length,
                    letter + typo.length + 1
                  )
                );
              }
            }
          });
          if (Math.random() <= 0.6) {
            setTypoBackwards(true);
          }
        } else {
          if (letter < list[sentence].length + 5) {
            if (
              Math.random() <= 0.1 &&
              shouldTypo &&
              letter < list[sentence].length - 5
            ) {
              setTypo(String.fromCharCode(Math.random() * (122 - 97) + 97));
              setTypoBackwards(false);
            } else {
              setLetter((letter) => letter + 1);
            }
          } else {
            setBackwards(true);
          }
        }
      }
    }, Math.random() * 30 + 30);

    return () => clearInterval(interval);
  }, [letter, backwards, typo, typoBackwards]);

  return (
    <>
      {list[sentence].substring(0, letter)}
      {typo}
    </>
  );
}
