import { createPage } from "../app";
import { useEffect, useMemo, useRef, useState } from "react";
import "./anxiety.scss";

function FloatingImage({ offsetX, offsetY, src }) {
  return (
    <img
      style={{
        position: "absolute",
        top: offsetY,
        left: offsetX,
        maxHeight: 90,
      }}
      src={src}
      alt={"i float."}
    />
  );
}

function Float({ children, offset = 0 }) {
  const [translate, setTranslate] = useState([0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now() / 1000 + offset;
      setTranslate([Math.cos(now) * 5, Math.sin(now * 0.5) * 5]);
    }, 10);

    return () => clearInterval(interval);
  });

  return (
    <div
      style={{
        transform: `translate(${translate[0]}px, ${translate[1]}px)`,
      }}
    >
      {children}
    </div>
  );
}

function Me({ children }) {
  return (
    <div
      style={{
        marginLeft: 30,
      }}
    >
      {/* <Float offset={1000}> */}
      {children}
      {/* <TypingList list={[children]} /> */}
      {/* </Float> */}
    </div>
  );
}

function ChildMe({ children }) {
  return (
    <div
      style={{
        marginLeft: 100,
      }}
    >
      <Float>
        {children}
        {/* <TypingList list={[children]} /> */}
      </Float>
    </div>
  );
}

// this was very fun to write
function TypingList({ list }) {
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
            if (Math.random() <= 0.1 && letter < list[sentence].length - 5) {
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

export default function AnxietyPage() {
  return (
    <div className="anxiety">
      <p>
        <strong>i wonder what you see when you look at me</strong>
      </p>
      <p>
        in 2023, somebody told me,
        <br /> "when i got to know more about you, i became disappointed."
      </p>
      <p>
        when i was younger
        <br />i had trouble talking to people in person
        <br />
        and would freeze and avoid eye contact
        <FloatingImage
          offsetY={30}
          offsetX={520}
          src={require("./images/anxiety/2.png")}
        />
      </p>
      <p>
        but i had no trouble online
        <br /> because i could{" "}
        <TypingList list={["type and delete, and type and delete"]} />
        <br />
        until my sentences were perfect
      </p>
      <p>
        as i got older, i got better at masking my anxiety
        <br />
        but when i am around people who{" "}
        <TypingList
          list={[
            "i've just met",
            "i admire",
            "are pretty",
            "i have a crush on",
            "i'm inspired by",
            "i look up to",
            "are beautiful",
          ]}
        />
        <br />i become a child again
      </p>
      <p>
        does my anxiety make me seem{" "}
        <TypingList list={["abrasive?", "shy?", "aloof?"]} />
      </p>
      <p>
        it's hard for me to express my existence
        <br />
        so I{" "}
        <TypingList
          list={["make video games", "write", "sing songs", "draw"]}
        />
        <br />
        where I can{" "}
        <TypingList list={["type and delete, and type and delete"]} />
        <br />
        until it is perfect
      </p>
      <p>
        even then
        <br />
        those are only slivers of who i am
        <br />
        how do i summarize more than <a href="polaroids">three decades of existence?</a>
        <FloatingImage
          offsetY={-30}
          offsetX={-20}
          src={require("./images/anxiety/1.png")}
        />
      </p>
      <p>
        there are so many versions of my self
        <br />
        based on how others see me
        <br />
        and all of those versions are real
      </p>
      <p>
        but how can you know me <br />
        unless we've{" "}
        <TypingList
          list={[
            "argued?",
            "cried?",
            "traveled together?",
            "seen each other grow?",
            "broken past the anxiety?",
          ]}
        />
      </p>
      <p>
        <br />
        different versions that only exist
        <br />
        in rare contexts
        <FloatingImage
          offsetY={30}
          offsetX={400}
          src={require("./images/anxiety/3.png")}
        />
      </p>
      <p>
        everyone looks for the initial spark
        <br />
        but all of my friends
        <br />
        were people i was once afraid of
        <br />
        we just spent enough time
        <br />
        until i was no longer afraid
      </p>
      <p>
        i sat down, closed my eyes,
        <br />
        and had a conversation with my child self.
      </p>
      <p>
        <Me>why are you so anxious?</Me>
        <ChildMe>i'm scared that people wouldn't like me</ChildMe>
        <ChildMe>
          and when they find out who i really am, they'll leave me
        </ChildMe>
        <Me>i'm no longer afraid of that, but the anxiety is still there</Me>
        <ChildMe>will it ever go away?</ChildMe>
        <Me>i don't think so</Me>
        <Me>but maybe i can learn to live with it</Me>
      </p>
    </div>
  );
}

createPage(AnxietyPage, { showPets: false });
