import "./App.css";

import HenryAvatar from "./components/HenryAvatar";
import HenryName from "./components/HenryName";
import React from "react";
import TelevisionRoom from "./components/TelevisionRoom";
import { WordBackground } from "./components/WordBackground";

function App() {
  return (
    <div className="App">
      <WordBackground />
      <TelevisionRoom />
      <div
        style={{
          display: "inline-block",
          textAlign: "left",
          // width: "630px",
          marginTop: "1em",
          padding: "3em",
        }}
      >
        {/* <HenryAvatar /> */}
        <span
          style={{
            fontFamily: "Handjet",
            verticalAlign: "top",
            // marginLeft: "1em",
            fontWeight: "100",
            fontSize: "2em",
          }}
        >
          {"[?]"}
          {/* my name is{" "} */}
          <span
            style={{
              marginLeft: "5px",
              display: "inline-block",
              // fontSize: "1.0em",
              // fontWeight: "bold",
            }}
          >
            <HenryName />
          </span>
        </span>
      </div>
    </div>
  );
}

export default App;
