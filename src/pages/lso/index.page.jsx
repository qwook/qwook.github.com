import * as _ from "lodash";
import "./lso.css";
import Button from "@/common/components/ui/Button";
import { Panel } from "@/common/components/ui/Panel";
import Layout from "@/common/layout/Layout";
import logo from "../images/lso/logo.gif";
import computer from "../images/lso/computer.gif";
import spooky from "../images/lso/spooky.gif";
import friends from "../images/lso/friends.gif";
import play from "../images/lso/play.gif";
import steam from "../images/lso/steam.gif";
import discord from "../images/lso/discord.gif";
import kitten from "../images/lso/kitten.gif";
import smashingcomputer from "../images/lso/smashingcomputer.gif";

const lastSeenOnline = `
.---.  .---.  .----.------.
|   | /  ^  \\|  ___/_    _|
|   |_   _   \\ __  \\ |  |
|     | / \\   \\    | |  |
'-----'    '--'---'  '--'
 .----.----.----.--..--.
|  ___/ ___| ___|  \\|  |
\\__   \\ ___| ___|      |
/     |    |    |  |\\  |
'----''----'----'--''--'
.----.--..--.---.---.--..--.----.
| .. |  \\|  |   |   |  \\|  | ___|
| || |      |   |_  |      | ___|
|  ' |  |\\  |     | |  |\\  |    |
'----'--''--'-----'-'--''--'----'

`;

function Page() {
  return (
    <div>
      <div className="center-image">
        <img src={logo} />
      </div>
      <p>
        Welcome mystery fans!! what is <strong>Last Seen Online???</strong>
        <img src={computer} />
      </p>
      <p>
        itzz a game about <strong>FINDING</strong> an <strong>ABANDONED</strong>{" "}
        computer and DIGGING through the files! spooky right??
      </p>
      <div className="center-image">
        <img src={spooky} />
      </div>
      <p>what the heck can be on that computer? &gt;.&gt;</p>
      <div className="center-image">
        <img src={friends} />
      </div>
      <p>really fun to play with friends!!! just 30 minz long!!</p>
      <div
        style={{
          gap: 20,
          color: "black",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Button href="https://qwook.itch.io/last-seen-online">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="center-image">
              <img src={play} />
            </div>
            <div>PLAY on ITCH</div>
            <div>(browser, phone)</div>
          </div>
        </Button>
        <Button href="https://store.steampowered.com/app/2824230/last_seen_online/">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="center-image">
              <img src={steam} />
            </div>
            <div>PLAY on STEAM</div>
            <div>(windows, mac)</div>
          </div>
        </Button>
      </div>
      <br />
      <div
        style={{
          gap: 20,
          color: "black",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Button href="https://discord.gg/4HtZG2uR6J">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="center-image">
              <img src={discord} />
            </div>
            <div>Join the Community!</div>
          </div>
        </Button>
      </div>
      <br />
      <div className="center-image">
        <img src={kitten} />
      </div>
      <table
        className="press"
        style={{
          width: "100%",
        }}
      >
        <tbody>
          <tr>
            <td>Description</td>
            <td>
              <p>
                You were always a snoop, weren’t you? That’s why you bought an old
                computer you saw lying among piles of junk at a garage sale. You
                didn’t even bother to format the computer before you turned it on.
                You were curious. After all, a personal computer is an extension
                of another person’s soul, all their secrets, projects,
                interactions.
              </p>
              <p>
                “last seen online” is a psychological horror escape room, based on
                early flash games. Look through someone's computer files. Solve
                puzzles and discover the secrets that lie within the computer.
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <h1>Trailer</h1>
      <iframe
        style={{
          display: "block",
          margin: "auto",
        }}
        width="100%"
        height="315"
        src="https://www.youtube.com/embed/wtvLOKpmv_c?si=wLEguuRmKpVbGAgQ"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
      <hr />
      <div
        style={{
          gap: 20,
          color: "black",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Button href="/lso/press">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>Press Sheet</div>
          </div>
        </Button>
        <Button href="https://instagram.com/nohurryhen">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>Contact Me (instagram)</div>
          </div>
        </Button>
      </div>
      <hr />
      <p>
        this page is always under construction!!{" "}
        <img src={smashingcomputer} />
      </p>
      <pre style={{ fontFamily: "monospace", overflow: "scroll" }}>
        {lastSeenOnline}
      </pre>
    </div>
  );
}

export default function Root() {
  return (
    <Layout showNav={false}>
      <Page />
    </Layout>
  );
}
