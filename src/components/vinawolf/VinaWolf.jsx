import { createContext, useContext, useEffect, useMemo, useState } from "react";
import "./vinawolf.scss";
import Button from "../ui/Button";
import { Howl } from "howler";
import { Panel } from "../ui/Panel";

const SOUND_DB = {
  ["timer10s"]: require("./sounds/timer10s.mp3.100.mp3"),
  ["timer30s"]: require("./sounds/timer30s.mp3.100.mp3"),
  ["timerend"]: require("./sounds/timerend.mp3.100.mp3"),
  ["bgm"]: require("./sounds/bgm.mp3.100.mp3"),
  ["begin"]: require("./sounds/begin.mp3.100.mp3"),
  ["werewolf1"]: require("./sounds/werewolf1.mp3.100.mp3"),
  ["werewolf2"]: require("./sounds/werewolf2.mp3.100.mp3"),
  ["mason1"]: require("./sounds/mason1.mp3.100.mp3"),
  ["mason2"]: require("./sounds/mason2.mp3.100.mp3"),
  ["minion1"]: require("./sounds/minion1.mp3.100.mp3"),
  ["minion2"]: require("./sounds/minion2.mp3.100.mp3"),
  ["seer1"]: require("./sounds/seer1.mp3.100.mp3"),
  ["seer2"]: require("./sounds/seer2.mp3.100.mp3"),
  ["robber1"]: require("./sounds/robber1.mp3.100.mp3"),
  ["robber2"]: require("./sounds/robber2.mp3.100.mp3"),
  ["troublemaker1"]: require("./sounds/troublemaker1.mp3.100.mp3"),
  ["troublemaker2"]: require("./sounds/troublemaker2.mp3.100.mp3"),
  ["drunk1"]: require("./sounds/drunk1.mp3.100.mp3"),
  ["drunk2"]: require("./sounds/drunk2.mp3.100.mp3"),
  ["insomniac1"]: require("./sounds/insomniac1.mp3.100.mp3"),
  ["insomniac2"]: require("./sounds/insomniac2.mp3.100.mp3"),
  ["end1"]: require("./sounds/end1.mp3.100.mp3"),
  ["end2"]: require("./sounds/end2.mp3.100.mp3"),
  ["flavor1"]: require("./sounds/mientay/flavor1.mp3"),
  ["flavor2"]: require("./sounds/mientay/flavor2.mp3"),
};

// const SOUND_DB = {
//   ["timer10s"]: require("./sounds/timer10s.mp3.100.mp3"),
//   ["timer30s"]: require("./sounds/timer30s.mp3.100.mp3"),
//   ["timerend"]: require("./sounds/timerend.mp3.100.mp3"),
//   ["bgm"]: require("./sounds/mientay/bgm.mp3"),
//   ["begin"]: require("./sounds/mientay/begin.mp3"),
//   ["werewolf1"]: require("./sounds/mientay/werewolf1.mp3"),
//   ["werewolf2"]: require("./sounds/mientay/werewolf2.mp3"),
//   ["mason1"]: require("./sounds/mientay/mason1.mp3"),
//   ["mason2"]: require("./sounds/mientay/mason2.mp3"),
//   ["minion1"]: require("./sounds/mientay/minion1.mp3"),
//   ["minion2"]: require("./sounds/mientay/minion2.mp3"),
//   ["seer1"]: require("./sounds/mientay/seer1.mp3"),
//   ["seer2"]: require("./sounds/mientay/seer2.mp3"),
//   ["robber1"]: require("./sounds/mientay/robber1.mp3"),
//   ["robber2"]: require("./sounds/mientay/robber2.mp3"),
//   ["troublemaker1"]: require("./sounds/mientay/troublemaker1.mp3"),
//   ["troublemaker2"]: require("./sounds/mientay/troublemaker2.mp3"),
//   ["drunk1"]: require("./sounds/mientay/drunk1.mp3"),
//   ["drunk2"]: require("./sounds/mientay/drunk2.mp3"),
//   ["insomniac1"]: require("./sounds/mientay/insomniac1.mp3"),
//   ["insomniac2"]: require("./sounds/mientay/insomniac2.mp3"),
//   ["end1"]: require("./sounds/mientay/end1.mp3"),
//   ["end2"]: require("./sounds/mientay/end2.mp3"),
//   ["flavor1"]: require("./sounds/mientay/flavor1.mp3"),
//   ["flavor2"]: require("./sounds/mientay/flavor2.mp3"),
// };

