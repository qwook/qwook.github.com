import "./index.css";

/** Site chrome: the nav bar, and an optional sidebar beside the content. */
export default function Layout({ children, sidebar, showNav = true }) {
  return (
    <>
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
        {sidebar}
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
