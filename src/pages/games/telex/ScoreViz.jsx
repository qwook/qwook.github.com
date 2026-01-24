import { Html, Hud, OrthographicCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import _ from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";

export function ScoreViz({ score = 100 }) {
  const scoreEle = useRef();
  useEffect(() => {
    const ele = scoreEle.current;
    const observer = new ResizeObserver((entries) => {
      const box = entries[0].contentBoxSize[0];
      ele.style.fontSize = box.inlineSize / 10 + "px";
    });
    observer.observe(ele);
    return () => {
      observer.unobserve(ele);
    };
  }, []);

  const oldScore = useRef();
  useEffect(() => {
    const oldScoreForreal = oldScore.current;
    setScoreParticles((scoreParticles) => {
      return [
        ...scoreParticles,
        {
          score: oldScoreForreal || 0,
          startTime: Date.now(),
        },
      ];
    });
    oldScore.current = score;
  }, [score]);

  const [scoreParticles, setScoreParticles] = useState([]);

  const scoreParticleRefs = useRef();
  scoreParticleRefs.current = scoreParticles;

  const particleRefs = useRef([]);
  // particleRefs.current = [];

  useEffect(() => {
    const interval = setInterval(() => {
      for (let i = 0; i < scoreParticleRefs.current.length; i++) {
        const data = scoreParticleRefs.current[i];
        const ele = particleRefs.current[i];
        if (!ele) continue;
        const elapsed = Date.now() - data.startTime;
        ele.style.top = elapsed / 10 + 5 + "%";
        ele.style.opacity = Math.max(0, 1 - elapsed / 300);
      }

      setScoreParticles((scoreParticles) => {
        const newParticles = [];
        let changed = false;
        for (let particle of scoreParticles) {
          if (Date.now() < particle.startTime + 2000) {
            newParticles.push(particle);
          } else {
            changed = true;
          }
        }

        if (changed) {
          return newParticles;
        } else {
          return scoreParticles;
        }
      });
    }, 50);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="score"
      ref={scoreEle}
      style={{
        position: "absolute",
        top: 0,
        width: "100%",
        height: "50%",
        left: 0,
        display: "flex",
        overflow: "hidden",
        padding: "2%",
      }}
    >
      <span className="score-text">Score: {score}</span>
      {scoreParticles.map((particle, idx) => {
        return (
          <div
            style={{
              position: "absolute",
              top: "5%",
              left: "26%",
            }}
            ref={(ref) => (particleRefs.current[idx] = ref)}
            key={particle.startTime}
            className="score-particle"
          >
            {particle.score}
          </div>
        );
      })}
    </div>
  );
}
