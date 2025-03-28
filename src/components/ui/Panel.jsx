import "./panel.scss";

export function Panel({ children, outie, ...props }) {
  return (
    <div {...props} className={["panel", outie ? "outie" : ""].join(" ")}>
      {children}
    </div>
  );
}
