import Banner from "../components/Banner";
import { createPage } from "../app";
import { useEffect, useRef, useState } from "react";
import Button from "../components/ui/Button";
import { TypingList } from "../components/TypingList";

// Congratulations on digging around!

// No, there is no LLM. This was all made organically :)

// Yes, this is a Barnum Statement. It was originally written by Derren Brown.
// Read more about it here: https://en.wikipedia.org/wiki/Barnum_effect
// It's applicable to almost everyone and uses enough vague wording that you
// can fill in the blanks with yourself.

// Watch it in action here: https://www.youtube.com/watch?v=haP7Ys9ocTk

// I'm quite a big skeptic of astrology, mysticism, and many things out of the
// rational world. This was one of my first try at implementing it in my "art"
// practice.

const derrenBrown =
  `You are a person prone to bouts of self-examination. This is in sharp contrast to a striking ability you have developed to appear very socially engaged, even the life and soul of the party; but in a way that only convinces others. You are all too aware of it being a facade.
<br/><br/>
This means that you will often be at a gathering and find yourself playing a part. While on the one hand you'll be talkative and funny, you'll be detaching yourself to the point where you will find yourself watching everything going on around you and feeling utterly unable to engage. You'll play conversations back to yourself in your head and wonder what that person really meant when he said such-and-such - conversations that other people wouldn't give a second thought to.
<br/><br/>
How have you learned to deal with this conflict? Through exercising control. You like to show a calm, self-assured fluid kind of stability (but because this is self-consciously created, it will create bouts of frustrated silliness and a delight in extremes, or at least a delight in being seen to be extreme). You most easily recognize this control in how you are with people around you. You have learned to protect yourself by keeping people at bay. Because in the past you have learned to be disappointed by people (and because there were issues with you adjusting to your sexuality), you instinctively keep people at arms' length, until you decide they are allowed over that magic line into your group of close friends.
<br/><br/>
However, once across that line, the problem is that an emotional dependency kicks in which leaves you feeling very hurt or rejected if it appears that they have betrayed that status.
<br/><br/>
Because you are prone to self-examination, you will be aware of these traits. However, you are unusually able to examine even that self-examination, which means that you have become concerned about what the real you is. You have become all too aware of facades, of sides of yourself which you present to the world, and you wonder if you have lost touch with the real and spontaneous you.
<br/><br/>
You are very creative, and have tried different avenues to utilize that ability. It may not be that you specifically, say, paint; it may be that your creativity shows itself in more subtle ways, but you will certainly find yourself having vivid and well-formed ideas which others will find hard to grasp. You set high standards for yourself, though, and in many ways are a bit of a perfectionist. The problem is, though, that it means you often don't get stuff done, because you are frustrated by the idea of mediocrity and are wearied by the idea of starting something afresh. However, once your brain is engaged you'll find yourself sailing. Very much this will likely lead to you having considered writing a novel or some such, but a fear that you won't be able to achieve quite what you want stops you from getting on with it. But you have a real vision for things, which others fall short of. Particularly in your academic/college situation, you are currently fighting against restraints upon your desire to express yourself freely.
<br/><br/>
Your relationship with your parents (there is a suggestion that one is no longer around, or at least emotionally absent) is under some strain. You wish to remain fond of them but recent issues are causing frustration - from your side far more than theirs. In fact they seem unaware of your thoughts on the matter. Partly this is because there are ways in which you have been made to feel isolated from certain groups in the past - something of an outsider. Now what is happening is that you are taking that outsider role and defending it to the point of consciously avoiding being part of a group. This will serve you well in your creative and career pursuits. You have an enormous cynicism towards those who prefer to be part of a group or who exhibit any cliquey behaviour, and you always feel a pang of disappointment when you see your 'close' friends seeming to follow that route. Deep down it feels like rejection.
<br/><br/>
However, for all that introspection, you have developed a sensational, dry sense of humour that makes connections quickly and wittily and will leave you making jokes that go right over the heads of others. You delight in it so much that you'll often rehearse jokes or amusing voices to yourself in order to 'spontaneously' impress others with them. But this is a healthy desire to impress, and although you hate catching yourself at it, it's nothing to be so worried about.
<br/><br/>
There's also an odd feeling that you should have been born in a different century. You might be able to make more sense of that than I can.
<br/><br/>
There are some strong monetary shifts taking place at the moment. Both the recent past and what's in store over the next few months represent quite a change.
<br/><br/>
You have links at the moment with people abroad, which are quite interesting, and will look to yield worthwhile results. You're naturally a little disorganized. A look around your living space would show a box of photos, unorganized into albums, out-of-date medicines, broken items not thrown out, and notes to yourself which are significantly out of date. Something related to this is that you lack motivation. Because you're resourceful and talented enough to be pretty successful when you put your mind to things, this encourages you to procrastinate and put them off. Equally, you've given up dreams a little easily when your mind flitted elsewhere. There are in your home signs of an excursion into playing a musical instrument, which you have since abandoned, or are finding yourself less interested in. (This may alternatively relate to poetry and creative writing you've briefly tried your hand at and left behind you.) You have a real capacity for deciding that such-and-such a thing (or so-and-so a person) will be the be all and end all of everything and be with you for ever. But you'd rather try and fail, and swing from one extreme to the other, than settle for the little that you see others content with.
<br/><br/>
Conclusion: It's very interesting doing your reading, as you do present something of a conundrum, which won't surprise you. You are certainly bright, but unusually open to life's possibilities - something not normally found among achieving people. I'd say you'd do well to be less self-absorbed, as it tends to distance you a little, and to relinquish some of the control you exercise when you present that stylized version of yourself to others. You could let people in a little more, but I am aware that there is a darkness you feel you should hide (much of this is in the personal/relationship/sexual area, and is related to a neediness which you don't like).
<br/><br/>
You really have an appealing personality - genuinely. Many thanks for doing this, and for offering something far more substantial than most.`.split(
    " "
  );

