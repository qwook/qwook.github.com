import * as _ from "lodash";
import "./lso.css";
import Button from "@/common/components/ui/Button";
import { Panel } from "@/common/components/ui/Panel";
import Layout from "@/common/layout/Layout";
import logo from "../images/lso/logo.gif";
import me from "../images/lso/me.jpg";
import logoPng from "../images/lso/logo.png";
import desktop from "../images/lso/ss/desktop.jpg";
import photo from "../images/lso/ss/photo.png";
import message from "../images/lso/ss/message.png";
import loseamp from "../images/lso/ss/loseamp.png";
import smashingcomputer from "../images/lso/smashingcomputer.gif";

function Page() {
  return (
    <div>
      <div className="center-image">
        <img src={logo} />
      </div>
      <div
        style={{
          gap: 20,
          color: "black",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Button href="/lso">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>Go Back</div>
          </div>
        </Button>
      </div>
      <h1>Press Sheet</h1>
      <Panel
        style={{
          background: "transparent",
          color: "white",
        }}
      >
        <img style={{ width: 100 }} src={me} />
        <table className="press">
          <tbody>
            <tr>
              <td>Developer</td>
              <td>Henry Quoc Tran (as Sochin Studio)</td>
            </tr>
            <tr>
              <td>Country of Origin</td>
              <td>USA / Vietnam</td>
            </tr>
            <tr>
              <td>Developer Website</td>
              <td>
                <a href="https://qwook.io">qwook.io</a>
              </td>
            </tr>
            <tr>
              <td>Main Contact</td>
              <td>
                <a href="https://instagram.com/nohurryhen">Instagram</a>
              </td>
            </tr>
            <tr>
              <td>Creator's Interests</td>
              <td>
                Bạc Xỉu, Rock Climbing, Porter Robinson, Soccer Mommy, Phoebe
                Bridgers, Thịnh Suy, American Football, Tùng, Alex G, Yeule
              </td>
            </tr>
            <tr>
              <td>Release Date</td>
              <td>December 23, 2023 (Web / itch.io), March 15, 2024 (Steam)</td>
            </tr>
            <tr>
              <td>Regular Price</td>
              <td>Free</td>
            </tr>
            <tr>
              <td>Platforms</td>
              <td>
                <a href="https://store.steampowered.com/app/2824230/last_seen_online/">
                  Steam (Windows, OSX)
                </a>
                <br />
                <a href="https://qwook.itch.io/last-seen-online">Itch.io (Web)</a>
              </td>
            </tr>
            <tr>
              <td>Website</td>
              <td>
                <a href="https://lastseenonline.com/">lastseenonline.com</a>
              </td>
            </tr>
            <tr>
              <td>Description</td>
              <td>
                <p>
                  You were always a snoop, weren’t you? That’s why you bought an
                  old computer you saw lying among piles of junk at a garage sale.
                  You didn’t even bother to format the computer before you turned
                  it on. You were curious. After all, a personal computer is an
                  extension of another person’s soul, all their secrets, projects,
                  interactions.
                </p>
                <p>
                  “last seen online” is a psychological horror escape room, based
                  on early flash games. Look through someone's computer files.
                  Solve puzzles and discover the secrets that lie within the
                  computer.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </Panel>
      <h1>High Resolution Logo</h1>
      <div className="images">
        <img src={logoPng}></img>
      </div>
      <h1>Trailer</h1>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/wtvLOKpmv_c?si=zkAefYho4oyrdkO0"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
      <h1>Screenshots</h1>
      <div className="images center-image">
        <img src={desktop}></img>
        <img src={photo}></img>
        <img src={message}></img>
        <img src={loseamp}></img>
      </div>
      <hr />
      <p>
        this page is always under construction!!{" "}
        <img src={smashingcomputer} />
      </p>
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