const SoundContext = createContext({});

function SoundContextProvider({ children, soundDb }) {
  const [toLoad, setToLoad] = useState(0);
  const [loadedSounds, setLoadedSounds] = useState(new Set());
  const loading = loadedSounds.size < toLoad;
  const sounds = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(soundDb).map(([k, sound]) => [
          k,
          new Howl(
            {
              src: sound,
              autoplay: false,
              volume: 1,
              html5: false,
              onload: () => {
                console.log("Loaded " + sound);
                setLoadedSounds((loadedSounds) =>
                  new Set(loadedSounds).add(sound)
                );
              },
            },
            []
          ),
        ])
      ),
    [soundDb]
  );

  useEffect(() => {
    setToLoad(Object.values(soundDb).length);
  }, [soundDb]);

  return (
    <SoundContext.Provider value={{ sounds, toLoad, loadedSounds, loading }}>
      {children}
    </SoundContext.Provider>
  );
}

function Timer({ timer, onReturnToScreen }) {
  const [timeLeft, setTimeLeft] = useState(timer);

  const sounds = useMemo(
    () =>
      Object.fromEntries(
        Object.entries({
          ["timer10s"]: require("./sounds/timer10s.mp3"),
          ["timer30s"]: require("./sounds/timer30s.mp3"),
          ["timerend"]: require("./sounds/timerend.mp3"),
        }).map(([k, sound]) => [
          k,
          new Howl(
            {
              src: sound,
              autoplay: false,
              volume: 1,
              html5: true,
            },
            []
          ),
        ])
      ),
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((timeLeft) => timeLeft - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft <= 30) {
      sounds["timer30s"].play();
    }
  }, [timeLeft <= 30]);

  useEffect(() => {
    if (timeLeft <= 10) {
      sounds["timer10s"].play();
    }
  }, [timeLeft <= 10]);

  useEffect(() => {
    if (timeLeft <= 0) {
      sounds["timerend"].play();
      onReturnToScreen();
    }
  }, [timeLeft <= 0]);

  return (
    <>
      <h1>
        {timeLeft >= 60 && <>{Math.floor(timeLeft / 60)},</>}
        {timeLeft % 60} để tìm ma sói
      </h1>
      <Button onClick={() => onReturnToScreen()}>Stop</Button>
    </>
  );
}

function DelayControl({ onDelayChange, min, max, increment, defaultValue }) {
  const [delay, setDelay] = useState(defaultValue);

  useEffect(() => {
    onDelayChange && onDelayChange(delay);
  }, [delay]);

  return (
    <>
      <Button
        style={{ flexGrow: 0, width: 20 }}
        onClick={() => setDelay((delay) => Math.max(min, delay - increment))}
      >
        -
      </Button>
      <Panel style={{ background: "white", padding: 10, width: 150 }}>
        {delay > 59 && <>{Math.floor(delay / 60)} phút </>}
        {delay % 60 > 0 &&
          (delay % 60 === 30 && delay > 59 ? (
            <>rưỡi</>
          ) : (
            <>{delay % 60} giây</>
          ))}
        {delay === 0 && <>0 giây</>}
      </Panel>
      <Button
        style={{ flexGrow: 0, width: 20 }}
        onClick={() => setDelay((delay) => Math.min(max, delay + increment))}
      >
        +
      </Button>
    </>
  );
}

