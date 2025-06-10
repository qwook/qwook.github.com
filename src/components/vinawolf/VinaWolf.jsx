import { createContext, useContext, useMemo, useState } from "react";
import "./vinawolf.scss";
import Button from "../ui/Button";
import { Howl } from "howler";

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
  const [villager, setVillager] = useState(false);
  const [selectedId, setSelectedId] = useState({});
  const [selectedRole, setSelectedRoles] = useState([]);

  const [playing, setPlaying] = useState(false);
  const [cancel, setCancel] = useState();

  const [instruction, setInstruction] = useState("");

  // const sounds = useState();
  const sounds = useMemo(
    () =>
      Object.fromEntries(
        Object.entries({
          ["bgm"]: require("./sounds/bgm.mp3"),
          ["begin"]: require("./sounds/begin.mp3"),
          ["werewolf1"]: require("./sounds/werewolf1.mp3"),
          ["werewolf2"]: require("./sounds/werewolf2.mp3"),
          ["end1"]: require("./sounds/end1.mp3"),
          ["end2"]: require("./sounds/end2.mp3"),
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

  function stopAllSounds() {
    for (const sound of Object.values(sounds)) {
      if (sound.playing()) {
        sound.stop();
      }
    }
  }

  async function playSoundSync(sound, cancelCheck) {
    // I don't understand sound.on() for some reason.
    if (cancelCheck()) return;
    sound.play();
    await new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (!sound.playing() || cancelCheck()) {
          resolve();
          clearInterval(interval);
        }
      }, 50);
    });
  }

  return (
    <>
      <RoleContext.Provider
        value={{ selectedId, setSelectedId, selectedRole, setSelectedRoles }}
      >
        {!playing ? (
          <>
            <Button
              onClick={() => {
                setPlaying(true);
                setCancel(() =>
                  sleepable(async (sleep, cancelCheck) => {
                    sounds["bgm"].volume(0.2);
                    sounds["bgm"].play();

                    if (await sleep(1000)) return;
                    setInstruction("Everyone, close your eyes.");
                    await playSoundSync(sounds["begin"], cancelCheck);
                    if (await sleep(1000)) return;

                    if (selectedRole.includes("Werewolf")) {
                      setInstruction(
                        "Werewolves, open your eyes and look for other werewolves. If there are no other werewolves, then you may look at a card from the center."
                      );
                      await playSoundSync(sounds["werewolf1"], cancelCheck);
                      if (await sleep(1000)) return;
                      setInstruction("Werewolves, close your eyes.");
                      await playSoundSync(sounds["werewolf2"], cancelCheck);
                      if (await sleep(1000)) return;
                    }

                    if (selectedRole.includes("Masons")) {
                      setInstruction(
                        "Masons, open your eyes and look for other masons."
                      );
                      if (await sleep(1000)) return;
                      setInstruction("Masons, close your eyes.");
                      if (await sleep(1000)) return;
                    }

                    if (selectedRole.includes("Seer")) {
                      setInstruction(
                        "Seer, open your eyes. You may look at another player's card, or two cards in the center."
                      );
                      if (await sleep(1000)) return;
                      setInstruction("Seer, close your eyes.");
                      if (await sleep(1000)) return;
                    }

                    setInstruction(
                      "Everyone, reach out and move your card around just a tiny bit."
                    );
                    await playSoundSync(sounds["end1"], cancelCheck);
                    if (await sleep(1000)) return;
                    setInstruction("Everyone, open your eyes.");
                    await playSoundSync(sounds["end2"], cancelCheck);
                    if (await sleep(1000)) return;

                    setPlaying(false);
                    stopAllSounds();
                  })
                );
              }}
            >
              Play
            </Button>
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
        ) : (
          <>
            <Button
              onClick={() => {
                setPlaying(false);
                cancel();
                stopAllSounds();
              }}
            >
              Stop
            </Button>
            <br />
            {instruction}
          </>
        )}
      </RoleContext.Provider>
    </>
  );
}
