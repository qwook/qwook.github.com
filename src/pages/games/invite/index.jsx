import { createPage } from "../../../app";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import "./invite.scss";
import { Collapsible } from "../../../components/ui/Collapsible";
import Button from "../../../components/ui/Button";
import { Panel } from "../../../components/ui/Panel";
import Banner from "../../../components/Banner";

const Person = forwardRef(
  (
    { img = "", text = [], name, avatar, status, selected, onSelected },
    ref
  ) => {
    const [bubble, setBubble] = useState(0);
    const bubbleEle = useRef();

    useImperativeHandle(
      ref,
      () => {
        return {
          reset: () => {
            setBubble(0);
          },
        };
      },
      []
    );

    return (
      <div
        className={["person", selected && "selected"].join(" ")}
        onClick={(e) => {
          bubbleEle.current.style.animation = "none";
          bubbleEle.current.offsetHeight;
          bubbleEle.current.style.animation = null;
          setBubble((bubble) => (bubble + 1) % text.length);
        }}
      >
        <div className="bubble" ref={bubbleEle}>
          {text[bubble % text.length] && (
            <div className="bubble-inner">
              {text[bubble % text.length] || ""}
            </div>
          )}
        </div>
        <div
          className="avatar"
          style={{
            backgroundImage: `url(${avatar})`,
          }}
          onClick={(e) => {
            onSelected && onSelected();
            e.stopPropagation();
          }}
        ></div>
        <div className="name">{name}</div>
        {status && (
          <div className="status">{status ? "+1 Accepted!" : "Rejected"}</div>
        )}
      </div>
    );
  }
);

const PERSON = {
  invites: 0,
  selected: false,
};

