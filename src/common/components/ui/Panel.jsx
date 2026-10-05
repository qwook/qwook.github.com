import "./panel.css";

export function Panel({ children, className, outie, ...props }) {
  return (
    <div {...props} className={[className, "panel", outie ? "outie" : ""].join(" ")}>
      {children}
    </div>
  );
}