function Role({ id, en, vn, icon }) {
  const { selectedId, setSelectedId, selectedRole, setSelectedRoles } =
    useContext(RoleContext);

  return (
    <div className="role">
      <Button
        correct={selectedId[id]}
        onClick={() => {
          setSelectedId((selectedId) => {
            return { ...selectedId, [id]: !selectedId[id] };
          });
          if (selectedId[id]) {
            setSelectedRoles((selectedRole) => {
              const roles = [...selectedRole];
              roles.splice(roles.indexOf(en), 1);
              return roles;
            });
          } else {
            setSelectedRoles((selectedRole) => [...selectedRole, en]);
          }
        }}
      >
        <div className="role-name">
          <img src={icon}></img>
          <div className="big">{vn}</div>
          <div className="small">{en}</div>
        </div>
      </Button>{" "}
    </div>
  );
}

const RoleContext = createContext();

function sleepable(fn) {
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
  function cancelCheck() {
    return cancelled;
  }
  fn(sleep, cancelCheck);

  return () => {
    cancelled = true;
    for (const timeout of timeouts) {
      clearTimeout(timeout);
    }
  };
}

export function VinaWolf() {
  return (
    <SoundContextProvider soundDb={SOUND_DB}>
      <VinaWolfInner />
    </SoundContextProvider>
  );
}

