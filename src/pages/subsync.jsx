import Banner from "../components/Banner";
import Page from "../components/Page";
import { createPage } from "../app";
import { useEffect } from "react";
import srtParser2 from "srt-parser-2";

export default function SubSyncPage() {
  useEffect(() => {
    var parser = new srtParser2();
    var wobblyArray = parser.fromSrt(
      `
`
    );

    magnetArray.sort((a, b) => {
      b.startSeconds - a.startSeconds || b.endSeconds - a.endSeconds;
    });

    const tolerance = 1000 / 1000;

    for (const wobbly of wobblyArray) {
      for (const magnet of magnetArray) {
        // Too far, let's not search the entire list.
        if (magnet.startSeconds > wobbly.startSeconds + tolerance) {
          break;
        }

        if (
          Math.abs(magnet.startSeconds - wobbly.startSeconds) < tolerance &&
          Math.abs(magnet.endSeconds - wobbly.endSeconds) < tolerance
        ) {
          wobbly.startTime = magnet.startTime;
          wobbly.endTime = magnet.endTime;
          wobbly.startSeconds = magnet.startSeconds;
          wobbly.endSeconds = magnet.endSeconds;
          magnetArray.splice(magnetArray.indexOf(magnet), 1);
          break;
        }
      }
    }

    // turn array back to SRT string.
    var wobblyString = parser.toSrt(wobblyArray);
    console.log(wobblyString);
  }, []);

  return (
    <>
      <Banner>SubSync</Banner>
      <p>Snap the timestamps of two subtitles that are almost far apart.</p>
      <p>Difference in MS:</p>
      <input type="text" value={100} defaultValue={100} />
    </>
  );
}

createPage(SubSyncPage, { showPets: false });
