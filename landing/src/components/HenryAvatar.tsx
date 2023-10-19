import { useEffect, useState } from "react";

import avatarPng from "./henrys/avatar.png";
import ferktheworldPng from "./henrys/ferktheworld.png";
import indexPng from "./henrys/index.png";
import jjjpg from "./henrys/JJ_2T.jpg";
import jpg1937374 from "./henrys/1937374.jpg";
import kid64Png from "./henrys/kid64.png";
import meSpinningAroundGif from "./henrys/me_spinning_around.gif";
import zombixSmallBmp from "./henrys/zombix_small.bmp";

const avatarPool = [
  avatarPng,
  ferktheworldPng,
  indexPng,
  jjjpg,
  jpg1937374,
  kid64Png,
  meSpinningAroundGif,
  zombixSmallBmp,
];

export default function HenryAvatar() {
  const [avatar, setAvatar] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAvatar((avatar) => (avatar + 1) % avatarPool.length);
    }, 500);
    return () => {
      clearInterval(interval);
    };
  });
  return (
    <div
      style={{
        display: "inline-block",
        width: "64px",
        height: "64px",
      }}
    >
      <img
        style={{
          minHeight: "100%",
          maxHeight: "100%",
          imageRendering: "pixelated",
        }}
        src={avatarPool[avatar]}
        alt="Avatar."
      />
    </div>
  );
}
