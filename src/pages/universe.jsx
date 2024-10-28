import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPage } from "../app";
import { Collage, CollageImage } from "../components/collage/Collage";
import "./universe.scss";
import { Color, Euler, Matrix4, Quaternion, Vector3 } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { seededRandom } from "three/src/math/MathUtils.js";
import { easeInOutCubic } from "../components/plant/Plant";

function FlashingCollage({ collages, animated, speed }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setIdx((idx) => (idx + 1) % collages.length);
      }, speed);
      return () => {
        clearInterval(interval);
      };
    } else {
      setIdx(collages.length - 1);
    }
  }, [animated, collages.length]);

  return (
    <>
      {collages.map((collage, thisIdx) => (
        <div
          style={{
            display: thisIdx == idx % collages.length ? "inherit" : "none",
          }}
        >
          {collage}
        </div>
      ))}
    </>
  );
}

function Character({
  char,
  color = new Color(0, 0, 0),
  bg = new Color(1, 1, 1),
  x,
  y,
  onMouseEnter,
  onMouseLeave,
  opacity = 1,
}) {
  return (
    <span
      style={{
        position: x ? "absolute" : "relative",
        left: x && x * 10,
        top: y && y * 16,
        display: "inline-block",
        overflow: "hidden",
        width: 12,
        height: 16,
        color: color.getHexString ? "#" + color.getHexString() : color,
        opacity,
        background: bg.getHexString ? "#" + bg.getHexString() : bg,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {char}
    </span>
  );
}

function useInterval(cb, ms, deps = []) {
  useEffect(() => {
    const interval = setInterval(cb, ms);
    return () => clearInterval(interval);
  }, [cb, ms, ...deps]);
}

function RayOfText({
  startOffset = 0,
  zIndexOffset = 0,
  xOffset = 0,
  text = "",
  highlight = "",
  highlightColor = new Color(1, 0, 0),
  line = 0,
  width = 1000,
  disappearingBackground = false,
  precreate = false, // Create all elements immediately.
}) {
  const [progress, setProgress] = useState(-startOffset);
  const textArray = useMemo(() => text.split(""), [text]);
  const match = useMemo(() => text.match(highlight), [text, highlight]);
  const [hoverCount, setHoverCount] = useState(0);

  useInterval(() => {
    setProgress((progress) => {
      if (progress < text.length * 2 + 200) {
        return progress + 2;
      } else {
        return progress;
      }
    });
  }, 20);

  const quickness = 2;
  const currentCharacterIdx = Math.max(Math.floor(progress / quickness - 9), 0);

  const increaseHover = useCallback(() =>
    setHoverCount((hoverCount) => hoverCount + 1)
  );

  const decreaseHover = useCallback(() =>
    setHoverCount((hoverCount) => hoverCount - 1)
  );

  const lines = useMemo(() => {
    return (
      <div
        style={{
          position: "absolute",
          left: xOffset * 10,
          top: line * 16,
          zIndex: hoverCount > 0 ? 1000 : 0,
        }}
      >
        {textArray
          .slice(0, precreate ? textArray.length : currentCharacterIdx)
          .map((char, idx) => {
            let a = 1;
            const coloring = Math.min(
              (progress / quickness - idx - 10) * 0.5,
              1
            );
            const coloring2 = Math.min(
              Math.max(((progress - 100) / quickness - idx - 3) * 0.05, 0),
              disappearingBackground ? 1.0 : 0.8
            );
            let color = new Color(
              1 - coloring + coloring2,
              1 - coloring + coloring2,
              1 - coloring + coloring2
            );
            let bg = new Color(1, 1, 1);
            if (
              match &&
              currentCharacterIdx > match.index + 25 &&
              idx >= match.index &&
              idx < match.index + highlight.length
            ) {
              const coloring = Math.min(
                Math.max(
                  (progress - match.index * quickness - 100) / quickness,
                  0
                ) * 0.1,
                1
              );
              color.r += coloring;
              color.g += coloring;
              color.b += coloring;
              bg.r = bg.r - (1 * coloring - highlightColor.r);
              bg.g = bg.g - (1 * coloring - highlightColor.g);
              bg.b = bg.b - (1 * coloring - highlightColor.b);
            }
            if (
              hoverCount > 0 &&
              !(
                match &&
                idx >= match.index &&
                idx < match.index + highlight.length
              )
            ) {
              color.r = 0;
              color.g = 0;
              color.b = 0;
            }
            if (
              disappearingBackground &&
              !(
                match &&
                idx >= match.index &&
                idx < match.index + highlight.length
              )
            ) {
              a = 1 - color.r;
            }
            return (
              <Character
                key={idx}
                char={char}
                color={"#" + color.getHexString()}
                bg={"#" + bg.getHexString()}
                opacity={a}
                x={idx % width}
                y={Math.floor(idx / width)}
                onMouseEnter={increaseHover}
                onMouseLeave={decreaseHover}
              />
            );
          })}
      </div>
    );
  }, [progress, match, hoverCount]);

  return lines;
}

function ConsoleCanvas({ highlight }) {
  return (
    <>
      <RayOfText
        text="A complex person as some of the books written about him discuss. I never realized how hard it was for him to come until Neil Rosenberg told me and then I saw it written in one of the books by Neil....."
        highlight={highlight && "I saw it written"}
        line={2}
        startOffset={0}
        width={30}
        xOffset={10}
      />
      <RayOfText
        text={`
[Chorus]
I remember when my heart broke
I remember when I gave up lovin' you
My heart couldn't take no more of you
`}
        highlight={highlight && "when my heart broke"}
        line={0}
        startOffset={100}
        width={20}
      />
      <RayOfText
        text={`
Nothing else but seeing God in everything will make us loving and patient with those who annoy and trouble us. They will be to us then only instruments for accomplishing His tender and wise purposes toward us, 
`}
        highlight={highlight && "in everything"}
        line={9}
        startOffset={400}
        width={45}
      />
      <RayOfText
        text={`
Or sat in the coffee shop for ages, watching people come and go, feeling you’ve just arrived but time has, in actual fact, flown? Or listened to a song in a bar and it’s flooded you with nostalgic memories that are so alive?
`}
        highlight={highlight && "a song in a bar"}
        line={12}
        xOffset={0}
        startOffset={300}
        width={35}
      />
      <RayOfText
        text={`
A couple on a date sitting close together and holding hands in the movie theatre, watching the movie Titanic, is most likely at which distance?

A. Intimate distance

B. Personal distance

C. Social distance`}
        highlight={highlight && "A couple on a date"}
        line={18}
        xOffset={10}
        startOffset={700}
        width={35}
      />
      <RayOfText
        text={`I was on my way home in the rain, really upset and discouraged, when I saw a piece of graffiti that said NEVER GIVE UP. Thanks, graffiti artist; I really needed that.`}
        highlight={highlight && "graffiti that said"}
        line={20}
        xOffset={10}
        startOffset={700}
        width={40}
      />
      <span
        style={{
          fontStyle: "italic",
        }}
      >
        <RayOfText
          text={`Wish all you sunset lovers were here to watch these amazing sunsets each night!`}
          highlight={highlight && "lovers were here"}
          line={28}
          xOffset={10}
          startOffset={900}
          width={40}
        />
      </span>
    </>
  );
}

function ConsoleTrain() {
  const words = useMemo(() => {
    return `
Two, two, three, four
Strobe lights, heart signs
Then it's over, It's over
For half my long life
You were with me, it went quickly
It's you and me
And the air in between, mm
All of me and all of you
Nothing else in the room
Saw me fondly
You don't know me, but you know me
I guard my soft mind
'Cause I have to, didn't want to
And it's you and me
And the air in between, mm
All of me and all of you
Nothing else in the room
This seems like it's everything to me
If this is goodbye, if I won't see you again
Waiting on a corner with your phone in hand
If irony is a virtue, maybe I should be king
Crush me like a plushie, I'll be one of your things
And maybe I'm addicted to the look in your eyes
It's hard to say you've had enough when you get this high
I shouldn't say I love you, I don't know your name
But I just say it anyway, 'cause it feels the same
When it's you and me
And the air in between, mm
All of me and all of you
Nothing else in the room
This seems like it's everything to me

Fill my fond heart with God alone, for he
Alone can rival, can succeed to thee.

How happy is the blameless vestal's lot!
The world forgetting, by the world forgot.
Eternal sunshine of the spotless mind!
Each pray'r accepted, and each wish resign'd;
Labour and rest, that equal periods keep;
"Obedient slumbers that can wake and weep;"
Desires compos'd, affections ever ev'n,

Joel : I did. I thought maybe you were a nut... but you were exciting.

Clementine : I wish you had stayed.

Joel : I wish I had stayed too. NOW I wish I had stayed. I wish I had done a lot of things. I wish I had... I wish I had stayed. I do.

Clementine : Well I came back downstairs and you were gone!

Joel : I walked out, I walked out the door!

Clementine : Why?

Joel : I don't know. I felt like a scared little kid, I was like... it was above my head, I don't know.

And I'm standing on a platform
Now I'm staring from a train
And all the trees roll back beside but I'm so oblivious
To the dark to the light
It's all the same
You gave me so much and now it's of the earth
And it makes me cry
(It makes me cry, it makes me cry)
It can make me cry
`
      .replace("\n")
      .split(" ")
      .filter((word) => {
        return word;
      });
  });

  const [lines, setLines] = useState([]);

  const randomText = () => {
    const start = Math.floor(Math.random() * (words.length - 15));
    return words
      .slice(start, start + 15)
      .join(" ")
      .substring(0, 80);
  };

  useEffect(() => {
    setLines((lines) => {
      if (lines.length === 0) {
        let initialLines = [];
        for (let i = 0; i < 30; i++) {
          const offset = Math.random() * 800;
          initialLines.push({
            text: randomText(),
            line: i,
            creation: Date.now() + offset,
            offset,
          });
        }
        return initialLines;
      }
      return lines;
    });
  }, []);
  useInterval(() => {
    const lineNo = Math.floor(Math.random() * 30);
    setLines((lines) => {
      return [
        ...lines.filter((line) => {
          if (line.line === lineNo && line.creation + 1000 * 30 < Date.now()) {
            return false;
          }
          return true;
        }),
        {
          text: randomText(),
          line: lineNo,
          creation: Date.now(),
          offset: 0,
        },
      ];
    });
  }, 1000);

  return (
    <>
      <span>
        {lines.map((line) => (
          <RayOfText
            key={line.text + line.line + line.creation}
            text={line.text}
            highlight=""
            line={line.line}
            xOffset={0}
            startOffset={line.offset}
            width={1000}
          />
        ))}
      </span>
      <span
        style={{
          zIndex: 10,
        }}
      >
        <RayOfText
          text={
            "Conclusion. Living in a noisy city can have a significant impact on your health, both physically and mentally."
          }
          highlight="in a noisy city"
          line={5}
          xOffset={0}
          startOffset={0}
          width={1000}
          // disappearingBackground
        />
        <RayOfText
          text={
            "we are constantly bombarded with information. The news, social media posts, advertisements, emails, notifications — the list is endless."
          }
          highlight="bombarded with information"
          line={15}
          xOffset={0}
          startOffset={100}
          width={1000}
          // disappearingBackground
        />
        <RayOfText
          text={
            "In Am I Just My Brain?, Sharon Dirckx draws upon her doctoral work in the sciences together with her years of experience explaining the Christian faith"
          }
          highlight="My Brain"
          line={20}
          xOffset={0}
          startOffset={200}
          width={1000}
          // disappearingBackground
        />
        <RayOfText
          text={
            "there is a part during his concerts where he picks out messages and has a short interview with the couples and the guys in the couples just answer really “briefly” like “yeah…”,"
          }
          highlight="picks out messages"
          line={25}
          xOffset={0}
          startOffset={200}
          width={1000}
          // disappearingBackground
        />

        <RayOfText
          text={
            "Upon release, As If! received polarizing responses from music journalists. Caryn Ganz of Rolling Stone provided a positive review for the extended play"
          }
          highlight="As If"
          line={3}
          xOffset={0}
          startOffset={400}
          width={1000}
          highlightColor={new Color(0, 0, 1)}
          // disappearingBackground
        />
        <RayOfText
          text={
            "During this period, the universe doubled in size at least 90 times, going from subatomic-sized to golf-ball-sized almost instantaneously."
          }
          highlight="the universe"
          line={11}
          xOffset={0}
          startOffset={450}
          width={1000}
          highlightColor={new Color(0, 0, 1)}
          // disappearingBackground
        />
        <RayOfText
          text={
            "criticism involves three moments: Something speaks to me. I must tell you about it. But I don't know how."
          }
          highlight="speaks to me"
          line={17}
          xOffset={0}
          startOffset={450}
          width={1000}
          highlightColor={new Color(0, 0, 1)}
          // disappearingBackground
        />
        <RayOfText
          text={
            "beat your heart, break through myself. 耳を澄ませば, 語らずとも聞こえる世界に,怖じけず踏み出せ, 思うまま"
          }
          highlight="through myself"
          line={23}
          xOffset={0}
          startOffset={550}
          width={1000}
          highlightColor={new Color(0, 0, 1)}
          // disappearingBackground
        />
      </span>
    </>
  );
}

function PulsatingCloudLetter({ letter, offset, position }) {
  position = useMemo(() => new Vector3(...position), position);
  const distance = useMemo(() => position.length(), position);
  const vector = useMemo(() => position.clone().normalize(), position);

  const objectRef = useRef();
  const now = useRef(0);
  const letterRef = useRef();

  useFrame((state, deltaTime) => {
    now.current += deltaTime;
    // (new Vector3()).clone().multiplyScalar
    objectRef.current.position
      .copy(vector)
      .multiplyScalar(distance + Math.sin(now.current - offset) * 0.2);

    if (letterRef.current)
      letterRef.current.style.color = `rgba(0,0,0,${Math.max(
        now.current - offset * 2,
        0
      )})`;
  });

  return (
    <object3D ref={objectRef} position={position}>
      <Html sprite zIndexRange={[0, 500]}>
        <span ref={letterRef}>{letter}</span>
      </Html>
    </object3D>
  );
}

function HighlightedCloudLetter({ position, letter, space, highlighted }) {
  return (
    <object3D position={position}>
      <Html sprite zIndexRange={[510, 800]}>
        <span
          style={{
            position: "relative",
            color: highlighted ? "white" : "black",
            background: highlighted ? "red" : "transparent",
            paddingRight: space ? 20 : 0,
            transition: "color 5s, background 5s",
          }}
        >
          {letter}
        </span>
      </Html>
    </object3D>
  );
}

function Cloud({ slide }) {
  const meshRef = useRef();
  const [highlight, setHighlight] = useState("");
  const rotation = useMemo(() => new Euler(0, 0, 0));
  const storedRotation = useRef();
  const storedStart = useRef(Date.now());
  const lastSlide = useRef(0);

  const invertedSlide4 = useMemo(() => {
    const euler = new Euler(Math.PI * 2, Math.PI * 0.25, Math.PI * 0.0);
    return new Matrix4().makeRotationFromEuler(euler);
  });

  useFrame((state, deltaTime) => {
    if (slide >= 2 && slide <= 5) {
      if (slide != lastSlide.current) {
        storedRotation.current = meshRef.current.quaternion.clone();
        storedStart.current = Date.now();
      }
      let targetRotation;
      if (slide === 2) {
        targetRotation = new Euler(0, Math.PI, 0);
      } else if (slide === 3) {
        targetRotation = new Euler(Math.PI * 2, Math.PI * 0.2, Math.PI * 0.3);
      } else if (slide === 4) {
        targetRotation = new Euler(Math.PI * 2, Math.PI * 0.25, Math.PI * 0.0);
      }
      meshRef.current.quaternion
        .copy(storedRotation.current)
        .slerp(
          new Quaternion().setFromEuler(targetRotation),
          easeInOutCubic(Math.min((Date.now() - storedStart.current) / 3000, 1))
        );
    } else {
      meshRef.current.quaternion.slerp(
        new Quaternion().setFromEuler(rotation),
        0.05
      );
      rotation.x += deltaTime * 0.2;
      rotation.y += deltaTime * 0.2;
      rotation.z += deltaTime * 0.05;
    }
    lastSlide.current = slide;
  });

  useEffect(() => {
    // Change highlight by slide.
  }, [slide]);

  const cloud = useMemo(() => {
    const letterBank = `
in cloudy weather
my brain
picks out the sun
`
      .replace(/[\n]+/g, " ")
      .split(" ");

    seededRandom(1234);
    let cloud = [];
    for (let i = 0; i < 300; i++) {
      cloud.push({
        letter: letterBank[Math.floor(seededRandom() * letterBank.length)],
        position: [
          seededRandom() * 6 - 3,
          seededRandom() * 6 - 3,
          seededRandom() * 6 - 3,
        ],
        offset: i * 0.02,
      });
    }
    return cloud;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <object3D ref={meshRef}>
        <HighlightedCloudLetter
          position={[2.0, 2.0, -1.0]}
          letter="when"
          space
          highlighted={slide === 2}
        />
        <HighlightedCloudLetter
          position={[1.7, 2.4, -0.2]}
          letter="I"
          highlighted={slide === 2}
          space
        />
        <HighlightedCloudLetter
          position={[1.8, 3.0, 1.0]}
          letter="love"
          highlighted={slide === 2}
        />
        <HighlightedCloudLetter
          position={[1.8, 3.0, 1.0]}
          letter="love"
          highlighted={slide === 2}
        />
        <HighlightedCloudLetter
          position={[1.8, 2.0, 0.5]}
          letter="unbounded"
          highlighted={slide === 2}
        />
        <HighlightedCloudLetter
          position={[0.8, 0.0, -2.0]}
          letter="I"
          space
          highlighted={slide === 3}
        />
        <HighlightedCloudLetter
          position={[-0.73, 1.395, 2.04]}
          letter="hear"
          space
          highlighted={slide === 3}
        />
        <HighlightedCloudLetter
          position={[1.2, -0.65, -0.5]}
          letter="it"
          highlighted={slide === 3}
        />
        <HighlightedCloudLetter
          position={[-0.7, -0.65, -0.5]}
          letter="in"
          space
          highlighted={slide === 3}
        />
        <HighlightedCloudLetter
          position={[-0.42, -1.1, -0.4]}
          letter="the"
          space
          highlighted={slide === 3}
        />
        <HighlightedCloudLetter
          position={[-1.19, 1.1, 2.79]}
          letter="birds"
          space
          highlighted={slide === 3}
        />
        {/* lol i give up here and do the sane thing, which is use matrices */}
        <HighlightedCloudLetter
          position={new Vector3(-1.0, 1.0, -2.0).applyMatrix4(invertedSlide4)}
          letter="and"
          space
          highlighted={slide === 4}
        />
        <HighlightedCloudLetter
          position={new Vector3(0.0, 1.25, -1.8).applyMatrix4(invertedSlide4)}
          letter="see"
          space
          highlighted={slide === 4}
        />
        <HighlightedCloudLetter
          position={new Vector3(1.0, 1.5, -1.3).applyMatrix4(invertedSlide4)}
          letter="it"
          space
          highlighted={slide === 4}
        />
        <HighlightedCloudLetter
          position={new Vector3(-3.0, -0.5, -0.3).applyMatrix4(invertedSlide4)}
          letter="in"
          space
          highlighted={slide === 4}
        />
        <HighlightedCloudLetter
          position={new Vector3(-1.8, -0.8, -0.1).applyMatrix4(invertedSlide4)}
          letter="the"
          space
          highlighted={slide === 4}
        />
        <HighlightedCloudLetter
          position={new Vector3(1.4, -1.6, 0.7).applyMatrix4(invertedSlide4)}
          letter="trees"
          highlighted={slide === 4}
        />
        {cloud.map((point, idx) => {
          return (
            <PulsatingCloudLetter
              key={idx}
              letter={point.letter}
              offset={point.offset}
              position={point.position}
            />
          );
        })}
      </object3D>
    </>
  );
}

export default function UniversePage() {
  const [slide, setSlide] = useState(
    parseInt(window.location.hash.substring(1)) || 0
  );

  useEffect(() => {
    const hashChange = () => {
      setSlide(parseInt(window.location.hash.substring(1)) || 0);
    };
    window.addEventListener("hashchange", hashChange);
    return () => {
      window.removeEventListener("hashchange", hashChange);
    };
  });

  let currentSlide = 0;
  return (
    <div className="decompose">
      <span
        className="fake-link"
        onClick={(e) => (window.location.hash = Math.max(slide - 1, 0))}
      >
        [prev]
      </span>
      <span
        className="fake-link"
        onClick={(e) => (window.location.hash = Math.max(slide + 1, 0))}
      >
        [next]
      </span>
      <br />
      <br />
      {slide === currentSlide++ && <>Press [next] to start.</>}
      {slide >= currentSlide && slide < currentSlide + 2 ? (
        <div
          style={{
            width: 640,
            height: 480,
            fontFamily: "monospace, Courier New",
            fontSize: 14,
            whiteSpace: "nowrap",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {slide === currentSlide++ && <></>}
          <ConsoleCanvas highlight={slide === currentSlide - 1} />
          {slide === currentSlide++ && <ConsoleTrain />}
        </div>
      ) : (
        (currentSlide += 2) && null
      )}
      {slide >= currentSlide && slide < currentSlide + 3 ? (
        <Collage
          sizeRatio={480 / 640}
          context={{ refWidth: 640, refHeight: 480 }}
        >
          {/* <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "50%",
            height: "10%",
            transform: "translate(-50%,-50%)",
            border: "5px solid red",
            zIndex: 100000,
            pointerEvents: "none",
          }}
        /> */}
          {slide === currentSlide++ && (
            <FlashingCollage
              animated
              speed={800}
              collages={[
                <CollageImage
                  url={require("./images/universe/00_when_my_heart_broke/1.png")}
                  x={-2}
                  y={-31}
                  w={640}
                  h={480}
                  offsetX={-114.5}
                  offsetY={-129.5}
                  scaleX={973}
                />,
                <CollageImage
                  url={require("./images/universe/00_when_my_heart_broke/2.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={114}
                  offsetY={-235}
                  scaleX={1366}
                />,
                <CollageImage
                  url={require("./images/universe/00_when_my_heart_broke/4.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={14}
                  offsetY={180}
                  scaleX={554}
                />,
              ]}
            />
          )}
          {slide === currentSlide++ && (
            <FlashingCollage
              animated
              speed={700}
              collages={[
                <CollageImage
                  url={require("./images/universe/01_i_saw_it_written/1.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={-52}
                  offsetY={-351}
                  scaleX={1602}
                />,
                <CollageImage
                  url={require("./images/universe/01_i_saw_it_written/2.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={-444.5}
                  offsetY={-331.5}
                  scaleX={1671}
                />,
                <CollageImage
                  url={require("./images/universe/01_i_saw_it_written/3.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={18.5}
                  offsetY={-453.5}
                  scaleX={1113}
                />,
                <CollageImage
                  url={require("./images/universe/01_i_saw_it_written/4.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={-23}
                  offsetY={-135}
                  scaleX={1390}
                />,
              ]}
            />
          )}
          {slide === currentSlide++ && (
            <FlashingCollage
              animated
              speed={500}
              collages={[
                <CollageImage
                  url={require("./images/universe/02_in_everything/1.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={-428}
                  offsetY={-162}
                  scaleX={1552}
                />,
                <CollageImage
                  url={require("./images/universe/02_in_everything/2.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={-77.5}
                  offsetY={-103.5}
                  scaleX={931}
                />,
                <CollageImage
                  url={require("./images/universe/02_in_everything/3.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={-505}
                  offsetY={-372}
                  scaleX={1170}
                />,
                <CollageImage
                  url={require("./images/universe/02_in_everything/4.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={-319.5}
                  offsetY={-509.5}
                  scaleX={1545}
                />,
              ]}
            />
          )}
          {/* {slide === currentSlide++ && (
            <FlashingCollage
              animated
              speed={300}
              collages={[
                <CollageImage
                  url={require("./images/universe/04_a_song_in_a_bar/1.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={-23.5}
                  offsetY={-54.5}
                  scaleX={1399}
                />,
                <CollageImage
                  url={require("./images/universe/04_a_song_in_a_bar/2.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={-190.5}
                  offsetY={-397.5}
                  scaleX={1621}
                />,
                <CollageImage
                  url={require("./images/universe/04_a_song_in_a_bar/3.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={-960}
                  offsetY={-198}
                  scaleX={1976}
                />,
                <CollageImage
                  url={require("./images/universe/04_a_song_in_a_bar/4.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={-723.5}
                  offsetY={-231.5}
                  scaleX={1845}
                />,
              ]}
            />
          )}
          {slide === currentSlide++ && (
            <FlashingCollage
              animated
              speed={300}
              collages={[
                <CollageImage
                  url={require("./images/universe/05_a_couple_on_a_date/1.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={-67.5}
                  offsetY={-2.5}
                  scaleX={1121}
                />,
                <CollageImage
                  url={require("./images/universe/05_a_couple_on_a_date/2.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={-422}
                  offsetY={-299}
                  scaleX={1572}
                />,
                <CollageImage
                  url={require("./images/universe/05_a_couple_on_a_date/3.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={138}
                  offsetY={-293}
                  scaleX={1396}
                />,
                <CollageImage
                  url={require("./images/universe/05_a_couple_on_a_date/4.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={-228}
                  offsetY={-101}
                  scaleX={1500}
                />,
              ]}
            />
          )}
          {slide === currentSlide++ && (
            <FlashingCollage
              animated
              speed={300}
              collages={[
                <CollageImage
                  url={require("./images/universe/06_graffiti_that_said/1.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={-327.5}
                  offsetY={-178.5}
                  scaleX={1323}
                />,
                <CollageImage
                  url={require("./images/universe/06_graffiti_that_said/2.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={-383}
                  offsetY={-98}
                  scaleX={1408}
                />,
                <CollageImage
                  url={require("./images/universe/06_graffiti_that_said/3.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={-369.5}
                  offsetY={-218.5}
                  scaleX={1587}
                />,
                <CollageImage
                  url={require("./images/universe/06_graffiti_that_said/4.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={-579.5}
                  offsetY={-146.5}
                  scaleX={1583}
                />,
              ]}
            />
          )}
          {slide === currentSlide++ && (
            <FlashingCollage
              animated
              speed={300}
              collages={[
                <CollageImage
                  url={require("./images/universe/07_lovers_were_here/1.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={-149.5}
                  offsetY={69.5}
                  scaleX={983}
                />,
                <CollageImage
                  url={require("./images/universe/07_lovers_were_here/2.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={-863}
                  offsetY={-122}
                  scaleX={1880}
                />,
                <CollageImage
                  url={require("./images/universe/07_lovers_were_here/3.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={-542}
                  offsetY={-197}
                  scaleX={1664}
                />,
                <CollageImage
                  url={require("./images/universe/07_lovers_were_here/4.png")}
                  x={0}
                  y={0}
                  w={640}
                  h={480}
                  offsetX={-362.5}
                  offsetY={-39.5}
                  scaleX={1897}
                />,
              ]} 
            />
          )}*/}
        </Collage>
      ) : (
        (currentSlide += 3) && null
      )}
      {slide >= currentSlide && slide < currentSlide + 8 ? (
        <div
          style={{
            width: 640,
            height: 480,
            overflow: "hidden",
            position: "relative",
            fontFamily: "monospace, Courier New",
            fontSize: 14,
          }}
        >
          <Canvas>
            {slide === currentSlide++ && <></>}
            <Cloud slide={slide - 5} />
          </Canvas>
        </div>
      ) : (
        (currentSlide += 2) && null
      )}
    </div>
  );
}

createPage(UniversePage, { showPets: false });
