import "./panel.scss";

export function Panel({ children, className, outie, ...props }) {
  return (
    <div {...props} className={[className, "panel", outie ? "outie" : ""].join(" ")}>
      {children}
    </div>
  );
}
