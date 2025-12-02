import Banner from "../components/Banner";
import { createPage } from "../app";
import "./vcr.scss";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import srtParser2 from "srt-parser-2";

const credits = `LAST SEEN ONLINE (2023)
lastseenonline.com
 
AND YOU'LL MISS IT (2024)
qwook.io/miss
 
Cô Hà's Living Room Tour (2025)
_
BAY AREA
>Music Production
>> Entropic Sonics (@entropicsonics)
>Artwork
>> Isabel Li (@ilyues)
>> Noa (@snakesforeyes)
>Film
>> Jungmin (@jungmin.oo)
>LoseAmp Musicians
>> Gail (@studioghobbli)
>> Joe Baker (@joesshoestore)
_
NEW YORK
>LoseAmp Musicians
>> Toomi (@toomiiiii__)
 
LOS ANGELES
>End Credit Songs
>> Matthew Rudas (@sunnygrey0)
 
SAIGON
>Guitar Ambient Track
>> Oniks Lê (@oniksle)
>Poetry
>> Ng Ny (@aleglessbird)
>Artwork
>> Trần Thanh Thiện (@xuongmattrang)
_
Special Thanks To
>> Sho (wu.sh0)
>> Reading Cabin (@readingcabin.vn)
>> Nay Mai (@naymai.day)
`;

const poem1 = `this interview excerpt with
'Last Seen Online' developer,
> Henry Quốc Trần
was conducted by
> Cyn Phương-Anh Lê
for 'SEA2SEA'
at 'Lower Grand Radio'
`;

const poem2 = `sớm nay con đã hút điếu thuốc khi xưa
từng nằm trên tay ba
ngựa trắng
 
sao ba lại hút
bé con đã tự hỏi
 
giữa hai lượt siết
giờ nó thắc mắc
sao ba lại bỏ
 
phải mà
mà vẫn được vỗ về
bởi ngà say thơm khói này
sẽ dịu dàng đời ba hơn
 
sẽ ôm con
khóc một lần nữa
chí lớn không thành
 
ngồi trước ti vi
khóc võ nguyên giáp một lần nữa
mà vẫn ráo hoảnh trước xác nội
 
mở chế linh ca một bài nữa,
“đường nhân gian đầy ải thương đau”
ba dặn con
 
“đường thương đau đầy ải nhân gian” 
ba nhớ sai lời rồi
 
“ai chưa qua chưa phải là người”
 
sg, 4/4/25
`;

const VCRCaption = forwardRef(
  ({ style, maxLines = 3, autoMove = true }, ref) => {
    useImperativeHandle(
      ref,
      () => ({
        spawnCaption: (caption) => {
          if (caption) {
            setCaptions((captions) => {
              return [
                ...captions,
                {
                  text: caption,
                  progress: 0,
                  line: lineTracker.current++,
                },
              ];
            });
            setTimeout(() => resetMoveLineUpTimer(), 0);
          }
        },
        pushUp() {
          setLine((line) => {
            return Math.min(line + 1, lineTracker.current + maxLines);
          });
          resetMoveLineUpTimer();
        },
      }),
      []
    );

    const [captions, setCaptions] = useState([]);
    const [line, setLine] = useState(0);
    const [lineLerp, setLineLerp] = useState(0);
    const lineTracker = useRef(0);

    const autoLineMoveUp = useRef();
    function resetMoveLineUpTimer() {
      if (autoLineMoveUp.current) {
        clearTimeout(autoLineMoveUp.current);
      }
      autoLineMoveUp.current = setTimeout(() => {
        if (autoMove) {
          setLine((line) => {
            return Math.min(line + 1, lineTracker.current + maxLines);
          });
        }
        resetMoveLineUpTimer();
      }, 1000);
    }

    useEffect(() => {
      return () => {
        clearTimeout(autoLineMoveUp.current);
      };
    }, []);

    /* Caption Data

  {
    text: "test",
    progress: 0,
    line: 0,
  }
  */

    useEffect(() => {
      const interval = setInterval(() => {
        setCaptions((captions) => {
          return captions.map((caption) => ({
            ...caption,
            progress: caption.progress + 1,
          }));
        });
      }, 50);
      return () => {
        clearInterval(interval);
      };
    }, []);

    useEffect(() => {
      const lineDelta = 0.1;
      const interval = setInterval(() => {
        setLineLerp((lineLerp) => {
          if (line - lineLerp > lineDelta) {
            return lineLerp + lineDelta;
          } else {
            return line;
          }
        });
      }, 10);
      return () => {
        clearInterval(interval);
      };
    }, [line]);

    useEffect(() => {
      if (captions.length > maxLines) {
        setLine(
          Math.max(captions[Math.max(0, captions.length - maxLines)].line, line)
        );
      }
    }, [captions]);

    return (
      <>
        <div className="vcr-closed-captions" style={style}>
          {captions.map((caption) => {
            return (
              <div
                className="vcr-line"
                style={{
                  top: `${0.8 * (caption.line - lineLerp)}em`,
                  marginLeft: `${caption.text.replace(/[^\>]/g, "").length}em`,
                }}
              >
                <span
                  className="vcr-text"
                  style={{
                    backgroundColor:
                      caption.text === " " ? "transparent" : null,
                  }}
                >
                  {caption.text
                    .replace(/[\>]/g, "")
                    .split(" ")
                    .slice(0, caption.progress)
                    .join(" ")}
                </span>
              </div>
            );
          })}
        </div>
      </>
    );
  }
);

