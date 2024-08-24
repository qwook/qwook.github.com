import "../style/index.scss";

import Pets from "./pets";

export default function Page({ children }) {
  return (
    <>
      <div>
        <div style={{ display: "flex", gap: 20 }}>
          <div
            style={{
              flexBasis: 200,
            }}
          >
            <Pets />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="nav">
              <a className="nav-item" href="/">
                Home
              </a>
              |
              <a className="nav-item" href="/projects">
                Projects
              </a>
              |
              <a className="nav-item" href="/list">
                List of Things
              </a>
            </div>
            <div className="content">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