function Reading() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < derrenBrown.length) {
      const interval = setInterval(() => {
        setCurrentIndex((currentIndex) => currentIndex + 3);
      }, 70);

      return () => {
        clearInterval(interval);
      };
    }
  }, [currentIndex < derrenBrown.length]);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: derrenBrown.slice(0, currentIndex).join(" "),
      }}
    ></div>
  );
}

export default function ListPage() {
  const [pos, setPos] = useState("");
  const canvas = useRef();
  const context = useRef();
  const [showContinue, setShowContinue] = useState(false);
  const [showGenerating, setShowGenerating] = useState(false);
  const [showReading, setShowReading] = useState(false);

  useEffect(() => {
    context.current = canvas.current.getContext("2d");
  }, []);

  useEffect(() => {
    const pointerMove = (e) => {
      setPos(
        <>
          <div style={{ display: "inline-block", width: 100 }}>
            {Math.floor(e.offsetX)}
          </div>
          <div style={{ display: "inline-block", width: 100 }}>
            {Math.floor(e.offsetY)}
          </div>
        </>
      );
    };
    document.addEventListener("pointermove", pointerMove);

    return () => {
      document.removeEventListener("pointermove", pointerMove);
    };
  }, []);

  const drawing = useRef();
  const lastMouse = useRef();

  return (
    <>
      <Banner>Digital Palm Reading</Banner>
      <h1>Draw a Square, and I'll Determine Your Personality</h1>
      {showGenerating && (
        <TypingList
          list={[
            "Collecting Data...",
            "Generating Palm Data...",
            "Analyzing Palm...",
          ]}
          shouldTypo={false}
        />
      )}
      {showReading && <Reading />}
      <br />
      <canvas
        width="300"
        height="300"
        style={{ border: "1px dashed black", touchAction: "none" }}
        ref={canvas}
        onPointerDown={(e) => {
          drawing.current = true;
          context.current.fillColor = "rgb(0,0,0)";

          context.current.fillRect(
            Math.floor(e.nativeEvent.offsetX / 5) * 5,
            Math.floor(e.nativeEvent.offsetY / 5) * 5,
            5,
            5
          );

          lastMouse.current = {
            offsetX: e.nativeEvent.offsetX,
            offsetY: e.nativeEvent.offsetY,
          };

          setShowContinue(true);
        }}
        onPointerUp={(e) => {
          drawing.current = false;
        }}
        onPointerMove={(e) => {
          // Thank you: https://www.youtube.com/watch?v=CceepU1vIKo
          // For this line algorithm!

          if (drawing.current) {
            context.current.fillColor = "rgb(0,0,0)";

            let x0 = Math.floor(lastMouse.current.offsetX / 5);
            let y0 = Math.floor(lastMouse.current.offsetY / 5);
            let x1 = Math.floor(e.nativeEvent.offsetX / 5);
            let y1 = Math.floor(e.nativeEvent.offsetY / 5);

            if (Math.abs(x1 - x0) > Math.abs(y1 - y0)) {
              if (x0 > x1) {
                [x0, x1] = [x1, x0];
                [y0, y1] = [y1, y0];
              }

              // draw line horizontal
              let dx = x1 - x0;
              let dy = y1 - y0;
              const dir = Math.sign(dy);
              dy *= dir;

              if (dx != 0) {
                let y = y0;
                let p = 2 * dy - dx;
                for (let i = 0; i <= dx; i++) {
                  context.current.fillRect((x0 + i) * 5, y * 5, 5, 5);
                  if (p >= 0) {
                    y += dir;
                    p -= 2 * dx;
                  }
                  p += 2 * dy;
                }
              }
            } else {
              if (y0 > y1) {
                [x0, x1] = [x1, x0];
                [y0, y1] = [y1, y0];
              }

              // draw line vertical
              let dx = x1 - x0;
              let dy = y1 - y0;
              const dir = Math.sign(dx);
              dx *= dir;

              if (dy != 0) {
                let x = x0;
                let p = 2 * dx - dy;
                for (let i = 0; i <= dy; i++) {
                  context.current.fillRect(x * 5, (y0 + i) * 5, 5, 5);
                  if (p >= 0) {
                    x += dir;
                    p -= 2 * dy;
                  }
                  p += 2 * dx;
                }
              }
            }

            lastMouse.current = {
              offsetX: e.nativeEvent.offsetX,
              offsetY: e.nativeEvent.offsetY,
            };
          }
        }}
      />
      <p>{pos}</p>
      {showContinue && (
        <Button
          onClick={(e) => {
            setShowContinue(false);
            setShowGenerating(true);
            setTimeout(() => {
              setShowGenerating(false);
              setShowReading(true);
            }, 4000);
          }}
        >
          Continue
        </Button>
      )}
      <h2>Background</h2>
      <p>
        In the 1910's, Dr. Phineas Taylor Bertram developed a method of reading
        palms with 70% accuracy. By following the dips and lines on the palm,
        one can determine a lot about a person. With today's neural imaging
        tools I am able to read your palm just from you drawing a square.
      </p>
      <img width="50%" src={require("./images/seance.jpg")}></img>
      <p>
        <strong>How does it work?</strong> Our handwriting is determined by the
        shape of our fingers and palms – along with our motor skills. By
        analyzing the tiny mistakes you make with your mouse or touchscreen, I
        am able to generate a full 3D re-creation of your hand. Then I utilize
        Bertram's personality grid to match you with a reading. You don't
        actually have to draw a square – you can draw anything! I am recording
        your cursor/touch movement information. The reading starts as soon as
        you open the page. I'm running the LLM on a small laptop in Vietnam, so
        be patient if it's a little slow!
      </p>
    </>
  );
}

createPage(ListPage, { showPets: false });
