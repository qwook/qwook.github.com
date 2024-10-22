import { createPage } from "../app";
import { useEffect, useMemo, useRef, useState } from "react";

function Image({ url, x, y, w, h, offsetX, offsetY, scaleX }) {
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        width: w,
        height: h,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative" }}>
        <img
          src={url}
          style={{
            position: "absolute",
            left: offsetX,
            top: offsetY,
            width: scaleX,
          }}
        />
      </div>
    </div>
  );
}

export default function DecomposePage() {
  return (
    <div className="decompose">
      <p>
        i've woken up early in the morning, yet again, in a cold sweat, to
        create another web site.
      </p>
      <p>
        right now it's october 22, 2024. i am moving away from san francisco. in 40 days, that part of my soul
        dies, and every potential version of my life that would have existed if
        i stayed will also die.
      </p>
      <p>
        i am thinking about the ephemerality of everything. the internet was a
        promise of something beyond the physical, but{" "}
        <a href="https://lastseenonline.com" target="_blank">
          even things on the internet will fade.
        </a>
      </p>
      <p>
        none of the images in the page are hosted by me. over time, these images
        will go offline.
      </p>
      <p>
        the grass will die, the flowers will wither, and the body of the
        internet will decompose
      </p>
      <p>it may take years until all of this is fully realized.</p>
      <div
        style={{
          position: "relative",
          width: "500px",
          height: "500px",
        }}
      >
        <Image
          url="https://img.freepik.com/premium-photo/arafed-image-man-with-glowing-body-arms-generative-ai_958165-10874.jpg"
          x={0}
          y={0}
          w={800}
          h={1300}
          offsetX={-600}
          offsetY={-400}
          scaleX={2000}
        />
        <Image
          url="https://www.agulloplasticsurgery.com/wp-content/themes/pss-theme/_dist/img/img-services-models.png"
          x={620}
          y={590}
          w={60}
          h={140}
          offsetX={-720}
          offsetY={-610}
        />
        <Image
          url="https://cdn2.stylecraze.com/wp-content/uploads/2015/03/79-Top-10-Celebrities-With-Sexy-Eyebrows.jpg.avif"
          x={400}
          y={120}
          w={70}
          h={50}
          offsetX={-400}
          offsetY={-290}
        />
        <Image
          url="https://cdn2.stylecraze.com/wp-content/uploads/2015/03/79-Top-10-Celebrities-With-Sexy-Eyebrows.jpg.avif"
          x={320}
          y={120}
          w={70}
          h={50}
          offsetX={-400}
          offsetY={-290}
        />
        <Image
          url="https://pbs.twimg.com/media/FulsrogWIAMMqbv?format=jpg&name=large"
          x={360}
          y={200}
          w={70}
          h={40}
          offsetX={-530}
          offsetY={-780}
          scaleX={700}
        />
      </div>
    </div>
  );
}

createPage(DecomposePage, { showPets: false });
