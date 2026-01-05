import { useEffect, useRef, useState } from "react";
import { createPage } from "../../../app";
import { EventSpecial } from "../../../components/events/event-special";
import { headTags } from "../../../utils/headTags";
import "./salon.scss";
import p5 from "p5";

headTags({
  title: "HTML Day 2025 - Sài Gòn",
  description: "a day of HTML freewrite",
});

const TITLE = "HTML Day 2025 - Sài Gòn";

let offsetTime = 0;
let offsetX = 0;
let offsetY = 0;

function P5Canvas() {
  const canvasContainer = useRef(null);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const strokeWidthRef = useRef(strokeWidth);

  useEffect(() => {
    strokeWidthRef.current = strokeWidth;
  }, [strokeWidth]);

  const sketch = (p) => {
    p.setup = () => {
      const rectangle = canvasContainer.current.getBoundingClientRect();
      const canvas = p.createCanvas(rectangle.width, rectangle.height);
    };

    p.draw = () => {
      p.clear();

      // Set the noise level and scale.
      let noiseLevel = 255;
      let noiseScale = 0.09;
      offsetTime += p.deltaTime * 0.0001;
      offsetX += p.deltaTime * 0.001;
      offsetY += p.deltaTime * 0.0005;

      // Iterate from top to bottom.
      for (let y = 0; y < p.height / 20; y += 1) {
        // Iterate from left to right.
        for (let x = 0; x < p.width / 20; x += 1) {
          // Scale the input coordinates.
          let nx = noiseScale * x;
          let ny = noiseScale * y;

          // Compute the noise value.
          let c = p.noise(nx + offsetX, ny + offsetY, offsetTime);

          const matWidth = p.width / 20;
          const matHeight = p.height / 20;
          let alpha =
            6000 *
            Math.pow(
              (matWidth / 2 - Math.abs(x - matWidth / 2)) / (matWidth / 2),
              2
            ) *
            Math.pow(
              (matHeight / 2 - Math.abs(y - matHeight / 2)) / (matHeight / 2),
              2
            );

          // Draw the point.
          p.textSize(24);
          p.fill(0, 0, 255, alpha);
          p.strokeWeight(0);
          if (c > 0.65) {
            // fill("black");
            // text('ề', x*20-2, y*20+2)
            // fill("blue");
            // stroke("white");
            // strokeWeight(2);
            p.text("ề", x * 20, y * 20);
          } else if (c > 0.65) {
            // fill("black");
            // text('ô', x*20-2, y*20+2)
            // fill("blue");
            // stroke("white");
            // strokeWeight(2);
            p.text("ô", x * 20, y * 20);
          } else if (c > 0.55) {
            p.text("*", x * 20, y * 20);
          } else if (c > 0.5) {
            p.text(".", x * 20, y * 20);
          }
        }
      }
    };
  };

  useEffect(() => {
    if (!canvasContainer.current) return;
    const p5Instance = new p5(sketch, canvasContainer.current);
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        p5Instance.resizeCanvas(entry.contentRect.width, entry.contentRect.height);
      }
    });
    resizeObserver.observe(canvasContainer.current);
    return () => {
      p5Instance.remove();
      resizeObserver.unobserve(canvasContainer.current);
    };
  }, []);

  return (
    <>
      <div className="canvas-container" ref={canvasContainer}></div>
    </>
  );
}

export default function EventPage() {
  const [language, setLanguage] = useState("vn");

  return (
    <>
      <div>
        <P5Canvas />
        <h1>Sài Gòn Sà Lon</h1>
        <p>
          A casual show and tell of cool creative work in trung tâm Sài Gòn.
        </p>
        <h2>
          Salon 1 - 31/1/2026 <img src={require("./new.gif")} />
        </h2>
        <table className="salon-table">
          <tr>
            <td>Telex of the Dead</td>
            <td>Henry Quoc Tran</td>
          </tr>
          <tr>
            <td>Telex of the Dead</td>
            <td>Henry Quoc Tran</td>
          </tr>
        </table>
      </div>
    </>
  );
}

createPage(EventPage, {
  showPets: false,
  showNav: false,
  title: TITLE,
});
