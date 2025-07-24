import { useEffect, useRef, useState } from "react";
import Button from "./ui/Button";
import "./VideoPlayer.scss";
import { Panel } from "./ui/Panel";
import _ from "lodash";

function Scrubber({ max = 100, value, setValue, onPress, onRelease }) {
  const [dragging, setDragging] = useState(false);
  // const [value, setValue] = useState(0);
  const scrubberScale = useRef();
  const originalValue = useRef(0);
  const mouseOffset = useRef(0);

  useEffect(() => {
    if (dragging) {
      const pointerMove = (e) => {
        const reference = scrubberScale.current.getBoundingClientRect();
        setValue(
          _.clamp(
            originalValue.current +
              ((e.clientX - mouseOffset.current) / reference.width) * max,
            0,
            max - 0.1
          )
        );
      };
      document.addEventListener("pointermove", pointerMove);
      const pointerUp = () => {
        setDragging(false);
        onRelease();
      };
      document.addEventListener("pointerup", pointerUp);
      return () => {
        document.removeEventListener("pointermove", pointerMove);
        document.removeEventListener("pointerup", pointerUp);
      };
    }
  }, [dragging]);

  return (
    <div
      className="video-scrubber"
      onPointerDown={(e) => {
        const reference = scrubberScale.current.getBoundingClientRect();
        const value = _.clamp(
          ((e.clientX - reference.x - 7) / reference.width) * max,
          0,
          max - 0.1
        );
        setValue(value);
        setDragging(true);
        originalValue.current = value;
        mouseOffset.current = e.clientX;
        onPress();
      }}
    >
      <div className="scrubber-container">
        <div className="scrubber-scale" ref={scrubberScale}></div>
        <Button
          style={{
            height: 40,
            width: 15,
            padding: 0,
            left: (value / max) * 100 + "%",
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            console.log(e);
            setDragging(true);
            originalValue.current = value;
            mouseOffset.current = e.clientX;
            onPress();
          }}
        ></Button>
      </div>
      <Panel className="scrubber-bg" style={{ background: "white" }} />
    </div>
  );
}

export function VideoPlayer({ src }) {
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState();
  const video = useRef();

  return (
    <>
      <Panel outie style={{ maxWidth: 500, padding: 5 }}>
        <video
          ref={video}
          autoPlay
          loop
          playsInline
          controls={false}
          src={src}
          onPlay={() => {
            setPlaying(true);
          }}
          onPause={() => {
            setPlaying(false);
          }}
          onTimeUpdate={() => {
            setTime(video.current.currentTime);
          }}
          onLoadedMetadata={() => {
            setDuration(video.current.duration);
          }}
        />
        <Scrubber
          value={time}
          setValue={(value) => {
            video.current.currentTime = value;
          }}
          max={duration}
          onPress={() => {
            video.current.pause();
          }}
          onRelease={() => {
            video.current.play();
          }}
        />
        <div className="video-control">
          <Button
            onClick={(e) => {
              video.current.play();
            }}
            disabled={playing}
            style={{ fontSize: 25, padding: 10, lineHeight: 1 }}
          >
            ▶
          </Button>
          <Button
            onClick={(e) => {
              video.current.pause();
            }}
            disabled={!playing}
            style={{ fontSize: 30, padding: 5, lineHeight: 0 }}
          >
            ▮▮
          </Button>
          <Button
            onClick={(e) => {
              video.current.pause();
              video.current.currentTime = 0;
            }}
            disabled={!playing}
            style={{ fontSize: 50, padding: 5, lineHeight: 0 }}
          >
            ■
          </Button>
        </div>
      </Panel>
    </>
  );
}