export default function InviteGamePage() {
  const [peopleState, setPeopleState] = useState([
    {
      ...PERSON,
      name: "Zo",
      avatar: require("./avatars/1.png"),
      rounds: [
        {
          beckon: [
            "Heyyyyy :)",
            "you're so cool",
            "let's hang out!!!",
            "omg i'm SO excited!!",
          ],
          party: ["heyyy", "i'm not coming :(", "soo busy this week!"],
          reality: false,
        },
        {
          beckon: [
            "em ơiiiii",
            "i've been thinking of uu",
            "let's meet yeah??",
          ],
          party: [
            "heyyyyy",
            "don't be mad!!",
            "it's just",
            "it's my friends last week here",
          ],
          reality: false,
        },
        {
          beckon: ["heeeyyy!!!", "i'm free :)", "let's hang out tonight??"],
          party: [],
          reality: false,
        },
        {
          beckon: [],
          party: [],
          reality: false,
        },
        {
          beckon: ["heyyyyyy"],
          party: [],
          reality: false,
        },
        {
          beckon: [],
          party: [],
          reality: false,
        },
        {
          beckon: [],
          party: [],
          reality: false,
        },
        {
          beckon: [],
          party: [],
          reality: false,
        },
        {
          beckon: [],
          party: [],
          reality: false,
        },
      ],
    },
    {
      ...PERSON,
      name: "Thuy",
      avatar: require("./avatars/2.png"),
      rounds: [
        {
          beckon: ["hey", "are you free?", "let's hang :D"],
          party: ["what a lovely time!", "let's hang out soon!"],
          reality: true,
        },
        {
          beckon: [
            "Yo dude!",
            "i'll be busy this week",
            "but let's see next week yeah?",
          ],
          party: ["I appreciate the invite!", "but yeah, likely busy."],
          reality: false,
          automaticIncrease: true,
        },
        {
          beckon: ["MY DUDE!", "this week's free for me :DD"],
          party: ["what a great hang out!", "same time next week?"],
          reality: true,
        },
        {
          beckon: ["YOYOYOYOYO", "wyd wyd wyd??"],
          party: ["bruhhh kekeke", "text me when you get home"],
          reality: true,
        },
        {
          beckon: ["I'M BUSY THIS WEEEK", "so ready for my vacay"],
          party: ["I JUST TOLD YOU I WAS BUSY!!"],
          reality: false,
          automaticIncrease: true,
        },
        {
          beckon: ["I AM BACK!!", "let's HANG!!"],
          party: ["omg u get home safe??", "I LOVE YOUUUUuuu"],
          reality: true,
        },
        {
          beckon: ["come 2 my going away party", ":(((("],
          party: [
            "dude",
            "you always invite me",
            "it makes me feel so appreciated",
            "i get busy a lot",
            "so people forget about me..",
            "but you never do",
            "love that!",
            "when i move...",
            "it's going to be really hard",
            "to meet friends as good as you",
            "i'll miss you so much",
          ],
          reality: true,
        },
        {
          beckon: [],
          party: [],
          reality: false,
        },
        {
          beckon: [],
          party: [],
          reality: false,
        },
      ],
    },
    {
      ...PERSON,
      name: "Phúc",
      avatar: require("./avatars/3.png"),
      rounds: [
        {
          beckon: [],
          party: ["actually really needed that", "thanks"],
          reality: true,
        },
        {
          beckon: [],
          party: ["thanks for hanging again dude"],
          reality: true,
        },
        {
          beckon: [],
          party: ["really needed that"],
          reality: true,
        },
        {
          beckon: [],
          party: [":) good stuff again"],
          reality: true,
        },
        {
          beckon: [],
          party: ["really a good time"],
          reality: true,
        },
        {
          beckon: [],
          party: [
            "actually man",
            "to tell you the truth",
            "it's been hard",
            "for me to reach out",
            "i've been going",
            "through a tough time...",
            "i really appreciate you",
          ],
          reality: true,
        },
        {
          beckon: [
            "want to grab coffee?",
            "let's get to know",
            "each other better",
          ],
          party: [
            "thanks for talking",
            "actually I think you're...",
            "really cool! and kind",
            "want to go on a date some time?",
          ],
          reality: true,
        },
        {
          beckon: [],
          party: [],
          reality: false,
        },
        {
          beckon: [],
          party: [],
          reality: false,
        },
      ],
    },
    {
      ...PERSON,
      name: "Tri",
      avatar: require("./avatars/4.png"),
      rounds: [
        {
          beckon: [
            "good talk last night...",
            "i feel like you understand me",
            "in ways no one else does.",
          ],
          party: [
            "you're so amazing",
            "so kind and compassionate..",
            "like... real. emotional. intelligence??",
            "it's been so long",
            "since I met someone like you...",
          ],
          reality: true,
        },
        {
          beckon: [
            "had a dream about you",
            "i know it's just been 2 days",
            "but i see my future with you",
          ],
          party: [
            "you are so beautiful",
            "so.. so beautiful",
            "I can't stop thinking of you",
          ],
          reality: true,
        },
        {
          beckon: [
            "hey future :)",
            "last night was amazing",
            "let's see each other tonight?",
          ],
          party: [],
          reality: false,
          automaticIncrease: true,
        },
        {
          beckon: [],
          party: [],
          reality: false,
          automaticIncrease: true,
        },
        {
          beckon: [],
          party: [],
          reality: false,
          automaticIncrease: true,
        },
        {
          beckon: ["hey beautiful....", "i miss you"],
          party: [],
          reality: false,
        },
        {
          beckon: [],
          party: [],
          reality: false,
        },
        {
          beckon: [],
          party: [],
          reality: false,
        },
        {
          beckon: [],
          party: [],
          reality: false,
        },
      ],
    },
    {
      ...PERSON,
      name: "Kel",
      avatar: require("./avatars/5.png"),
      rounds: [
        {
          beckon: ["ugh..", "work's been so tough.."],
          party: ["sorry, work pulled me in last minute"],
          reality: false,
          automaticIncrease: true,
        },
        {
          beckon: ["i just can't understand", "what he wants..."],
          party: ["no, my bf and i have to talk"],
          reality: false,
          automaticIncrease: true,
        },
        {
          beckon: [
            "dad's in the hospital..",
            "i just",
            "don't feel in control",
          ],
          party: ["no i really can't go..."],
          reality: false,
          automaticIncrease: true,
        },
        {
          beckon: ["can't get out of bed", "just one of those days"],
          party: ["i really don't have", "the energy to do this"],
          reality: false,
          automaticIncrease: true,
        },
        {
          beckon: ["finally, sunshine!", "got a break!", "let's hang?"],
          party: [
            "UGGHH",
            "I missed this so much.",
            "you don't know",
            "how stressful it's been...",
          ],
          reality: true,
          automaticIncrease: true,
        },
        {
          beckon: ["oh, darkness", "i'll be okay..."],
          party: ["i need some space right now..."],
          reality: false,
          automaticIncrease: true,
        },
        {
          beckon: [
            "hi..",
            "can you invite me to something?",
            "i really need it",
          ],
          party: ["thank you...", "thank you so much!!!!"],
          reality: true,
          automaticIncrease: true,
        },
        {
          beckon: [],
          party: [],
          reality: false,
        },
        {
          beckon: [],
          party: [],
          reality: false,
        },
      ],
    },
    {
      ...PERSON,
      name: "Trân",
      avatar: require("./avatars/6.png"),
      rounds: [
        {
          beckon: [],
          party: ["thanks but i'm busy :)"],
          reality: false,
        },
        {
          beckon: [],
          party: ["sounds fun, but i'll be out of town."],
          reality: false,
        },
        {
          beckon: [],
          party: ["ah, maybe next time?"],
          reality: false,
        },
        {
          beckon: [],
          party: [],
          reality: false,
        },
        {
          beckon: [],
          party: [],
          reality: false,
        },
        {
          beckon: [],
          party: [],
          reality: false,
        },
        {
          beckon: [],
          party: [],
          reality: false,
        },
        {
          beckon: [],
          party: [],
          reality: false,
        },
        {
          beckon: [],
          party: [],
          reality: false,
        },
      ],
    },
  ]);

  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  const resultsRef = useRef([]);

  const personEle = useRef([]);
  const personReactionsRef = useRef([]);

  const peopleEle = useRef();
  const peopleReactionsRef = useRef();
  const [selectedCount, setSelectedCount] = useState(0);
  const [showReaction, setShowReaction] = useState(false);
  const [showResults, setShowResults] = useState();

  const playAgainClick = () => {
    peopleEle.current.style.animation = "none";
    peopleEle.current.offsetHeight;
    peopleEle.current.style.animation = "enterStageRight 0.5s normal forwards";

    resultsRef.current.style.animation = "none";
    resultsRef.current.offsetHeight;
    resultsRef.current.style.animation = "exitStageLeft 0.5s normal forwards";

    peopleReactionsRef.current.style.animation = "none";
    peopleReactionsRef.current.offsetHeight;
    peopleReactionsRef.current.style.animation =
      "exitStageLeft 0.5s normal forwards";

    setPeopleState((peopleState) => {
      const copy = [...peopleState];
      for (let i = 0; i < copy.length; i++) {
        const person = copy[i];
        const clone = { ...person };
        clone.invites = 0;
        clone.selected = false;
        copy[i] = clone;
      }
      return copy;
    });

    setRound(0);
    setShowReaction(false);
    setScore(0);
    setSelectedCount(0);
  };

  const inviteButtonClick = () => {
    if (!showReaction && selectedCount >= 3) {
      peopleEle.current.style.animation = "none";
      peopleEle.current.offsetHeight;
      peopleEle.current.style.animation = "exitStageLeft 0.5s normal forwards";

      peopleReactionsRef.current.style.animation = "none";
      peopleReactionsRef.current.offsetHeight;
      peopleReactionsRef.current.style.animation =
        "enterStageRight 0.5s normal forwards";

      for (let ele of personReactionsRef.current) {
        ele && ele.reset();
      }

      let roundScore = 0;

      for (let people of peopleState) {
        if (people.selected && people.rounds[people.invites].reality === true) {
          roundScore++;
        }
      }
      setScore((score) => score + roundScore);

      setShowReaction(true);
    } else if (showReaction) {
      if (round < 7) {
        peopleEle.current.style.animation = "none";
        peopleEle.current.offsetHeight;
        peopleEle.current.style.animation =
          "enterStageRight 0.5s normal forwards";
      } else {
        resultsRef.current.style.animation = "none";
        resultsRef.current.offsetHeight;
        resultsRef.current.style.animation =
          "enterStageRight 0.5s normal forwards";
      }

      peopleReactionsRef.current.style.animation = "none";
      peopleReactionsRef.current.offsetHeight;
      peopleReactionsRef.current.style.animation =
        "exitStageLeft 0.5s normal forwards";

      for (let ele of personEle.current) {
        ele && ele.reset();
      }

      setSelectedCount(0);
      setPeopleState((peopleState) => {
        const copy = [...peopleState];
        for (let i = 0; i < copy.length; i++) {
          const person = copy[i];
          const clone = { ...person };
          if (clone.selected || clone.rounds[clone.invites].automaticIncrease) {
            clone.invites++;
          }
          clone.selected = false;
          copy[i] = clone;
        }
        return copy;
      });

      setShowReaction(false);
      setRound((round) => round + 1);
    }
  };

  return (
    <>
      <Banner>Invitation Game</Banner>
      <p>
        You got a busy schedule, so you can only invite 3 people to hang out
        this week! Who will it be? Click on the bubbles to keep talking to the
        person. Click on the profile picture to select them.
      </p>
      <br />
      <div>
        <div className="stage">
          <div className="people" ref={peopleEle}>
            {peopleState.map((person, idx) => {
              return (
                <Person
                  ref={(ref) => (personEle.current[idx] = ref)}
                  text={person.rounds[person.invites].beckon}
                  name={person.name}
                  avatar={person.avatar}
                  selected={person.selected}
                  onSelected={() => {
                    setPeopleState((peopleState) => {
                      const copy = [...peopleState];
                      if (selectedCount < 3 && !copy[idx].selected) {
                        copy[idx].selected = true;
                        setSelectedCount(
                          (selectedCount) => (selectedCount += 1)
                        );
                      } else if (copy[idx].selected) {
                        copy[idx].selected = false;
                        setSelectedCount(
                          (selectedCount) => (selectedCount -= 1)
                        );
                      }
                      return copy;
                    });
                  }}
                ></Person>
              );
            })}
          </div>
          <div className="people reactions" ref={peopleReactionsRef}>
            {peopleState
              .filter((person) => person.selected)
              .map((person, idx) => {
                return (
                  <Person
                    ref={(ref) => (personReactionsRef.current[idx] = ref)}
                    text={person.rounds[person.invites].party}
                    name={person.name}
                    avatar={person.avatar}
                    status={person.rounds[person.invites].reality}
                  ></Person>
                );
              })}
          </div>
          <div className="results" ref={resultsRef}>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <h1 style={{ textAlign: "center" }}>Your Score: {score}</h1>

            <div style={{ textAlign: "center" }}>
              <Button
                style={{ display: "inline-block" }}
                onClick={playAgainClick}
              >
                Play Again?
              </Button>
            </div>
          </div>
        </div>
        <br />
        <div style={{ textAlign: "center", paddingBottom: 5 }}>
          Score: {score}
          <br />
          Round: {round} / 7
        </div>
        <div style={{ textAlign: "center" }}>
          <Button
            style={{ display: "inline-block" }}
            disabled={selectedCount < 3}
            onClick={inviteButtonClick}
          >
            {showReaction
              ? "Next"
              : selectedCount < 3
              ? "Select 3 people to invite."
              : "Let's hang out!"}
          </Button>
        </div>
      </div>
      <br />
      <br />
      <br />
      <Panel>
        <Collapsible name={"[SPOILERS] Why did I make this game?"}>
          <p>Inviting people out has taught me a lot of lessons.</p>
          <p>
            In the past, I've met a lot of really exciting people and they
            seemed to like all the things I do, but they just didn't show up in
            my life.
          </p>
          <p>
            These could be genuinely nice people whose schedules just never
            align with mine. Maybe they suck at setting boundaries or being
            direct and they can't say no. Maybe they're going through something
            in their life, and perhaps the timing will be right much later on.
          </p>
          <p>
            Whatever the case, they're not meant to be in my life at this
            moment, and that is totally okay.
          </p>
        </Collapsible>
      </Panel>
    </>
  );
}

createPage(InviteGamePage, { showPets: false });
