import { useEffect, useState } from "react";
import "./progress.scss";
import { useHotkey } from "./useHotkey";

export default function Progress({ minValue, maxValue, value }) {
  return (
    <div className="progress">
      <div
        className="progress-bar"
        style={{
          width: Math.abs(value / (maxValue - minValue)) * 100 + "%",
        }}
      ></div>
    </div>
  );
}
