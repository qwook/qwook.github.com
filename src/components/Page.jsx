import { useEffect } from "react";
import "../style/index.scss";

import Pets from "./pets";

export default function Page({
  children,
  showPets = true,
  showNav = true,
  title = "qwook's Homepage",
}) {
  return (
    <>
      <title>{title}</title>
      {showNav && (
        <div className="nav">
          <a className="nav-item" href="/list">
            Bookmarks
          </a>
          |
          <a className="nav-item" href="/archive">
            Archive
          </a>
          |
          <a className="nav-item" href="/art">
            Art
          </a>
          |
          <a className="nav-item" href="/works">
            Works
          </a>
          |
          <a className="nav-item" href="/">
            Home
          </a>
        </div>
      )}
      <div className="page">
        {showPets && (
          <div className="pets">
            <Pets />
          </div>
        )}
        <div
          className="content"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
