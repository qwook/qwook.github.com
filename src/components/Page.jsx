import "../style/index.scss";

import Pets from "./pets";

export default function Page({ children }) {
  return (
    <>
      <div className="nav">
        <a className="nav-item" href="/archive">
          Archive
        </a>
        |
        <a className="nav-item" href="/list">
          List of Things
        </a>
        |
        <a className="nav-item" href="/projects">
          Projects
        </a>
        |
        <a className="nav-item" href="/">
          Home
        </a>
      </div>
      <div className="page">
        <div className="pets">
          <Pets />
        </div>
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
