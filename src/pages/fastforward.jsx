import Banner from "../components/Banner";
import { createPage } from "../app";
import { useEffect, useRef } from "react";

function FastForwardPage() {
  const video = useRef();
  const canvas1 = useRef();
  const canvas2 = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      let time = video.current.currentTime - 0.2;
      if (time >= 0) {
        console.log(video.current.currentTime);
        video.current.currentTime = time;
      } else {
        video.current.currentTime = video.current.duration;
      }
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let c1 = 0;
    const interval = setInterval(() => {
      const ctx1 = canvas1.current.getContext("2d");
      const ctx2 = canvas2.current.getContext("2d");

      const gridCountW = 9 + Math.floor(Math.random() * 2);
      const gridCountH = 10 + Math.floor(Math.random() * 2);
      const gridW = Math.floor(video.current.videoWidth / gridCountW);
      const gridH = Math.floor(video.current.videoHeight / gridCountH);

      for (let z = 0; z < 5; z++) {
        ctx1.drawImage(video.current, 0, 0);
        c1 = (c1 + 1) % (gridCountH * 2);
        let meh = 0;
        for (let i = 0; i < gridCountW; i++) {
          if (Math.random() > 0.6) {
            meh++;
          }
          for (let j = 0; j < gridCountH; j++) {
            // if ((j % c1 == 0 && Math.random() > 0.8) || Math.random() > 0.8) {
            if (i !== c1 - gridCountH + (j + meh)) {
              ctx1.clearRect(
                i * gridW,
                j * gridH, // + gridH * (Math.random() > 0.1 ? 0.0 : 0.0),
                gridW,
                gridH,
              );
            }
          }
        }
        ctx2.drawImage(canvas1.current, 0, 0);
        if (Math.random() > 0.7) {
          break;
        }
      }
    }, 5);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <video
        ref={video}
        src={require("./images/fastforward/central.mp4")}
        mute
        loop
        // autoPlay
        controls
        onLoadedMetadata={() => {
          video.current.playbackRate = 4;
          canvas1.current.width = video.current.videoWidth;
          canvas1.current.height = video.current.videoHeight;
          canvas2.current.width = video.current.videoWidth;
          canvas2.current.height = video.current.videoHeight;
        }}
      />
      <canvas ref={canvas1}></canvas>
      <canvas ref={canvas2}></canvas>
    </>
  );
}

createPage(FastForwardPage, { showPets: false });