function Poem({ poemSource, maxLines, style, delay = 0 }) {
  const caption = useRef();
  const poem = useMemo(() => poemSource.split("\n"), [poemSource]);
  const currentLine = useRef(0);

  useEffect(() => {
    let interval;
    const timeOut = setTimeout(() => {
      interval = setInterval(() => {
        const line = currentLine.current++;
        if (poem[line]) {
          caption.current.spawnCaption(poem[line]);
        }
      }, 500);
    }, delay);
    return () => {
      clearTimeout(timeOut);
      clearInterval(interval);
    };
  });

  return <VCRCaption ref={caption} maxLines={maxLines} style={style} />;
}

export function sleepable(fn) {
  let timeouts = [];
  let cancelled = false;

  function sleep(time) {
    if (cancelled) return false;
    return new Promise((resolve, reject) => {
      let timeout = setTimeout(() => {
        timeouts.splice(timeouts.indexOf(timeout), 1);
        if (cancelled) {
          resolve(true);
        }
        resolve(false);
      }, time);
      timeouts.push(timeout);
    });
  }
  fn(sleep);

  return () => {
    cancelled = true;
    for (const timeout of timeouts) {
      clearTimeout(timeout);
    }
  };
}

function MiniCredits({ poemSource, maxLines, style, delay = 0 }) {
  const caption = useRef();
  const pages = useMemo(() =>
    poemSource.split("_\n").map((lines) => lines.split("\n"))
  );
  const currentLine = useRef(0);

  useEffect(() => {
    sleepable(async (sleep) => {
      if (await sleep(2000)) return;

      while (true) {
        for (let page of pages) {
          page = page.slice(0, page.length - 1);
          for (const line of page) {
            caption.current.spawnCaption(line);
            console.log(line);
            if (await sleep(100)) return;
          }
          console.log("reset");
          if (await sleep(6000)) return;
          for (const line of page) {
            caption.current.pushUp();
            // if (await sleep(100)) return;
          }
        }
      }

      // if (await sleep(1000)) return;
    });
  }, []);

  // useEffect(() => {
  //   let interval;
  //   const timeOut = setTimeout(() => {
  //     interval = setInterval(() => {
  //       const line = currentLine.current++;
  //       if (poem[line]) {
  //         caption.current.spawnCaption(poem[line]);
  //       }
  //     }, 1500);
  //   }, delay);
  //   return () => {
  //     clearTimeout(timeOut);
  //     clearInterval(interval);
  //   };
  // });

  return (
    <VCRCaption ref={caption} maxLines={20} style={style} autoMove={false} />
  );
}

function SubtitleClosedCaptions() {
  const caption = useRef();

  const srtArray = useMemo(() => {
    const parser = new srtParser2();
    let srtArray = parser.fromSrt(require("./images/vcr/VCRCaptions.txt"));
    srtArray = srtArray.sort((a, b) => {
      b.startSeconds - a.startSeconds;
    });
    srtArray.splice(0, 67);
    console.log(srtArray);
    return srtArray;
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedTime = (3600000 + 150000 + Date.now() - startTime) / 1000;
      while (srtArray[0] && srtArray[0].startSeconds < elapsedTime) {
        caption.current.spawnCaption(srtArray[0].text);
        srtArray.splice(0, 1);
      }
    }, 100);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return <VCRCaption ref={caption} maxLines={3} />;
}