function VinaWolfInner() {
  const { sounds, loading, toLoad, loadedSounds } = useContext(SoundContext);

  const [villager, setVillager] = useState(false);
  const [selectedId, setSelectedId] = useState({});
  const [selectedRole, setSelectedRoles] = useState([]);

  const [cancel, setCancel] = useState();

  const [instruction, setInstruction] = useState("");
  const [delay, setDelay] = useState(5);
  const [timer, setTimer] = useState(5 * 60);

  const [screen, setScreen] = useState("selection");

  function stopAllSounds() {
    for (const sound of Object.values(sounds)) {
      if (sound === sounds["bgm"]) {
        sound.fade(1, 0, 1000);
        continue;
      }
      if (sound.playing()) {
        sound.stop();
      }
    }
  }

  async function playSoundSync(sound, cancelCheck) {
    // I don't understand sound.on() for some reason.
    if (cancelCheck()) return true;
    sound.play();
    return await new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (!sound.playing() || cancelCheck()) {
          resolve(cancelCheck());
          clearInterval(interval);
        }
      }, 50);
    });
  }

  return (
    <>
      {loading ? (
        <>
          Loading... {loadedSounds.size}/{toLoad}
        </>
      ) : (
        <RoleContext.Provider
          value={{ selectedId, setSelectedId, selectedRole, setSelectedRoles }}
        >
          {screen === "selection" && (
            <>
              <div className="button-row">
                <Button
                  onClick={() => {
                    setScreen("playing");
                    setCancel(() =>
                      sleepable(async (sleep, cancelCheck) => {
                        if (sounds["bgm"].playing()) {
                          sounds["bgm"].seek(0);
                        } else {
                          sounds["bgm"].play();
                        }
                        if (await sleep(100)) return;
                        sounds["bgm"].fade(0, 1, 1);

                        if (await sleep(1000)) return;
                        setInstruction("[INTRO]");
                        await playSoundSync(sounds["flavor1"], cancelCheck);

                        if (await sleep(1000)) return;
                        setInstruction("Everyone, close your eyes.");
                        await playSoundSync(sounds["begin"], cancelCheck);
                        if (await sleep(1000)) return;

                        if (selectedRole.includes("Werewolf")) {
                          setInstruction(
                            "Werewolves, open your eyes and look for other werewolves. If there are no other werewolves, then you may look at a card from the center."
                          );
                          if (
                            await playSoundSync(
                              sounds["werewolf1"],
                              cancelCheck
                            )
                          )
                            return;
                          if (await sleep(delay * 1000)) return;
                          setInstruction("Werewolves, close your eyes.");
                          if (
                            await playSoundSync(
                              sounds["werewolf2"],
                              cancelCheck
                            )
                          )
                            return;
                          if (await sleep(1000)) return;
                        }

                        if (selectedRole.includes("Minion")) {
                          setInstruction(
                            "Minion, open your eyes. Werewolves, stick out your thumb so that the minion can see you."
                          );
                          if (
                            await playSoundSync(
                              sounds["minion1"],
                              cancelCheck
                            )
                          )
                            return;
                          if (await sleep(delay * 1000)) return;
                          setInstruction("Werewolves, put your thumb away. Minion, close your eyes.");
                          if (
                            await playSoundSync(
                              sounds["minion2"],
                              cancelCheck
                            )
                          )
                            return;
                          if (await sleep(1000)) return;
                        }

                        if (selectedRole.includes("Mason")) {
                          setInstruction(
                            "Masons, open your eyes and look for other masons."
                          );
                          if (
                            await playSoundSync(sounds["mason1"], cancelCheck)
                          )
                            return;
                          if (await sleep(delay * 1000)) return;
                          setInstruction("Masons, close your eyes.");
                          await playSoundSync(sounds["mason2"], cancelCheck);
                          if (await sleep(1000)) return;
                        }

                        if (selectedRole.includes("Seer")) {
                          setInstruction(
                            "Seer, open your eyes. You may look at another player's card, or two cards in the center."
                          );
                          if (await playSoundSync(sounds["seer1"], cancelCheck))
                            return;
                          if (await sleep(delay * 1000)) return;
                          setInstruction("Seer, close your eyes.");
                          if (await playSoundSync(sounds["seer2"], cancelCheck))
                            return;
                          if (await sleep(1000)) return;
                        }

                        if (selectedRole.includes("Robber")) {
                          setInstruction(
                            "Robber, open your eyes. Reach for another player's card, look at it, and then replace it with your own card."
                          );
                          if (
                            await playSoundSync(sounds["robber1"], cancelCheck)
                          )
                            return;
                          if (await sleep(delay * 1000)) return;
                          setInstruction("Robber, close your eyes.");
                          if (
                            await playSoundSync(sounds["robber2"], cancelCheck)
                          )
                            return;
                          if (await sleep(1000)) return;
                        }

                        if (selectedRole.includes("Troublemaker")) {
                          setInstruction(
                            "Troublemaker, open your eyes. Swap two other player's cards, but do not look at the cards."
                          );
                          if (
                            await playSoundSync(
                              sounds["troublemaker1"],
                              cancelCheck
                            )
                          )
                            return;
                          if (await sleep(delay * 1000)) return;
                          setInstruction("Troublemaker, close your eyes.");
                          if (
                            await playSoundSync(
                              sounds["troublemaker2"],
                              cancelCheck
                            )
                          )
                            return;
                          if (await sleep(1000)) return;
                        }

                        if (selectedRole.includes("Drunk")) {
                          setInstruction(
                            "Drunk, open your eyes. Swap your card with a card from the center. Do not look at your new card."
                          );
                          if (
                            await playSoundSync(sounds["drunk1"], cancelCheck)
                          )
                            return;
                          if (await sleep(delay * 1000)) return;
                          setInstruction("Drunk, close your eyes.");
                          if (
                            await playSoundSync(sounds["drunk2"], cancelCheck)
                          )
                            return;
                          if (await sleep(1000)) return;
                        }

                        if (selectedRole.includes("Insomniac")) {
                          setInstruction(
                            "Insomniac, open your eyes. Look at your own card."
                          );
                          if (
                            await playSoundSync(
                              sounds["insomniac1"],
                              cancelCheck
                            )
                          )
                            return;
                          if (await sleep(delay * 1000)) return;
                          setInstruction(
                            "Insomniac, put your card back down and close your eyes."
                          );
                          if (
                            await playSoundSync(
                              sounds["insomniac2"],
                              cancelCheck
                            )
                          )
                            return;
                          if (await sleep(1000)) return;
                        }

                        setInstruction(
                          "Everyone, reach out and move your card around just a tiny bit."
                        );
                        if (await playSoundSync(sounds["end1"], cancelCheck))
                          return;
                        if (await sleep(1000)) return;
                        setInstruction("[OUTRO]");
                        await playSoundSync(sounds["flavor2"], cancelCheck);
                        if (await sleep(1000)) return;
                        setInstruction("Everyone, open your eyes.");
                        if (await playSoundSync(sounds["end2"], cancelCheck))
                          return;
                        if (await sleep(1000)) return;

                        setScreen("timer");
                        stopAllSounds();
                      })
                    );
                  }}
                >
                  Play &#9658;
                </Button>
                <Button
                  style={{ flexGrow: 0 }}
                  onClick={() => setScreen("settings")}
                >
                  Settings
                </Button>
              </div>
              <br />
              <div className="roles">
                <Role
                  id="1"
                  vn={"Ma Sói"}
                  en={"Werewolf"}
                  icon={require("./images/werewolf.png")}
                />
                <Role
                  id="4"
                  vn={"Kẻ Phản Bội"}
                  en={"Minion"}
                  icon={require("./images/minion.png")}
                />
                <Role
                  id="2"
                  vn={"Thợ Hồ"}
                  en={"Mason"}
                  icon={require("./images/masons.png")}
                />
                <Role
                  id="2b"
                  vn={"Thợ Hồ"}
                  en={"Mason"}
                  icon={require("./images/masons.png")}
                />
                <Role
                  id="3"
                  vn={"Tiên Tri"}
                  en={"Seer"}
                  icon={require("./images/seer.png")}
                />
                <Role
                  id="5"
                  vn={"Đạo Tặc"}
                  en={"Robber"}
                  icon={require("./images/robber.png")}
                />
                <Role
                  id="6"
                  vn={"Kẻ Gây Rối"}
                  en={"Troublemaker"}
                  icon={require("./images/troublemaker.png")}
                />
                <Role
                  id="7"
                  vn={"Bợm Nhậu"}
                  en={"Drunk"}
                  icon={require("./images/drunk.png")}
                />
                <Role
                  id="8"
                  vn={"Cú Đêm"}
                  en={"Insomniac"}
                  icon={require("./images/insomniac.png")}
                />
                <Role
                  id="9"
                  vn={"Kẻ Chán Đời"}
                  en={"Tanner"}
                  icon={require("./images/tanner.png")}
                />
                <Role
                  id="10"
                  vn={"Dân Làng"}
                  en={"Villager"}
                  icon={require("./images/villager.png")}
                />
                <Role
                  id="11"
                  vn={"Dân Làng"}
                  en={"Villager"}
                  icon={require("./images/villager.png")}
                />
                <Role
                  id="12"
                  vn={"Dân Làng"}
                  en={"Villager"}
                  icon={require("./images/villager.png")}
                />
              </div>
            </>
          )}
          {screen === "settings" && (
            <>
              <Button onClick={() => setScreen("selection")}>Go Back</Button>
              <h3>Game Timer</h3>
              <div className="button-row">
                <DelayControl
                  min={0}
                  max={60 * 10}
                  increment={30}
                  defaultValue={60 * 5}
                  onDelayChange={setTimer}
                />
              </div>
              <h3>Role Timer</h3>
              <div className="button-row">
                <DelayControl
                  min={1}
                  max={10}
                  increment={1}
                  defaultValue={5}
                  onDelayChange={setDelay}
                />
              </div>
            </>
          )}
          {screen === "playing" && (
            <>
              <Button
                onClick={() => {
                  cancel();
                  setScreen("selection");
                  stopAllSounds();
                }}
              >
                Stop &#9209;
              </Button>
              <br />
              {instruction}
            </>
          )}
          {screen === "timer" && (
            <Timer
              timer={timer}
              onReturnToScreen={() => setScreen("selection")}
            />
          )}
        </RoleContext.Provider>
      )}
    </>
  );
}