const song1 = `♪ Feel the weight down in your feet ♪
♪ Feel the wind against your cheek ♪
♪ A ray of light into your chest ♪
♪ Warmth dripping from your head ♪
 
♪ Remember when you played with bugs? ♪
♪ Bionicles flung in the mud ♪
♪ Pillow forts and barbie dolls ♪
♪ You go and run when mommy calls ♪
 
♪ Slow down the ticking of your brain ♪
♪ Let the thoughts drip down like rain ♪
 
♪ Take one step at a time ♪
♪ You don't need to run ♪
♪ to cross the finish line ♪
♪ Take another minute ♪
♪ Turn back the dial ♪
♪ Roll out of bed even take a while ♪
 
♪ Take one day at a time ♪
♪ remember to breathe ♪
♪ You're doing fine ♪
♪ Just slow down and take your time ♪
♪ The sun doesn't always have to shine ♪`;

const song2 = `♪ Wake up with sun in my eyes ♪
♪ Clear skies ♪
♪ Birds chirping outside ♪
♪ Wake up alone in my bed ♪
 
♪ No one in my head nothing to forget ♪
♪ World's spinning around me ♪
♪ But I'm perfectly still ♪
♪ Everyone gets older ♪
♪ But I feel the same ♪
 
♪ Wake up alone in my head ♪
♪ No one in my bed ♪
♪ Nothing to forget ♪
 
♪ Wake up with rain in my eyes ♪
♪ Clear skies ♪
♪ I'm too tired to go outside ♪
♪ World's perfectly still ♪
♪ But I'm spinning around ♪
♪ I keep getting older ♪
♪ But I feel the same ♪
 
♪ Nothing really matters anyways ♪
♪ The big picture will –
  come crashing down any day ♪
♪ I do not care, I'll be happy either way ♪
 
♪ Nothing bothers me anymore ♪
♪ My dreams are waiting for –
  me out that door ♪
♪ No perfect plans to find what I'm living for ♪`;

function SimpleVCR({ text }) {
  const textSplit = useMemo(() => {
    return text.split("\n");
  }, [text]);
  return (
    <div className="vcr-closed-captions" style={{ margin: 100, height: 1000 }}>
      {textSplit.map((line, idx) => {
        return (
          <div className="vcr-line" style={{ top: `${0.8 * idx}em` }}>
            <span
              className="vcr-text"
              style={{
                marginLeft: `${line.substr(0, 1) === "&" ? 2 : 0}em`,
                backgroundColor:
                  line === " " || line === "" ? "transparent" : null,
              }}
            >
              {line.substr(0, 1) === "&" ? line.substr(1) : line}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function VCRPage() {
  return (
    <>
      {/* <SubtitleClosedCaptions /> */}
      <Poem
        poemSource={poem1}
        maxLines={7}
        style={{
          position: "absolute",
          top: 200,
          left: 300,
          width: 1000,
          height: 1000,
        }}
      />
      {/* <SimpleVCR
        text={`A Dream State Informercial

Mis Perfect,
&dir. Jessica Le

Fight Night,
&dir. Spencer Tsang

Magma,
&Moscelyne ParkeHarrison / Post:ballet

Black Cat Summer,
&dir. Steven Gong

Moo, Annie. Moo,
&dir. Caleb Soon

A Heavy Burden,
&dir.  Ginger Yifan Chen

Globe,
&BODYSONNET

Plenty of Fish,
&dir. Ethan Okamoto and TJ Camaclang

Bleach,
&dir Caleb Soon

Bridge to Everywhere,
&dir Spencer Tsang`}
      /> */}
      {/* <Poem
        poemSource={poem2}
        maxLines={5}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          width: 800,
        }}
        delay={500}
      /> */}
      {/* <Poem
        poemSource={song1.toUpperCase()}
        maxLines={5}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          width: 600,
        }}
      />
      <Poem
        poemSource={song2.toUpperCase()}
        maxLines={5}
        style={{
          position: "absolute",
          top: 200,
          left: 200,
          width: 600,
        }}
        delay={500}
      /> */}
      {/*<MiniCredits
        poemSource={credits}
        maxLines={5}
        style={{
          position: "absolute",
          top: 100,
          left: 100,
          width: 800,
          height: 1000,
        }}
        delay={500}
      />*/}
    </>
  );
}

createPage(VCRPage, { showPets: false, showNav: false });
